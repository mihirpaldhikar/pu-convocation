package com.puconvocation.di

import com.google.gson.Gson
import com.puconvocation.controllers.WebsiteController
import com.puconvocation.database.mongodb.repositories.WebsiteConfigRepository
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.AuthService
import com.puconvocation.services.CacheService
import org.koin.dsl.module

object ControllerModule {
    val init = module {
        single<WebsiteController> {
            WebsiteController(
                websiteConfigRepository = get<WebsiteConfigRepository>(),
                jsonWebToken = get<JsonWebToken>(),
                gson = get<Gson>(),
                cacheService = get<CacheService>(),
                authService = get<AuthService>()
            )
        }
    }
}