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
import com.puconvocation.Environment
import com.puconvocation.commons.dto.AccountWithIAMRoles
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import org.bson.types.ObjectId

class AuthService(
    private val client: HttpClient,
    private val cache: CacheController,
    private val jsonWebToken: JsonWebToken,
    private val json: ObjectMapper,
    environment: Environment
) {

    private val iamRoute = "${environment.authServiceURL}/iam"

    suspend fun isAuthorized(role: String, principal: String?): Boolean {

        val separator = role.split(":")
        val operation = separator[0]
        val iam = separator[1]

        if (principal.isNullOrEmpty()) return false

        if (ObjectId.isValid(principal)) {
            val cachedRulesForAccount =
                cache.get(CachedKeys.accountWithIAMRolesKey(principal))

            return if (cachedRulesForAccount != null) {
                json.readValue<AccountWithIAMRoles>(cachedRulesForAccount).iamRoles.contains(role)
            } else {
                isOperationAllowed(principal, role)
            }
        }
        val claims = jsonWebToken.getClaims(
            token = principal,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (claims.isEmpty()) return false

        val cachedRulesForAccount =
            cache.get(CachedKeys.accountWithIAMRolesKey(claims[0]))

        return if (cachedRulesForAccount != null) {
            val roles = json.readValue<AccountWithIAMRoles>(cachedRulesForAccount).iamRoles
            if (operation == "read") {
                roles.contains("write:$iam") ||
                        roles.contains("read:$iam")
            } else {
                roles.contains("write:$iam")
            }
        } else {
            isOperationAllowed(claims[0], role)
        }
    }

    private suspend fun isOperationAllowed(uuid: String, rule: String): Boolean {
        val response = client.get("$iamRoute/authorized") {
            header("X-IAM-CHECK", "$rule@$uuid")
        }

        return response.bodyAsText().toBooleanStrictOrNull() ?: false
    }
}