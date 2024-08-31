package com.puconvocation.controllers

import com.google.gson.Gson
import com.puconvocation.commons.dto.UpdateWebsiteConfigRequest
import com.puconvocation.constants.CachedKeys
import com.puconvocation.database.mongodb.entities.WebsiteConfig
import com.puconvocation.database.mongodb.repositories.WebsiteConfigRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.AuthService
import com.puconvocation.services.CacheService
import com.puconvocation.utils.Result
import io.ktor.http.*

class WebsiteController(
    private val websiteConfigRepository: WebsiteConfigRepository,
    private val jsonWebToken: JsonWebToken,
    private val gson: Gson,
    private val cacheService: CacheService,
    private val authService: AuthService
) {
    suspend fun setWebsiteConfig(websiteConfig: WebsiteConfig): Result {
        val success = websiteConfigRepository.setWebsiteConfig(websiteConfig)

        if (!success) {
            return Result.Error(
                statusCode = HttpStatusCode.InternalServerError,
                errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                message = "Something went wrong!"
            )
        }

        return Result.Success(
            statusCode = HttpStatusCode.Created,
            code = ResponseCode.OK,
            data = mapOf(
                "code" to ResponseCode.OK,
                "message" to "Website config created."
            )
        )
    }

    suspend fun getWebsiteConfig(): Result {
        val cachedConfig = cacheService.get(CachedKeys.getWebsiteConfigKey())

        val config = if (cachedConfig != null) {
            gson.fromJson(cachedConfig, WebsiteConfig::class.java)
        } else {
            val fetchedConfig = websiteConfigRepository.getWebsiteConfig()

            cacheService.set(CachedKeys.getWebsiteConfigKey(), gson.toJson(fetchedConfig))

            fetchedConfig
        }

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = config
        )
    }

    suspend fun updateWebsiteConfig(
        authorizationToken: String?,
        updateWebsiteConfigRequest: UpdateWebsiteConfigRequest
    ): Result {
        if (authorizationToken == null) return Result.Error(
            statusCode = HttpStatusCode.Unauthorized,
            errorCode = ResponseCode.INVALID_OR_NULL_TOKEN,
            message = "Authorization token is invalid or expired."
        )

        if (!isAllowed(authorizationToken, "manageWebsite")) {
            return Result.Error(
                statusCode = HttpStatusCode.Forbidden,
                errorCode = ResponseCode.NOT_PERMITTED,
                message = "You don't have privilege to change website configurations."
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
                statusCode = HttpStatusCode.InternalServerError,
                errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                message = "Something went wrong!"
            )
        }

        cacheService.set(CachedKeys.getWebsiteConfigKey(), gson.toJson(config))

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = mapOf(
                "code" to ResponseCode.OK,
                "message" to "Website configuration updated."
            )
        )
    }

    private suspend fun isAllowed(authorizationToken: String, ruleName: String): Boolean {
        val tokenVerificationResult = jsonWebToken.verifySecurityToken(
            authorizationToken = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (tokenVerificationResult is Result.Error) {
            return false
        }

        val cachedRulesForAccount =
            cacheService.get(CachedKeys.getAllRulesAssociatedWithAccount((tokenVerificationResult.responseData as List<String>)[0]))

        return if (cachedRulesForAccount != null) {
            (gson.fromJson(cachedRulesForAccount, List::class.java) as List<String>).contains(ruleName)
        } else {
            authService.isOperationAllowed(authorizationToken, ruleName)
        }
    }
}