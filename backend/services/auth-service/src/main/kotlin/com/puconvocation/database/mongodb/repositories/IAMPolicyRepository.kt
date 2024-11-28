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
import com.puconvocation.constants.IAMPolicies
import com.puconvocation.database.mongodb.datasources.IAMPolicyDatasource
import com.puconvocation.database.mongodb.entities.IAMPolicy
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList

class IAMPolicyRepository(
    database: MongoDatabase,
) : IAMPolicyDatasource {

    private val iamCollection: MongoCollection<IAMPolicy> =
        database.getCollection<IAMPolicy>("iam")

    override suspend fun createNewPolicy(policy: IAMPolicy): Boolean {
        return iamCollection.withDocumentClass<IAMPolicy>().insertOne(policy).wasAcknowledged()
    }

    override suspend fun getPolicy(policyName: String): IAMPolicy? {
        return iamCollection.withDocumentClass<IAMPolicy>().find<IAMPolicy>(eq("_id", policyName)).firstOrNull()
    }

    override suspend fun allPolicies(): List<IAMPolicy> {
        val policies = iamCollection.withDocumentClass<IAMPolicy>().find<IAMPolicy>().toList()
        return policies.toList().filter { it.policy != IAMPolicies.WRITE_IAM_POLICIES }.toList()
    }

    override suspend fun getAccountsForPolicy(policyName: String): List<String> {
        val ruleSet = iamCollection.withDocumentClass<IAMPolicy>().find<IAMPolicy>(
            eq("_id", policyName)
        ).firstOrNull()

        if (ruleSet == null) {
            return emptyList()
        }

        return ruleSet.principals.toList()
    }

    override suspend fun listPoliciesForAccount(uuid: String): List<String> {
        val matchedRules = iamCollection.withDocumentClass<IAMPolicy>()
            .aggregate(listOf(Aggregates.match(eq(IAMPolicy::principals.name, uuid))))
        val rules = mutableListOf<String>()

        for (rule in matchedRules.toList()) {
            rules.add(rule.policy)
        }

        return rules
    }

    override suspend fun isAuthorized(policyName: String, uuid: String): Boolean {
        val rule = iamCollection.withDocumentClass<IAMPolicy>().find<IAMPolicy>(
            eq("_id", policyName)
        ).firstOrNull()

        if (rule == null) {
            return false
        }

        return rule.principals.contains(uuid)
    }

    override suspend fun updatePolicy(policy: IAMPolicy): Boolean {
        return iamCollection.withDocumentClass<IAMPolicy>().updateOne(
            eq("_id", policy.policy),
            Updates.combine(
                Updates.set(IAMPolicy::description.name, policy.description),
                Updates.set(IAMPolicy::principals.name, policy.principals),
            )
        ).wasAcknowledged()
    }

}