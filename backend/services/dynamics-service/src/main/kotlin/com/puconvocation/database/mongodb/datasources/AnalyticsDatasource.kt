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

package com.puconvocation.database.mongodb.datasources

import com.puconvocation.commons.dto.Popular
import com.puconvocation.commons.dto.WeeklyTraffic
import java.time.LocalDate
import java.time.LocalDateTime

interface AnalyticsDatasource {

    suspend fun trafficOnDate(date: LocalDate): List<Popular>

    suspend fun weeklyTraffic(timestamp: LocalDateTime): WeeklyTraffic

    suspend fun popularLangs(): List<Popular>

    suspend fun popularCountries(): List<Popular>

    suspend fun popularStatesOfCountry(countryCode: String): List<Popular>

    suspend fun popularDistrictsWithInStateOfCountry(countryCode: String, state: String): List<Popular>
}