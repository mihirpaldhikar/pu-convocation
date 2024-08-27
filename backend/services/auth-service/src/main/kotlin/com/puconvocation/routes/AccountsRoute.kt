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

package com.puconvocation.routes

import com.puconvocation.commons.dto.AuthenticationCredentials
import com.puconvocation.commons.dto.NewAccount
import com.puconvocation.controllers.AccountController
import com.puconvocation.controllers.PasskeyController
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.removeSecurityTokens
import com.puconvocation.utils.sendResponse
import com.puconvocation.utils.sendResponseWithAccountCookies
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.accountsRoute(
    accountController: AccountController,
    passkeyController: PasskeyController
) {
    route("/accounts") {

        post("/authenticationStrategy") {
            val credentials = call.receive<AuthenticationCredentials>()

            val result = accountController.getAuthenticationStrategy(credentials.identifier)
            sendResponse(result)
        }

        post("/authenticate") {
            val credentials: AuthenticationCredentials = call.receive<AuthenticationCredentials>()
            val result = accountController.authenticate(credentials)
            sendResponseWithAccountCookies(result)
        }

        post("/new") {
            val securityToken = getSecurityTokens()
            val newAccount: NewAccount = call.receive<NewAccount>()
            val result = accountController.createNewAccount(newAccount, securityToken)
            sendResponseWithAccountCookies(result)
        }

        post("/signout") {
            removeSecurityTokens()
        }

        get("/") {
            val securityToken = getSecurityTokens()
            val result = accountController.accountDetails(securityToken)
            sendResponseWithAccountCookies(result)
        }

        route("/passkeys") {

            post("/register") {
                val securityToken = getSecurityTokens()
                val result = passkeyController.startPasskeyRegistrationWithSecurityToken(
                    securityToken
                )
                sendResponse(result)
            }

            post("/validateRegistrationChallenge") {
                val credentials = call.receive<AuthenticationCredentials>()
                val result =
                    passkeyController.validatePasskeyRegistration(
                        identifier = credentials.identifier,
                        credentials = credentials.passkeyCredentials!!
                    )

                sendResponse(result)
            }

            post("/validatePasskeyChallenge") {
                val credentials = call.receive<AuthenticationCredentials>()
                val result = passkeyController.validatePasskeyChallenge(
                    identifier = credentials.identifier,
                    credentials = credentials.passkeyCredentials!!
                )

                sendResponseWithAccountCookies(result)
            }
        }

    }
}