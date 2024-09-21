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

package com.puconvocation.controllers

import com.puconvocation.commons.dto.ErrorResponse
import com.puconvocation.database.mongodb.repositories.AnalyticsRepository
import com.puconvocation.utils.Result
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

class AnalyticsController(
    private val analyticsRepository: AnalyticsRepository
) {

    suspend fun requestTimeLineAnalytics(
        timestamp: Long, days: Long
    ): Result<List<HashMap<String, String>>, ErrorResponse> {
        return Result.Success(
            analyticsRepository.generateRequestsTimeline(
                LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(timestamp),
                    ZoneOffset.UTC
                ), days
            )
        )
    }
}