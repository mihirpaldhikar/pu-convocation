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

package com.puconvocation.database.mongodb

import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoDatabase

class MongoDBConnector(
    private val connectionURL: String,
    private val database: String,
) {
    fun connectToDatabase(): MongoDatabase {
        val mongoClient: MongoClient = MongoClient.create(connectionURL)
        return mongoClient.getDatabase(database)
    }
}