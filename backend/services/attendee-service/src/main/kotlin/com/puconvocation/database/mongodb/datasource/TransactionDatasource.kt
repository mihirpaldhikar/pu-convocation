package com.puconvocation.database.mongodb.datasource

import com.puconvocation.database.mongodb.entities.Transaction

interface TransactionDatasource {
    suspend fun insertTransaction(transaction: Transaction): Boolean

    suspend fun getTransaction(transactionId: String): Transaction?

    suspend fun transactionExists(enrollmentNumber:String): Boolean
}