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

package com.puconvocation.security.jwt

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.TokenExpiredException
import com.puconvocation.enums.TokenType
import com.puconvocation.security.dao.JWTMetadata
import java.security.KeyFactory
import java.security.PrivateKey
import java.security.PublicKey
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.security.spec.PKCS8EncodedKeySpec
import java.util.*

class JsonWebToken(
    private val jwtMetadata: JWTMetadata
) {
    private data class Keys(
        val authorizationTokenPublicKey: PublicKey,
        val authorizationTokenPrivateKey: PrivateKey,
        val refreshTokenPublicKey: PublicKey,
        val refreshTokenPrivateKey: PrivateKey,
    )

    private fun keys(): Keys {
        val authorizationTokenPublicKey = jwtMetadata.provider.get(jwtMetadata.authorizationTokenKeyId).publicKey
        val authorizationTokenKeySpec =
            PKCS8EncodedKeySpec(Base64.getDecoder().decode(jwtMetadata.authorizationTokenPrivateKey))
        val authorizationTokenPrivateKey = KeyFactory.getInstance("RSA").generatePrivate(authorizationTokenKeySpec)

        val refreshTokenPublicKey = jwtMetadata.provider.get(jwtMetadata.authorizationTokenKeyId).publicKey
        val refreshTokenKeySpec =
            PKCS8EncodedKeySpec(Base64.getDecoder().decode(jwtMetadata.refreshTokenPrivateKey))
        val refreshTokenPrivateKey = KeyFactory.getInstance("RSA").generatePrivate(refreshTokenKeySpec)

        return Keys(
            authorizationTokenPublicKey = authorizationTokenPublicKey,
            authorizationTokenPrivateKey = authorizationTokenPrivateKey,
            refreshTokenPublicKey = refreshTokenPublicKey,
            refreshTokenPrivateKey = refreshTokenPrivateKey
        )
    }

    private fun jwtVerifier(tokenType: TokenType): JWTVerifier {
        val keys = keys()
        return JWT.require(
            Algorithm.RSA256(
                if (tokenType == TokenType.REFRESH_TOKEN) keys.refreshTokenPublicKey as RSAPublicKey
                else keys.authorizationTokenPublicKey as RSAPublicKey,
                if (tokenType == TokenType.REFRESH_TOKEN) keys.refreshTokenPrivateKey as RSAPrivateKey
                else keys.authorizationTokenPrivateKey as RSAPrivateKey
            )
        ).withIssuer(jwtMetadata.issuer).build()
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
                claimData.add(jwtVerifier.verify(token).getClaim(claim).asString())
            }

            claimData
        } catch (e: TokenExpiredException) {
            return emptyList()
        }
    }

    companion object {
        const val UUID_CLAIM = "uuid"
    }
}