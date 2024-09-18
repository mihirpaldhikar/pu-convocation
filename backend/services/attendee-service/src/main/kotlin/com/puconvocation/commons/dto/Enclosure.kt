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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import com.puconvocation.enums.Direction

@JsonIgnoreProperties(ignoreUnknown = true)
data class Enclosure(
    @JsonProperty("enclosureMapping") val enclosureMapping: MutableList<EnclosureMapping>,
) {
    data class EnclosureMapping(
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