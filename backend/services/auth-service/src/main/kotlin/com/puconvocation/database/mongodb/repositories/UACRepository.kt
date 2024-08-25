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

package com.puconvocation.database.mongodb.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.datasources.UACDatasource
import com.puconvocation.database.mongodb.entities.UACRule
import kotlinx.coroutines.flow.firstOrNull

class UACRepository(
    database: MongoDatabase,
) : UACDatasource {

    private val uacRulesCollection: MongoCollection<UACRule> =
        database.getCollection<UACRule>("uac_rules")

    override suspend fun createNewRule(rule: UACRule): Boolean {
        return uacRulesCollection.withDocumentClass<UACRule>().insertOne(rule).wasAcknowledged()
    }

    override suspend fun getRule(name: String): UACRule? {
        return uacRulesCollection.withDocumentClass<UACRule>().find<UACRule>(eq("_id", name)).firstOrNull()
    }

    override suspend fun getAccountsForRule(rule: String): List<String> {
        val ruleSet = uacRulesCollection.withDocumentClass<UACRule>().find<UACRule>(
            eq("_id", rule)
        ).firstOrNull()

        if (ruleSet == null) {
            return emptyList()
        }

        return ruleSet.accounts.toList()
    }
}