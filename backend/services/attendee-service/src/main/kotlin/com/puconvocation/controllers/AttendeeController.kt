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

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.puconvocation.commons.dto.AttendeeWithEnclosureMetadata
import com.puconvocation.commons.dto.Enclosure
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.constants.CachedKeys
import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.database.mongodb.entities.AttendeeConfig
import com.puconvocation.database.mongodb.repositories.AttendeeRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.services.AuthService
import com.puconvocation.services.CacheService
import com.puconvocation.utils.Result
import io.ktor.http.*
import io.ktor.http.content.*

class AttendeeController(
    private val attendeeRepository: AttendeeRepository,
    private val csvSerializer: CSVSerializer,
    private val cacheService: CacheService,
    private val authService: AuthService,
    private val json: ObjectMapper,
) {
    suspend fun getAttendee(identifier: String): Result<AttendeeWithEnclosureMetadata, ErrorResponse> {
        if (!getAttendeeConfig().locked) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ATTENDEE_NOT_FOUND,
                    message = "Could not find attendee for identifier $identifier"
                )

            )
        }

        val cachedAttendee = cacheService.get(CachedKeys.getAttendeeKey(identifier))
        val attendee = if (cachedAttendee != null) {
            json.readValue<AttendeeWithEnclosureMetadata>(cachedAttendee)
        } else {
            val fetchedAttendee = attendeeRepository.getAttendee(identifier)
                ?: return Result.Error(
                    httpStatusCode = HttpStatusCode.NotFound,
                    error = ErrorResponse(
                        errorCode = ResponseCode.ATTENDEE_NOT_FOUND,
                        message = "Could not find attendee for identifier $identifier"
                    )

                )

            val enclosure = json.readValue<Enclosure>(cacheService.get(CachedKeys.getWebsiteConfigKey())!!)

            val computedAttendee = AttendeeWithEnclosureMetadata(
                attendee = fetchedAttendee,
                enclosureMetadata = enclosure.enclosureMapping.first {
                    it.letter.equals(
                        fetchedAttendee.enclosure,
                        ignoreCase = true
                    )
                }
            )

            cacheService.set(CachedKeys.getAttendeeKey(identifier), json.writeValueAsString(computedAttendee))

            computedAttendee
        }



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

        if (getAttendeeConfig().locked) {
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
        ) return Result.Error(
            httpStatusCode = HttpStatusCode.BadRequest,
            error = ErrorResponse(
                errorCode = ResponseCode.INVALID_FILE_FORMAT,
                message = "Invalid file format. The file must of type CSV"
            )
        )

        val attendees: List<Attendee> = csvSerializer.serializeAttendeesCSV(part.streamProvider().reader())
        val response = attendeeRepository.uploadAttendees(attendees)
        if (!response) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotModified,
                error = ErrorResponse(
                    errorCode = ResponseCode.FILE_NOT_UPLOADED,
                    message = "Could not upload attendees at the moment."
                )

            )
        }

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


    suspend fun lockAttendees(authorizationToken: String?): Result<HashMap<String, Any>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "write:Attendee",
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

        if (getAttendeeConfig().locked) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotModified,
                error = ErrorResponse(
                    errorCode = ResponseCode.ALREADY_LOCKED,
                    message = "Attendees List is already locked."
                )
            )
        }

        val locked = attendeeRepository.updateAttendeeConfig(
            getAttendeeConfig().copy(
                locked = true,
            )
        )

        if (!locked) {
            return Result.Error(
                ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                    message = "The Attendees List couldn't be locked. Please try again later."
                )
            )
        }

        cacheService.remove(CachedKeys.getAttendeeConfigKey())

        return Result.Success(
            hashMapOf(
                "code" to ResponseCode.OK,
                "message" to "Attendees List is now Locked."
            )
        )
    }

    suspend fun unLockAttendees(authorizationToken: String?): Result<HashMap<String, Any>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "write:Attendee",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to unlock attendee details."
                )
            )
        }

        if (!getAttendeeConfig().locked) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotModified,
                error = ErrorResponse(
                    errorCode = ResponseCode.ALREADY_UNLOCKED,
                    message = "Attendees List is already unlocked."
                )
            )
        }

        val unlocked = attendeeRepository.updateAttendeeConfig(
            getAttendeeConfig().copy(
                locked = false,
            )
        )

        if (!unlocked) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotModified,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_FULFILLED,
                    message = "The Attendees List couldn't be unlocked. Please try again later."
                )
            )
        }

        cacheService.remove(CachedKeys.getAttendeeConfigKey())

        return Result.Success(
            hashMapOf(
                "code" to ResponseCode.OK,
                "message" to "Attendees List is now UnLocked."
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
            hashMapOf(
                "page" to page,
                "next" to page + limit,
                "attendees" to attendees
            )
        )
    }

    private suspend fun getAttendeeConfig(): AttendeeConfig {
        val cachedAttendeeConfig = cacheService.get(CachedKeys.getAttendeeConfigKey())
        return if (cachedAttendeeConfig != null) {
            json.readValue<AttendeeConfig>(cachedAttendeeConfig.toString())
        } else {
            val fetchedAttendeeConfig = attendeeRepository.getAttendeeConfig()

            cacheService.set(CachedKeys.getAttendeeConfigKey(), json.writeValueAsString(fetchedAttendeeConfig))

            fetchedAttendeeConfig
        }
    }
}