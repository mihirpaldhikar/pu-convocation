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
import com.puconvocation.commons.dto.NewUACRule
import com.puconvocation.commons.dto.UpdateUACRuleRequest
import com.puconvocation.constants.CachedKeys
import com.puconvocation.database.mongodb.entities.UACRule
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.database.mongodb.repositories.UACRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.enums.TokenType
import com.puconvocation.enums.UACAccountOperation
import com.puconvocation.security.jwt.JsonWebToken
import com.puconvocation.services.CacheService
import com.puconvocation.utils.Result
import io.ktor.http.*

class UACController(
    private val accountRepository: AccountRepository,
    private val uacRepository: UACRepository,
    private val jsonWebToken: JsonWebToken,
    private val json: ObjectMapper,
    private val cacheService: CacheService

) {
    suspend fun getRule(authorizationToken: String?, name: String): Result<UACRule, ErrorResponse> {
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
                ruleName = "createNewRules"
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


        val rule = uacRepository.getRule(name) ?: return Result.Error(
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
        newUACRuleRequest: NewUACRule
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
                ruleName = "createNewRules"
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

        if (uacRepository.getRule(newUACRuleRequest.rule) != null) {
            return Result.Error(
                httpStatusCode = HttpStatusCode.Conflict,
                error = ErrorResponse(
                    errorCode = ResponseCode.RULE_EXISTS,
                    message = "Rule ${newUACRuleRequest.rule} already exists",
                )
            )
        }

        for (account: String in newUACRuleRequest.accounts) {
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

        val rule = UACRule(
            rule = newUACRuleRequest.rule,
            description = newUACRuleRequest.description,
            enabled = true,
            accounts = newUACRuleRequest.accounts
        )

        val isSuccess = uacRepository.createNewRule(rule)

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
            ruleName = ruleName,
        )
    }

    suspend fun updateRule(
        authorizationToken: String?,
        ruleName: String,
        updateUACRuleRequest: UpdateUACRuleRequest
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
                ruleName = "updateRules"
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

        var ruleSet = uacRepository.getRule(ruleName)
            ?: return Result.Error(
                httpStatusCode = HttpStatusCode.NotFound,
                error = ErrorResponse(
                    errorCode = ResponseCode.RULE_NOT_FOUND,
                    message = "Rule $ruleName not found",
                )
            )

        if (updateUACRuleRequest.description != null) {
            ruleSet = ruleSet.copy(description = updateUACRuleRequest.description)
        }

        if (updateUACRuleRequest.enabled != null) {
            ruleSet = ruleSet.copy(enabled = updateUACRuleRequest.enabled)
        }

        if (updateUACRuleRequest.accounts != null) {
            for (account in updateUACRuleRequest.accounts) {
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

                if (account.operation == UACAccountOperation.ADD) {
                    ruleSet.accounts.add(account.id)
                } else if (account.operation == UACAccountOperation.REMOVE) {
                    ruleSet.accounts.remove(account.id)
                }
            }
        }

        val success = uacRepository.updateRule(ruleSet)

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

    suspend fun getRulesAssociatedWithAccount(identifier: String): List<String> {
        val cachedRulesForAccount = cacheService.get(CachedKeys.getAllRulesAssociatedWithAccount(identifier))
        return if (cachedRulesForAccount != null) {
            json.readValue<List<String>>(cachedRulesForAccount)
        } else {
            val fetchedAllRulesAssociatedWithAccount = uacRepository.listRulesForAccount(identifier)
            cacheService.set(
                CachedKeys.getAllRulesAssociatedWithAccount(identifier),
                json.writeValueAsString(fetchedAllRulesAssociatedWithAccount)
            )
            fetchedAllRulesAssociatedWithAccount
        }
    }

    suspend fun isAllowed(identifier: String, ruleName: String): Boolean {
        return getRulesAssociatedWithAccount(identifier).contains(ruleName)
    }

}