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
import com.puconvocation.Environment
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.security.passkeys.PasskeyRelyingParty
import com.puconvocation.controllers.CacheController
import com.yubico.webauthn.RelyingParty
import org.koin.dsl.module
import redis.clients.jedis.JedisPool

object CoreModule {
    val init = module {
        single<Environment> {
            Environment()
        }

        single<JedisPool> {
            JedisPool(
                get<Environment>().redisURL
            )
        }

        single<ObjectMapper> {
            ObjectMapper()
        }

        single<JsonWebToken> {
            JsonWebToken(jwtMetadata = get<Environment>().jwtMetadata)
        }

        single<RelyingParty> {
            PasskeyRelyingParty(
                developmentMode = get<Environment>().developmentMode,
                accountRepository = get<AccountRepository>()
            ).getRelyingParty()
        }

        single<CacheController> {
            CacheController(
                pool = get<JedisPool>(),
            )
        }
    }
}