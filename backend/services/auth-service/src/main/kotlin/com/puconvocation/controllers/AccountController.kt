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

import com.puconvocation.commons.dto.AccountWithIAMRoles
import com.puconvocation.commons.dto.AuthenticationCredentials
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.commons.dto.NewAccount
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.repositories.AccountRepository
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
    private val passkeyController: PasskeyController,
    private val iamController: IAMController,
) {
    suspend fun getAuthenticationStrategy(identifier: String): Result<HashMap<String, Any>, ErrorResponse> {
        val account = accountRepository.getAccount(identifier) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found."
            )
        )

        if (account.suspended) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                    message = "Your account has been suspended."
                )
            )
        }

        val authenticationStrategy = if (account.fidoCredential.isEmpty()) AuthenticationStrategy.PASSWORD
        else AuthenticationStrategy.PASSKEY

        return Result.Success(
            hashMapOf(
                "authenticationStrategy" to
                        authenticationStrategy
            )
        )
    }

    suspend fun authenticate(credentials: AuthenticationCredentials): Result<Any, ErrorResponse> {
        val account = accountRepository.getAccount(credentials.identifier) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found."
            )
        )

        if (account.suspended) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                    message = "Your account has been suspended."
                )
            )
        }

        if (account.fidoCredential.isNotEmpty()) {
            val result = passkeyController.startPasskeyChallenge(credentials.identifier)
            return result
        }

        if (credentials.password == null || account.password == null) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.NULL_PASSWORD,
                    message = "Please provide password."
                )
            )
        }

        val passwordMatched = Hash().verify(credentials.password, account.password)

        if (!passwordMatched) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotAcceptable,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_PASSWORD,
                    message = "Password is invalid. Please check your password."
                )
            )
        }

        return Result.Success(
            SecurityToken(
                payload = "Authenticated Successfully",
                authorizationToken = jsonWebToken.generateAuthorizationToken(
                    account.uuid.toHexString(),
                    "null",
                ),
                refreshToken = jsonWebToken.generateRefreshToken(account.uuid.toHexString(), "null"),
            )
        )
    }

    suspend fun createNewAccount(
        newAccount: NewAccount,
        securityToken: SecurityToken
    ): Result<Any, ErrorResponse> {

        val tokenClaims = jsonWebToken.getClaims(
            token = securityToken.authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (tokenClaims.isEmpty()) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_TOKEN,
                    message = "Authorization token is invalid."
                )
            )
        }


        if (!iamController.isAuthorized(
                role = "write:Account",
                principal = tokenClaims[0],
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to create new accounts."
                )
            )
        }

        if (accountRepository.accountExists(newAccount.email) || accountRepository.accountExists(newAccount.username)) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_EXISTS,
                    message = "Account already exists. Please login instead."
                )
            )
        }

        val uuid = ObjectId()
        val account = Account(
            uuid = uuid,
            email = newAccount.email,
            username = newAccount.username,
            avatarURL = "https://assets.puconvocation.com/avatars/default.png",
            displayName = newAccount.displayName,
            designation = newAccount.designation,
            suspended = false,
            password = if (newAccount.password == null) null else Hash().generateSaltedHash(newAccount.password),
            fidoCredential = mutableSetOf()
        )
        val response = accountRepository.createAccount(account)
        if (!response) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_CREATION_ERROR,
                    message = "Account creation failed. Please try again."
                )
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
            securityTokens
        )
    }

    suspend fun accountDetails(securityToken: SecurityToken): Result<Any, ErrorResponse> {
        var tokens: SecurityToken = securityToken;

        var newTokenGenerated = false;

        if (tokens.refreshToken == null && tokens.authorizationToken == null) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Unauthorized,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_TOKEN,
                    message = "Authorization token is invalid or expired."
                )
            )
        }

        if (tokens.refreshToken != null && tokens.authorizationToken == null) {
            val newTokens =
                jsonWebToken.generateSecurityTokenFromRefreshToken(securityToken) ?: return Result.Error(
                    httpStatusCode = HttpStatusCode.Unauthorized,
                    error = ErrorResponse(
                        errorCode = ResponseCode.INVALID_TOKEN,
                        message = "Authorization token is invalid or expired."
                    )
                )


            tokens = newTokens
            newTokenGenerated = true
        }

        val tokenClaims =
            jsonWebToken.getClaims(tokens.authorizationToken!!, TokenType.AUTHORIZATION_TOKEN)

        if (tokenClaims.isEmpty()) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_TOKEN,
                    message = "Authorization token is invalid."
                )
            )
        }

        val account = accountRepository.getAccountWithIAMRoles(tokenClaims[0].replace("\"", ""))
            ?: return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                    message = "Account not found."
                )
            )

        if (newTokenGenerated) {
            return Result.Success(
                SecurityToken(
                    authorizationToken = tokens.authorizationToken,
                    refreshToken = tokens.refreshToken,
                    payload = account
                )
            )
        }

        return Result.Success(
            account
        )
    }

    suspend fun accountDetails(
        authorizationToken: String?,
        identifier: String
    ): Result<AccountWithIAMRoles, ErrorResponse> {
        val tokenClaims = jsonWebToken.getClaims(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (tokenClaims.isEmpty()) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_TOKEN,
                    message = "Authorization token is invalid."
                )

            )
        }


        if (!iamController.isAuthorized(
                role = "read:Account",
                principal = tokenClaims[0],
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view accounts."
                )
            )
        }

        val account = accountRepository.getAccountWithIAMRoles(identifier)
            ?: return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                    message = "Account not found."
                )
            )

        return Result.Success(
            account
        )
    }
}