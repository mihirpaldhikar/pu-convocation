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

import com.puconvocation.commons.dto.AuthenticationCredentials
import com.puconvocation.commons.dto.NewAccount
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.enums.AccountType
import com.puconvocation.enums.AuthenticationStrategy
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.core.Hash
import com.puconvocation.security.dao.SecurityToken
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.utils.Result
import io.ktor.http.*
import org.bson.types.ObjectId

class AccountController(
    private val accountRepository: AccountRepository,
    private val jsonWebToken: JsonWebToken,
    private val passkeyController: PasskeyController
) {
    suspend fun getAuthenticationStrategy(identifier: String): Result {
        val account = accountRepository.getAccount(identifier) ?: return Result.Error(
            statusCode = HttpStatusCode.NotFound,
            errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
            message = "Account not found."
        )

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = hashMapOf(
                "authenticationStrategy" to
                        if (account.fidoCredential.isEmpty()) AuthenticationStrategy.PASSWORD
                        else AuthenticationStrategy.PASSKEY
            )
        )
    }

    suspend fun authenticate(credentials: AuthenticationCredentials): Result {
        val account = accountRepository.getAccount(credentials.identifier) ?: return Result.Error(
            statusCode = HttpStatusCode.NotFound,
            errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
            message = "Account not found."
        )

        if (account.fidoCredential.isNotEmpty() && account.password == null) {
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

        val securityTokens = SecurityToken(
            message = "Authenticated Successfully",
            authorizationToken = jsonWebToken.generateAuthorizationToken(account.uuid.toHexString(), "null"),
            refreshToken = jsonWebToken.generateRefreshToken(account.uuid.toHexString(), "null"),
        )

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = securityTokens
        )
    }

    suspend fun signUp(newAccount: NewAccount): Result {
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
            password = if (newAccount.password == null) null else Hash().generateSaltedHash(newAccount.password),
            type = AccountType.USER,
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
            message = "Account Created.",
            authorizationToken = jsonWebToken.generateAuthorizationToken(account.uuid.toHexString(), "null"),
            refreshToken = jsonWebToken.generateRefreshToken(account.uuid.toHexString(), "null"),
        )

        return Result.Success(
            statusCode = HttpStatusCode.Created,
            code = ResponseCode.ACCOUNT_CREATED,
            data = securityTokens
        )
    }

    suspend fun accountDetails(securityToken: SecurityToken): Result {
        if (securityToken.authorizationToken == null) {
            return Result.Error(
                statusCode = HttpStatusCode.Unauthorized,
                errorCode = ResponseCode.INVALID_TOKEN,
                message = "Authorization token is invalid or expired."
            )
        }
        val jwtResult =
            jsonWebToken.verifySecurityToken(securityToken.authorizationToken, TokenType.AUTHORIZATION_TOKEN)
        if (jwtResult is Result.Error) {
            return jwtResult
        }
        val account =
            accountRepository.getAccount(jwtResult.responseData.toString().replace("\"", "")) ?: return Result.Error(
                statusCode = HttpStatusCode.NotFound,
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found."
            )
        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = account
        )
    }

    fun generateNewSecurityTokens(securityToken: SecurityToken): Result {
        return jsonWebToken.generateSecurityTokenFromRefreshToken(securityToken)
    }
}