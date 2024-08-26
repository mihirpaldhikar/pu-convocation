package com.puconvocation.controllers

import com.puconvocation.commons.dto.TransactionRequest
import com.puconvocation.database.mongodb.entities.Transaction
import com.puconvocation.database.mongodb.repositories.AttendeeRepository
import com.puconvocation.database.mongodb.repositories.TransactionRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.AuthService
import com.puconvocation.utils.Result
import io.ktor.http.*
import org.bson.types.ObjectId
import java.time.LocalDateTime
import java.time.ZoneOffset

class TransactionController(
    private val transactionRepository: TransactionRepository,
    private val attendeeRepository: AttendeeRepository,
    private val jsonWebToken: JsonWebToken,
    private val authService: AuthService
) {
    suspend fun insertTransaction(authorizationToken: String?, transactionRequest: TransactionRequest): Result {

        if (authorizationToken == null) return Result.Error(
            statusCode = HttpStatusCode.Unauthorized,
            errorCode = ResponseCode.INVALID_OR_NULL_TOKEN,
            message = "Authorization token is invalid or expired."
        )

        val tokenVerificationResult = jsonWebToken.verifySecurityToken(
            authorizationToken = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (tokenVerificationResult is Result.Error) {
            return tokenVerificationResult
        }


        if (!authService.isOperationAllowed(authorizationToken, "verifyAttendeeDetails")) {
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