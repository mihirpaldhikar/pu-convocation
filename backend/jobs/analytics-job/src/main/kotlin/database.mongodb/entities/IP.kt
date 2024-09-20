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

package com.puconvocation.database.mongodb.entities

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class IP(
    @JsonProperty("from") val from: Long,
    @JsonProperty("to") val to: Long,
    @JsonProperty("countryCode") val countryCode: String,
    @JsonProperty("country") val country: String,
    @JsonProperty("region") val region: String,
    @JsonProperty("city") val city: String,
    @JsonProperty("latitude") val latitude: Double,
    @JsonProperty("longitude") val longitude: Double,
    @JsonProperty("zipcode") val zipcode: String,
    @JsonProperty("timezone") val timezone: String,
)