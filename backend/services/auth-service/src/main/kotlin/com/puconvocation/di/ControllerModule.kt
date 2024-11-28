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

package com.puconvocation.di

import com.puconvocation.Environment
import com.puconvocation.controllers.AccountController
import com.puconvocation.controllers.CacheController
import com.puconvocation.controllers.IAMPolicyController
import com.puconvocation.controllers.PasskeyController
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.database.mongodb.repositories.IAMPolicyRepository
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.MessageQueue
import com.yubico.webauthn.RelyingParty
import org.koin.dsl.module

object ControllerModule {
    val init = module {
        single<IAMPolicyController> {
            IAMPolicyController(
                accountRepository = get<AccountRepository>(),
                iamRepository = get<IAMPolicyRepository>(),
                jsonWebToken = get<JsonWebToken>(),
                cacheController = get<CacheController>(),
                companionServices = get<Environment>().service.companionServices
            )
        }

        single<AccountController> {
            AccountController(
                accountRepository = get<AccountRepository>(),
                jsonWebToken = get<JsonWebToken>(),
                passkeyController = get<PasskeyController>(),
                iamPolicyController = get<IAMPolicyController>(),
                iamRepository = get<IAMPolicyRepository>(),
                cache = get<CacheController>(),
                messageQueue = get<MessageQueue>()
            )
        }

        single<PasskeyController> {
            PasskeyController(
                accountRepository = get<AccountRepository>(),
                jsonWebToken = get<JsonWebToken>(),
                rp = get<RelyingParty>(),
                cacheController = get<CacheController>(),
            )
        }
    }
}