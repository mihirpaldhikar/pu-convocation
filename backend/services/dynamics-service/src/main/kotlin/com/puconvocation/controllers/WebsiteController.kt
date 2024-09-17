package com.puconvocation.controllers

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.commons.dto.UpdateWebsiteConfigRequest
import com.puconvocation.constants.CachedKeys
import com.puconvocation.database.mongodb.entities.WebsiteConfig
import com.puconvocation.database.mongodb.repositories.WebsiteConfigRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.services.AuthService
import com.puconvocation.utils.Result
import io.ktor.http.*

class WebsiteController(
    private val websiteConfigRepository: WebsiteConfigRepository,
    private val authService: AuthService
) {
    suspend fun setWebsiteConfig(websiteConfig: WebsiteConfig): Result<HashMap<String, Any>, ErrorResponse> {
        val success = websiteConfigRepository.setWebsiteConfig(websiteConfig)

        if (!success) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "Something went wrong!"
                )

            )
        }

        return Result.Success(
            data = hashMapOf(
                "code" to ResponseCode.OK,
                "message" to "Website config created."
            )
        )
    }

    suspend fun getWebsiteConfig(): Result<WebsiteConfig, ErrorResponse> {
        val config = websiteConfigRepository.getWebsiteConfig()

        return Result.Success(config)
    }

    suspend fun updateWebsiteConfig(
        authorizationToken: String?,
        updateWebsiteConfigRequest: UpdateWebsiteConfigRequest
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
                    message = "You don't have privilege to change website configurations."
                )

            )
        }

        var config = websiteConfigRepository.getWebsiteConfig()

        config = config.copy(
            heroImage = updateWebsiteConfigRequest.heroImage ?: config.heroImage,
            heroTitle = updateWebsiteConfigRequest.heroTitle ?: config.heroTitle,
            aboutUs = updateWebsiteConfigRequest.aboutUs ?: config.aboutUs,
            aboutUsImage = updateWebsiteConfigRequest.aboutUsImage ?: config.aboutUsImage,
            gallery = updateWebsiteConfigRequest.gallery ?: config.gallery,
            instructionsFileURL = updateWebsiteConfigRequest.instructionsFileURL ?: config.instructionsFileURL,
            showInstructionsBanner = updateWebsiteConfigRequest.showInstructionsBanner ?: config.showInstructionsBanner,
            showCountDown = updateWebsiteConfigRequest.showCountDown ?: config.showCountDown,
            countDownEndTime = updateWebsiteConfigRequest.countDownEndTime ?: config.countDownEndTime,
            enclosureMapping = updateWebsiteConfigRequest.enclosureMapping ?: config.enclosureMapping,
        )

        val success = websiteConfigRepository.updateWebsiteConfig(config)

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
                "message" to "Website configuration updated."
            )
        )
    }

}