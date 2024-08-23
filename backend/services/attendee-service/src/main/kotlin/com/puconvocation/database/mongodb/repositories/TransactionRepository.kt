package com.puconvocation.database.mongodb.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.datasource.TransactionDatasource
import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.database.mongodb.entities.Transaction
import kotlinx.coroutines.flow.firstOrNull

class TransactionRepository(
    database: MongoDatabase
) : TransactionDatasource {

    private val transactionCollection: MongoCollection<Attendee> =
        database.getCollection<Attendee>("transactions")

    override suspend fun insertTransaction(transaction: Transaction): Boolean {
        return transactionCollection.withDocumentClass<Transaction>().insertOne(transaction).wasAcknowledged();
    }

    override suspend fun getTransaction(transactionId: String): Transaction? {
        return transactionCollection.withDocumentClass<Transaction>().find(
            eq(
                "_id", transactionId
            )
        ).firstOrNull()
    }

    override suspend fun transactionExists(enrollmentNumber: String): Boolean {
        return transactionCollection.withDocumentClass<Transaction>().find(
            eq(
                Transaction::studentEnrollmentNumber.name, enrollmentNumber
            )
        ).firstOrNull() != null
    }

}