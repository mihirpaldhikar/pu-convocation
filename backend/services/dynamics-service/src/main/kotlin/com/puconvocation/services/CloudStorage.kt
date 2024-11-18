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

package com.puconvocation.services

import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.ListObjectsV2Request
import aws.sdk.kotlin.services.s3.model.PutObjectRequest
import aws.smithy.kotlin.runtime.content.ByteStream
import aws.smithy.kotlin.runtime.content.fromInputStream
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.puconvocation.Environment
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
class CloudStorage(
    private val aws: Environment.Cloud.AWS,
    private val cache: CacheController,
    private val mapper: ObjectMapper,
) {

    suspend fun uploadObject(
        destinationPath: String,
        inputStream: ByteArray,
    ): String? {
        return try {
            S3Client {
                region = aws.region
                credentialsProvider = StaticCredentialsProvider.invoke {
                    accessKeyId = aws.accessKeyId
                    secretAccessKey = aws.secretAccessKey
                }
            }.use {
                it.putObject(PutObjectRequest {
                    bucket = aws.s3.assets
                    key = destinationPath
                    body = ByteStream.fromInputStream(inputStream.inputStream(), inputStream.inputStream().available().toLong())
                })
            }
            cache.invalidateWithPattern("cloudStorage:*")
            "https://assets.puconvocation.com/$destinationPath"
        } catch (e: Exception) {
            null
        }
    }

    suspend fun getObjectsInFolder(folderPath: String): List<String> {
        val cachedObjects = cache.get(CachedKeys.objectsOfFolderKey(folderPath))
        if (cachedObjects != null) {
            return mapper.readValue<List<String>>(cachedObjects)
        }
        val objects = mutableListOf<String>()

        S3Client {
            region = aws.region
            credentialsProvider = StaticCredentialsProvider.invoke {
                accessKeyId = aws.accessKeyId
                secretAccessKey = aws.secretAccessKey
            }
        }.use { s3Client ->
            try {
                var request = ListObjectsV2Request {
                    bucket = aws.s3.assets
                    prefix = folderPath
                }

                val response = s3Client.listObjectsV2(request)
                for (i in 1..response.contents!!.size - 1) {
                    objects.add("https://assets.puconvocation.com/${response.contents!![i].key}")

                }

            } catch (e: Exception) {
                println(e)
                return emptyList()
            }
        }

        cache.set(CachedKeys.objectsOfFolderKey(folderPath), mapper.writeValueAsString(objects))

        return objects
    }
}