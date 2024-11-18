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

package com.puconvocation.plugins

import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.puconvocation.serializers.ObjectIdDeserializer
import com.puconvocation.serializers.ObjectIdSerializer
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import org.bson.types.ObjectId

fun Application.configureSerialization() {
    val module = SimpleModule()
    module.addSerializer(ObjectId::class.java, ObjectIdSerializer())
    module.addDeserializer(ObjectId::class.java, ObjectIdDeserializer())
    install(ContentNegotiation) {
        jackson {
            registerModule(module)
            registerModule(JavaTimeModule())
        }
    }
}
