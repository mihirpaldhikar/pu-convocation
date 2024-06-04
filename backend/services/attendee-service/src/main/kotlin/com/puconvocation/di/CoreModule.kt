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

import com.puconvocation.Environment
import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.serializers.CSVSerializer
import com.puconvocation.services.CacheService
import org.koin.dsl.module
import java.util.concurrent.TimeUnit

object CoreModule {
    val init = module {
        single<Environment> {
            Environment()
        }

        single<CSVSerializer> {
            CSVSerializer()
        }

        single<CacheService<Attendee>> {
            CacheService(
                expiryDuration = 5,
                timeUnit = TimeUnit.MINUTES
            )
        }

        single<JsonWebToken> {
            JsonWebToken(
                jwtMetadata = get<Environment>().jwtMetadata
            )
        }
    }
}