package com.puconvocation.di

import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.repositories.WebsiteConfigRepository
import org.koin.dsl.module

object RepositoryModule {
    val init = module {
        single<WebsiteConfigRepository> {
            WebsiteConfigRepository(
                database = get<MongoDatabase>(),
            )
        }
    }
}