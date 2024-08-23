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

import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.database.mongodb.repositories.AttendeeRepository
import com.puconvocation.enums.AccountType
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.services.CacheService
import com.puconvocation.utils.Result
import io.ktor.http.*
import io.ktor.http.content.*

class AttendeeController(
    private val attendeeRepository: AttendeeRepository,
    private val csvSerializer: CSVSerializer,
    private val cacheService: CacheService<Attendee>,
    private val jsonWebToken: JsonWebToken
) {
    suspend fun getAttendee(identifier: String): Result {
        val attendee = cacheService.get(identifier) ?: attendeeRepository.getAttendee(identifier)
        ?: return Result.Error(
            statusCode = HttpStatusCode.NotFound,
            errorCode = ResponseCode.ATTENDEE_NOT_FOUND,
            message = "Could not find attendee for identifier $identifier"
        )
        if (cacheService.get(identifier) == null) {
            cacheService.put(identifier, attendee)
        }
        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = attendee
        )
    }

    suspend fun uploadAttendees(authorizationToken: String?, multiPart: MultiPartData): Result {

        if (authorizationToken == null) return Result.Error(
            statusCode = HttpStatusCode.Unauthorized,
            errorCode = ResponseCode.INVALID_OR_NULL_TOKEN,
            message = "Authorization token is invalid or expired."
        )

        val tokenVerificationResult = jsonWebToken.verifySecurityToken(
            authorizationToken = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claim = JsonWebToken.ACCOUNT_TYPE_CLAIM
        )

        if (tokenVerificationResult is Result.Error) {
            return tokenVerificationResult
        }

        val currentAccountType = AccountType.valueOf(tokenVerificationResult.responseData as String)


        if (currentAccountType != AccountType.SUPER_ADMIN && currentAccountType != AccountType.ADMIN) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.NOT_PERMITTED,
                message = "You don't have privilege to upload attendee details."
            )
        }

        if (attendeeRepository.isAttendeeLockEnforced()) {
            return Result.Error(
                statusCode = HttpStatusCode.Locked,
                errorCode = ResponseCode.ALREADY_LOCKED,
                message = "Couldn't upload attendees list. The Attendees List is already locked."
            )
        }

        val part = multiPart.readAllParts().first()
        if (part !is PartData.FileItem ||
            !part.originalFileName?.lowercase()?.contains(".csv")!!
        ) return Result.Error(
            statusCode = HttpStatusCode.BadRequest,
            errorCode = ResponseCode.INVALID_FILE_FORMAT,
            message = "Invalid file format. The file must of type CSV"
        )

        val attendees: List<Attendee> = csvSerializer.serializeAttendeesCSV(part.streamProvider().reader())
        val response = attendeeRepository.uploadAttendees(attendees)
        if (!response) {
            return Result.Error(
                statusCode = HttpStatusCode.InternalServerError,
                errorCode = ResponseCode.FILE_NOT_UPLOADED,
                message = "Could not upload attendees at the moment."
            )
        }

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.FILE_UPLOADED,
            data = mapOf(
                "code" to ResponseCode.FILE_UPLOADED,
                "message" to "File uploaded successfully"
            )
        )
    }

    suspend fun getTotalAttendees(): Result {
        val totalCount = attendeeRepository.getTotalAttendees()
        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = hashMapOf("count" to totalCount)
        )
    }

    suspend fun getAttendeeFromVerificationToken(authorizationToken: String?, token: String): Result {
        if (authorizationToken == null) return Result.Error(
            statusCode = HttpStatusCode.Unauthorized,
            errorCode = ResponseCode.INVALID_OR_NULL_TOKEN,
            message = "Authorization token is invalid or expired."
        )

        val tokenVerificationResult = jsonWebToken.verifySecurityToken(
            authorizationToken = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claim = JsonWebToken.ACCOUNT_TYPE_CLAIM
        )

        if (tokenVerificationResult is Result.Error) {
            return tokenVerificationResult
        }

        val currentAccountType = AccountType.valueOf(tokenVerificationResult.responseData as String)


        if (currentAccountType != AccountType.SUPER_ADMIN && currentAccountType != AccountType.ADMIN) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.NOT_PERMITTED,
                message = "You don't have privilege to Lock attendee details."
            )
        }

        val attendee = attendeeRepository.getAttendeeFromVerificationToken(token = token) ?: return return Result.Error(
            statusCode = HttpStatusCode.NotFound,
            errorCode = ResponseCode.ATTENDEE_NOT_FOUND,
            message = "Could not find attendee"
        )

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = attendee
        )
    }


    suspend fun lockAttendees(authorizationToken: String?): Result {
        if (authorizationToken == null) return Result.Error(
            statusCode = HttpStatusCode.Unauthorized,
            errorCode = ResponseCode.INVALID_OR_NULL_TOKEN,
            message = "Authorization token is invalid or expired."
        )

        val tokenVerificationResult = jsonWebToken.verifySecurityToken(
            authorizationToken = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claim = JsonWebToken.ACCOUNT_TYPE_CLAIM
        )

        if (tokenVerificationResult is Result.Error) {
            return tokenVerificationResult
        }

        val currentAccountType = AccountType.valueOf(tokenVerificationResult.responseData as String)


        if (currentAccountType != AccountType.SUPER_ADMIN && currentAccountType != AccountType.ADMIN) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.NOT_PERMITTED,
                message = "You don't have privilege to Lock attendee details."
            )
        }


        if (attendeeRepository.isAttendeeLockEnforced()) {
            return Result.Error(
                statusCode = HttpStatusCode.Conflict,
                errorCode = ResponseCode.ALREADY_LOCKED,
                message = "Attendees List is already locked."
            )
        }

        val locked = attendeeRepository.mutateAttendeeLock(isLocked = true);

        if (!locked) {
            return Result.Error(
                statusCode = HttpStatusCode.NotModified,
                errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                message = "The Attendees List couldn't be locked. Please try again later."
            )
        }

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = mapOf(
                "code" to ResponseCode.OK,
                "message" to "Attendees List is now Locked."
            )
        )
    }

    suspend fun unLockAttendees(authorizationToken: String?): Result {
        if (authorizationToken == null) return Result.Error(
            statusCode = HttpStatusCode.Unauthorized,
            errorCode = ResponseCode.INVALID_OR_NULL_TOKEN,
            message = "Authorization token is invalid or expired."
        )

        val tokenVerificationResult = jsonWebToken.verifySecurityToken(
            authorizationToken = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claim = JsonWebToken.ACCOUNT_TYPE_CLAIM
        )

        if (tokenVerificationResult is Result.Error) {
            return tokenVerificationResult
        }

        val currentAccountType = AccountType.valueOf(tokenVerificationResult.responseData as String)


        if (currentAccountType != AccountType.SUPER_ADMIN && currentAccountType != AccountType.ADMIN) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.NOT_PERMITTED,
                message = "You don't have privilege to unlock attendee details."
            )
        }


        if (!attendeeRepository.isAttendeeLockEnforced()) {
            return Result.Error(
                statusCode = HttpStatusCode.Conflict,
                errorCode = ResponseCode.ALREADY_UNLOCKED,
                message = "Attendees List is already unlocked."
            )
        }

        val unlocked = attendeeRepository.mutateAttendeeLock(isLocked = false);

        if (!unlocked) {
            return Result.Error(
                statusCode = HttpStatusCode.NotModified,
                errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                message = "The Attendees List couldn't be unlocked. Please try again later."
            )
        }

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = mapOf(
                "code" to ResponseCode.OK,
                "message" to "Attendees List is now UnLocked."
            )
        )
    }
}