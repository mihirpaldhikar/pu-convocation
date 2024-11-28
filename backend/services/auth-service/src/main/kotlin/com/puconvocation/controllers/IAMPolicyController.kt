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

import com.puconvocation.Environment
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.commons.dto.NewIAMPolicy
import com.puconvocation.constants.CachedKeys
import com.puconvocation.constants.IAMPolicies
import com.puconvocation.database.mongodb.entities.IAMPolicy
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.database.mongodb.repositories.IAMPolicyRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.utils.Result
import io.ktor.http.*
import org.bson.types.ObjectId

class IAMPolicyController(
    private val accountRepository: AccountRepository,
    private val iamRepository: IAMPolicyRepository,
    private val jsonWebToken: JsonWebToken,
    private val cacheController: CacheController,
    private val companionServices: Set<Environment.Service.CompanionService>

) {
    suspend fun getPolicy(authorizationToken: String?, name: String): Result<IAMPolicy, ErrorResponse> {
        if (!isAuthorized(
                policy = IAMPolicies.READ_IAM_POLICIES,
                principal = authorizationToken,
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view rules."
                )
            )
        }


        val rule = iamRepository.getPolicy(name) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.IAM_POLICY_NOT_FOUND,
                message = "Rule $name not found",
            )
        )

        return Result.Success(
            rule
        )
    }

    suspend fun allPolicies(authorizationToken: String?): Result<List<IAMPolicy>, ErrorResponse> {
        if (!isAuthorized(
                policy = IAMPolicies.READ_IAM_POLICIES,
                principal = authorizationToken,
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to view rules."
                )
            )
        }

        return Result.Success(
            data = iamRepository.allPolicies()
        )
    }

    suspend fun createRule(
        authorizationToken: String?,
        newIAMPolicyRequest: NewIAMPolicy
    ): Result<HashMap<String, Any>, ErrorResponse> {
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

        if (!isAuthorized(
                policy = IAMPolicies.WRITE_IAM_POLICIES,
                principal = tokenClaims[0],
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to create new policy."
                )
            )
        }

        if (iamRepository.getPolicy(newIAMPolicyRequest.policy) != null) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Conflict,
                error = ErrorResponse(
                    errorCode = ResponseCode.IAM_POLICY_EXISTS,
                    message = "Policy ${newIAMPolicyRequest.policy} already exists",
                )
            )
        }

        for (account: String in newIAMPolicyRequest.principals) {
            if (!accountRepository.accountExists(account)) {
                return Result.Error(
                    httpStatusCode = HttpStatusCode.NotFound,
                    error = ErrorResponse(
                        errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                        message = "Account $account not found",
                    )
                )
            }

            cacheController.invalidate(CachedKeys.accountKey(account))
            cacheController.invalidate(CachedKeys.accountWithIAMRolesKey(account))

        }

        val policy = IAMPolicy(
            policy = newIAMPolicyRequest.policy,
            description = newIAMPolicyRequest.description,
            principals = newIAMPolicyRequest.principals
        )

        val isSuccess = iamRepository.createNewPolicy(policy)

        if (!isSuccess) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "Failed to create IAM Policy.",
                )
            )
        }

        return Result.Success(
            httpStatusCode = HttpStatusCode.Created,
            data = hashMapOf(
                "code" to ResponseCode.IAM_POLICY_CREATED,
                "message" to "Successfully created IAM Policy.",
            )
        )
    }

    suspend fun isAuthorized(policy: String, principal: String?): Boolean {

        if (principal == null) return false

        val actualPrincipal = if (ObjectId.isValid(principal)) {
            principal
        } else {
            val jwtClaims = jsonWebToken.getClaims(
                token = principal,
                tokenType = TokenType.AUTHORIZATION_TOKEN,
                claims = listOf(JsonWebToken.UUID_CLAIM)
            )

            if (jwtClaims.isEmpty()) return false

            jwtClaims[0]
        }

        val separator = policy.split(":")
        val operation = separator[0]
        val entity = separator[1]

        val account = accountRepository.getAccountWithIAMRoles(actualPrincipal) ?: return false

        return if (operation == "read") {
            account.assignedIAMPolicies.contains("write:$entity") ||
                    account.assignedIAMPolicies.contains("read:$entity")
        } else {
            account.assignedIAMPolicies.contains("write:$entity")
        }
    }

    suspend fun serviceAuthorizationCheck(serviceAuthorizationToken: String?, policyWithPrincipal: String): Boolean {
        val tokenClaims = jsonWebToken.getClaims(
            token = serviceAuthorizationToken,
            tokenType = TokenType.SERVICE_AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.SERVICE_NAME)
        )

        if (tokenClaims.isEmpty()) return false

        if (companionServices.none { it.address.split("@")[0] == tokenClaims[0] }) return false

        val split = policyWithPrincipal.split("@")
        val policy = split[0]
        val principal = split[1]

        return isAuthorized(policy, principal)
    }
}