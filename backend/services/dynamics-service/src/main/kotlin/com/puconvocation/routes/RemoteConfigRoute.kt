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

package com.puconvocation.routes

import com.puconvocation.commons.dto.ChangeRemoteConfigRequest
import com.puconvocation.controllers.RemoteConfigController
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.remoteConfigRoute(
    remoteConfigController: RemoteConfigController,
) {
    route("/config") {
        get("/") {
            val result = remoteConfigController.getConfig()
            call.sendResponse(result)
        }

        patch("/change") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val changeRemoteConfigRequest = call.receive<ChangeRemoteConfigRequest>()
            val result = remoteConfigController.changeConfig(authorizationToken, changeRemoteConfigRequest)
            call.sendResponse(result)
        }
    }
}