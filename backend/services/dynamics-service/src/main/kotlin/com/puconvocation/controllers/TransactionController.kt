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
import com.puconvocation.commons.dto.TransactionRequest
import com.puconvocation.database.mongodb.entities.Transaction
import com.puconvocation.database.mongodb.repositories.TransactionRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.AuthService
import com.puconvocation.services.MessageQueue
import com.puconvocation.utils.Result
import io.ktor.http.*

class TransactionController(
    private val transactionRepository: TransactionRepository,
    private val jsonWebToken: JsonWebToken,
    private val authService: AuthService,
    private val messageQueue: MessageQueue
) {
    suspend fun insertTransaction(
        authorizationToken: String?,
        transactionRequest: TransactionRequest
    ): Result<HashMap<String, Any>, ErrorResponse> {

        val claims = jsonWebToken.getClaims(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )


        if (claims.isEmpty()) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotImplemented,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                    message = "Request not fulfilled. Please try again."
                )
            )
        }

        if (!authService.isAuthorized(
                role = "write:Transaction",
                principal = claims[0]
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to this transaction."
                )
            )
        }

        messageQueue.sendMessage(
            message = "{\"enrollmentNumber\":\"${transactionRequest.studentEnrollmentNumber}\",\"authorizedBy\":\"${claims[0]}\"}",
            groupId = "transactions",
            queueType = MessageQueue.QueueType.TRANSACTION
        )

        return Result.Success(
            hashMapOf(
                "code" to ResponseCode.OK,
                "message" to "Transaction has been added to the Queue."
            )
        )

    }

    suspend fun getTransaction(transactionId: String): Result<Transaction, ErrorResponse> {
        val transaction = transactionRepository.getTransaction(transactionId) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.NOT_FOUND,
                message = "Transaction with ID $transactionId not found."
            )
        )

        return Result.Success(
            transaction
        )
    }
}