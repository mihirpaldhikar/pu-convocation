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

package com.puconvocation.controllers

import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.commons.dto.Popular
import com.puconvocation.commons.dto.WeeklyTraffic
import com.puconvocation.database.mongodb.repositories.AnalyticsRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.services.AuthService
import com.puconvocation.utils.Result
import io.ktor.http.HttpStatusCode
import java.time.LocalDate
import java.time.LocalDateTime

class AnalyticsController(
    private val analyticsRepository: AnalyticsRepository,
    private val authService: AuthService,
) {

    suspend fun weeklyTraffic(
        authorizationToken: String?,
        weekStartDate: String
    ): Result<WeeklyTraffic, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "read:Analytics",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view analytics."
                )
            )
        }

        val formattedDate = weekStartDate.split("-")
        if (formattedDate.size != 3) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.BAD_REQUEST,
                    message = "The date is not properly formatted."
                )
            )
        }
        return Result.Success(
            analyticsRepository.weeklyTraffic(
                LocalDateTime.of(
                    formattedDate[0].toInt(),
                    formattedDate[1].toInt(),
                    formattedDate[2].toInt(),
                    0,
                    0
                )
            )
        )
    }

    suspend fun trafficOnDate(
        authorizationToken: String?,
        date: String
    ): Result<List<Popular>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "read:Analytics",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view analytics."
                )
            )
        }

        val formattedDate = date.split("-")
        if (formattedDate.size != 3) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.BAD_REQUEST,
                    message = "The date is not properly formatted."
                )
            )
        }
        return Result.Success(
            analyticsRepository.trafficOnDate(
                LocalDate.of(
                    formattedDate[0].toInt(),
                    formattedDate[1].toInt(),
                    formattedDate[2].toInt(),
                )
            )
        )
    }

    suspend fun popularLang(authorizationToken: String?): Result<List<Popular>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "read:Analytics",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view analytics."
                )
            )
        }

        return Result.Success(
            analyticsRepository.popularLangs()
        )
    }

    suspend fun popularCountries(authorizationToken: String?): Result<List<Popular>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "read:Analytics",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view analytics."
                )
            )
        }

        return Result.Success(
            analyticsRepository.popularCountries()
        )
    }

    suspend fun popularStatesOfCountry(
        authorizationToken: String?,
        countryCode: String
    ): Result<List<Popular>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "read:Analytics",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view analytics."
                )
            )
        }

        return Result.Success(
            analyticsRepository.popularStatesOfCountry(countryCode)
        )
    }

    suspend fun popularDistrictsWithInStateOfCountry(
        authorizationToken: String?,
        countryCode: String,
        state: String
    ): Result<List<Popular>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "read:Analytics",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view analytics."
                )
            )
        }
        return Result.Success(
            analyticsRepository.popularDistrictsWithInStateOfCountry(countryCode, state)
        )
    }
}