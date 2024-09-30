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

import com.puconvocation.di.ControllerModule
import com.puconvocation.di.CoreModule
import com.puconvocation.di.DatabaseModule
import com.puconvocation.di.RepositoriesModule
import io.ktor.server.application.*
import org.koin.ktor.plugin.Koin

fun Application.configureDependencyInjection() {
    install(Koin) {
        modules(
            CoreModule.init,
            DatabaseModule.init,
            RepositoriesModule.init,
            ControllerModule.init
        )
    }
}