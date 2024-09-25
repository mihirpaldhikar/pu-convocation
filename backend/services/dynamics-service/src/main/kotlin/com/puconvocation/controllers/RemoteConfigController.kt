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

import com.puconvocation.commons.dto.ChangeRemoteConfigRequest
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.database.mongodb.entities.RemoteConfig
import com.puconvocation.database.mongodb.repositories.RemoteConfigRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.services.AuthService
import com.puconvocation.utils.Result
import io.ktor.http.*
import org.bson.types.ObjectId

class RemoteConfigController(
    private val remoteConfigRepository: RemoteConfigRepository,
    private val authService: AuthService
) {

    suspend fun getConfig(): Result<RemoteConfig, ErrorResponse> {
        val config = remoteConfigRepository.getConfig()

        return Result.Success(config)
    }

    suspend fun changeConfig(
        authorizationToken: String?,
        changeRemoteConfigRequest: ChangeRemoteConfigRequest
    ): Result<HashMap<String, Any>, ErrorResponse> {

        if (!authService.isAuthorized(
                role = "write:WebsiteConfig",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to change remote configurations."
                )

            )
        }

        val currentConfig = remoteConfigRepository.getConfig()

        val newConfig = currentConfig.copy(
            id = ObjectId(),
            active = true,
            heroImage = changeRemoteConfigRequest.heroImage ?: currentConfig.heroImage,
            heroTitle = changeRemoteConfigRequest.heroTitle ?: currentConfig.heroTitle,
            aboutUs = changeRemoteConfigRequest.aboutUs ?: currentConfig.aboutUs,
            aboutUsImage = changeRemoteConfigRequest.aboutUsImage ?: currentConfig.aboutUsImage,
            gallery = changeRemoteConfigRequest.gallery ?: currentConfig.gallery,
            instructionsFileURL = changeRemoteConfigRequest.instructionsFileURL ?: currentConfig.instructionsFileURL,
            showInstructionsBanner = changeRemoteConfigRequest.showInstructionsBanner
                ?: currentConfig.showInstructionsBanner,
            showCountDown = changeRemoteConfigRequest.showCountDown ?: currentConfig.showCountDown,
            countDownEndTime = changeRemoteConfigRequest.countDownEndTime ?: currentConfig.countDownEndTime,
            enclosureMapping = changeRemoteConfigRequest.enclosureMapping ?: currentConfig.enclosureMapping,
        )

        val success = remoteConfigRepository.changeConfig(newConfig, currentConfig.id)

        if (!success) {
            return Result.Error(
                ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "Something went wrong!"
                )
            )
        }

        return Result.Success(
            hashMapOf(
                "code" to ResponseCode.OK,
                "message" to "Configuration updated."
            )
        )
    }

}