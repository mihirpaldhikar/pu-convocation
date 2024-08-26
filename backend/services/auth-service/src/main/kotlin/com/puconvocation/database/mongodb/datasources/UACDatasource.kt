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

package com.puconvocation.database.mongodb.datasources

import com.puconvocation.database.mongodb.entities.UACRule

interface UACDatasource {
    suspend fun createNewRule(rule: UACRule): Boolean

    suspend fun getRule(name: String): UACRule?

    suspend fun getAccountsForRule(rule: String): List<String>

    suspend fun listRulesForAccount(accountId: String): List<String>

    suspend fun isRuleAllowedForAccount(ruleName: String, accountId: String): Boolean

    suspend fun updateRule(rule: UACRule): Boolean

}