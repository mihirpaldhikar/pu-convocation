/*
 * Copyright (C) PU Convocation Management System Authors
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

import io.ktor.http.*

sealed interface Result<out D, out E : Error> {
    val httpStatusCode: HttpStatusCode?

    data class Success<out D>(val data: D, override val httpStatusCode: HttpStatusCode? = HttpStatusCode.OK) :
        Result<D, Nothing>

    data class Error<out E : com.puconvocation.utils.Error>(
        val error: E,
        override val httpStatusCode: HttpStatusCode? = HttpStatusCode.InternalServerError
    ) : Result<Nothing, E>
}

inline fun <T, E : Error, R> Result<T, E>.map(map: (T) -> R): Result<R, E> {
    return when (this) {
        is Result.Error -> Result.Error(error)
        is Result.Success -> Result.Success(map(data))
    }
}

fun <T, E : Error> Result<T, E>.asEmptyDataResult(): EmptyResult<E> {
    return map { }
}

inline fun <T, E : Error> Result<T, E>.onSuccess(action: (T, HttpStatusCode?) -> Unit): Result<T, E> {
    return when (this) {
        is Result.Error -> this
        is Result.Success -> {
            action(data, httpStatusCode)
            this
        }
    }
}

inline fun <T, E : Error> Result<T, E>.onError(action: (E, HttpStatusCode?) -> Unit): Result<T, E> {
    return when (this) {
        is Result.Error -> {
            action(error, httpStatusCode)
            this
        }

        is Result.Success -> this
    }
}

typealias EmptyResult<E> = Result<Unit, E>