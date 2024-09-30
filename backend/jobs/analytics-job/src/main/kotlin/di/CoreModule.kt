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

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.module.SimpleModule
import com.puconvocation.Environment
import com.puconvocation.serializers.ObjectIdDeserializer
import com.puconvocation.serializers.ObjectIdSerializer
import com.puconvocation.services.KafkaService
import org.bson.types.ObjectId
import org.koin.dsl.module

object CoreModule {
    val init = module {

        single<Environment> {
            Environment()
        }

        single<ObjectMapper> {
            val objectIdModule = SimpleModule()
            objectIdModule.addSerializer(ObjectId::class.java, ObjectIdSerializer())
            objectIdModule.addDeserializer(ObjectId::class.java, ObjectIdDeserializer())
            val mapper = ObjectMapper()
            mapper.registerModule(objectIdModule)
            mapper

        }

        single<KafkaService> {
            KafkaService(
                brokers = get<Environment>().kafkaBrokers
            )
        }
    }
}