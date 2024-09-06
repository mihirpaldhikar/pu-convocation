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

package com.puconvocation.di

import com.fasterxml.jackson.databind.ObjectMapper
import com.google.gson.Gson
import com.puconvocation.Environment
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.services.AuthService
import com.puconvocation.services.CacheService
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import org.koin.dsl.module

object CoreModule {
    val init = module {
        single<Environment> {
            Environment()
        }

        single<ObjectMapper> {
            ObjectMapper()
        }

        single<HttpClient> {
            HttpClient(CIO)
        }

        single<CSVSerializer> {
            CSVSerializer()
        }

        single<CacheService> {
            CacheService(
                environment = get<Environment>(),
            )
        }

        single<AuthService> {
            AuthService(
                environment = get<Environment>(),
                client = get<HttpClient>(),
                cacheService = get<CacheService>(),
                json = get<ObjectMapper>(),
                jsonWebToken = get<JsonWebToken>(),
            )
        }

        single<JsonWebToken> {
            JsonWebToken(
                jwtMetadata = get<Environment>().jwtMetadata
            )
        }
    }
}