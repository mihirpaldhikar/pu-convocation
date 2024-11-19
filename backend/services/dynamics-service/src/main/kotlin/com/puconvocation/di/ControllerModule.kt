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

package com.puconvocation.di

import com.puconvocation.Environment
import com.puconvocation.controllers.*
import com.puconvocation.database.mongodb.repositories.AnalyticsRepository
import com.puconvocation.database.mongodb.repositories.AttendeeRepository
import com.puconvocation.database.mongodb.repositories.RemoteConfigRepository
import com.puconvocation.database.mongodb.repositories.TransactionRepository
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.services.*
import io.ktor.client.*
import org.koin.dsl.module

object ControllerModule {
    val init = module {
        single<RemoteConfigController> {
            RemoteConfigController(
                remoteConfigRepository = get<RemoteConfigRepository>(),
                authService = get<AuthService>(),
            )
        }

        single<AnalyticsController> {
            AnalyticsController(
                analyticsRepository = get<AnalyticsRepository>(),
                authService = get<AuthService>()
            )
        }

        single<AttendeeController> {
            AttendeeController(
                attendeeRepository = get<AttendeeRepository>(),
                csvSerializer = get<CSVSerializer>(),
                authService = get<AuthService>(),
                distributedLock = get<DistributedLock>(),
                lambdaService = get<LambdaService>(),
                remoteConfigRepository = get<RemoteConfigRepository>(),
            )
        }

        single<TransactionController> {
            TransactionController(
                transactionRepository = get<TransactionRepository>(),
                jsonWebToken = get<JsonWebToken>(),
                authService = get<AuthService>(),
                messageQueue = get<MessageQueue>()
            )
        }

        single<AssetsController> {
            AssetsController(
                cloudStorage = get<CloudStorage>(),
                authService = get<AuthService>(),
                jsonWebToken = get<JsonWebToken>(),
                httpClient = get<HttpClient>(),
                credentialsAuthority = get<Environment>().security.jwt.credentialsAuthority
            )
        }
    }
}