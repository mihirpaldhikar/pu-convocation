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

import com.google.common.cache.CacheBuilder
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.dao.FidoCredential
import com.puconvocation.security.dao.SecurityToken
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.utils.PasskeyUtils
import com.puconvocation.utils.Result
import com.yubico.webauthn.*
import com.yubico.webauthn.data.*
import com.yubico.webauthn.exception.AssertionFailedException
import io.ktor.http.*
import java.util.concurrent.TimeUnit

class PasskeyController(
    private val rp: RelyingParty,
    private val accountRepository: AccountRepository,
    private val jsonWebToken: JsonWebToken
) {
    private val pkcCache = CacheBuilder.newBuilder().expireAfterAccess(5, TimeUnit.MINUTES)
        .build<String, PublicKeyCredentialCreationOptions>()

    private val assertionCache = CacheBuilder.newBuilder().expireAfterAccess(5, TimeUnit.MINUTES)
        .build<String, AssertionRequest>()

    suspend fun startPasskeyRegistration(identifier: String): Result {
        val account = accountRepository.getAccount(identifier) ?: return Result.Error(
            statusCode = HttpStatusCode.NotFound,
            errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
            message = "Account not found"
        )

        if (account.suspended) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                message = "Your account has been suspended."
            )
        }

        val pkcOptions = createPublicKeyCredentialCreationOptions(account)
        pkcCache.put(identifier, pkcOptions)

        return Result.Success(
            data = pkcOptions.toCredentialsCreateJson(),
            encodeStringAsJSON = true
        )
    }

    suspend fun startPasskeyRegistrationWithSecurityToken(securityToken: SecurityToken): Result {
        if (securityToken.authorizationToken == null) {
            return Result.Error(
                statusCode = HttpStatusCode.Unauthorized,
                errorCode = ResponseCode.INVALID_OR_NULL_TOKEN,
                message = "Invalid authorization token"
            )
        }
        val jwtVerificationResult = jsonWebToken.verifySecurityToken(
            authorizationToken = securityToken.authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN
        )

        if (jwtVerificationResult is Result.Error) {
            return jwtVerificationResult
        }

        return this.startPasskeyRegistration(jwtVerificationResult.responseData as String)

    }

    suspend fun validatePasskeyRegistration(identifier: String, credentials: String): Result {
        val account = accountRepository.getAccount(identifier) ?: return Result.Error(
            statusCode = HttpStatusCode.NotFound,
            errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
            message = "Account not found"
        )

        if (account.suspended) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                message = "Your account has been suspended."
            )
        }

        val pkc: PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> =
            PublicKeyCredential.parseRegistrationResponseJson(credentials)

        val result = rp.finishRegistration(
            FinishRegistrationOptions.builder()
                .request(pkcCache.getIfPresent(identifier))
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
                statusCode = HttpStatusCode.InternalServerError,
                errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                message = "Cannot register Passkey at the moment."
            )
        }

        return Result.Success(
            statusCode = HttpStatusCode.Created,
            code = ResponseCode.OK,
            data = hashMapOf("message" to "Passkey registered.")
        )
    }


    fun startPasskeyChallenge(identifier: String): Result {
        val request = rp.startAssertion(
            StartAssertionOptions.builder()
                .username(identifier)
                .build()
        )
        assertionCache.put(identifier, request)
        return Result.Success(
            data = request.toCredentialsGetJson(),
            encodeStringAsJSON = true
        )
    }

    suspend fun validatePasskeyChallenge(identifier: String, credentials: String): Result {

        val account = accountRepository.getAccount(identifier) ?: return Result.Error(
            statusCode = HttpStatusCode.NotFound,
            errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
            message = "Account not found."
        )

        if (account.suspended) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                message = "Your account has been suspended."
            )
        }

        val pkc =
            PublicKeyCredential.parseAssertionResponseJson(credentials)
        try {
            val result = rp.finishAssertion(
                FinishAssertionOptions.builder()
                    .request(assertionCache.getIfPresent(identifier))
                    .response(pkc)
                    .build()
            )

            if (!result.isSuccess) {
                return Result.Error(
                    statusCode = HttpStatusCode.InternalServerError,
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "Passkey challenge failed."
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
                statusCode = HttpStatusCode.OK,
                code = ResponseCode.OK,
                data = securityTokens
            )
        } catch (error: AssertionFailedException) {
            return Result.Error(
                statusCode = HttpStatusCode.InternalServerError,
                errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                message = error.message ?: "Passkey challenge failed."
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
}