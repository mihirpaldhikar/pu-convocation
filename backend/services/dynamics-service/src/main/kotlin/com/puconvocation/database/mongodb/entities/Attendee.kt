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
import org.bson.codecs.pojo.annotations.BsonId

data class Attendee(
    @BsonId @JsonProperty("enrollmentNumber") val enrollmentNumber: String,
    @JsonProperty("convocationId") val convocationId: String,
    @JsonProperty("studentName") val studentName: String,
    @JsonProperty("department") val department: String,
    @JsonProperty("institute") val institute: String,
    @JsonProperty("verificationToken") val verificationToken: String,
    @JsonProperty("verificationCode") val verificationCode: String,
    @JsonProperty("degreeReceived") val degreeReceived: Boolean,
    @JsonProperty("allocation") val allocation: Allocation,
) {
    data class Allocation(
        @JsonProperty("enclosure") val enclosure: String,
        @JsonProperty("row") val row: String,
        @JsonProperty("seat") val seat: String,
    )
}