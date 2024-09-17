package com.puconvocation.di

import com.fasterxml.jackson.databind.ObjectMapper
import com.puconvocation.controllers.CacheController
import com.puconvocation.controllers.WebsiteController
import com.puconvocation.database.mongodb.repositories.WebsiteConfigRepository
import com.puconvocation.services.AuthService
import org.koin.dsl.module

object ControllerModule {
    val init = module {
        single<WebsiteController> {
            WebsiteController(
                websiteConfigRepository = get<WebsiteConfigRepository>(),
                authService = get<AuthService>()
            )
        }
    }
}