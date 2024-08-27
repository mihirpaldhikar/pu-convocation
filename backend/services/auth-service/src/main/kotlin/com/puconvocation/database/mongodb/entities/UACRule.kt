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
import org.bson.codecs.pojo.annotations.BsonId

data class UACRule(
    @BsonId @Expose val rule: String,
    @Expose val description: String,
    @Expose val enabled: Boolean,
    @Expose val accounts: MutableSet<String>
)