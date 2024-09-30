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

package com.puconvocation.database.mongodb.repositories

import com.mongodb.client.model.Aggregates
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.datasources.IAMDatasource
import com.puconvocation.database.mongodb.entities.IAMRole
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList

class IAMRepository(
    database: MongoDatabase,
) : IAMDatasource {

    private val iamRoleCollection: MongoCollection<IAMRole> =
        database.getCollection<IAMRole>("iam")

    override suspend fun createNewRule(rule: IAMRole): Boolean {
        return iamRoleCollection.withDocumentClass<IAMRole>().insertOne(rule).wasAcknowledged()
    }

    override suspend fun getRule(name: String): IAMRole? {
        return iamRoleCollection.withDocumentClass<IAMRole>().find<IAMRole>(eq("_id", name)).firstOrNull()
    }

    override suspend fun getAllRules(): List<IAMRole> {
        return iamRoleCollection.withDocumentClass<IAMRole>().find<IAMRole>().toList()

    }

    override suspend fun getAccountsForRule(rule: String): List<String> {
        val ruleSet = iamRoleCollection.withDocumentClass<IAMRole>().find<IAMRole>(
            eq("_id", rule)
        ).firstOrNull()

        if (ruleSet == null) {
            return emptyList()
        }

        return ruleSet.principals.toList()
    }

    override suspend fun listRulesForAccount(accountId: String): List<String> {
        val matchedRules = iamRoleCollection.withDocumentClass<IAMRole>()
            .aggregate(listOf(Aggregates.match(eq(IAMRole::principals.name, accountId))))
        val rules = mutableListOf<String>()

        for (rule in matchedRules.toList()) {
            rules.add(rule.role)
        }

        return rules
    }

    override suspend fun isRuleAllowedForAccount(ruleName: String, accountId: String): Boolean {
        val rule = iamRoleCollection.withDocumentClass<IAMRole>().find<IAMRole>(
            eq("_id", ruleName)
        ).firstOrNull()

        if (rule == null) {
            return false
        }

        return rule.principals.contains(accountId)
    }

    override suspend fun updateRule(rule: IAMRole): Boolean {
        return iamRoleCollection.withDocumentClass<IAMRole>().updateOne(
            eq("_id", rule.role),
            Updates.combine(
                Updates.set(IAMRole::description.name, rule.description),
                Updates.set(IAMRole::principals.name, rule.principals),
            )
        ).wasAcknowledged()
    }

}