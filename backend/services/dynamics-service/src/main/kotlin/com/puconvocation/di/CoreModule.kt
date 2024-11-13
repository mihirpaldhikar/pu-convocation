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

import aws.sdk.kotlin.services.sqs.SqsClient
import aws.sdk.kotlin.services.sqs.SqsClient.Companion.invoke
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
import com.puconvocation.services.CloudStorage
import com.puconvocation.services.DistributedLock
import com.puconvocation.services.KafkaService
import com.puconvocation.services.LambdaService
import com.puconvocation.services.MessageQueue
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.jackson.jackson
import org.bson.types.ObjectId
import org.koin.dsl.module
import redis.clients.jedis.JedisPool
import kotlin.collections.filter
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

        single<CloudStorage> {
            CloudStorage(
                aws = get<Environment>().cloud.aws,
                mapper = get<ObjectMapper>(),
                cache = get<CacheController>()
            )
        }

        single<KafkaService> {
            KafkaService(
                msk = get<Environment>().cloud.aws.msk
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

        single<JsonWebToken> {
            JsonWebToken(
                config = get<Environment>().security.jwt
            )
        }

        single<AuthService> {
            AuthService(
                client = get<HttpClient>(),
                cache = get<CacheController>(),
                json = get<ObjectMapper>(),
                jsonWebToken = get<JsonWebToken>(),
                authServiceAddress = get<Environment>().service.companionServices.filter { it.address.contains("auth") }
                    .first().address,
                currentServiceName = get<Environment>().service.name
            )
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

        single<CSVSerializer> {
            CSVSerializer()
        }

        single<LambdaService> {
            LambdaService()
        }

        single<CacheController> {
            CacheController(
                pool = get<JedisPool>(),
            )
        }
    }
}