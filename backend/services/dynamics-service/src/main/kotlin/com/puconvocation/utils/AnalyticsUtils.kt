/*
 * Copyright (C) PU Convocation Management System Authors
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

import com.puconvocation.commons.dto.WeeklyTraffic.Traffic

fun List<Traffic>.sortByWeekdays(): List<Traffic> {
    val daysOfWeek = listOf("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    val existingDays = this.associateBy { it.day.lowercase() }

    return daysOfWeek.map { day ->
        existingDays[day.lowercase()] ?: Traffic(day, 0)
    }
}