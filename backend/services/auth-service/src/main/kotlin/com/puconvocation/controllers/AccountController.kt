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

package com.puconvocation.controllers

import com.puconvocation.commons.dto.*
import com.puconvocation.constants.CachedKeys
import com.puconvocation.constants.IAMPolicies
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.entities.Invitation
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.database.mongodb.repositories.IAMPolicyRepository
import com.puconvocation.enums.PrincipalOperation
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.dao.SecurityToken
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.MessageQueue
import com.puconvocation.utils.Result
import io.ktor.http.*
import org.bson.types.ObjectId

class AccountController(
    private val accountRepository: AccountRepository,
    private val iamRepository: IAMPolicyRepository,
    private val jsonWebToken: JsonWebToken,
    private val passkeyController: PasskeyController,
    private val iamPolicyController: IAMPolicyController,
    private val cache: CacheController,
    private val messageQueue: MessageQueue
) {
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

        if (account.fidoCredential.isEmpty()) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.BadRequest,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "No FIDO credentials are associated with this account."
                )
            )
        }

        val result = passkeyController.startPasskeyChallenge(credentials.identifier)
        return result
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

        val existingAccount = accountRepository.getAccount(invitation.email)
        if (existingAccount != null && existingAccount.fidoCredential.isEmpty()) {
            val result = passkeyController.startPasskeyRegistration(existingAccount.username)
            return result
        }

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
        val newAccount = Account(
            uuid = uuid,
            email = invitation.email,
            username = newAccountFromInvitation.username,
            avatarURL = "https://assets.puconvocation.com/avatars/default.png",
            displayName = newAccountFromInvitation.displayName,
            designation = newAccountFromInvitation.designation,
            suspended = false,
            fidoCredential = mutableSetOf()
        )
        val response = accountRepository.createAccount(newAccount)
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
            var rule = iamRepository.getPolicy(iamRoles)

            if (rule != null) {
                val principals = rule.principals
                principals.add(uuid.toHexString())
                rule = rule.copy(
                    principals = principals
                )
                iamRepository.updatePolicy(rule)
            }
        }
        val result = passkeyController.startPasskeyRegistration(newAccount.username)
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
    ): Result<AccountWithIAMPolicies, ErrorResponse> {
        if (!iamPolicyController.isAuthorized(
                policy = IAMPolicies.READ_ACCOUNTS,
                principal = authorizationToken,
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

    suspend fun getAllAccounts(authorizationToken: String?): Result<List<AccountWithIAMPolicies>, ErrorResponse> {
        if (!iamPolicyController.isAuthorized(
                policy = IAMPolicies.READ_ACCOUNTS,
                principal = authorizationToken,
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

        return Result.Success(
            accountRepository.getAllAccounts()
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


        if (!iamPolicyController.isAuthorized(
                policy = IAMPolicies.WRITE_ACCOUNTS,
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

        val sender = accountRepository.getAccount(tokenClaims[0].replace("\"", ""))!!

        val allIAMRules = iamRepository.allPolicies()

        val allIAMRoleNames = allIAMRules.map { it.policy }

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

                for (iamRole: String in invite.assignedIAMPolicies) {
                    if (!allIAMRoleNames.contains(iamRole)) {
                        return Result.Error(
                            httpStatusCode = HttpStatusCode.NotFound,
                            error = ErrorResponse(
                                errorCode = ResponseCode.IAM_POLICY_NOT_FOUND,
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
                    roles = invite.assignedIAMPolicies,
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
            messageQueue.sendMessage(
                message = "{\"type\":\"invitation\",\"sender\":\"PU Convocation System <noreply@puconvocation.com>\",\"recipient\":\"${invite.email}\",\"replyTo\":\"${sender.email}\",\"payload\":{\"senderName\":\"${if (sender.designation.isEmpty()) sender.displayName else sender.designation + " " + sender.displayName}\",\"invitationToken\":\"${invitationToken}\"}}",
                groupId = "emails",
            )
        }

        return Result.Success(
            httpStatusCode = HttpStatusCode.Created,
            data = hashMapOf<String, Any>(
                "code" to ResponseCode.INVITATIONS_SENT,
                "message" to "Invitations sent successfully."
            )
        )
    }

    suspend fun updateAssignedIAMPoliciesForAccount(
        authorizationToken: String?,
        updateAccountIAMPoliciesRequest: UpdateAccountIAMPoliciesRequest
    ): Result<HashMap<String, Any>, ErrorResponse> {
        if (!iamPolicyController.isAuthorized(
                policy = IAMPolicies.WRITE_ACCOUNTS,
                principal = authorizationToken,
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to update IAM Policies."
                )
            )
        }

        for (iam in updateAccountIAMPoliciesRequest.iamPolicyOperations) {
            val iamPolicy = iamRepository.getPolicy(iam.policy)
            if (iamPolicy == null) continue;
            if (iam.policy === IAMPolicies.WRITE_IAM_POLICIES || iam.operation === PrincipalOperation.NO_CHANGE) {
                continue
            } else if (iamPolicy.principals.contains(updateAccountIAMPoliciesRequest.uuid) && iam.operation === PrincipalOperation.REMOVE) {
                iamPolicy.principals.remove(updateAccountIAMPoliciesRequest.uuid)
            } else if (!iamPolicy.principals.contains(updateAccountIAMPoliciesRequest.uuid) && iam.operation === PrincipalOperation.ADD) {
                iamPolicy.principals.add(updateAccountIAMPoliciesRequest.uuid)
            }

            iamRepository.updatePolicy(iamPolicy)
        }

        cache.invalidate(CachedKeys.accountKey(updateAccountIAMPoliciesRequest.uuid))
        cache.invalidate(CachedKeys.accountWithIAMRolesKey(updateAccountIAMPoliciesRequest.uuid))

        return Result.Success(
            hashMapOf(
                "code" to ResponseCode.OK,
                "message" to "Account IAM Policies updated successfully."
            )
        )

    }

    suspend fun updateAccount(
        authorizationToken: String?,
        updateRequest: AccountUpdateRequest
    ): Result<HashMap<String, Any>, ErrorResponse> {
        val tokenClaims = jsonWebToken.getClaims(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (updateRequest.uuid !== null && updateRequest.uuid !== tokenClaims[0] && !iamPolicyController.isAuthorized(
                policy = IAMPolicies.WRITE_ACCOUNTS,
                principal = tokenClaims[0],
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to other accounts."
                )
            )
        }

        var account = accountRepository.getAccount(updateRequest.uuid ?: tokenClaims[0])

        if (account == null) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                    message = "Account not found."
                )
            )
        }

        account = account.copy(
            designation = updateRequest.designation ?: account.designation,
            username = updateRequest.username ?: account.username,
            displayName = updateRequest.displayName ?: account.displayName,
            suspended = updateRequest.suspended ?: account.suspended,
            avatarURL = updateRequest.avatarURL ?: account.avatarURL,
        )

        val acknowledge = accountRepository.updateAccount(account)

        if (!acknowledge) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "Account not updated."
                )
            )
        }

        return Result.Success(
            hashMapOf(
                "code" to ResponseCode.OK,
                "message" to "Account updated successfully."
            )
        )
    }
}