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

package com.puconvocation.services

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.puconvocation.Environment
import com.puconvocation.commons.dto.RemoteConfig
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.patch
import io.ktor.client.statement.bodyAsText

class DynamicsService(
    private val client: HttpClient,
    private val cache: CacheController,
    private val mapper: ObjectMapper,
    environment: Environment
) {
    private val configRoute = "/config"

    suspend fun getRemoteConfig(): RemoteConfig {
        val cachedConfig = cache.get(CachedKeys.remoteConfigKey())

        if (cachedConfig != null) {
            return mapper.readValue<RemoteConfig>(cachedConfig)
        }

        val fetchedRemoteConfig = client.get("$configRoute/")

        return fetchedRemoteConfig.body<RemoteConfig>()
    }

    suspend fun mutateAttendeeLock(lock: Boolean): Boolean {
        val response = client.patch("$configRoute/mutateAttendeeLock?lock=$lock")
        return response.bodyAsText().toBooleanStrictOrNull() == true
    }
}