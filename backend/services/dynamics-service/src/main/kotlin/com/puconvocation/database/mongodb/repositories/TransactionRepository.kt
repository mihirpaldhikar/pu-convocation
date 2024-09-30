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

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.mongodb.client.model.Filters.eq
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.datasources.TransactionDatasource
import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.database.mongodb.entities.Transaction
import kotlinx.coroutines.flow.firstOrNull

class TransactionRepository(
    database: MongoDatabase,
    private val mapper: ObjectMapper,
    private val cache: CacheController
) : TransactionDatasource {

    private val transactionCollection: MongoCollection<Attendee> =
        database.getCollection<Attendee>("transactions")

    override suspend fun insertTransaction(transaction: Transaction): Boolean {
        return transactionCollection.withDocumentClass<Transaction>().insertOne(transaction).wasAcknowledged();
    }

    override suspend fun getTransaction(transactionId: String): Transaction? {
        val cachedTransaction = cache.get(CachedKeys.transactionKey(transactionId))
        if (cachedTransaction != null) {
            return mapper.readValue<Transaction>(cachedTransaction)
        }
        val fetchedTransaction = transactionCollection.withDocumentClass<Transaction>().find(
            eq(
                "_id", transactionId
            )
        ).firstOrNull()

        if (fetchedTransaction != null) {
            cache.set(CachedKeys.transactionKey(transactionId), mapper.writeValueAsString(fetchedTransaction))
        }

        return fetchedTransaction
    }

    override suspend fun transactionExists(enrollmentNumber: String): Boolean {
        return transactionCollection.withDocumentClass<Transaction>().find(
            eq(
                Transaction::studentEnrollmentNumber.name, enrollmentNumber
            )
        ).firstOrNull() != null
    }

}