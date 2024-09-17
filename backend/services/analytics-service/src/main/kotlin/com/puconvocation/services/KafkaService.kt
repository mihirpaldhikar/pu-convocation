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

package com.puconvocation.services

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.apache.kafka.clients.admin.AdminClient
import org.apache.kafka.clients.admin.NewTopic
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import java.util.*

class KafkaService(
    brokers: String,
) {
    private val properties = Properties()
    private val kafkaAdmin: AdminClient
    private val producer: KafkaProducer<String, String>
    private val consumer: KafkaConsumer<String, String>

    init {
        properties["bootstrap.servers"] = brokers
        properties["security.protocol"] = "SASL_SSL"
        properties["sasl.mechanism"] = "AWS_MSK_IAM"
        properties["sasl.jaas.config"] = "software.amazon.msk.auth.iam.IAMLoginModule required;"
        properties["sasl.client.callback.handler.class"] = "software.amazon.msk.auth.iam.IAMClientCallbackHandler"
        properties["key.serializer"] = "org.apache.kafka.common.serialization.StringSerializer"
        properties["value.serializer"] = "org.apache.kafka.common.serialization.StringSerializer"
        properties["key.deserializer"] = "org.apache.kafka.common.serialization.StringDeserializer"
        properties["value.deserializer"] = "org.apache.kafka.common.serialization.StringDeserializer"
        properties["group.id"] = "analytics-consumer-group"

        kafkaAdmin = AdminClient.create(properties)
        producer = KafkaProducer<String, String>(properties)
        consumer = KafkaConsumer<String, String>(properties)
    }

    fun createTopic(
        name: String,
        partitions: Int? = 2,
        replicationFactor: Short? = 2
    ): Boolean {
        val existingTopics = kafkaAdmin.listTopics().names().get()
        if (existingTopics.any { it.equals(name, ignoreCase = true) }) {
            return false
        }
        kafkaAdmin.createTopics(listOf(NewTopic(name, partitions ?: 2, replicationFactor ?: 2))).all().get()
        return true
    }

    suspend fun produce(message: String) {
        withContext(Dispatchers.IO) {
            producer.send(ProducerRecord(ANALYTICS_TOPIC, message)).get()
        }
    }

    companion object {
        const val ANALYTICS_TOPIC = "analytics"
    }
}