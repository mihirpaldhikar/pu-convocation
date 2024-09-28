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
import com.ecwid.consul.v1.ConsulClient
import com.ecwid.consul.v1.agent.model.NewService
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.module.kotlin.readValue
import com.puconvocation.Environment
import com.puconvocation.controllers.CacheController
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.serializers.ObjectIdDeserializer
import com.puconvocation.serializers.ObjectIdSerializer
import com.puconvocation.services.AuthService
import com.puconvocation.services.DistributedLock
import com.puconvocation.services.DynamicsService
import com.puconvocation.services.LambdaService
import com.puconvocation.services.MessageQueue
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.jackson.jackson
import org.bson.types.ObjectId
import org.koin.dsl.module
import redis.clients.jedis.JedisPool
import java.util.UUID
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
object CoreModule {
    val init = module {
        single<ObjectMapper> {
            ObjectMapper()
        }

        single<Environment> {
            get<ObjectMapper>().readValue<Environment>(Base64.decode(System.getenv("SERVICE_CONFIG")))
        }

        single<ConsulClient> {
            ConsulClient()
        }

        single<NewService> {
            val service = NewService()
            service.id = UUID.randomUUID().toString()
            service.name = get<Environment>().serviceName
            service.address = "localhost"
            service.port = 8082

            val serviceCheck = NewService.Check()
            serviceCheck.http = "http://localhost:${service.port}/health"
            serviceCheck.interval = "60s"

            service.check = serviceCheck
            service
        }

        single<DistributedLock> {
            DistributedLock(
                jedisPool = get<JedisPool>(),
            )
        }

        single<SqsClient> {
            SqsClient {
                region = get<Environment>().cloud.aws.region
            }
        }

        single<MessageQueue> {
            MessageQueue(
                sqsClient = get<SqsClient>(),
                awsConfig = get<Environment>().cloud.aws
            )
        }

        single<HttpClient> {
            HttpClient(CIO) {
                val module = SimpleModule()
                module.addSerializer(ObjectId::class.java, ObjectIdSerializer())
                module.addDeserializer(ObjectId::class.java, ObjectIdDeserializer())
                install(ContentNegotiation) {
                    jackson {
                        registerModule(module)
                    }
                }
            }
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
                client = get<HttpClient>(),
                cache = get<CacheController>(),
                json = get<ObjectMapper>(),
                jsonWebToken = get<JsonWebToken>(),
                serviceDiscovery = get<ConsulClient>()
            )
        }

        single<DynamicsService> {
            DynamicsService(
                client = get<HttpClient>(),
                cache = get<CacheController>(),
                mapper = get<ObjectMapper>(),
                serviceDiscovery = get<ConsulClient>()
            )
        }

        single<LambdaService> {
            LambdaService()
        }

        single<JsonWebToken> {
            JsonWebToken(
                config = get<Environment>().security.jwt
            )
        }
    }
}