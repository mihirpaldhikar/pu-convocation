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

import com.puconvocation.controllers.AssetsController
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.server.request.receiveMultipart
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route

fun Routing.assetsRoute(
    assetsController: AssetsController
) {
    route("/assets") {
        post("/images/upload") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val file = call.receiveMultipart()
            val result = assetsController.uploadImage(authorizationToken, file)
            call.sendResponse(result)
        }

        post("/avatars/upload") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val file = call.receiveMultipart()
            val result = assetsController.uploadAvatar(authorizationToken, file)
            call.sendResponse(result)
        }

        post("/documents/upload") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val file = call.receiveMultipart()
            val result = assetsController.uploadDocument(authorizationToken, file)
            call.sendResponse(result)
        }

        post("/documents/instructions/upload") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val file = call.receiveMultipart()
            val result = assetsController.uploadInstructions(authorizationToken, file)
            call.sendResponse(result)
        }

        post("/documents/instructions/source/upload") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val file = call.receiveMultipart()
            val result = assetsController.uploadInstructionsSource(authorizationToken, file)
            call.sendResponse(result)
        }

        get("/images") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val result = assetsController.getObjectsInFolder(authorizationToken, "images/")
            call.sendResponse(result)
        }

        get("/avatars") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val result = assetsController.getObjectsInFolder(authorizationToken, "avatars/")
            call.sendResponse(result)
        }

        get("/documents") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val result = assetsController.getObjectsInFolder(authorizationToken, "documents/")
            call.sendResponse(result)
        }
    }
}