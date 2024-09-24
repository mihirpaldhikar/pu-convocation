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

package com.puconvocation

import com.puconvocation.database.mongodb.entities.AnalyticsLog
import com.puconvocation.database.mongodb.repositories.AnalyticsRepository
import com.puconvocation.database.mongodb.repositories.IpTableRepository
import com.puconvocation.di.CoreModule
import com.puconvocation.di.DatabaseModule
import com.puconvocation.di.RepositoryModule
import com.puconvocation.services.KafkaService
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.bson.types.ObjectId
import org.koin.core.context.startKoin
import org.koin.java.KoinJavaComponent
import java.time.Duration
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.ConcurrentLinkedQueue

fun main(): Unit = runBlocking {
    val queue = ConcurrentLinkedQueue<String>()

    startKoin {
        modules(
            listOf(
                CoreModule.init,
                DatabaseModule.init,
                RepositoryModule.init
            )
        )
    }

    val environment by KoinJavaComponent.inject<Environment>(Environment::class.java)

    val kafkaService by KoinJavaComponent.inject<KafkaService>(KafkaService::class.java)
    val consumer = kafkaService.getConsumer()

    val analyticsRepository by KoinJavaComponent.inject<AnalyticsRepository>(AnalyticsRepository::class.java)
    val ipTable by KoinJavaComponent.inject<IpTableRepository>(IpTableRepository::class.java)

    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");

    launch {
        while (true) {
            val records = consumer.poll(Duration.ofMillis(100))
            for (record in records) {
                queue.add(record.value())
            }
            delay(1000)
        }
    }

    launch {
        while (true) {
            repeat(10) {
                val message = queue.poll()
                if (message != null) {
                    val data = message.split(";")
                    val ip = if (environment.developmentMode) {
                        environment.testIP
                    } else {
                        data[3]
                    }
                    val ipDetails = ipTable.getDetails(ip)
                    if (ipDetails != null) {
                        val analyticsLog = AnalyticsLog(
                            logId = ObjectId(),
                            timestamp = OffsetDateTime.parse(data[0], formatter).toLocalDateTime(),
                            lang = data[1],
                            path = data[2],
                            region = AnalyticsLog.Region(
                                district = ipDetails.city,
                                state = ipDetails.region,
                                country = ipDetails.country,
                                countryCode = ipDetails.countryCode
                            )
                        )
                        analyticsRepository.addLog(analyticsLog)
                    }

                }
            }
            delay(3000)
        }
    }

}