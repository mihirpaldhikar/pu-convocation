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

import com.puconvocation.commons.dto.NewUACRule
import com.puconvocation.controllers.UACController
import com.puconvocation.enums.ResponseCode
import com.puconvocation.utils.Result
import com.puconvocation.utils.sendResponse
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.uacRoute(
    uacController: UACController
) {
    route("/uac") {
        route("/rules") {
            get("/{name}") {
                val rule = call.parameters["name"] ?: return@get sendResponse(
                    Result.Error(
                        statusCode = HttpStatusCode.BadRequest,
                        errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                        message = "Please provide a rule name."
                    )
                )
                val result = uacController.getRule(rule)
                sendResponse(result)
            }

            post("/create") {
                val rule = call.receive<NewUACRule>()
                val result = uacController.createRule(rule)
                sendResponse(result)
            }
        }
    }
}