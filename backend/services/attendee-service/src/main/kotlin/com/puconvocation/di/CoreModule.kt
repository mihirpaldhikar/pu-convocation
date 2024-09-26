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

import aws.sdk.kotlin.services.sqs.SqsClient
import com.fasterxml.jackson.databind.ObjectMapper
import com.puconvocation.Environment
import com.puconvocation.controllers.CacheController
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.services.AuthService
import com.puconvocation.services.DistributedLock
import com.puconvocation.services.DynamicsService
import com.puconvocation.services.LambdaService
import com.puconvocation.services.MessageQueue
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import org.koin.dsl.module
import redis.clients.jedis.JedisPool

object CoreModule {
    val init = module {
        single<Environment> {
            Environment()
        }

        single<JedisPool> {
            JedisPool(
                get<Environment>().redisURL
            )
        }

        single<DistributedLock> {
            DistributedLock(
                jedisPool = get<JedisPool>(),
            )
        }

        single<SqsClient> {
            SqsClient {
                region = get<Environment>().messageQueueRegion
            }
        }

        single<MessageQueue> {
            MessageQueue(
                sqsClient = get<SqsClient>(),
                environment = get<Environment>()
            )
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

        single<CacheController> {
            CacheController(
                pool = get<JedisPool>(),
            )
        }

        single<AuthService> {
            AuthService(
                environment = get<Environment>(),
                client = get<HttpClient>(),
                cache = get<CacheController>(),
                json = get<ObjectMapper>(),
                jsonWebToken = get<JsonWebToken>(),
            )
        }

        single<DynamicsService> {
            DynamicsService(
                environment = get<Environment>(),
                client = get<HttpClient>(),
                cache = get<CacheController>(),
                mapper = get<ObjectMapper>(),
            )
        }

        single<LambdaService> {
            LambdaService()
        }

        single<JsonWebToken> {
            JsonWebToken(
                jwtConfig = get<Environment>().jwtConfig
            )
        }
    }
}