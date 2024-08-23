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

import com.puconvocation.controllers.AttendeeController
import com.puconvocation.controllers.TransactionController
import com.puconvocation.routes.attendeesRoute
import com.puconvocation.routes.transactionsRoute
import io.ktor.server.application.*
import io.ktor.server.routing.*
import org.koin.java.KoinJavaComponent

fun Application.configureRouting() {
    val attendeeController by KoinJavaComponent.inject<AttendeeController>(AttendeeController::class.java)
    val transactionController by KoinJavaComponent.inject<TransactionController>(TransactionController::class.java)

    routing {
        attendeesRoute(attendeeController = attendeeController)
        transactionsRoute(transactionController = transactionController)
    }
}
