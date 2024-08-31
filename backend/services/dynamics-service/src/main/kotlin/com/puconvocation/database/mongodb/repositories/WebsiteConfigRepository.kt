package com.puconvocation.database.mongodb.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.datasources.WebsiteConfigDatasource
import com.puconvocation.database.mongodb.entities.WebsiteConfig
import kotlinx.coroutines.flow.first

class WebsiteConfigRepository(
    database: MongoDatabase
) : WebsiteConfigDatasource {

    private val configCollection: MongoCollection<WebsiteConfig> =
        database.getCollection<WebsiteConfig>("website_configs")

    override suspend fun getWebsiteConfig(): WebsiteConfig {
        return configCollection.withDocumentClass<WebsiteConfig>().find(
            eq(
                "_id", "website_config"
            )
        ).first()
    }

    override suspend fun setWebsiteConfig(websiteConfig: WebsiteConfig): Boolean {
        return configCollection.withDocumentClass<WebsiteConfig>().insertOne(websiteConfig).wasAcknowledged()
    }

    override suspend fun updateWebsiteConfig(websiteConfig: WebsiteConfig): Boolean {
        return configCollection.withDocumentClass<WebsiteConfig>().updateOne(
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
                Updates.set(WebsiteConfig::encloserMapping.name, websiteConfig.encloserMapping),
            )
        ).wasAcknowledged()
    }
}