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

import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.enums.AssetType
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.AuthService
import com.puconvocation.services.CloudStorage
import com.puconvocation.utils.Result
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.MultiPartData
import io.ktor.http.content.PartData
import io.ktor.utils.io.core.readBytes
import io.ktor.utils.io.readBuffer
import org.apache.commons.io.FilenameUtils
import java.util.UUID
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi


@OptIn(ExperimentalEncodingApi::class)
class AssetsController(
    private val cloudStorage: CloudStorage,
    private val authService: AuthService,
    private val jsonWebToken: JsonWebToken,
    private val httpClient: HttpClient,
    private val credentialsAuthority: String
) {

    private suspend fun uploadFile(
        authorizationToken: String?,
        file: MultiPartData,
        assetType: AssetType,
        fileName: String?
    ): Result<HashMap<String, String>, ErrorResponse> {
        if (!authService.isAuthorized(
                role = "write:Assets",
                principal = authorizationToken
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to upload assets."
                )
            )
        }

        val part = file.readPart()
        if (part !is PartData.FileItem) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.FILE_NOT_UPLOADED,
                    message = "Asset must be a file."
                )
            )
        }

        val objectName = fileName ?: "${
            UUID.randomUUID().toString().replace("-", "")
        }.${FilenameUtils.getExtension(part.originalFileName)}"

        val objectURL = when (assetType) {
            AssetType.IMAGE -> {
                cloudStorage.uploadObject(
                    "images/$objectName",
                    part.provider.invoke().readBuffer().readBytes()
                )
            }

            AssetType.AVATAR -> {
                cloudStorage.uploadObject(
                    "avatars/$objectName",
                    part.provider.invoke().readBuffer().readBytes()
                )
            }

            AssetType.DOCUMENT -> {
                cloudStorage.uploadObject(
                    "documents/$objectName",
                    part.provider.invoke().readBuffer().readBytes()
                )
            }
        }

        if (assetType == AssetType.IMAGE) {
            generateThumbnail(objectURL)
        }

        return Result.Success(
            data = hashMapOf("url" to objectURL)
        )
    }

    suspend fun uploadImage(
        authorizationToken: String?,
        file: MultiPartData
    ): Result<HashMap<String, String>, ErrorResponse> {
        return uploadFile(authorizationToken, file, AssetType.IMAGE, null)
    }

    suspend fun uploadAvatar(
        authorizationToken: String?,
        file: MultiPartData
    ): Result<HashMap<String, String>, ErrorResponse> {
        val uuid = jsonWebToken.getClaims(
            authorizationToken,
            TokenType.AUTHORIZATION_TOKEN,
            listOf(JsonWebToken.UUID_CLAIM)
        )[0]
        return uploadFile(authorizationToken, file, AssetType.AVATAR, "$uuid.avif")
    }

    suspend fun uploadDocument(
        authorizationToken: String?,
        file: MultiPartData
    ): Result<HashMap<String, String>, ErrorResponse> {
        return uploadFile(authorizationToken, file, AssetType.DOCUMENT, null)
    }

    suspend fun uploadInstructions(
        authorizationToken: String?,
        file: MultiPartData
    ): Result<HashMap<String, String>, ErrorResponse> {
        return uploadFile(authorizationToken, file, AssetType.DOCUMENT, "instructions.txt")
    }

    suspend fun uploadInstructionsSource(
        authorizationToken: String?,
        file: MultiPartData
    ): Result<HashMap<String, String>, ErrorResponse> {
        return uploadFile(authorizationToken, file, AssetType.DOCUMENT, "instructions-source.json")
    }

    suspend fun getObjectsInFolder(authorizationToken: String?, folder: String): Result<List<String>, ErrorResponse> {
        if ((!authService.isAuthorized(
                role = "write:Assets",
                principal = authorizationToken
            ) || (!authService.isAuthorized(
                role = "read:Assets",
                principal = authorizationToken
            )))
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view assets."
                )
            )
        }
        return Result.Success(
            data = cloudStorage.getObjectsInFolder(folder)
        )
    }

    private suspend fun generateThumbnail(imageURL: String) {
        val thumbnailGenerator = httpClient.get("$credentialsAuthority/api/generateThumbnail?imageURL=$imageURL")
        val base64Thumbnail = thumbnailGenerator.bodyAsText()

        println(base64Thumbnail)

        val decodedThumbnail =
            Base64.decode(base64Thumbnail)
        cloudStorage.uploadObject(
            "thumbnails/${FilenameUtils.getBaseName(imageURL)}.png",
            decodedThumbnail
        )
    }
}