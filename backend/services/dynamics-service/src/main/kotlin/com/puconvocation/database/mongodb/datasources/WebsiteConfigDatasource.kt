package com.puconvocation.database.mongodb.datasources

import com.puconvocation.database.mongodb.entities.WebsiteConfig

interface WebsiteConfigDatasource {
    suspend fun getWebsiteConfig(): WebsiteConfig

    suspend fun setWebsiteConfig(websiteConfig: WebsiteConfig): Boolean

    suspend fun updateWebsiteConfig(websiteConfig: WebsiteConfig): Boolean
}