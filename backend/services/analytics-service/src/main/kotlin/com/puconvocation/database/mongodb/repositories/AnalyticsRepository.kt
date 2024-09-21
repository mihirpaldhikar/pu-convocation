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

import com.mongodb.client.model.Accumulators.sum
import com.mongodb.client.model.Aggregates.*
import com.mongodb.client.model.Filters.*
import com.mongodb.client.model.Indexes.descending
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.datasource.AnalyticsDatasource
import kotlinx.coroutines.flow.toList
import org.bson.Document
import java.time.LocalDateTime

class AnalyticsRepository(
    database: MongoDatabase
) : AnalyticsDatasource {

    private val analytics: MongoCollection<Document> =
        database.getCollection<Document>("analytics")

    private val weekdays: List<String> = listOf(
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    )

    override suspend fun generateRequestsTimeline(
        timestamp: LocalDateTime,
        days: Long
    ): List<HashMap<String, String>> {

        val startDate = timestamp
        val endDate = timestamp.plusDays(days)

        val pipeline = listOf(
            match(and(gte("timestamp", startDate), lt("timestamp", endDate))),
            group(
                Document("\$dayOfWeek", Document("date", Document("\$toDate", "\$timestamp"))),
                sum("requests", 1L)
            ),
            sort(descending("timestamp"))
        )


        val aggregatedData = analytics.withDocumentClass<Document>().aggregate(
            pipeline
        ).toList()

        val timeLine = mutableListOf<HashMap<String, String>>()

        for (data in aggregatedData) {
            timeLine.add(
                hashMapOf(
                    "day" to weekdays["${data.get("_id")}".toInt() - 1 % 7],
                    "requests" to "${data["requests"]}"
                )
            )
        }

        return timeLine
    }
}