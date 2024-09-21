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

package com.puconvocation.utils

import com.puconvocation.commons.dto.WeeklyTraffic
import com.puconvocation.commons.dto.WeeklyTraffic.Traffic

fun WeeklyTraffic.sortTrafficByWeekdaysAndFillMissing(): WeeklyTraffic {
    val dayOfWeekOrder = mapOf(
        "sunday" to 1,
        "monday" to 2,
        "tuesday" to 3,
        "wednesday" to 4,
        "thursday" to 5,
        "friday" to 6,
        "saturday" to 7
    )

    val existingDays = traffic.associateBy { it.day.lowercase() }

    val completeTraffic = dayOfWeekOrder.map { (day, _) ->
        existingDays[day] ?: Traffic(
            day.replaceFirstChar { it.uppercase() },
            0
        )
    }

    val sortedTraffic = completeTraffic.sortedBy { dayOfWeekOrder[it.day.lowercase()] }

    return this.copy(traffic = sortedTraffic)
}
