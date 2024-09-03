/*
 * Copyright (c) PU Convocation Management System Authors
 *
 * This software is owned by PU Convocation Management System Authors.
 * No part of the software is allowed to be copied or distributed
 * in any form. Any attempt to do so will be considered a violation
 * of copyright law.
 *
 * This software is protected by copyright law and international
 * treaties. Unauthorized copying or distribution of this software
 * is a violation of these laws and could result in severe penalties.
 */

package com.puconvocation.controllers

import com.google.gson.Gson
import com.puconvocation.commons.dto.AccountWithUACRules
import com.puconvocation.commons.dto.AuthenticationCredentials
import com.puconvocation.commons.dto.NewAccount
import com.puconvocation.constants.CachedKeys
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.enums.AuthenticationStrategy
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.core.Hash
import com.puconvocation.security.dao.SecurityToken
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.CacheService
import com.puconvocation.utils.Result
import io.ktor.http.*
import org.bson.types.ObjectId

class AccountController(
    private val accountRepository: AccountRepository,
    private val jsonWebToken: JsonWebToken,
    private val passkeyController: PasskeyController,
    private val uacController: UACController,
    private val gson: Gson,
    private val cacheService: CacheService,
) {
    suspend fun getAuthenticationStrategy(identifier: String): Result {
        val cachedAccountStrategy = cacheService.get(CachedKeys.getAccountStrategyKey(identifier))

        if (cachedAccountStrategy != null) {
            return Result.Success(
                statusCode = HttpStatusCode.OK,
                code = ResponseCode.OK,
                data = hashMapOf(
                    "authenticationStrategy" to cachedAccountStrategy
                )
            )
        }

        val cachedAccount = cacheService.get(CachedKeys.getAccountKey(identifier))

        val account = if (cachedAccount != null) {
            gson.fromJson(cachedAccount, Account::class.java)
        } else {
            val fetchedAccount = accountRepository.getAccount(identifier) ?: return Result.Error(
                statusCode = HttpStatusCode.NotFound,
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found."
            )

            cacheService.set(CachedKeys.getAccountKey(identifier), gson.toJson(fetchedAccount))

            fetchedAccount
        }

        if (account.suspended) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                message = "Your account has been suspended."
            )
        }

        val authenticationStrategy = if (account.fidoCredential.isEmpty()) AuthenticationStrategy.PASSWORD
        else AuthenticationStrategy.PASSKEY

        cacheService.set(CachedKeys.getAccountStrategyKey(identifier), authenticationStrategy.toString())

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = hashMapOf(
                "authenticationStrategy" to
                        authenticationStrategy
            )
        )
    }

    suspend fun authenticate(credentials: AuthenticationCredentials): Result {
        val cachedAccount = cacheService.get(CachedKeys.getAccountKey(credentials.identifier))

        val account = if (cachedAccount != null) {
            gson.fromJson(cachedAccount, Account::class.java)
        } else {
            val fetchedAccount = accountRepository.getAccount(credentials.identifier) ?: return Result.Error(
                statusCode = HttpStatusCode.NotFound,
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found."
            )

            cacheService.set(CachedKeys.getAccountKey(credentials.identifier), gson.toJson(fetchedAccount))

            fetchedAccount
        }

        if (account.suspended) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                message = "Your account has been suspended."
            )
        }

        if (account.fidoCredential.isNotEmpty()) {
            val result = passkeyController.startPasskeyChallenge(credentials.identifier)
            return result
        }

        if (credentials.password == null || account.password == null) {
            return Result.Error(
                statusCode = HttpStatusCode.BadRequest,
                errorCode = ResponseCode.NULL_PASSWORD,
                message = "Please provide password."
            )
        }

        val passwordMatched = Hash().verify(credentials.password, account.password)

        if (!passwordMatched) {
            return Result.Error(
                statusCode = HttpStatusCode.NonAuthoritativeInformation,
                errorCode = ResponseCode.INVALID_PASSWORD,
                message = "Password is invalid. Please check your password."
            )
        }

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = SecurityToken(
                payload = "Authenticated Successfully",
                authorizationToken = jsonWebToken.generateAuthorizationToken(
                    account.uuid.toHexString(),
                    "null",
                ),
                refreshToken = jsonWebToken.generateRefreshToken(account.uuid.toHexString(), "null"),
            )
        )
    }

    suspend fun createNewAccount(newAccount: NewAccount, securityToken: SecurityToken): Result {

        val verificationResult = jsonWebToken.verifySecurityToken(
            token = securityToken.authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (verificationResult is Result.Error) {
            return verificationResult
        }

        val isAllowed = uacController.isAllowed(
            identifier = (verificationResult.responseData as List<String>)[0],
            ruleName = "createNewAccounts"
        )

        if (!isAllowed) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.NOT_PERMITTED,
                message = "You don't have privilege to create new accounts."
            )
        }

        if (accountRepository.accountExists(newAccount.email) || accountRepository.accountExists(newAccount.username)) {
            return Result.Error(
                statusCode = HttpStatusCode.Conflict,
                errorCode = ResponseCode.ACCOUNT_EXISTS,
                message = "Account already exists. Please login instead."
            )
        }

        val uuid = ObjectId()
        val account = Account(
            uuid = uuid,
            email = newAccount.email,
            username = newAccount.username,
            avatarURL = "https://assets.puconvocation.com/avatars/default.png",
            displayName = newAccount.displayName,
            suspended = false,
            password = if (newAccount.password == null) null else Hash().generateSaltedHash(newAccount.password),
            fidoCredential = mutableSetOf()
        )
        val response = accountRepository.createAccount(account)
        if (!response) {
            return Result.Error(
                statusCode = HttpStatusCode.InternalServerError,
                errorCode = ResponseCode.ACCOUNT_CREATION_ERROR,
                message = "Account creation failed. Please try again."
            )
        }

        if (newAccount.authenticationStrategy === AuthenticationStrategy.PASSKEY) {
            val result = passkeyController.startPasskeyRegistration(account.username)
            return result;
        }

        val securityTokens = SecurityToken(
            payload = "Account Created.",
            authorizationToken = jsonWebToken.generateAuthorizationToken(
                account.uuid.toHexString(),
                "null",
            ),
            refreshToken = jsonWebToken.generateRefreshToken(account.uuid.toHexString(), "null"),
        )

        return Result.Success(
            statusCode = HttpStatusCode.Created,
            code = ResponseCode.ACCOUNT_CREATED,
            data = securityTokens
        )
    }

    suspend fun accountDetails(securityToken: SecurityToken): Result {
        var tokens: SecurityToken = securityToken;

        var newTokenGenerated = false;

        if (tokens.refreshToken == null && tokens.authorizationToken == null) {
            return Result.Error(
                statusCode = HttpStatusCode.Unauthorized,
                errorCode = ResponseCode.INVALID_TOKEN,
                message = "Authorization token is invalid or expired."
            )
        }

        if (tokens.refreshToken != null && tokens.authorizationToken == null) {
            val newTokenGenerationResult = jsonWebToken.generateSecurityTokenFromRefreshToken(securityToken)

            if (newTokenGenerationResult is Result.Error) {
                return newTokenGenerationResult
            }

            tokens = newTokenGenerationResult.responseData as SecurityToken
            newTokenGenerated = true
        }

        val jwtResult =
            jsonWebToken.verifySecurityToken(tokens.authorizationToken!!, TokenType.AUTHORIZATION_TOKEN)
        if (jwtResult is Result.Error) {
            return jwtResult
        }

        val cachedAccountWithPrivileges = cacheService.get(
            CachedKeys.getAccountWithPrivilegesKey(
                (jwtResult.responseData as List<String>)[0].replace(
                    "\"",
                    ""
                )
            )
        )

        if (cachedAccountWithPrivileges != null) {
            if (newTokenGenerated) {
                return Result.Success(
                    statusCode = HttpStatusCode.OK,
                    code = ResponseCode.OK,
                    data = SecurityToken(
                        authorizationToken = tokens.authorizationToken,
                        refreshToken = tokens.refreshToken,
                        payload = gson.fromJson(cachedAccountWithPrivileges, AccountWithUACRules::class.java),
                    )
                )
            }

            return Result.Success(
                statusCode = HttpStatusCode.OK,
                code = ResponseCode.OK,
                data = gson.fromJson(cachedAccountWithPrivileges, AccountWithUACRules::class.java)
            )
        }

        val cachedAccount =
            cacheService.get(CachedKeys.getAccountKey(jwtResult.responseData[0].replace("\"", "")))


        val account = if (cachedAccount != null) {
            gson.fromJson(cachedAccount, Account::class.java)
        } else {
            val fetchedAccount = accountRepository.getAccount(jwtResult.responseData[0].replace("\"", ""))
                ?: return Result.Error(
                    statusCode = HttpStatusCode.NotFound,
                    errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                    message = "Account not found."
                )

            cacheService.set(CachedKeys.getAccountKey(fetchedAccount.uuid.toHexString()), gson.toJson(fetchedAccount))

            fetchedAccount
        }

        if (account.suspended) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                message = "Your account has been suspended."
            )
        }

        val accountWithUACRules = getAccountWithPrivileges(account)

        if (newTokenGenerated) {
            return Result.Success(
                statusCode = HttpStatusCode.OK,
                code = ResponseCode.OK,
                data = SecurityToken(
                    authorizationToken = tokens.authorizationToken,
                    refreshToken = tokens.refreshToken,
                    payload = accountWithUACRules
                )
            )
        }

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = accountWithUACRules
        )
    }

    suspend fun accountDetails(authorizationToken: String?, identifier: String): Result {
        val verificationResult = jsonWebToken.verifySecurityToken(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (verificationResult is Result.Error) {
            return verificationResult
        }

        val isAllowed = uacController.isAllowed(
            identifier = (verificationResult.responseData as List<String>)[0],
            ruleName = "viewAccounts"
        )

        if (!isAllowed) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.NOT_PERMITTED,
                message = "You don't have privilege to view accounts."
            )
        }

        val cachedAccount =
            cacheService.get(CachedKeys.getAccountKey(identifier))


        val account = if (cachedAccount != null) {
            gson.fromJson(cachedAccount, Account::class.java)
        } else {
            val fetchedAccount = accountRepository.getAccount(identifier)
                ?: return Result.Error(
                    statusCode = HttpStatusCode.NotFound,
                    errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                    message = "Account not found."
                )

            cacheService.set(CachedKeys.getAccountKey(fetchedAccount.uuid.toHexString()), gson.toJson(fetchedAccount))

            fetchedAccount
        }

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = getAccountWithPrivileges(account)
        )
    }

    private suspend fun getAccountWithPrivileges(account: Account): AccountWithUACRules {
        val accountPrivileges = uacController.getRulesAssociatedWithAccount(account.uuid.toHexString())

        val accountWithUACRules = AccountWithUACRules(
            uuid = account.uuid,
            email = account.email,
            username = account.username,
            avatarURL = account.avatarURL,
            displayName = account.displayName,
            privileges = accountPrivileges
        )

        cacheService.set(
            CachedKeys.getAccountWithPrivilegesKey(account.uuid.toHexString()),
            gson.toJson(accountWithUACRules)
        )

        return accountWithUACRules
    }

}