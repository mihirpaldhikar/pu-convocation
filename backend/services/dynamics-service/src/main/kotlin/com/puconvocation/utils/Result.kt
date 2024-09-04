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