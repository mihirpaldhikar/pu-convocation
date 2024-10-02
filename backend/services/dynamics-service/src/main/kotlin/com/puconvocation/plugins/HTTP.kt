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

import com.puconvocation.Environment
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cachingheaders.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.defaultheaders.*
import org.koin.java.KoinJavaComponent

fun Application.configureHTTP() {
    val environment: Environment by KoinJavaComponent.inject<Environment>(Environment::class.java)

    install(CachingHeaders) {
        options { _, outgoingContent ->
            when (outgoingContent.contentType?.withoutParameters()) {
                ContentType.Text.CSS -> CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 24 * 60 * 60))
                else -> null
            }
        }
    }

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
        allowHeader("x-analytics")

        if (environment.service.developmentMode) {
            allowHost("localhost:3000", listOf("http", "https"))
            allowHost("localhost:8081", listOf("http", "https"))
            allowHost("localhost:8082", listOf("http", "https"))
            allowHost("localhost:8084", listOf("http", "https"))
        }

        allowHost(
            host = "puconvocation.com",
            subDomains = listOf("auth", "dynamics"),
            schemes = listOf("https"),
        )

    }

    install(DefaultHeaders) {
        header("X-Service", "Dynamics Service")
    }
}
