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

import com.puconvocation.Environment
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.commons.dto.NewUACRule
import com.puconvocation.commons.dto.UpdateUACRuleRequest
import com.puconvocation.controllers.UACController
import com.puconvocation.enums.ResponseCode
import com.puconvocation.utils.Result
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.uacRoute(
    uacController: UACController,
    environment: Environment
) {
    route("/uac") {

        route("/rules") {

            route("/{name}") {

                get("/") {
                    val authorizationToken = getSecurityTokens().authorizationToken
                    val rule = call.parameters["name"] ?: return@get sendResponse(
                        Result.Error(
                            httpStatusCode = HttpStatusCode.BadRequest,
                            error = ErrorResponse(
                                errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                                message = "Please provide a rule name."
                            )
                        )
                    )
                    val result = uacController.getRule(authorizationToken, rule)
                    sendResponse(result)
                }

                get("/allowed") {
                    val host = call.request.host()
                    if (environment.servicesHosts.split(";;").contains(host)) {
                        return@get call.respond(false)
                    }
                    val authorizationToken = getSecurityTokens().authorizationToken
                    val rule = call.parameters["name"] ?: return@get call.respond(false)
                    call.respond(uacController.isRuleAllowedForAccount(authorizationToken, rule))
                }

                patch("/update") {
                    val authorizationToken = getSecurityTokens().authorizationToken
                    val rule = call.parameters["name"] ?: return@patch sendResponse(
                        Result.Error(
                            httpStatusCode = HttpStatusCode.BadRequest,
                            error = ErrorResponse(
                                errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                                message = "Please provide a rule name."
                            )
                        )
                    )
                    val updateUACRuleRequest = call.receive<UpdateUACRuleRequest>()
                    val result = uacController.updateRule(authorizationToken, rule, updateUACRuleRequest)
                    sendResponse(result)

                }
            }

            post("/create") {
                val authorizationToken = getSecurityTokens().authorizationToken
                val rule = call.receive<NewUACRule>()
                val result = uacController.createRule(authorizationToken, rule)
                sendResponse(result)
            }

        }
    }
}