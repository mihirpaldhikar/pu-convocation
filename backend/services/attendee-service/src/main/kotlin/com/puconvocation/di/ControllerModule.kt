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

package com.puconvocation.di

import com.puconvocation.controllers.AttendeeController
import com.puconvocation.controllers.TransactionController
import com.puconvocation.database.mongodb.repositories.AttendeeRepository
import com.puconvocation.database.mongodb.repositories.TransactionRepository
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.services.AuthService
import com.puconvocation.services.DistributedLock
import com.puconvocation.services.MessageQueue
import org.koin.dsl.module

object ControllerModule {
    val init = module {
        single<AttendeeController> {
            AttendeeController(
                attendeeRepository = get<AttendeeRepository>(),
                csvSerializer = get<CSVSerializer>(),
                authService = get<AuthService>(),
                messageQueue = get<MessageQueue>(),
                distributedLock = get<DistributedLock>(),
            )
        }

        single<TransactionController> {
            TransactionController(
                transactionRepository = get<TransactionRepository>(),
                attendeeRepository = get<AttendeeRepository>(),
                jsonWebToken = get<JsonWebToken>(),
                authService = get<AuthService>(),
            )
        }
    }
}