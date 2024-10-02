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

package com.puconvocation.routes

import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.controllers.AnalyticsController
import com.puconvocation.enums.ResponseCode
import com.puconvocation.services.KafkaService
import com.puconvocation.utils.Result
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.plugins.origin
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route

fun Route.analyticsRoute(
    analyticsController: AnalyticsController,
    kafkaService: KafkaService
) {
    route("/analytics") {
        post("/telemetry") {
            val analyticsHeader = call.request.headers["x-telemetry"]

            if (analyticsHeader != null) {
                kafkaService.produce("$analyticsHeader;${call.request.origin.remoteHost}")
            }
            call.respondText("Recorded")
        }

        get("/weeklyTraffic") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val date = call.request.queryParameters["date"] ?: return@get call.sendResponse(
                Result.Error(
                    httpStatusCode = HttpStatusCode.BadRequest,
                    error = ErrorResponse(
                        errorCode = ResponseCode.BAD_REQUEST,
                        message = "Please provide timestamp as query parameter."
                    )
                )
            )
            val result = analyticsController.weeklyTraffic(authorizationToken, date)
            call.sendResponse(result)
        }

        get("/trafficOnDate") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val date = call.request.queryParameters["date"] ?: return@get call.sendResponse(
                Result.Error(
                    httpStatusCode = HttpStatusCode.BadRequest,
                    error = ErrorResponse(
                        errorCode = ResponseCode.BAD_REQUEST,
                        message = "Please provide timestamp as query parameter."
                    )
                )
            )
            val result = analyticsController.trafficOnDate(authorizationToken, date)
            call.sendResponse(result)
        }

        get("/popularLangs") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val result = analyticsController.popularLang(authorizationToken)
            call.sendResponse(result)
        }

        get("/popularCountries") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val result = analyticsController.popularCountries(authorizationToken)
            call.sendResponse(result)
        }

        get("/popularStatesOfCountry") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val country = call.request.queryParameters["country"] ?: return@get call.sendResponse(
                Result.Error(
                    httpStatusCode = HttpStatusCode.BadRequest,
                    error = ErrorResponse(
                        errorCode = ResponseCode.BAD_REQUEST,
                        message = "Please provide country as query parameter."
                    )
                )
            )
            val result = analyticsController.popularStatesOfCountry(authorizationToken, country)
            call.sendResponse(result)
        }

        get("/popularDistrictsWithInStateOfCountry") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val country = call.request.queryParameters["country"] ?: return@get call.sendResponse(
                Result.Error(
                    httpStatusCode = HttpStatusCode.BadRequest,
                    error = ErrorResponse(
                        errorCode = ResponseCode.BAD_REQUEST,
                        message = "Please provide country as query parameter."
                    )
                )
            )
            val state = call.request.queryParameters["state"] ?: return@get call.sendResponse(
                Result.Error(
                    httpStatusCode = HttpStatusCode.BadRequest,
                    error = ErrorResponse(
                        errorCode = ResponseCode.BAD_REQUEST,
                        message = "Please provide state as query parameter."
                    )
                )
            )

            val result = analyticsController.popularDistrictsWithInStateOfCountry(authorizationToken, country, state)
            call.sendResponse(result)
        }
    }
}