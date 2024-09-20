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

import com.puconvocation.commons.dto.UpdateWebsiteConfigRequest
import com.puconvocation.controllers.WebsiteController
import com.puconvocation.services.KafkaService
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.server.plugins.origin
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.websiteConfigRoute(
    websiteController: WebsiteController,
    kafkaService: KafkaService
) {
    route("/websiteConfig") {
        get("/") {
            val analyticsHeader = call.request.headers["x-analytics"]

            if (analyticsHeader != null) {
                kafkaService.produce("$analyticsHeader;${call.request.origin.remoteAddress}")
            }

            val result = websiteController.getWebsiteConfig()
            call.sendResponse(result)
        }

        patch("/update") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val updateWebsiteConfigRequest = call.receive<UpdateWebsiteConfigRequest>()
            val result = websiteController.updateWebsiteConfig(authorizationToken, updateWebsiteConfigRequest)
            call.sendResponse(result)
        }
    }
}