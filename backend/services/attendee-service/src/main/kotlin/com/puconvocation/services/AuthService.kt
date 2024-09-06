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

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.google.gson.Gson
import com.puconvocation.Environment
import com.puconvocation.constants.CachedKeys
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import org.bson.types.ObjectId

class AuthService(
    private val client: HttpClient,
    private val cacheService: CacheService,
    private val jsonWebToken: JsonWebToken,
    private val json: ObjectMapper,
    environment: Environment
) {

    private val uacRoute = "${environment.authServiceURL}/uac"

    suspend fun isAllowed(string: String?, ruleName: String): Boolean {

        if (string.isNullOrEmpty()) return false

        if (ObjectId.isValid(string)) {
            val cachedRulesForAccount =
                cacheService.get(CachedKeys.getAllRulesAssociatedWithAccount(string))

            return if (cachedRulesForAccount != null) {
                json.readValue<List<String>>(cachedRulesForAccount).contains(ruleName)
            } else {
                isOperationAllowed(string, ruleName)
            }
        }
        val claims = jsonWebToken.getClaims(
            token = string,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (claims.isEmpty()) return false

        val cachedRulesForAccount =
            cacheService.get(CachedKeys.getAllRulesAssociatedWithAccount(claims[0]))

        return if (cachedRulesForAccount != null) {
            json.readValue<List<String>>(cachedRulesForAccount).contains(ruleName)
        } else {
            isOperationAllowed(claims[0], ruleName)
        }
    }

    private suspend fun isOperationAllowed(uuid: String, rule: String): Boolean {
        val response = client.get("$uacRoute/rules/$rule/allowed") {
            header("X-UAC-CHECK", uuid)
        }

        return response.bodyAsText().toBoolean()
    }
}