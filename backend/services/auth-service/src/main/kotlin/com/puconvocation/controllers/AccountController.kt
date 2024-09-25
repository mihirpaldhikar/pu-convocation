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

package com.puconvocation.controllers

import com.puconvocation.commons.dto.AccountInvitations
import com.puconvocation.commons.dto.AccountWithIAMRoles
import com.puconvocation.commons.dto.AuthenticationCredentials
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.commons.dto.NewAccountFromInvitation
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.entities.Invitation
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.database.mongodb.repositories.IAMRepository
import com.puconvocation.enums.AuthenticationStrategy
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.core.Hash
import com.puconvocation.security.dao.SecurityToken
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.utils.Result
import io.ktor.http.*
import org.bson.types.ObjectId

class AccountController(
    private val accountRepository: AccountRepository,
    private val iamRepository: IAMRepository,
    private val jsonWebToken: JsonWebToken,
    private val passkeyController: PasskeyController,
    private val iamController: IAMController,
) {
    suspend fun getAuthenticationStrategy(identifier: String): Result<HashMap<String, Any>, ErrorResponse> {
        val account = accountRepository.getAccount(identifier) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found."
            )
        )

        if (account.suspended) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                    message = "Your account has been suspended."
                )
            )
        }

        val authenticationStrategy = if (account.fidoCredential.isEmpty()) AuthenticationStrategy.PASSWORD
        else AuthenticationStrategy.PASSKEY

        return Result.Success(
            hashMapOf(
                "authenticationStrategy" to
                        authenticationStrategy
            )
        )
    }

    suspend fun authenticate(credentials: AuthenticationCredentials): Result<Any, ErrorResponse> {
        val account = accountRepository.getAccount(credentials.identifier) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                message = "Account not found."
            )
        )

        if (account.suspended) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_SUSPENDED,
                    message = "Your account has been suspended."
                )
            )
        }

        if (account.fidoCredential.isNotEmpty()) {
            val result = passkeyController.startPasskeyChallenge(credentials.identifier)
            return result
        }

        if (credentials.password == null || account.password == null) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.NULL_PASSWORD,
                    message = "Please provide password."
                )
            )
        }

        val passwordMatched = Hash().verify(credentials.password, account.password)

        if (!passwordMatched) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotAcceptable,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_PASSWORD,
                    message = "Password is invalid. Please check your password."
                )
            )
        }

        return Result.Success(
            SecurityToken(
                payload = "Authenticated Successfully",
                authorizationToken = jsonWebToken.generateAuthorizationToken(
                    account.uuid.toHexString(),
                    "null",
                ),
                refreshToken = jsonWebToken.generateRefreshToken(account.uuid.toHexString(), "null"),
            )
        )
    }

    suspend fun createNewAccount(
        invitationToken: String,
        newAccountFromInvitation: NewAccountFromInvitation
    ): Result<Any, ErrorResponse> {

        val tokenClaims = jsonWebToken.getClaims(
            token = invitationToken,
            tokenType = TokenType.INVITATION_TOKEN,
            claims = listOf(JsonWebToken.INVITATION_ID_CLAIM)
        )

        if (tokenClaims.isEmpty()) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_TOKEN,
                    message = "Invitation is invalid or expired."
                )
            )
        }

        val invitation = accountRepository.findInvitation(tokenClaims[0]) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.INVITATION_NOT_FOUND,
                message = "Invitation not found."
            )
        )

        if (accountRepository.accountExists(invitation.email) || accountRepository.accountExists(
                newAccountFromInvitation.username
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_EXISTS,
                    message = "Account already exists. Please login instead."
                )
            )
        }

        val uuid = ObjectId()
        val account = Account(
            uuid = uuid,
            email = invitation.email,
            username = newAccountFromInvitation.username,
            avatarURL = "https://assets.puconvocation.com/avatars/default.png",
            displayName = newAccountFromInvitation.displayName,
            designation = newAccountFromInvitation.designation,
            suspended = false,
            password = null,
            fidoCredential = mutableSetOf()
        )
        val response = accountRepository.createAccount(account)
        if (!response) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_CREATION_ERROR,
                    message = "Account creation failed. Please try again."
                )
            )
        }

        for (iamRoles in invitation.roles) {
            var rule = iamRepository.getRule(iamRoles)

            if (rule != null) {
                val principals = rule.principals
                principals.add(uuid.toHexString())
                rule = rule.copy(
                    principals = principals
                )
                iamRepository.updateRule(rule)
            }
        }
        val result = passkeyController.startPasskeyRegistration(account.username)
        accountRepository.deleteInvitation(invitation.id.toHexString())
        return result
    }

    suspend fun accountDetails(securityToken: SecurityToken): Result<Any, ErrorResponse> {
        var tokens: SecurityToken = securityToken;

        var newTokenGenerated = false;

        if (tokens.refreshToken == null && tokens.authorizationToken == null) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Unauthorized,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_TOKEN,
                    message = "Authorization token is invalid or expired."
                )
            )
        }

        if (tokens.refreshToken != null && tokens.authorizationToken == null) {
            val newTokens =
                jsonWebToken.generateSecurityTokenFromRefreshToken(securityToken) ?: return Result.Error(
                    httpStatusCode = HttpStatusCode.Unauthorized,
                    error = ErrorResponse(
                        errorCode = ResponseCode.INVALID_TOKEN,
                        message = "Authorization token is invalid or expired."
                    )
                )


            tokens = newTokens
            newTokenGenerated = true
        }

        val tokenClaims =
            jsonWebToken.getClaims(tokens.authorizationToken!!, TokenType.AUTHORIZATION_TOKEN)

        if (tokenClaims.isEmpty()) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_TOKEN,
                    message = "Authorization token is invalid."
                )
            )
        }

        val account = accountRepository.getAccountWithIAMRoles(tokenClaims[0].replace("\"", ""))
            ?: return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                    message = "Account not found."
                )
            )

        if (newTokenGenerated) {
            return Result.Success(
                SecurityToken(
                    authorizationToken = tokens.authorizationToken,
                    refreshToken = tokens.refreshToken,
                    payload = account
                )
            )
        }

        return Result.Success(
            account
        )
    }

    suspend fun accountDetails(
        authorizationToken: String?,
        identifier: String
    ): Result<AccountWithIAMRoles, ErrorResponse> {
        val tokenClaims = jsonWebToken.getClaims(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (tokenClaims.isEmpty()) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_TOKEN,
                    message = "Authorization token is invalid."
                )

            )
        }


        if (!iamController.isAuthorized(
                role = "read:Account",
                principal = tokenClaims[0],
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view accounts."
                )
            )
        }

        val account = accountRepository.getAccountWithIAMRoles(identifier)
            ?: return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                    message = "Account not found."
                )
            )

        return Result.Success(
            account
        )
    }

    suspend fun createInvitations(
        authorizationToken: String?,
        accountInvitations: AccountInvitations
    ): Result<HashMap<String, Any>, ErrorResponse> {
        val tokenClaims = jsonWebToken.getClaims(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (tokenClaims.isEmpty()) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.INVALID_TOKEN,
                    message = "Authorization token is invalid."
                )
            )
        }


        if (!iamController.isAuthorized(
                role = "write:Account",
                principal = tokenClaims[0],
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to create invitations."
                )
            )
        }

        val allIAMRules = iamRepository.getAllRules()

        val allIAMRoleNames = allIAMRules.map { it.role }

        for (invite: AccountInvitations.Invite in accountInvitations.invites) {
            if (accountRepository.findInvitation(invite.email) != null) {
                return Result.Error(
                    httpStatusCode = HttpStatusCode.Conflict,
                    error = ErrorResponse(
                        errorCode = ResponseCode.ACCOUNT_EXISTS,
                        message = "Invitation already sent for email ${invite.email}."
                    )
                )
            }
            if (accountRepository.accountExists(invite.email)) {
                return Result.Error(
                    httpStatusCode = HttpStatusCode.Conflict,
                    error = ErrorResponse(
                        errorCode = ResponseCode.ACCOUNT_EXISTS,
                        message = "Account already exists with email ${invite.email}."
                    )
                )

                for (iamRole: String in invite.iamRoles) {
                    if (!allIAMRoleNames.contains(iamRole)) {
                        return Result.Error(
                            httpStatusCode = HttpStatusCode.NotFound,
                            error = ErrorResponse(
                                errorCode = ResponseCode.RULE_NOT_FOUND,
                                message = "$iamRole does not exist."
                            )
                        )
                    }
                }
            }
        }

        for (invite: AccountInvitations.Invite in accountInvitations.invites) {
            val invitationId = ObjectId()
            val acknowledge = accountRepository.createInvitation(
                Invitation(
                    id = invitationId,
                    email = invite.email,
                    roles = invite.iamRoles,
                )
            )

            if (!acknowledge) {
                return Result.Error(
                    httpStatusCode = HttpStatusCode.InternalServerError,
                    error = ErrorResponse(
                        errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                        message = "Cannot send invitation to ${invite.email}."
                    )
                )
            }

            val invitationToken = jsonWebToken.generateInvitationToken(invitationId.toHexString())

            println("INVITATION: $invitationToken")
        }

        return Result.Success(
            httpStatusCode = HttpStatusCode.Created,
            data = hashMapOf<String, Any>(
                "code" to ResponseCode.INVITATIONS_SENT,
                "message" to "Invitations sent successfully."
            )
        )
    }
}