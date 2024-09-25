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

package com.puconvocation.plugins

import com.puconvocation.controllers.RemoteConfigController
import com.puconvocation.routes.remoteConfigRoute
import com.puconvocation.services.KafkaService
import io.ktor.server.application.*
import io.ktor.server.routing.*
import org.koin.java.KoinJavaComponent

fun Application.configureRouting() {

    val remoteConfigController by KoinJavaComponent.inject<RemoteConfigController>(RemoteConfigController::class.java)
    val kafkaService by KoinJavaComponent.inject<KafkaService>(KafkaService::class.java)

    routing {
        remoteConfigRoute(
            remoteConfigController = remoteConfigController,
            kafkaService = kafkaService
        )
    }
}
