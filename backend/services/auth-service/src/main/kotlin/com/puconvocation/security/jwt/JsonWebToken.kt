/*
 * Copyright (C) PU Convocation Management System Authors
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

package com.puconvocation.security.jwt

import com.auth0.jwk.JwkProviderBuilder
import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTDecodeException
import com.auth0.jwt.exceptions.TokenExpiredException
import com.puconvocation.Environment
import com.puconvocation.enums.TokenType
import com.puconvocation.security.dao.SecurityToken
import java.security.KeyFactory
import java.security.PrivateKey
import java.security.PublicKey
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.security.spec.PKCS8EncodedKeySpec
import java.util.*
import java.util.concurrent.TimeUnit

class JsonWebToken(
    private val config: Environment.Security.JWT
) {
    private val provider =
        JwkProviderBuilder(config.credentialsAuthority).cached(10, 24, TimeUnit.HOURS)
            .rateLimited(10, 1, TimeUnit.MINUTES).build()

    private data class Keys(
        val authorizationTokenPublicKey: PublicKey,
        val authorizationTokenPrivateKey: PrivateKey,
        val refreshTokenPublicKey: PublicKey,
        val refreshTokenPrivateKey: PrivateKey,
    )

    private fun keys(): Keys {
        val authorizationTokenPublicKey = provider.get(config.tokens.authorization.keyId).publicKey
        val authorizationTokenKeySpec =
            PKCS8EncodedKeySpec(Base64.getDecoder().decode(config.tokens.authorization.privateKey))
        val authorizationTokenPrivateKey = KeyFactory.getInstance("RSA").generatePrivate(authorizationTokenKeySpec)

        val refreshTokenPublicKey = provider.get(config.tokens.refresh.keyId).publicKey
        val refreshTokenKeySpec =
            PKCS8EncodedKeySpec(Base64.getDecoder().decode(config.tokens.refresh.privateKey))
        val refreshTokenPrivateKey = KeyFactory.getInstance("RSA").generatePrivate(refreshTokenKeySpec)

        return Keys(
            authorizationTokenPublicKey = authorizationTokenPublicKey,
            authorizationTokenPrivateKey = authorizationTokenPrivateKey,
            refreshTokenPublicKey = refreshTokenPublicKey,
            refreshTokenPrivateKey = refreshTokenPrivateKey
        )
    }

    private fun jwtVerifier(tokenType: TokenType): JWTVerifier {
        if (tokenType === TokenType.SERVICE_AUTHORIZATION_TOKEN) {
            return JWT.require(
                Algorithm.HMAC512(config.tokens.serviceAuthorization.secret)
            ).withIssuer(config.credentialsAuthority).build()
        }
        if (tokenType === TokenType.INVITATION_TOKEN) {
            return JWT.require(
                Algorithm.HMAC512(config.tokens.invitation.secret)
            ).withIssuer(config.credentialsAuthority).build()
        }
        val keys = keys()
        return JWT.require(
            Algorithm.RSA256(
                if (tokenType == TokenType.REFRESH_TOKEN) keys.refreshTokenPublicKey as RSAPublicKey
                else keys.authorizationTokenPublicKey as RSAPublicKey,
                if (tokenType == TokenType.REFRESH_TOKEN) keys.refreshTokenPrivateKey as RSAPrivateKey
                else keys.authorizationTokenPrivateKey as RSAPrivateKey
            )
        ).withIssuer(config.credentialsAuthority).build()
    }

    fun generateAuthorizationToken(uuid: String, sessionId: String): String {
        val currentTime = System.currentTimeMillis()
        val tokenCreatedAt = Date(currentTime)
        val tokenExpiresAt = Date(currentTime + 3600000)
        val keys = keys()
        return JWT.create().withAudience(config.audience).withIssuer(
            config.credentialsAuthority
        ).withClaim(UUID_CLAIM, uuid).withClaim(
            SESSION_ID_CLAIM, sessionId
        ).withIssuedAt(tokenCreatedAt).withExpiresAt(tokenExpiresAt)
            .withSubject(API_AUTHORIZATION_SUBJECT).sign(
                Algorithm.RSA256(
                    keys.authorizationTokenPublicKey as RSAPublicKey,
                    keys.authorizationTokenPrivateKey as RSAPrivateKey
                )
            )
    }

    fun generateRefreshToken(uuid: String, sessionId: String): String {
        val currentTime = System.currentTimeMillis()
        val tokenCreatedAt = Date(currentTime)
        val tokenExpiresAt = Date(currentTime + 31556952000)
        val keys = keys()
        return JWT.create().withAudience(config.audience).withIssuer(
            config.credentialsAuthority
        ).withClaim(
            SESSION_ID_CLAIM, sessionId
        ).withClaim(
            UUID_CLAIM, uuid
        ).withIssuedAt(tokenCreatedAt)
            .withExpiresAt(tokenExpiresAt)
            .withSubject(API_AUTHORIZATION_SUBJECT).sign(
                Algorithm.RSA256(
                    keys.authorizationTokenPublicKey as RSAPublicKey,
                    keys.authorizationTokenPrivateKey as RSAPrivateKey
                )
            )
    }

    fun getClaims(
        token: String?,
        tokenType: TokenType,
        claims: List<String> = listOf(UUID_CLAIM)
    ): List<String> {

        if (token == null) {
            return emptyList()
        }

        return try {
            val jwtVerifier = jwtVerifier(tokenType)

            val claimData: MutableList<String> = mutableListOf();

            claims.map { claim ->
                claimData.add(jwtVerifier.verify(token).getClaim(claim).asString().replace("\"", ""))
            }
            claimData
        } catch (e: TokenExpiredException) {
            return emptyList()
        }
    }

    fun generateSecurityTokenFromRefreshToken(securityToken: SecurityToken): SecurityToken? {
        return try {
            val jwtVerifier = jwtVerifier(TokenType.REFRESH_TOKEN)
            val uuid = jwtVerifier.verify(securityToken.refreshToken).getClaim(UUID_CLAIM).asString()
            val sessionId =
                jwtVerifier.verify(securityToken.refreshToken).getClaim(SESSION_ID_CLAIM).asString()

            SecurityToken(
                authorizationToken = generateAuthorizationToken(uuid, sessionId),
                refreshToken = generateRefreshToken(uuid, sessionId)
            )

        } catch (e: TokenExpiredException) {
            return null
        } catch (e: JWTDecodeException) {
            return null
        }
    }

    fun generateInvitationToken(invitationId: String): String {
        val currentTime = System.currentTimeMillis()
        val tokenCreatedAt = Date(currentTime)
        val tokenExpiresAt = Date(currentTime + 259200000)

        return JWT.create()
            .withAudience(config.audience)
            .withIssuer(config.credentialsAuthority)
            .withClaim(INVITATION_ID_CLAIM, invitationId)
            .withIssuedAt(tokenCreatedAt)
            .withExpiresAt(tokenExpiresAt)
            .withSubject(API_AUTHORIZATION_SUBJECT)
            .sign(Algorithm.HMAC512(config.tokens.invitation.secret))
    }

    fun generateServiceAuthorizationToken(serviceName: String): String {
        val currentTime = System.currentTimeMillis()
        val tokenCreatedAt = Date(currentTime)
        val tokenExpiresAt = Date(currentTime + 300000)

        return JWT.create()
            .withAudience(config.audience)
            .withIssuer(config.credentialsAuthority)
            .withClaim(SERVICE_NAME, serviceName)
            .withIssuedAt(tokenCreatedAt)
            .withExpiresAt(tokenExpiresAt)
            .withSubject(API_AUTHORIZATION_SUBJECT)
            .sign(Algorithm.HMAC512(config.tokens.serviceAuthorization.secret))
    }

    companion object {
        const val UUID_CLAIM = "uuid"
        const val INVITATION_ID_CLAIM = "invitation_id"
        const val API_AUTHORIZATION_SUBJECT = "iam.puconvocation.com"
        const val SESSION_ID_CLAIM = "session"
        const val SERVICE_NAME = "serviceName"
    }
}