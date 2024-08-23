package com.puconvocation.routes

import com.puconvocation.commons.dto.TransactionRequest
import com.puconvocation.controllers.TransactionController
import com.puconvocation.enums.ResponseCode
import com.puconvocation.utils.Result
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.transactionsRoute(
    transactionController: TransactionController
) {
    route("/transactions") {
        get("/{transactionId}") {
            val transactionId = call.parameters["transactionId"] ?: return@get sendResponse(
                Result.Error(
                    statusCode = HttpStatusCode.BadRequest,
                    errorCode = ResponseCode.INVALID_OR_NULL_IDENTIFIER,
                    message = "Please provide a valid transaction id."
                )
            )

            val result = transactionController.getTransaction(transactionId)
            sendResponse(result)
        }

        post("/new") {
            val authorizationToken = getSecurityTokens().authorizationToken
            val transactionRequest = call.receive<TransactionRequest>()

            val result = transactionController.insertTransaction(authorizationToken, transactionRequest)
            sendResponse(result)
        }
    }
}