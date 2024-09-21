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
import com.mongodb.client.model.Accumulators.sum
import com.mongodb.client.model.Aggregates.*
import com.mongodb.client.model.Filters.*
import com.mongodb.client.model.Indexes.descending
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.commons.dto.WeeklyTraffic
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.datasource.AnalyticsDatasource
import com.puconvocation.utils.sortTrafficByWeekdaysAndFillMissing
import kotlinx.coroutines.flow.toList
import org.bson.Document
import org.bson.conversions.Bson
import java.time.Duration
import java.time.LocalDateTime

class AnalyticsRepository(
    database: MongoDatabase,
    private val cache: CacheController,
    private val mapper: ObjectMapper
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

    override suspend fun weeklyTrafficAnalytics(
        timestamp: LocalDateTime,
    ): WeeklyTraffic {

        val cachedValue = cache.get(CachedKeys.weeklyTrafficAnalyticsKey())

        if (cachedValue != null) {
            return mapper.readValue<WeeklyTraffic>(cachedValue)
        }

        val currentWeekStart = timestamp

        val previousWeekStart = currentWeekStart.minusDays(7)

        val currentWeekAggregationPipeline = weeklyTrafficAggregationPipeline(currentWeekStart)

        val previousWeekAggregationPipeline = weeklyTrafficAggregationPipeline(previousWeekStart)


        val currentWeekAggregatedData = analytics.withDocumentClass<Document>().aggregate(
            currentWeekAggregationPipeline
        ).toList()

        val previousWeekAggregatedData = analytics.withDocumentClass<Document>().aggregate(
            previousWeekAggregationPipeline
        ).toList()

        val traffic = mutableListOf<WeeklyTraffic.Traffic>()

        var currentWeekTotalRequests = 0L
        var previousWeekTotalRequests = 0L

        for (i in currentWeekAggregatedData.indices) {
            currentWeekTotalRequests += currentWeekAggregatedData[i]["requests"].toString().toLong()

            traffic.add(
                WeeklyTraffic.Traffic(
                    day = weekdays["${currentWeekAggregatedData[i].get("_id")}".toInt() - 1 % 7],
                    requests = currentWeekAggregatedData[i]["requests"].toString().toLong()
                )

            )
        }

        for (i in previousWeekAggregatedData.indices) {
            previousWeekTotalRequests += previousWeekAggregatedData[i]["requests"].toString().toLong()
        }

        val computedTraffic = WeeklyTraffic(
            traffic = traffic,
            surge = ((currentWeekTotalRequests - previousWeekTotalRequests) / (previousWeekTotalRequests) * 100).toFloat(),
        ).sortTrafficByWeekdaysAndFillMissing()

        cache.set(
            CachedKeys.weeklyTrafficAnalyticsKey(), mapper.writeValueAsString(computedTraffic),
            expiryDuration = Duration.ofMinutes(10)
        )

        return computedTraffic
    }

    private fun weeklyTrafficAggregationPipeline(startDate: LocalDateTime): List<Bson> {
        return listOf(
            match(and(gte("timestamp", startDate), lt("timestamp", startDate.plusDays(7)))),
            group(
                Document("\$dayOfWeek", Document("date", Document("\$toDate", "\$timestamp"))),
                sum("requests", 1L)
            ),
            sort(descending("timestamp"))
        )
    }
}