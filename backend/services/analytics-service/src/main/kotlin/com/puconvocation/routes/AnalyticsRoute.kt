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

package com.puconvocation.routes

import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.controllers.AnalyticsController
import com.puconvocation.enums.ResponseCode
import com.puconvocation.utils.Result
import com.puconvocation.utils.sendResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.routing.*

fun Route.analyticsRoute(
    analyticsController: AnalyticsController
) {
    route("/analytics") {
        get("/weeklyTraffic") {
            val date = call.request.queryParameters["date"] ?: return@get call.sendResponse(
                Result.Error(
                    httpStatusCode = HttpStatusCode.BadRequest,
                    error = ErrorResponse(
                        errorCode = ResponseCode.BAD_REQUEST,
                        message = "Please provide timestamp as query parameter."
                    )
                )
            )
            val result = analyticsController.weeklyTraffic(date)
            call.sendResponse(result)
        }

        get("/popularLangs") {
            val result = analyticsController.popularLang()
            call.sendResponse(result)
        }

        get("/popularCountries") {
            val result = analyticsController.popularCountries()
            call.sendResponse(result)
        }

        get("/popularStatesOfCountry") {
            val country = call.request.queryParameters["country"] ?: return@get call.sendResponse(
                Result.Error(
                    httpStatusCode = HttpStatusCode.BadRequest,
                    error = ErrorResponse(
                        errorCode = ResponseCode.BAD_REQUEST,
                        message = "Please provide country as query parameter."
                    )
                )
            )
            val result = analyticsController.popularStatesOfCounty(country)
            call.sendResponse(result)
        }
    }
}