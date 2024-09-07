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
import com.puconvocation.controllers.AccountController
import com.puconvocation.controllers.PasskeyController
import com.puconvocation.controllers.IAMController
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.database.mongodb.repositories.IAMRepository
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.CacheService
import com.yubico.webauthn.RelyingParty
import org.koin.dsl.module

object ControllerModule {
    val init = module {
        single<IAMController> {
            IAMController(
                accountRepository = get<AccountRepository>(),
                iamRepository = get<IAMRepository>(),
                jsonWebToken = get<JsonWebToken>(),
                json = get<ObjectMapper>(),
                cacheService = get<CacheService>()
            )
        }

        single<AccountController> {
            AccountController(
                accountRepository = get<AccountRepository>(),
                jsonWebToken = get<JsonWebToken>(),
                passkeyController = get<PasskeyController>(),
                iamController = get<IAMController>(),
                json = get<ObjectMapper>(),
                cacheService = get<CacheService>(),
            )
        }

        single<PasskeyController> {
            PasskeyController(
                accountRepository = get<AccountRepository>(),
                jsonWebToken = get<JsonWebToken>(),
                rp = get<RelyingParty>(),
                json = get<ObjectMapper>(),
                cacheService = get<CacheService>(),
            )
        }
    }
}