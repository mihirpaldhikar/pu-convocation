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
import com.puconvocation.commons.dto.TransactionRequest
import com.puconvocation.controllers.TransactionController
import com.puconvocation.enums.ResponseCode
import com.puconvocation.utils.Result
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.server.request.receive
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route

fun Routing.transactionsRoute(
    transactionController: TransactionController
) {
    route("/transactions") {
        get("/{transactionId}") {
            val transactionId = call.parameters["transactionId"] ?: return@get call.sendResponse(
                Result.Error(
                    ErrorResponse(
                        errorCode = ResponseCode.INVALID_OR_NULL_IDENTIFIER,
                        message = "Please provide a valid transaction id."
                    )
                )
            )

            val result = transactionController.getTransaction(transactionId)
            call.sendResponse(result)
        }

        post("/new") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val transactionRequest = call.receive<TransactionRequest>()

            val result = transactionController.insertTransaction(authorizationToken, transactionRequest)
            call.sendResponse(result)
        }
    }
}