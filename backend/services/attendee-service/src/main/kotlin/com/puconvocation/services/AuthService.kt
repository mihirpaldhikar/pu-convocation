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