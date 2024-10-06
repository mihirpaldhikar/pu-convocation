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

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import com.puconvocation.Environment
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import java.io.ByteArrayInputStream
import java.io.InputStream
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
class CloudStorage(
    private val gcp: Environment.Cloud.GCP,
    private val cache: CacheController,
    private val mapper: ObjectMapper,
) {
    private val storage: Storage


    init {
        val credentialsStream: InputStream = try {
            val decodedCredentials = Base64.decode(gcp.serviceAccount)
            ByteArrayInputStream(decodedCredentials)
        } catch (e: IllegalArgumentException) {
            throw IllegalArgumentException("Failed to decode service account credentials", e)
        }

        storage = StorageOptions.newBuilder().setCredentials(
            ServiceAccountCredentials.fromStream(credentialsStream)
        ).build().service
    }


    fun uploadObject(
        destinationPath: String,
        inputStream: ByteArray,
    ): String {
        storage.get(gcp.cloudStorage).create(destinationPath, inputStream)

        return "https://assets.puconvocation.com/$destinationPath"
    }

    fun getObjectsInFolder(folderPath: String): List<String> {
        val cachedObjects = cache.get(CachedKeys.objectsOfFolderKey(folderPath))
        if (cachedObjects != null) {
            return mapper.readValue<List<String>>(cachedObjects)
        }
        val blobs = storage.list(
            gcp.cloudStorage,
            Storage.BlobListOption.prefix(folderPath)

        )
        val objects = mutableListOf<String>()
        for (blob in blobs.iterateAll()) {
            if (blob.name == folderPath) {
                continue
            }

            objects.add("https://assets.puconvocation.com/${blob.name}")

        }

        cache.set(CachedKeys.objectsOfFolderKey(folderPath), mapper.writeValueAsString(objects))
        return objects
    }
}