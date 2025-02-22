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

package com.puconvocation.database.mongodb.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.datasources.RemoteConfigDatasource
import com.puconvocation.database.mongodb.entities.RemoteConfig
import kotlinx.coroutines.flow.first
import org.bson.types.ObjectId
import java.time.Duration
import java.time.temporal.ChronoUnit

class RemoteConfigRepository(
    database: MongoDatabase,
    private val cache: CacheController,
    private val mapper: ObjectMapper,
) : RemoteConfigDatasource {

    private val configCollection: MongoCollection<RemoteConfig> =
        database.getCollection<RemoteConfig>("remote_config")

    override suspend fun getConfig(): RemoteConfig {
        val cachedConfig = cache.get(CachedKeys.remoteConfigKey())
        if (cachedConfig != null) {
            return mapper.readValue<RemoteConfig>(cachedConfig)
        }
        val fetchedConfig = configCollection.withDocumentClass<RemoteConfig>().find(
            eq(
                RemoteConfig::active.name, true
            )
        ).first()

        cache.set(
            CachedKeys.remoteConfigKey(),
            mapper.writeValueAsString(fetchedConfig),
            expiryDuration = Duration.of(1, ChronoUnit.HOURS)
        )

        return fetchedConfig
    }

    override suspend fun changeConfig(
        remoteConfig: RemoteConfig,
        configId: ObjectId
    ): Boolean {
        val acknowledged = configCollection.withDocumentClass<RemoteConfig>().updateOne(
            eq("_id", configId),
            Updates.combine(
                Updates.set(RemoteConfig::images.name, remoteConfig.images),
                Updates.set(RemoteConfig::instructions.name, remoteConfig.instructions),
                Updates.set(RemoteConfig::countdown.name, remoteConfig.countdown),
                Updates.set(RemoteConfig::attendees.name, remoteConfig.attendees),
                Updates.set(RemoteConfig::groundMappings.name, remoteConfig.groundMappings),
            )
        ).wasAcknowledged()

        cache.invalidate(CachedKeys.remoteConfigKey())
        return acknowledged
    }

    override suspend fun mutateAttendeeLock(attendeeConfig: RemoteConfig.Attendees): Boolean {
        val acknowledged = configCollection.withDocumentClass<RemoteConfig>().updateOne(
            eq(RemoteConfig::active.name, true),
            Updates.combine(
                Updates.set(RemoteConfig::attendees.name, attendeeConfig),
            )
        ).wasAcknowledged()

        if (acknowledged) {
            cache.invalidate(CachedKeys.remoteConfigKey())
        }
        return acknowledged
    }

}