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

import com.puconvocation.controllers.AccountController
import com.puconvocation.controllers.PasskeyController
import com.puconvocation.controllers.UACController
import com.puconvocation.routes.accountsRoute
import com.puconvocation.routes.uacRoute
import io.ktor.server.application.*
import io.ktor.server.routing.*
import org.koin.java.KoinJavaComponent

fun Application.configureRouting() {
    val accountController by KoinJavaComponent.inject<AccountController>(AccountController::class.java)
    val passkeyController by KoinJavaComponent.inject<PasskeyController>(PasskeyController::class.java)
    val uacController by KoinJavaComponent.inject<UACController>(UACController::class.java)

    routing {
        uacRoute(uacController = uacController)
        accountsRoute(
            accountController = accountController,
            passkeyController = passkeyController
        )
    }
}
