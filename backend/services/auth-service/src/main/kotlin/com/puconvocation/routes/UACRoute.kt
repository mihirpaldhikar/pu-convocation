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
            get("/{name}") {
                val authorizationToken = getSecurityTokens().authorizationToken
                val rule = call.parameters["name"] ?: return@get sendResponse(
                    Result.Error(
                        statusCode = HttpStatusCode.BadRequest,
                        errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                        message = "Please provide a rule name."
                    )
                )
                val result = uacController.getRule(authorizationToken, rule)
                sendResponse(result)
            }

            post("/create") {
                val authorizationToken = getSecurityTokens().authorizationToken
                val rule = call.receive<NewUACRule>()
                val result = uacController.createRule(authorizationToken, rule)
                sendResponse(result)
            }

            get("/{name}/allowed") {
                val host = call.request.host()
                if (host != environment.attendeeServiceHost) {
                    return@get call.respond(false)
                }
                val authorizationToken = getSecurityTokens().authorizationToken
                val rule = call.parameters["name"] ?: return@get call.respond(false)
                call.respond(uacController.isRuleAllowedForAccount(authorizationToken, rule))
            }

            patch("/{name}/update") {
                val authorizationToken = getSecurityTokens().authorizationToken
                val rule = call.parameters["name"] ?: return@patch sendResponse(
                    Result.Error(
                        statusCode = HttpStatusCode.BadRequest,
                        errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                        message = "Please provide a rule name."
                    )
                )
                val updateUACRuleRequest = call.receive<UpdateUACRuleRequest>()
                val result = uacController.updateRule(authorizationToken, rule, updateUACRuleRequest)
                sendResponse(result)

            }

        }

        get("/{identifier}/rules") {
            val authorizationToken = getSecurityTokens().authorizationToken
            val identifier = call.parameters["identifier"] ?: return@get sendResponse(
                Result.Error(
                    statusCode = HttpStatusCode.BadRequest,
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "Please provide a account identifier."
                )
            )
            val result = uacController.getAccountRules(authorizationToken, identifier)
            sendResponse(result)
        }
    }
}