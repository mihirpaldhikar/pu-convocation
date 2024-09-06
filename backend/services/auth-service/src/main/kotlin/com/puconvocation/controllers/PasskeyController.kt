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
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.constants.CachedKeys
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.dao.FidoCredential
import com.puconvocation.security.dao.SecurityToken
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.CacheService
import com.puconvocation.utils.PasskeyUtils
import com.puconvocation.utils.Result
import com.yubico.webauthn.*
import com.yubico.webauthn.data.*
import com.yubico.webauthn.exception.AssertionFailedException
import io.ktor.http.*

class PasskeyController(
    private val rp: RelyingParty,
    private val accountRepository: AccountRepository,
    private val jsonWebToken: JsonWebToken,
    private val gson: Gson,
    private val cacheService: CacheService,
) {
    suspend fun startPasskeyRegistration(identifier: String): Result<String, ErrorResponse> {
        val account = getAccount(identifier) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found"
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

        val pkcOptions = createPublicKeyCredentialCreationOptions(account)
        cacheService.set(CachedKeys.getPasskeyPKCKey(identifier), gson.toJson(pkcOptions))

        return Result.Success(
            pkcOptions.toCredentialsCreateJson(),
        )
    }

    suspend fun startPasskeyRegistrationWithSecurityToken(securityToken: SecurityToken): Result<String, ErrorResponse> {
        val tokenClaims = jsonWebToken.getClaims(
            token = securityToken.authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN
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

        return this.startPasskeyRegistration(tokenClaims[0])

    }

    suspend fun validatePasskeyRegistration(
        identifier: String,
        credentials: String
    ): Result<HashMap<String, Any>, ErrorResponse> {
        val account = getAccount(identifier) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found"
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

        val pkcOptions = cacheService.get(CachedKeys.getPasskeyPKCKey(identifier))
            ?: return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "An internal error occurred."
                )
            )

        val pkc: PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> =
            PublicKeyCredential.parseRegistrationResponseJson(credentials)

        val result = rp.finishRegistration(
            FinishRegistrationOptions.builder()
                .request(gson.fromJson(pkcOptions, PublicKeyCredentialCreationOptions::class.java))
                .response(pkc)
                .build()
        )

        val fidoCredentialAdded = accountRepository.addFidoCredentials(
            account.uuid.toHexString(), FidoCredential(
                keyId = result.keyId.id.base64Url,
                publicKeyCose = result.publicKeyCose.base64Url,
                keyType = result.keyId.type.name,
            )
        )

        if (!fidoCredentialAdded) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "Cannot register Passkey at the moment."
                )
            )
        }

        cacheService.remove(CachedKeys.getPasskeyPKCKey(identifier))
        cacheService.remove(CachedKeys.getPasskeyAssertionKey(identifier))
        cacheService.remove(CachedKeys.getAccountKey(identifier))

        return Result.Success(
            httpStatusCode = HttpStatusCode.Created,
            data = hashMapOf("message" to "Passkey registered.")
        )
    }


    fun startPasskeyChallenge(identifier: String): Result<String, ErrorResponse> {
        val request = rp.startAssertion(
            StartAssertionOptions.builder()
                .username(identifier)
                .build()
        )
        cacheService.set(CachedKeys.getPasskeyAssertionKey(identifier), gson.toJson(request))

        return Result.Success(
            request.toCredentialsGetJson(),
        )
    }

    suspend fun validatePasskeyChallenge(
        identifier: String,
        credentials: String
    ): Result<SecurityToken, ErrorResponse> {

        val account = getAccount(identifier) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found"
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

        val assertion = cacheService.get(CachedKeys.getPasskeyAssertionKey(identifier))
            ?: return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "An internal error occurred."
                )
            )

        val pkc =
            PublicKeyCredential.parseAssertionResponseJson(credentials)
        try {
            val result = rp.finishAssertion(
                FinishAssertionOptions.builder()
                    .request(gson.fromJson(assertion, AssertionRequest::class.java))
                    .response(pkc)
                    .build()
            )

            if (!result.isSuccess) {
                return Result.Error(
                    httpStatusCode = HttpStatusCode.InternalServerError,
                    error = ErrorResponse(
                        errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                        message = "Passkey challenge failed."
                    )
                )
            }

            val securityTokens = SecurityToken(
                payload = "Authenticated Successfully.",
                authorizationToken = jsonWebToken.generateAuthorizationToken(
                    account.uuid.toHexString(),
                    "null",
                ),
                refreshToken = jsonWebToken.generateRefreshToken(account.uuid.toHexString(), "null"),
            )
            return Result.Success(
                securityTokens
            )
        } catch (error: AssertionFailedException) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = error.message ?: "Passkey challenge failed."
                )
            )
        }
    }

    private fun createPublicKeyCredentialCreationOptions(
        user: Account
    ): PublicKeyCredentialCreationOptions {
        val userIdentity =
            UserIdentity.builder()
                .name(user.email)
                .displayName(user.displayName)
                .id(PasskeyUtils.toByteArray(user.uuid))
                .build()

        val authenticatorSelectionCriteria =
            AuthenticatorSelectionCriteria.builder()
                .userVerification(UserVerificationRequirement.REQUIRED)
                .build()

        val startRegistrationOptions =
            StartRegistrationOptions.builder()
                .user(userIdentity)
                .timeout(30000)
                .authenticatorSelection(authenticatorSelectionCriteria)
                .build()

        val options: PublicKeyCredentialCreationOptions =
            rp.startRegistration(startRegistrationOptions)

        return options
    }

    private suspend fun getAccount(identifier: String): Account? {
        val cachedAccount = cacheService.get(CachedKeys.getAccountKey(identifier))

        return if (cachedAccount != null) {
            gson.fromJson(cachedAccount, Account::class.java)
        } else {
            val fetchedAccount = accountRepository.getAccount(identifier)

            if (fetchedAccount != null) {
                cacheService.set(CachedKeys.getAccountKey(identifier), gson.toJson(fetchedAccount))

            }
            fetchedAccount
        }
    }
}