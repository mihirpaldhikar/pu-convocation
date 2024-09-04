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

import com.puconvocation.security.dao.SecurityToken
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.util.pipeline.*

object CookieName {
    const val AUTHORIZATION_TOKEN_COOKIE = "__puc_at__"
    const val REFRESH_TOKEN_COOKIE = "__puc_rt__"
}


suspend fun PipelineContext<Unit, ApplicationCall>.sendResponse(
    repositoryResult: Result<Any, Error>
) {
    repositoryResult.onSuccess { payload, httpStatusCode ->
        call.respond(
            status = httpStatusCode ?: HttpStatusCode.OK,
            message = payload
        )
    }
    repositoryResult.onError { error, httpStatusCode ->
        call.respond(
            status = httpStatusCode ?: HttpStatusCode.InternalServerError,
            message = error
        )
    }
}

fun PipelineContext<Unit, ApplicationCall>.getSecurityTokens(): SecurityToken {
    val authorizationToken = call.request.cookies[CookieName.AUTHORIZATION_TOKEN_COOKIE]
    val refreshToken = call.request.cookies[CookieName.REFRESH_TOKEN_COOKIE]

    return SecurityToken(
        authorizationToken = authorizationToken,
        refreshToken = refreshToken
    )
}