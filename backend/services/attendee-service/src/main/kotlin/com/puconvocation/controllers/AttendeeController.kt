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
import com.puconvocation.enums.ResponseCode
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.services.CacheService
import com.puconvocation.utils.Result
import io.ktor.http.*
import io.ktor.http.content.*

class AttendeeController(
    private val attendeeRepository: AttendeeRepository,
    private val csvSerializer: CSVSerializer,
    private val cacheService: CacheService<Attendee>
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

    suspend fun uploadAttendees(multiPart: MultiPartData): Result {
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
}