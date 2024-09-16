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

import com.fasterxml.jackson.databind.ObjectMapper
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.repositories.AttendeeRepository
import com.puconvocation.database.mongodb.repositories.TransactionRepository
import org.koin.dsl.module

object RepositoriesModule {
    val init = module {
        single<AttendeeRepository> {
            AttendeeRepository(
                database = get<MongoDatabase>(),
                cache = get<CacheController>(),
                mapper = get<ObjectMapper>(),
            )
        }

        single<TransactionRepository> {
            TransactionRepository(
                database = get<MongoDatabase>(), cache = get<CacheController>(),
                mapper = get<ObjectMapper>(),
            )
        }
    }
}