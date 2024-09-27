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

package com.puconvocation.commons.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.puconvocation.enums.Direction
import com.puconvocation.serializers.ObjectIdSerializer
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

data class RemoteConfig(
    @JsonSerialize(using = ObjectIdSerializer::class)
    @JsonProperty("id")
    @BsonId
    val id: ObjectId,

    @JsonProperty("active") val active: Boolean,

    @JsonProperty("heroTitle") val heroTitle: String,
    @JsonProperty("gallery") val gallery: MutableList<Gallery>,
    @JsonProperty("showInstructionsBanner") val showInstructionsBanner: Boolean,
    @JsonProperty("instructionsFileURL") val instructionsFileURL: String,
    @JsonProperty("aboutUs") val aboutUs: String,
    @JsonProperty("aboutUsImage") val aboutUsImage: String,
    @JsonProperty("heroImage") val heroImage: String,
    @JsonProperty("showCountDown") val showCountDown: Boolean,
    @JsonProperty("countDownEndTime") val countDownEndTime: Long,
    @JsonProperty("attendeeLocked") val attendeeLocked: Boolean,
    @JsonProperty("groundMappings") val groundMappings: MutableList<Enclosure>,
) {
    data class Gallery(
        @JsonProperty("title") val title: String,
        @JsonProperty("url") val url: String,
        @JsonProperty("description") val description: String,
    )

    data class Enclosure(
        @JsonProperty("letter") val letter: String,
        @JsonProperty("entryDirection") val entryDirection: Direction,
        @JsonProperty("rows") val rows: MutableList<Row>,
    ) {
        data class Row(
            @JsonProperty("letter") val letter: String,
            @JsonProperty("start") val start: Int,
            @JsonProperty("end") val end: Int,
        )
    }
}