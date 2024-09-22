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
import com.puconvocation.commons.dto.Popular
import com.puconvocation.commons.dto.WeeklyTraffic
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.datasource.AnalyticsDatasource
import com.puconvocation.utils.sortByWeekdays
import kotlinx.coroutines.flow.toList
import org.bson.Document
import org.bson.conversions.Bson
import java.time.Duration
import java.time.LocalDate
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

    override suspend fun trafficOnDate(date: LocalDate): List<Popular> {

        val cachedTraffic = cache.get(CachedKeys.trafficOnDateKey(date.toString()))

        if (cachedTraffic != null) {
            return mapper.readValue<List<Popular>>(cachedTraffic)
        }

        val specificDate = date
        val totalEntriesBy2HourInterval = analytics.aggregate(
            listOf(
                match(
                    and(
                        gte("timestamp", specificDate),
                        lt("timestamp", specificDate.plusDays(1))

                    )
                ),
                project(
                    Document(
                        "hourInterval",
                        Document(
                            "\$subtract", listOf(
                                Document("\$hour", "\$timestamp"),
                                Document("\$mod", listOf(Document("\$hour", "\$timestamp"), 2))
                            )
                        )
                    ),
                ),
                group("\$hourInterval", sum("count", 1)),
            )
        ).toList()

        var computedTraffic = mutableListOf<Popular>()

        totalEntriesBy2HourInterval.forEach {
            computedTraffic.add(
                Popular(
                    key = it["_id"].toString(),
                    count = it["count"].toString().toLong()
                )
            )
        }

        computedTraffic =
            fillMissing(computedTraffic, listOf("0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22"))

        computedTraffic.sortWith(compareBy {
            it.key.toLongOrNull() ?: Long.MAX_VALUE
        })

        cache.set(
            CachedKeys.trafficOnDateKey(date.toString()), mapper.writeValueAsString(computedTraffic),
            expiryDuration = Duration.ofMinutes(10)
        )

        return computedTraffic
    }

    override suspend fun weeklyTraffic(
        timestamp: LocalDateTime,
    ): WeeklyTraffic {
        popularLangs()
        val cachedWeeklyTraffic = cache.get(CachedKeys.weeklyTrafficKey())

        if (cachedWeeklyTraffic != null) {
            return mapper.readValue<WeeklyTraffic>(cachedWeeklyTraffic)
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

        val currentTraffic = mutableListOf<WeeklyTraffic.Traffic>()
        val previousTraffic = mutableListOf<WeeklyTraffic.Traffic>()

        var currentWeekTotalRequests = 0L
        var previousWeekTotalRequests = 0L

        currentWeekAggregatedData.forEach {
            currentWeekTotalRequests += it["requests"].toString().toLong()

            currentTraffic.add(
                WeeklyTraffic.Traffic(
                    day = weekdays["${it.get("_id")}".toInt() - 1 % 7],
                    requests = it["requests"].toString().toLong()
                )

            )
        }

        previousWeekAggregatedData.forEach {
            previousWeekTotalRequests += it["requests"].toString().toLong()
            previousTraffic.add(
                WeeklyTraffic.Traffic(
                    day = weekdays["${it.get("_id")}".toInt() - 1 % 7],
                    requests = it["requests"].toString().toLong()
                )

            )
        }

        val computedTraffic = WeeklyTraffic(
            currentWeek = currentTraffic.sortByWeekdays(),
            previousWeek = previousTraffic.sortByWeekdays(),
            surge = ((currentWeekTotalRequests - previousWeekTotalRequests) / (previousWeekTotalRequests) * 100).toFloat(),
        )

        cache.set(
            CachedKeys.weeklyTrafficKey(), mapper.writeValueAsString(computedTraffic),
            expiryDuration = Duration.ofMinutes(10)
        )

        return computedTraffic
    }

    override suspend fun popularLangs(): List<Popular> {
        val cachedPopularLangs = cache.get(CachedKeys.popularLangsKey())

        if (cachedPopularLangs != null) {
            return mapper.readValue<List<Popular>>(cachedPopularLangs)
        }

        val aggregationPipeline = listOf(
            group(
                "\$lang",
                sum("count", 1)
            ),
            sort(descending("count"))
        )
        val popularLanguages = analytics.aggregate(
            aggregationPipeline
        ).toList()

        var langs = mutableListOf<Popular>()

        popularLanguages.forEach { document ->
            langs.add(
                Popular(
                    key = document["_id"].toString(),
                    count = document["count"].toString().toLong()
                )
            )
        }

        langs = fillMissing(langs, listOf("en", "hi", "gu", "mr"))

        cache.set(
            CachedKeys.popularLangsKey(), mapper.writeValueAsString(langs),
            expiryDuration = Duration.ofMinutes(10)
        )

        return langs
    }

    override suspend fun popularCountries(): List<Popular> {
        val cachedPopularCountries = cache.get(CachedKeys.popularCountriesKey())

        if (cachedPopularCountries != null) {
            return mapper.readValue<List<Popular>>(cachedPopularCountries)
        }

        val aggregationPipeline = listOf(
            group(
                "\$region.countryCode",
                sum("count", 1)
            ),
            sort(descending("count")),
            limit(5)
        )
        val popularCountries = analytics.aggregate(
            aggregationPipeline
        ).toList()

        var countries = mutableListOf<Popular>()

        popularCountries.forEach { document ->
            countries.add(
                Popular(
                    key = document["_id"].toString(),
                    count = document["count"].toString().toLong()
                )
            )
        }

        countries = fillMissing(countries, listOf("US", "IN", "UK", "FR", "JP"))

        cache.set(
            CachedKeys.popularCountriesKey(), mapper.writeValueAsString(countries),
            expiryDuration = Duration.ofMinutes(10)
        )

        return countries
    }

    override suspend fun popularStatesOfCountry(countryCode: String): List<Popular> {
        val popularStates = cache.get(CachedKeys.popularStatesOfCountryKey(countryCode))

        if (popularStates != null) {
            return mapper.readValue<List<Popular>>(popularStates)
        }

        val aggregationPipeline = listOf(
            match(eq("region.countryCode", countryCode)),
            group(
                "\$region.state",
                sum("count", 1)
            ),
            sort(descending("count")),
            limit(5)
        )
        val popularCountries = analytics.aggregate(
            aggregationPipeline
        ).toList()

        var states = mutableListOf<Popular>()

        popularCountries.forEach { document ->
            states.add(
                Popular(
                    key = document["_id"].toString(),
                    count = document["count"].toString().toLong()
                )
            )
        }

        cache.set(
            CachedKeys.popularStatesOfCountryKey(countryCode), mapper.writeValueAsString(states),
            expiryDuration = Duration.ofMinutes(10)
        )

        return states
    }

    override suspend fun popularDistrictsWithInStateOfCountry(
        countryCode: String,
        state: String
    ): List<Popular> {
        val cachedDistricts = cache.get(CachedKeys.popularDistrictsWithInStatesOfCountryKey(countryCode, state))

        if (cachedDistricts != null) {
            return mapper.readValue<List<Popular>>(cachedDistricts)
        }

        val aggregationPipeline = listOf(
            match(
                and(
                    eq("region.countryCode", countryCode),
                    eq("region.state", state)
                )
            ),
            group(
                "\$region.district",
                sum("count", 1)
            ),
            sort(descending("count")),
            limit(5)
        )
        val popularDistricts = analytics.aggregate(
            aggregationPipeline
        ).toList()

        var districts = mutableListOf<Popular>()

        popularDistricts.forEach { document ->
            districts.add(
                Popular(
                    key = document["_id"].toString(),
                    count = document["count"].toString().toLong()
                )
            )
        }

        cache.set(
            CachedKeys.popularDistrictsWithInStatesOfCountryKey(countryCode, state),
            mapper.writeValueAsString(districts),
            expiryDuration = Duration.ofMinutes(10)
        )

        return districts
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

    fun fillMissing(input: MutableList<Popular>, required: List<String>): MutableList<Popular> {
        val currentKeys = input.map { it.key.lowercase() }
        for (key in required) {
            if (!currentKeys.contains(key.lowercase())) {
                input.add(
                    Popular(
                        key = key,
                        count = 0L
                    )
                )
            }
        }

        return input
    }
}