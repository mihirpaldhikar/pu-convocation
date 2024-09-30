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

package com.puconvocation.database.mongodb.entities

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.puconvocation.serializers.ObjectIdSerializer
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId
import java.time.LocalDateTime

data class AnalyticsLog(
    @JsonSerialize(using = ObjectIdSerializer::class)
    @BsonId
    @JsonProperty("logId")
    val logId: ObjectId,

    @JsonProperty("timestamp") val timestamp: LocalDateTime,
    @JsonProperty("lang") val lang: String,
    @JsonProperty("path") val path: String,
    @JsonProperty("region") val region: Region,
) {
    data class Region(
        @JsonProperty("district") val district: String,
        @JsonProperty("state") val state: String,
        @JsonProperty("country") val country: String,
        @JsonProperty("countryCode") val countryCode: String,
    )
}
