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

import com.puconvocation.commons.dto.CredentialsDTO
import com.puconvocation.commons.dto.NewAccountDTO
import com.puconvocation.controllers.AccountController
import com.puconvocation.controllers.PasskeyController
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.removeSecurityTokens
import com.puconvocation.utils.sendResponse
import com.puconvocation.utils.setAccountCookies
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.accountsRoute(
    accountController: AccountController,
    passkeyController: PasskeyController
) {
    route("/accounts") {
        post("/authenticate") {
            val credentials: CredentialsDTO = call.receive<CredentialsDTO>()
            val result = accountController.authenticate(credentials)
            setAccountCookies(result)
        }

        post("/passkeys/register") {
            val credentials = call.receive<CredentialsDTO>()
            val result = passkeyController.startPasskeyRegistration(
                identifier = credentials.identifier
            )
            sendResponse(result)
        }

        post("/passkeys/validateRegistrationChallenge") {
            val credentials = call.receive<CredentialsDTO>()
            val result =
                passkeyController.validatePasskeyRegistration(
                    identifier = credentials.identifier,
                    credentials = credentials.passkeyCredentials!!
                )

            sendResponse(result)
        }

        post("/passkeys/validatePasskeyChallenge") {
            val credentials = call.receive<CredentialsDTO>()
            val result = passkeyController.validatePasskeyChallenge(
                identifier = credentials.identifier,
                credentials = credentials.passkeyCredentials!!
            )

            setAccountCookies(result)
        }

        post("/signup") {
            val newAccount: NewAccountDTO = call.receive<NewAccountDTO>()
            val result = accountController.signUp(newAccount)
            setAccountCookies(result)
        }

        post("/refresh") {
            val securityToken = getSecurityTokens()
            val result = accountController.generateNewSecurityTokens(securityToken)
            setAccountCookies(result)
        }

        post("/signout") {
            removeSecurityTokens()
        }

        get("/") {
            val securityToken = getSecurityTokens()
            val result = accountController.accountDetails(securityToken)
            sendResponse(result)
        }

    }
}