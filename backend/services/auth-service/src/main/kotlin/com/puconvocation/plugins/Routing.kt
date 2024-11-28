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

import com.puconvocation.controllers.AccountController
import com.puconvocation.controllers.IAMPolicyController
import com.puconvocation.controllers.PasskeyController
import com.puconvocation.routes.accountsRoute
import com.puconvocation.routes.iamRoute
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.java.KoinJavaComponent

fun Application.configureRouting() {
    val accountController by KoinJavaComponent.inject<AccountController>(AccountController::class.java)
    val passkeyController by KoinJavaComponent.inject<PasskeyController>(PasskeyController::class.java)
    val iamPolicyController by KoinJavaComponent.inject<IAMPolicyController>(IAMPolicyController::class.java)

    routing {
        get("/health") {
            call.respondText(
                "Auth Service is Healthy.",
                contentType = ContentType.Text.Plain,
                status = HttpStatusCode.OK,
            )
        }
        iamRoute(
            iamPolicyController = iamPolicyController,
        )
        accountsRoute(
            accountController = accountController,
            passkeyController = passkeyController
        )
    }

}
