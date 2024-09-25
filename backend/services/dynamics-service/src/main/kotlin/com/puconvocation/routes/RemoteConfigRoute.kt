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

package com.puconvocation.routes

import com.puconvocation.Environment
import com.puconvocation.commons.dto.ChangeRemoteConfigRequest
import com.puconvocation.controllers.RemoteConfigController
import com.puconvocation.services.KafkaService
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.server.plugins.origin
import io.ktor.server.request.*
import io.ktor.server.response.respond
import io.ktor.server.routing.*

fun Routing.remoteConfigRoute(
    remoteConfigController: RemoteConfigController,
    kafkaService: KafkaService,
    environment: Environment,
) {
    route("/config") {
        get("/") {
            val analyticsHeader = call.request.headers["x-analytics"]

            if (analyticsHeader != null) {
                kafkaService.produce("$analyticsHeader;${call.request.origin.remoteAddress}")
            }

            val result = remoteConfigController.getConfig()
            call.sendResponse(result)
        }

        patch("/change") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val changeRemoteConfigRequest = call.receive<ChangeRemoteConfigRequest>()
            val result = remoteConfigController.changeConfig(authorizationToken, changeRemoteConfigRequest)
            call.sendResponse(result)
        }

        patch("/mutateAttendeeLock") {
            val host = call.request.host()

            if (!environment.servicesHosts.split(";;").contains(host)) {
                return@patch call.respond(false)
            }
            val lock = call.request.queryParameters["lock"]?.toBooleanStrictOrNull() ?: return@patch call.respond(false)
            val result = remoteConfigController.mutateAttendeeLock(lock)
            call.respond(result)
        }
    }
}