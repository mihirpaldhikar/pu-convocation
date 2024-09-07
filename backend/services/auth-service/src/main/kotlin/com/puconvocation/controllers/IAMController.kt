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

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.commons.dto.NewIAMRole
import com.puconvocation.commons.dto.UpdateIAMRole
import com.puconvocation.constants.CachedKeys
import com.puconvocation.database.mongodb.entities.IAMRole
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.database.mongodb.repositories.IAMRepository
import com.puconvocation.enums.PrincipalOperation
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.CacheService
import com.puconvocation.utils.Result
import io.ktor.http.*

class IAMController(
    private val accountRepository: AccountRepository,
    private val iamRepository: IAMRepository,
    private val jsonWebToken: JsonWebToken,
    private val json: ObjectMapper,
    private val cacheService: CacheService

) {
    suspend fun getRule(authorizationToken: String?, name: String): Result<IAMRole, ErrorResponse> {
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

        if (!isAllowed(
                identifier = tokenClaims[0],
                role = "read:IAMRoles"
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


        val rule = iamRepository.getRule(name) ?: return Result.Error(
            httpStatusCode = HttpStatusCode.NotFound,
            error = ErrorResponse(
                errorCode = ResponseCode.RULE_NOT_FOUND,
                message = "Rule $name not found",
            )
        )

        return Result.Success(
            rule
        )
    }

    suspend fun createRule(
        authorizationToken: String?,
        newIAMRoleRequest: NewIAMRole
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

        if (!isAllowed(
                identifier = tokenClaims[0],
                role = "write:IAMRoles"
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to create new rules."
                )
            )
        }

        if (iamRepository.getRule(newIAMRoleRequest.role) != null) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Conflict,
                error = ErrorResponse(
                    errorCode = ResponseCode.RULE_EXISTS,
                    message = "Rule ${newIAMRoleRequest.role} already exists",
                )
            )
        }

        for (account: String in newIAMRoleRequest.principals) {
            if (!accountRepository.accountExists(account)) {
                return Result.Error(
                    httpStatusCode = HttpStatusCode.NotFound,
                    error = ErrorResponse(
                        errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                        message = "Account $account not found",
                    )
                )
            }

            cacheService.remove(CachedKeys.getAllRulesAssociatedWithAccount(account))

        }

        val rule = IAMRole(
            role = newIAMRoleRequest.role,
            description = newIAMRoleRequest.description,
            principals = newIAMRoleRequest.principals
        )

        val isSuccess = iamRepository.createNewRule(rule)

        if (!isSuccess) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "Failed to create a rule",
                )
            )
        }

        return Result.Success(
            httpStatusCode = HttpStatusCode.Created,
            data = hashMapOf(
                "code" to ResponseCode.RULE_CREATED,
                "message" to "Successfully created a rule",
            )
        )
    }

    suspend fun isRuleAllowedForAccount(authorizationToken: String?, ruleName: String): Boolean {

        val tokenClaims = jsonWebToken.getClaims(
            token = authorizationToken,
            tokenType = TokenType.AUTHORIZATION_TOKEN,
            claims = listOf(JsonWebToken.UUID_CLAIM)
        )

        if (tokenClaims.isEmpty()) {
            return false
        }

        return isAllowed(
            identifier = tokenClaims[0],
            role = ruleName,
        )
    }

    suspend fun updateRule(
        authorizationToken: String?,
        ruleName: String,
        updateIAMRole: UpdateIAMRole
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

        if (!isAllowed(
                identifier = tokenClaims[0],
                role = "write:IAMRoles"
            )
        ) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Forbidden,
                error = ErrorResponse(
                    errorCode = ResponseCode.NOT_PERMITTED,
                    message = "You don't have privilege to update rules."
                )
            )
        }

        var ruleSet = iamRepository.getRule(ruleName)
            ?: return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.RULE_NOT_FOUND,
                    message = "Rule $ruleName not found",
                )
            )

        if (updateIAMRole.description != null) {
            ruleSet = ruleSet.copy(description = updateIAMRole.description)
        }

        if (updateIAMRole.principals != null) {
            for (account in updateIAMRole.principals) {
                if (!accountRepository.accountExists(account.id)) {
                    return Result.Error(
                        httpStatusCode = HttpStatusCode.NotFound,
                        error = ErrorResponse(
                            errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                            message = "Account $account not found",
                        )
                    )
                }

                cacheService.remove(CachedKeys.getAllRulesAssociatedWithAccount(account.id))

                if (account.operation == PrincipalOperation.ADD) {
                    ruleSet.principals.add(account.id)
                } else if (account.operation == PrincipalOperation.REMOVE) {
                    ruleSet.principals.remove(account.id)
                }
            }
        }

        val success = iamRepository.updateRule(ruleSet)

        if (!success) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.InternalServerError,
                error = ErrorResponse(
                    errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                    message = "Failed to update rules."
                )
            )
        }

        return Result.Success(
            hashMapOf(
                "code" to ResponseCode.OK,
                "message" to "Successfully updated rule.",
            )
        )
    }

    suspend fun getRolesAssociatedWithAccount(identifier: String): List<String> {
        val cachedRulesForAccount = cacheService.get(CachedKeys.getAllRulesAssociatedWithAccount(identifier))
        return if (cachedRulesForAccount != null) {
            json.readValue<List<String>>(cachedRulesForAccount)
        } else {
            val fetchedAllRulesAssociatedWithAccount = iamRepository.listRulesForAccount(identifier)
            cacheService.set(
                CachedKeys.getAllRulesAssociatedWithAccount(identifier),
                json.writeValueAsString(fetchedAllRulesAssociatedWithAccount)
            )
            fetchedAllRulesAssociatedWithAccount
        }
    }

    suspend fun isAllowed(identifier: String, role: String): Boolean {
        val separator = role.split(":")
        val operation = separator[0]
        val iam = separator[1]

        return if (operation == "read") {
            getRolesAssociatedWithAccount(identifier).contains("write:$iam") ||
                    getRolesAssociatedWithAccount(identifier).contains("read:$iam")
        } else {
            getRolesAssociatedWithAccount(identifier).contains("write:$iam")
        }
    }

}