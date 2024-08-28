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

import com.puconvocation.Environment
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*

class AuthService(
    private val client: HttpClient,
    environment: Environment
) {

    private val uacRoute = "${environment.authServiceURL}/uac"

    suspend fun isOperationAllowed(authorizationToken: String, rule: String): Boolean {
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