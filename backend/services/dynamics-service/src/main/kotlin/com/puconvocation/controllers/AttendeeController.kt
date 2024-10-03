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

import com.puconvocation.commons.dto.AttendeeWithEnclosureMetadata
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.database.mongodb.repositories.AttendeeRepository
import com.puconvocation.database.mongodb.repositories.RemoteConfigRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.services.AuthService
import com.puconvocation.services.DistributedLock
import com.puconvocation.services.LambdaService
import com.puconvocation.utils.Result
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.MultiPartData
import io.ktor.http.content.PartData
import io.ktor.http.content.readAllParts
import io.ktor.http.content.streamProvider
import java.time.Duration
import java.time.temporal.ChronoUnit

class AttendeeController(
    private val attendeeRepository: AttendeeRepository,
    private val csvSerializer: CSVSerializer,
    private val authService: AuthService,
    private val distributedLock: DistributedLock,
    private val lambdaService: LambdaService,
    private val remoteConfigRepository: RemoteConfigRepository,
) {
    suspend fun getAttendee(identifier: String): Result<AttendeeWithEnclosureMetadata, ErrorResponse> {
        if (!remoteConfigRepository.getConfig().attendeesLocked) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ATTENDEE_NOT_FOUND,
                    message = "Could not find attendee for identifier $identifier"
                )

            )
        }

        val attendee = attendeeRepository.getAttendeeWithEnclosureMetadata(identifier)
            ?: return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ATTENDEE_NOT_FOUND,
                    message = "Could not find attendee for identifier $identifier"
                )

            )

        return Result.Success(
            attendee
        )
    }

    suspend fun uploadAttendees(
        authorizationToken: String?,
        multiPart: MultiPartData
    ): Result<HashMap<String, Any>, ErrorResponse> {

        if (!authService.isAuthorized(
                role = "write:Attendee",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to upload attendee details."
                )

            )
        }

        val lockAcquired = distributedLock.acquire("attendeeUploadLock", Duration.of(5, ChronoUnit.MINUTES))

        if (!lockAcquired) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                    message = "Couldn't upload attendees list."
                )
            )
        }

        if (remoteConfigRepository.getConfig().attendeesLocked) {
            distributedLock.release("attendeeUploadLock")
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.ALREADY_LOCKED,
                    message = "Couldn't upload attendees list. The Attendees List is already locked."
                )
            )
        }

        val part = multiPart.readAllParts().first()
        if (part !is PartData.FileItem ||
            !part.originalFileName?.lowercase()?.contains(".csv")!!
        ) {
            distributedLock.release("attendeeUploadLock")
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_FILE_FORMAT,
                    message = "Invalid file format. The file must of type CSV"
                )
            )
        }

        val attendees: List<Attendee> = csvSerializer.serializeAttendeesCSV(part.streamProvider().reader())
        val response = attendeeRepository.uploadAttendees(attendees)
        if (!response) {
            distributedLock.release("attendeeUploadLock")
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotModified,
                error = ErrorResponse(
                    errorCode = ResponseCode.FILE_NOT_UPLOADED,
                    message = "Could not upload attendees at the moment."
                )

            )
        }

        distributedLock.release("attendeeUploadLock")

        return Result.Success(
            hashMapOf(
                "code" to ResponseCode.FILE_UPLOADED,
                "message" to "File uploaded successfully"
            )
        )
    }

    suspend fun getTotalAttendees(): Result<HashMap<String, Any>, ErrorResponse> {
        val totalCount = attendeeRepository.getTotalAttendees()
        return Result.Success(
            hashMapOf("count" to totalCount)
        )
    }

    suspend fun getAttendeeFromVerificationToken(
        authorizationToken: String?,
        token: String
    ): Result<Attendee, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "read:Attendee",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to Lock attendee details."
                )

            )
        }

        val attendee = attendeeRepository.getAttendeeFromVerificationToken(token = token) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.ATTENDEE_NOT_FOUND,
                message = "Could not find attendee"
            )

        )

        return Result.Success(
            attendee
        )
    }


    suspend fun mutateAttendeeLock(
        authorizationToken: String?,
        lock: Boolean
    ): Result<HashMap<String, Any>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "write:Attendee",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege change attendee lock state."
                )
            )
        }

        val lockAcquired = distributedLock.acquire("attendeeLock", Duration.of(5, ChronoUnit.MINUTES))

        if (!lockAcquired) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.ALREADY_LOCKED,
                    message = "The Attendees List couldn't be ${if (lock) "locked" else "unlocked"}. Please try again later."
                )
            )
        }

        if (lock == remoteConfigRepository.getConfig().attendeesLocked) {
            distributedLock.release("attendeeLock")
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = if (lock) ResponseCode.ALREADY_LOCKED else ResponseCode.ALREADY_UNLOCKED,
                    message = "Attendees List is already ${if (lock) "locked" else "unlocked"}."
                )
            )
        }

        val acknowledge = remoteConfigRepository.mutateAttendeeLock(lock)

        if (!acknowledge) {
            distributedLock.release("attendeeLock")
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                    message = "The Attendees List couldn't be ${if (lock) "locked" else "unlocked"}. Please try again later."
                )
            )
        }

        if (lock) {
            lambdaService.invoke("seatAllocationJob")
        }

        distributedLock.release("attendeeLock")

        return Result.Success(
            hashMapOf(
                "code" to ResponseCode.OK,
                "message" to "Attendees List is ${if (lock) "locked" else "unlocked"}."
            )
        )
    }

    suspend fun getAttendees(
        authorizationToken: String?,
        page: Int,
        limit: Int
    ): Result<HashMap<String, Any>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "read:Attendee",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view attendee details."
                )

            )
        }

        val attendees = attendeeRepository.getAttendees(page, limit)

        return Result.Success(
            attendees
        )
    }

}