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
import com.puconvocation.enums.Direction
import com.puconvocation.serializers.ObjectIdSerializer
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId
import java.time.LocalDateTime

data class RemoteConfig(
    @JsonSerialize(using = ObjectIdSerializer::class)
    @JsonProperty("id")
    @BsonId
    val id: ObjectId,

    @JsonProperty("active") val active: Boolean,
    @JsonProperty("images") val images: Images,
    @JsonProperty("instructions") val instructions: Instructions,
    @JsonProperty("countdown") val countdown: Countdown,
    @JsonProperty("attendees") val attendees: Attendees,
    @JsonProperty("groundMappings") val groundMappings: MutableList<Enclosure>,
) {

    data class Attendees(
        @JsonProperty("locked") val locked: Boolean,
        @JsonProperty("updatedAt") val updatedAt: LocalDateTime,
        @JsonProperty("csvFile") val csvFile: String,
    )

    data class Instructions(
        @JsonProperty("show") val show: Boolean,
        @JsonProperty("document") val document: String,
    )

    data class Countdown(
        @JsonProperty("show") val show: Boolean,
        @JsonProperty("endTime") val endTime: Long,
    )

    data class Images(
        @JsonProperty("carousel") val carousel: List<ImageMetaData>,
        @JsonProperty("hero") val hero: ImageMetaData,
        @JsonProperty("aboutUs") val aboutUs: ImageMetaData,
    ) {
        data class ImageMetaData(
            @JsonProperty("url") val url: String,
            @JsonProperty("description") val description: String,
        )
    }

    data class Enclosure(
        @JsonProperty("letter") val letter: String,
        @JsonProperty("entryDirection") val entryDirection: Direction,
        @JsonProperty("rows") val rows: MutableList<Row>,
    ) {
        data class Row(
            @JsonProperty("letter") val letter: String,
            @JsonProperty("start") val start: Int,
            @JsonProperty("end") val end: Int,
            @JsonProperty("reserved") val reserved: String,
        )
    }
}