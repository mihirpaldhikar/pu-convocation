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

import com.puconvocation.Environment
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.defaultheaders.*
import org.koin.java.KoinJavaComponent

fun Application.configureHTTP() {
    val environment: Environment by KoinJavaComponent.inject(Environment::class.java)

    install(CORS) {
        allowCredentials = true

        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Delete)

        allowHeader(HttpHeaders.Origin)
        allowHeader(HttpHeaders.Accept)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.AuthenticationInfo)
        allowHeader(HttpHeaders.AccessControlAllowOrigin)
        allowHeader(HttpHeaders.AccessControlAllowHeaders)
        allowHeader(HttpHeaders.AccessControlAllowCredentials)


        if (environment.developmentMode) {
            allowHost("localhost:3000", listOf("http", "https"))
            allowHost("localhost:8080", listOf("http", "https"))
        }

        allowHost(
            host = "puconvocation.com",
            schemes = listOf("http", "https"),
            subDomains = listOf("api", "accounts", "dashboard")
        )
    }

    install(DefaultHeaders) {
        header("X-Service", "Attendee Service")
    }
}
