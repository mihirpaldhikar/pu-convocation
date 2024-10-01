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

import com.puconvocation.Environment
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.commons.dto.NewIAMRole
import com.puconvocation.commons.dto.UpdateIAMRole
import com.puconvocation.controllers.IAMController
import com.puconvocation.enums.ResponseCode
import com.puconvocation.utils.Result
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.http.*
import io.ktor.server.plugins.origin
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.iamRoute(
    iamController: IAMController,
    companionServices: Set<Environment.Service.CompanionService>,
    developmentMode: Boolean
) {
    route("/iam") {

        get("/authorized") {
            if (!developmentMode && companionServices.filter { it.address.contains(call.request.origin.remoteAddress) }
                    .isEmpty()) {
                return@get call.respond(false)

            }
            val iamHeader = call.request.headers["X-IAM-CHECK"]
            if (iamHeader.isNullOrBlank()) {
                return@get call.respond(false)
            }

            val split = iamHeader.split("@")
            val role = split[0]
            val principal = split[1]
            call.respond(iamController.isAuthorized(role, principal))
        }

        route("/{name}") {

            get("/") {
                val authorizationToken = call.getSecurityTokens().authorizationToken
                val rule = call.parameters["name"] ?: return@get call.sendResponse(
                    Result.Error(
                        httpStatusCode = HttpStatusCode.BadRequest,
                        error = ErrorResponse(
                            errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                            message = "Please provide a rule name."
                        )
                    )
                )
                val result = iamController.getRule(authorizationToken, rule)
                call.sendResponse(result)
            }

            patch("/update") {
                val authorizationToken = call.getSecurityTokens().authorizationToken
                val rule = call.parameters["name"] ?: return@patch call.sendResponse(
                    Result.Error(
                        httpStatusCode = HttpStatusCode.BadRequest,
                        error = ErrorResponse(
                            errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                            message = "Please provide a rule name."
                        )
                    )
                )
                val updateIAMRole = call.receive<UpdateIAMRole>()
                val result = iamController.updateRule(authorizationToken, rule, updateIAMRole)
                call.sendResponse(result)

            }
        }

        post("/create") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val rule = call.receive<NewIAMRole>()
            val result = iamController.createRule(authorizationToken, rule)
            call.sendResponse(result)
        }


    }
}