package com.puconvocation.database.mongodb.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.datasources.WebsiteConfigDatasource
import com.puconvocation.database.mongodb.entities.WebsiteConfig
import kotlinx.coroutines.flow.first
import java.time.Duration
import java.time.temporal.ChronoUnit

class WebsiteConfigRepository(
    database: MongoDatabase,
    private val cache: CacheController,
    private val mapper: ObjectMapper,
) : WebsiteConfigDatasource {

    private val configCollection: MongoCollection<WebsiteConfig> =
        database.getCollection<WebsiteConfig>("website_configs")

    override suspend fun getWebsiteConfig(): WebsiteConfig {
        val cachedConfig = cache.get(CachedKeys.websiteConfigKey())
        if (cachedConfig != null) {
            return mapper.readValue<WebsiteConfig>(cachedConfig)
        }
        val fetchedConfig = configCollection.withDocumentClass<WebsiteConfig>().find(
            eq(
                "_id", "website_config"
            )
        ).first()

        cache.set(
            CachedKeys.websiteConfigKey(),
            mapper.writeValueAsString(fetchedConfig),
            expiryDuration = Duration.of(1, ChronoUnit.HOURS)
        )

        return fetchedConfig
    }

    override suspend fun setWebsiteConfig(websiteConfig: WebsiteConfig): Boolean {
        val acknowledged =
            configCollection.withDocumentClass<WebsiteConfig>().insertOne(websiteConfig).wasAcknowledged()

        if (acknowledged) {
            cache.invalidate(CachedKeys.websiteConfigKey())
        }
        return acknowledged
    }

    override suspend fun updateWebsiteConfig(websiteConfig: WebsiteConfig): Boolean {
        val acknowledged = configCollection.withDocumentClass<WebsiteConfig>().updateOne(
            eq("_id", "website_config"),
            Updates.combine(
                Updates.set(WebsiteConfig::heroTitle.name, websiteConfig.heroTitle),
                Updates.set(WebsiteConfig::gallery.name, websiteConfig.gallery),
                Updates.set(WebsiteConfig::showInstructionsBanner.name, websiteConfig.showInstructionsBanner),
                Updates.set(WebsiteConfig::instructionsFileURL.name, websiteConfig.instructionsFileURL),
                Updates.set(WebsiteConfig::aboutUs.name, websiteConfig.aboutUs),
                Updates.set(WebsiteConfig::heroImage.name, websiteConfig.heroImage),
                Updates.set(WebsiteConfig::showCountDown.name, websiteConfig.showCountDown),
                Updates.set(WebsiteConfig::countDownEndTime.name, websiteConfig.countDownEndTime),
                Updates.set(WebsiteConfig::enclosureMapping.name, websiteConfig.enclosureMapping),
            )
        ).wasAcknowledged()

        if (acknowledged) {
            cache.invalidate(CachedKeys.websiteConfigKey())
        }

        return acknowledged
    }
}