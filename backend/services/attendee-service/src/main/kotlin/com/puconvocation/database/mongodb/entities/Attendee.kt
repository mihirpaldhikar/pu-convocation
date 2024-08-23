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

import com.google.gson.annotations.Expose
import com.puconvocation.enums.Direction
import org.bson.codecs.pojo.annotations.BsonId

data class Attendee(
    @BsonId @Expose val enrollmentNumber: String,
    @Expose val convocationId: String,
    @Expose val studentName: String,
    @Expose val department: String,
    @Expose val institute: String,
    @Expose val enclosure: String,
    @Expose val row: String,
    @Expose val seat: String,
    @Expose val enterFrom: Direction,
    @Expose val verificationToken: String,
    @Expose val verificationCode: String,
    @Expose val degreeReceived: Boolean,
)
