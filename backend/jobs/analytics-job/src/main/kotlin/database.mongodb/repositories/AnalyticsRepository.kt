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

import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.datasources.AnalyticsDatasource
import com.puconvocation.database.mongodb.entities.AnalyticsLog

class AnalyticsRepository(
    database: MongoDatabase,
) : AnalyticsDatasource {

    private val analyticsCollection: MongoCollection<AnalyticsLog> =
        database.getCollection<AnalyticsLog>("analytics")

    override suspend fun addLog(analyticsLog: AnalyticsLog): Boolean {
        return analyticsCollection.withDocumentClass<AnalyticsLog>().insertOne(analyticsLog).wasAcknowledged()
    }
}