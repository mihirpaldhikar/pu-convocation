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

package com.puconvocation.services

import com.google.gson.Gson
import com.puconvocation.Environment
import com.puconvocation.constants.CachedKeys
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.utils.Result
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*

class AuthService(
    private val client: HttpClient,
    private val cacheService: CacheService,
    private val jsonWebToken: JsonWebToken,
    private val gson: Gson,
    environment: Environment
) {

    private val uacRoute = "${environment.authServiceURL}/uac"

    suspend fun isAllowed(authorizationToken: String?, ruleName: String): Boolean {
        val tokenVerificationResult = jsonWebToken.verifySecurityToken(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (tokenVerificationResult is Result.Error) {
            return false
        }

        val cachedRulesForAccount =
            cacheService.get(CachedKeys.getAllRulesAssociatedWithAccount((tokenVerificationResult.responseData as List<String>)[0]))

        return if (cachedRulesForAccount != null) {
            (gson.fromJson(cachedRulesForAccount, List::class.java) as List<String>).contains(ruleName)
        } else {
            isOperationAllowed(authorizationToken!!, ruleName)
        }
    }

    private suspend fun isOperationAllowed(authorizationToken: String, rule: String): Boolean {
        val response = client.get("$uacRoute/rules/$rule/allowed") {
            cookie(AUTHORIZATION_TOKEN_COOKIE, authorizationToken)
        }

        return response.bodyAsText().toBoolean()
    }

    companion object {
        const val AUTHORIZATION_TOKEN_COOKIE = "__puc_at__"
        const val REFRESH_TOKEN_COOKIE = "__puc_rt__"
    }
}