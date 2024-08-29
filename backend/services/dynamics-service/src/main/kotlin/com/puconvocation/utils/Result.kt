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