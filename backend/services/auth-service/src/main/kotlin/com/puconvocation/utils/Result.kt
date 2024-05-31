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

import com.google.gson.annotations.Expose
import com.puconvocation.enums.ResponseCode
import io.ktor.http.*

sealed class Result(
    val httpStatusCode: HttpStatusCode? = HttpStatusCode.OK,
    val responseCode: ResponseCode,
    val responseData: Any,
) {
    data class Error(
        val statusCode: HttpStatusCode? = HttpStatusCode.BadRequest,
        @Expose val errorCode: ResponseCode,
        @Expose val message: String,
    ) : Result(
        httpStatusCode = statusCode, responseCode = errorCode, responseData = message
    )

    data class Success(
        val statusCode: HttpStatusCode? = HttpStatusCode.OK,
        val code: ResponseCode = ResponseCode.OK,
        @Expose val data: Any,
        val encodeStringAsJSON: Boolean? = false
    ) : Result(
        httpStatusCode = statusCode, responseCode = code, responseData = data

    )
}