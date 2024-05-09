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
import com.puconvocation.security.dao.SecurityToken
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.util.date.*
import io.ktor.util.pipeline.*
import org.koin.java.KoinJavaComponent

object CookieName {
    const val AUTHORIZATION_TOKEN_COOKIE = "__puc_at__"
    const val REFRESH_TOKEN_COOKIE = "__puc_rt__"
}

val environment: Environment by KoinJavaComponent.inject(Environment::class.java)

suspend fun PipelineContext<Unit, ApplicationCall>.sendResponse(
    repositoryResult: Result
) {
    call.respond(
        status = repositoryResult.httpStatusCode ?: HttpStatusCode.OK,
        message = if (repositoryResult is Result.Success) {
            repositoryResult.responseData
        } else {
            repositoryResult
        }
    )
}

fun PipelineContext<Unit, ApplicationCall>.setCookie(
    name: String,
    value: String,
    expiresAt: Long,
    httpOnly: Boolean = true,
) {
    call.response.cookies.append(
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

suspend fun PipelineContext<Unit, ApplicationCall>.setAccountCookies(result: Result) {
    if (result is Result.Success &&
        result.responseData is SecurityToken &&
        result.responseData.refreshToken != null &&
        result.responseData.authorizationToken != null
    ) {
        setCookie(
            name = CookieName.AUTHORIZATION_TOKEN_COOKIE,
            value = result.responseData.authorizationToken,
            expiresAt = 3600000
        )
        setCookie(
            name = CookieName.REFRESH_TOKEN_COOKIE,
            value = result.responseData.refreshToken,
            expiresAt = 2629800000
        )
        if (result.responseData.message != null) {
            return sendResponse(
                Result.Success(
                    data = mapOf("message" to result.responseData.message),
                )
            )
        }
    }
    return sendResponse(result)
}

fun PipelineContext<Unit, ApplicationCall>.getSecurityTokens(): SecurityToken {
    val authorizationToken = call.request.cookies[CookieName.AUTHORIZATION_TOKEN_COOKIE]
    val refreshToken = call.request.cookies[CookieName.REFRESH_TOKEN_COOKIE]

    return SecurityToken(
        authorizationToken = authorizationToken,
        refreshToken = refreshToken
    )
}