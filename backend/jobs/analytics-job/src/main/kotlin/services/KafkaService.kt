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

import org.apache.kafka.clients.consumer.KafkaConsumer
import java.util.Properties

class KafkaService(
    brokers: String,
) {
    private val properties = Properties()
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

        consumer = KafkaConsumer<String, String>(properties)
        consumer.subscribe(listOf(ANALYTICS_TOPIC))
    }

    fun getConsumer(): KafkaConsumer<String, String> {
        return consumer
    }

    companion object {
        const val ANALYTICS_TOPIC = "analytics"
    }
}