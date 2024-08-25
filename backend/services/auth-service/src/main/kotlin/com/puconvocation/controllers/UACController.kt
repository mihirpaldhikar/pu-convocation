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

import com.puconvocation.commons.dto.NewUACRule
import com.puconvocation.database.mongodb.entities.UACRule
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.database.mongodb.repositories.UACRepository
import com.puconvocation.enums.ResponseCode
import com.puconvocation.utils.Result
import io.ktor.http.*

class UACController(
    private val accountRepository: AccountRepository,
    private val uacRepository: UACRepository
) {
    suspend fun getRule(name: String): Result {
        val rule = uacRepository.getRule(name) ?: return Result.Error(
            statusCode = HttpStatusCode.NotFound,
            errorCode = ResponseCode.RULE_NOT_FOUND,
            message = "Rule $name not found",
        )

        return Result.Success(
            statusCode = HttpStatusCode.OK,
            code = ResponseCode.OK,
            data = rule
        )
    }

    suspend fun createRule(newUACRuleRequest: NewUACRule): Result {
        if (uacRepository.getRule(newUACRuleRequest.rule) != null) {
            return Result.Error(
                statusCode = HttpStatusCode.Conflict,
                errorCode = ResponseCode.RULE_EXISTS,
                message = "Rule ${newUACRuleRequest.rule} already exists",
            )
        }

        for (account: String in newUACRuleRequest.accounts) {
            if (!accountRepository.accountExists(account)) {
                return Result.Error(
                    statusCode = HttpStatusCode.NotFound,
                    errorCode = ResponseCode.ACCOUNT_NOT_FOUND,
                    message = "Account $account not found",
                )
            }
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
                statusCode = HttpStatusCode.InternalServerError,
                errorCode = ResponseCode.REQUEST_NOT_COMPLETED,
                message = "Failed to create a rule",
            )
        }

        return Result.Success(
            statusCode = HttpStatusCode.Created,
            code = ResponseCode.RULE_CREATED,
            data = mapOf(
                "code" to ResponseCode.RULE_CREATED,
                "message" to "Successfully created a rule",
            )
        )
    }
}