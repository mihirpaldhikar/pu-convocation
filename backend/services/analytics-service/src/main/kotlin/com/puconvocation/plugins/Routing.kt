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

import com.puconvocation.controllers.AnalyticsController
import com.puconvocation.routes.analyticsRoute
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.response.respondText
import io.ktor.server.routing.*
import org.koin.java.KoinJavaComponent

fun Application.configureRouting() {

    val analyticsController by KoinJavaComponent.inject<AnalyticsController>(AnalyticsController::class.java)

    routing {
        get("/health") {
            call.respondText(
                "Analytics Service is Healthy.",
                contentType = ContentType.Text.Plain,
                status = HttpStatusCode.OK,
            )
        }

        analyticsRoute(
            analyticsController = analyticsController
        )
    }
}
