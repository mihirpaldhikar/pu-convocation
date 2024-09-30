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

package com.puconvocation.commons.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.puconvocation.commons.dto.WeeklyTraffic.Traffic

data class WeeklyTraffic(
    @JsonProperty("currentWeek") val currentWeek: List<Traffic>,
    @JsonProperty("previousWeek") val previousWeek: List<Traffic>,
    @JsonProperty("surge") val surge: Float,
) {
    data class Traffic(
        @JsonProperty("day") val day: String,
        @JsonProperty("requests") val requests: Long,
    )
}
