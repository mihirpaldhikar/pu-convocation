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

package com.puconvocation.utils

import com.puconvocation.Environment
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.security.dao.SecurityToken
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.date.*
import io.ktor.util.pipeline.*
import org.koin.java.KoinJavaComponent

object CookieName {
    const val AUTHORIZATION_TOKEN_COOKIE = "__puc_at__"
    const val REFRESH_TOKEN_COOKIE = "__puc_rt__"
}

val environment: Environment by KoinJavaComponent.inject(Environment::class.java)

suspend fun RoutingCall.sendResponse(
    result: Result<Any, Error>
) {
    result.onSuccess { payload, httpStatusCode ->
        respond(
            status = httpStatusCode ?: HttpStatusCode.OK,
            message = payload
        )
    }
    result.onError { error, httpStatusCode ->
        respond(
            status = httpStatusCode ?: HttpStatusCode.InternalServerError,
            message = error
        )
    }
}

fun RoutingCall.setCookie(
    name: String,
    value: String,
    expiresAt: Long,
    httpOnly: Boolean = true,
) {
    response.cookies.append(
        Cookie(
            name = name,
            value = value,
            expires = GMTDate(System.currentTimeMillis() + expiresAt),
            httpOnly = httpOnly,
            domain = if (environment.developmentMode) "localhost" else ".puconvocation.com",
            path = "/",
            secure = !environment.developmentMode,
            extensions = hashMapOf("SameSite" to "lax")
        )
    )
}

suspend fun RoutingCall.sendResponseWithAccountCookies(result: Result<Any, ErrorResponse>) {
    result.onSuccess { data, httpStatusCode ->
        if (data is SecurityToken) {
            data.authorizationToken?.let {
                setCookie(
                    name = CookieName.AUTHORIZATION_TOKEN_COOKIE,
                    value = it,
                    expiresAt = 3600000
                )
            }
            data.refreshToken?.let {
                setCookie(
                    name = CookieName.REFRESH_TOKEN_COOKIE,
                    value = it,
                    expiresAt = 2629800000
                )
            }
            if (data.payload != null) {
                return respond(
                    status = httpStatusCode ?: HttpStatusCode.OK,
                    message = data.payload
                )
            }
        }
        if (data is String) {
            response.headers.append("Content-Type", "application/json")
            return respond(
                message = data.toString()
            )
        }

    }

    return sendResponse(result)
}

fun RoutingCall.getSecurityTokens(): SecurityToken {
    val authorizationToken = request.cookies[CookieName.AUTHORIZATION_TOKEN_COOKIE]
    val refreshToken = request.cookies[CookieName.REFRESH_TOKEN_COOKIE]

    return SecurityToken(
        authorizationToken = authorizationToken,
        refreshToken = refreshToken
    )
}

suspend fun RoutingCall.removeSecurityTokens() {
    setCookie(
        name = CookieName.AUTHORIZATION_TOKEN_COOKIE,
        value = "null",
        expiresAt = 1
    )
    setCookie(
        name = CookieName.REFRESH_TOKEN_COOKIE,
        value = "null",
        expiresAt = 1
    )
    sendResponse(
        Result.Success(
            hashMapOf("message" to "Logged out.")
        )
    )
}