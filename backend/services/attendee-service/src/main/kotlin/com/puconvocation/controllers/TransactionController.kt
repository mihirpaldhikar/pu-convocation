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

import com.google.gson.Gson
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
import com.puconvocation.utils.Result
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
    suspend fun insertTransaction(authorizationToken: String?, transactionRequest: TransactionRequest): Result {
        val tokenVerificationResult = jsonWebToken.verifySecurityToken(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (tokenVerificationResult is Result.Error) {
            return tokenVerificationResult
        }


        if (!authService.isAllowed(authorizationToken, "verifyAttendeeDetails")) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.NOT_PERMITTED,
                message = "You don't have privilege to this transaction."
            )
        }

        if (transactionRepository.transactionExists(transactionRequest.studentEnrollmentNumber)) {
            return Result.Error(
                statusCode = HttpStatusCode.Conflict,
                errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                message = "Transaction already exists."
            )
        }

        val transaction = Transaction(
            id = ObjectId().toHexString(),
            approvedBy = (tokenVerificationResult.responseData as List<String>)[0],
            studentEnrollmentNumber = transactionRequest.studentEnrollmentNumber,
            timestamp = LocalDateTime.now(ZoneOffset.UTC).toInstant(ZoneOffset.UTC).toEpochMilli(),
        )
        val success = transactionRepository.insertTransaction(transaction)

        if (!success) {
            return Result.Error(
                statusCode = HttpStatusCode.BadRequest,
                errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                message = "Cannot confirm the transaction."

            )
        }

        attendeeRepository.setDegreeReceivedStatus(transactionRequest.studentEnrollmentNumber, true);
        cacheService.remove(CachedKeys.getAttendeeKey(transactionRequest.studentEnrollmentNumber))

        return Result.Success(
            statusCode = HttpStatusCode.Created,
            code = ResponseCode.OK,
            data = mapOf(
                "code" to ResponseCode.OK,
                "message" to "Transaction Confirmed."
            )
        )
    }

    suspend fun getTransaction(transactionId: String): Result {
        val transaction = transactionRepository.getTransaction(transactionId) ?: return Result.Error(
            statusCode = HttpStatusCode.NotFound,
            errorCode = ResponseCode.NOT_FOUND,
            message = "Transaction with ID $transactionId not found."
        )

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = transaction
        )
    }
}