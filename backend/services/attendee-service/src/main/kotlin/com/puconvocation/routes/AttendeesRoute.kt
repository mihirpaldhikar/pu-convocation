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
import com.puconvocation.controllers.AttendeeController
import com.puconvocation.enums.ResponseCode
import com.puconvocation.utils.Result
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.attendeesRoute(
    attendeeController: AttendeeController
) {
    route("/attendees") {
        get("/{identifier}") {
            val identifier = call.parameters["identifier"] ?: return@get sendResponse(
                Result.Error(
                    ErrorResponse(
                        errorCode = ResponseCode.INVALID_OR_NULL_IDENTIFIER,
                        message = "Please provide a valid identifier."
                    )

                )
            )

            val result = attendeeController.getAttendee(identifier)
            sendResponse(result)
        }

        get("/all") {
            val authorizationToken = getSecurityTokens().authorizationToken
            val page = call.request.queryParameters["page"]?.toInt() ?: 1
            val limit = call.request.queryParameters["limit"]?.toInt() ?: 10
            val result = attendeeController.getAttendees(authorizationToken, page, limit)
            sendResponse(result)
        }

        post("/upload") {
            val authorizationToken = getSecurityTokens().authorizationToken
            val multipartData = call.receiveMultipart()
            val result = attendeeController.uploadAttendees(authorizationToken, multipartData)
            sendResponse(result)
        }

        get("/totalCount") {
            val result = attendeeController.getTotalAttendees()
            sendResponse(result)
        }

        get("/verificationToken/{verificationToken}") {
            val authorizationToken = getSecurityTokens().authorizationToken
            val token = call.parameters["verificationToken"] ?: return@get sendResponse(
                Result.Error(
                    ErrorResponse(
                        errorCode = ResponseCode.INVALID_OR_NULL_IDENTIFIER,
                        message = "Please provide a valid token."
                    )
                )
            )
            val result = attendeeController.getAttendeeFromVerificationToken(authorizationToken, token)
            sendResponse(result)
        }

        post("/mutateAttendeeLock") {
            val authorizationToken = getSecurityTokens().authorizationToken
            val locked = call.request.queryParameters["locked"]?.toBooleanStrictOrNull() ?: return@post sendResponse(
                Result.Error(
                    ErrorResponse(
                        errorCode = ResponseCode.BAD_REQUEST,
                        message = "Please provide locked value as true or false as query parameter."
                    )
                )
            )
            val result = attendeeController.mutateAttendeeLock(authorizationToken, locked)
            sendResponse(result)
        }
    }
}