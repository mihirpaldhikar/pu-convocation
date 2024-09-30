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

package com.puconvocation

import com.ecwid.consul.v1.ConsulClient
import com.ecwid.consul.v1.agent.model.NewService
import com.puconvocation.plugins.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import org.koin.java.KoinJavaComponent

fun main() {
    embeddedServer(
        Netty,
        port = 8081,
        host = "0.0.0.0",
        module = Application::module,
    )
        .start(wait = true)
}

fun Application.module() {
    configureDependencyInjection()
    configureHTTP()
    configureMonitoring()
    configureSerialization()
    configureRouting()

    val serviceDiscovery by KoinJavaComponent.inject<ConsulClient>(ConsulClient::class.java)
    val currentService by KoinJavaComponent.inject<NewService>(NewService::class.java)


    environment.monitor.subscribe(ApplicationStarted) {
        serviceDiscovery.agentServiceRegister(currentService)
    }

    environment.monitor.subscribe(ApplicationStopping) {
        serviceDiscovery.agentServiceDeregister(currentService.id)
    }

}
