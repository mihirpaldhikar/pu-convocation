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

package com.puconvocation.routes

import com.puconvocation.commons.dto.*
import com.puconvocation.controllers.AccountController
import com.puconvocation.controllers.PasskeyController
import com.puconvocation.enums.ResponseCode
import com.puconvocation.utils.*
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.accountsRoute(
    accountController: AccountController,
    passkeyController: PasskeyController
) {
    route("/accounts") {
        post("/authenticate") {
            val credentials: AuthenticationCredentials = call.receive<AuthenticationCredentials>()
            val result = accountController.authenticate(credentials)
            call.sendResponseWithAccountCookies(result)
        }

        post("/new") {
            val invitationToken = call.request.queryParameters["invitationToken"] ?: return@post call.sendResponse(
                Result.Error(
                    httpStatusCode = HttpStatusCode.BadRequest,
                    error = ErrorResponse(
                        errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                        message = "Invitation token is missing"
                    )
                )
            )
            val account: NewAccountFromInvitation = call.receive<NewAccountFromInvitation>()
            val result = accountController.createNewAccount(invitationToken, account)
            call.sendResponseWithAccountCookies(result)
        }

        post("/sendInvitations") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val invitations: AccountInvitations = call.receive<AccountInvitations>()
            val result = accountController.createInvitations(authorizationToken, invitations)
            call.sendResponse(result)
        }

        post("/signout") {
            call.removeSecurityTokens()
        }

        get("/") {
            val securityToken = call.getSecurityTokens()
            val result = accountController.accountDetails(securityToken)
            call.sendResponseWithAccountCookies(result)
        }

        post("/updateIAMPolicies") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val request = call.receive<UpdateAccountIAMPoliciesRequest>()
            val result = accountController.updateAssignedIAMPoliciesForAccount(authorizationToken, request)
            call.sendResponse(result)
        }

        get("/all") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val result = accountController.getAllAccounts(authorizationToken)
            call.sendResponseWithAccountCookies(result)
        }

        get("/{identifier}") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val identifier = call.parameters["identifier"] ?: return@get call.sendResponse(
                Result.Error(
                    httpStatusCode = HttpStatusCode.BadRequest,
                    error = ErrorResponse(
                        errorCode = ResponseCode.INVALID_OR_NULL_IDENTIFIER,
                        message = "Please provide a valid identifier."
                    )
                )
            )
            val result = accountController.accountDetails(authorizationToken, identifier)
            call.sendResponse(result)
        }

        patch("/update") {
            val authorizationToken = call.getSecurityTokens().authorizationToken
            val updateRequest = call.receive<AccountUpdateRequest>()
            val result = accountController.updateAccount(authorizationToken, updateRequest)
            call.sendResponse(result)
        }

        route("/passkeys") {

            post("/register") {
                val securityToken = call.getSecurityTokens()
                val result = passkeyController.startPasskeyRegistrationWithSecurityToken(
                    securityToken
                )
                call.sendResponse(result)
            }

            post("/validateRegistrationChallenge") {
                val credentials = call.receive<AuthenticationCredentials>()
                val result =
                    passkeyController.validatePasskeyRegistration(
                        identifier = credentials.identifier,
                        credentials = credentials.passkeyCredentials!!
                    )

                call.sendResponseWithAccountCookies(result)
            }

            post("/validatePasskeyChallenge") {
                val credentials = call.receive<AuthenticationCredentials>()
                val result = passkeyController.validatePasskeyChallenge(
                    identifier = credentials.identifier,
                    credentials = credentials.passkeyCredentials!!
                )

                call.sendResponseWithAccountCookies(result)
            }
        }

    }
}