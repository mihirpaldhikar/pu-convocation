package com.puconvocation.di

import com.fasterxml.jackson.databind.ObjectMapper
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.repositories.WebsiteConfigRepository
import org.koin.dsl.module

object RepositoryModule {
    val init = module {
        single<WebsiteConfigRepository> {
            WebsiteConfigRepository(
                database = get<MongoDatabase>(),
                cache = get<CacheController>(),
                mapper = get<ObjectMapper>()
            )
        }
    }
}