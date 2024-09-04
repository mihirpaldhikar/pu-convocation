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

package com.puconvocation.controllers

import com.puconvocation.commons.dto.TransactionRequest
import com.puconvocation.constants.CachedKeys
import com.puconvocation.database.mongodb.entities.Transaction
import com.puconvocation.database.mongodb.repositories.AttendeeRepository
import com.puconvocation.database.mongodb.repositories.TransactionRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.AuthService
import com.puconvocation.services.CacheService
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.utils.Result
import com.puconvocation.utils.onError
import com.puconvocation.utils.onSuccess
import io.ktor.http.*
import org.bson.types.ObjectId
import java.time.LocalDateTime
import java.time.ZoneOffset

class TransactionController(
    private val transactionRepository: TransactionRepository,
    private val attendeeRepository: AttendeeRepository,
    private val jsonWebToken: JsonWebToken,
    private val authService: AuthService,
    private val cacheService: CacheService,
) {
    suspend fun insertTransaction(
        authorizationToken: String?,
        transactionRequest: TransactionRequest
    ): Result<HashMap<String, Any>, ErrorResponse> {
        val tokenVerificationResult = jsonWebToken.verifySecurityToken(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        tokenVerificationResult.onError { error, _ ->
            return Result.Error(error)
        }

        tokenVerificationResult.onSuccess { claims, _ ->

            if (!authService.isAllowed(claims[0], "verifyAttendeeDetails")) {
                return Result.Error(
                    httpStatusCode = HttpStatusCode.Forbidden,
                    error = ErrorResponse(
                        errorCode = ResponseCode.NOT_PERMITTED,
                        message = "You don't have privilege to this transaction."
                    )
                )
            }

            if (transactionRepository.transactionExists(transactionRequest.studentEnrollmentNumber)) {
                return Result.Error(
                    httpStatusCode = HttpStatusCode.NotImplemented,
                    error = ErrorResponse(
                        errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                        message = "Transaction already exists."
                    )
                )
            }

            val transaction = Transaction(
                id = ObjectId().toHexString(),
                approvedBy = claims[0],
                studentEnrollmentNumber = transactionRequest.studentEnrollmentNumber,
                timestamp = LocalDateTime.now(ZoneOffset.UTC).toInstant(ZoneOffset.UTC).toEpochMilli(),
            )


            val success = transactionRepository.insertTransaction(transaction)

            if (!success) {
                return Result.Error(
                    httpStatusCode = HttpStatusCode.NotImplemented,
                    error = ErrorResponse(
                        errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                        message = "Cannot confirm the transaction."
                    )
                )
            }

            attendeeRepository.setDegreeReceivedStatus(transactionRequest.studentEnrollmentNumber, true);
            cacheService.remove(CachedKeys.getAttendeeKey(transactionRequest.studentEnrollmentNumber))

            return Result.Success(
                hashMapOf(
                    "code" to ResponseCode.OK,
                    "message" to "Transaction Confirmed."
                )
            )
        }

        return Result.Error(
            httpStatusCode = HttpStatusCode.NotImplemented,
            error = ErrorResponse(
                errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                message = "Request not fulfilled. Please try again."
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