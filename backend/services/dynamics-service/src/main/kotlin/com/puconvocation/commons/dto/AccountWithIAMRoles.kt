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
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

data class AccountWithIAMRoles(
    @BsonId
    @JsonProperty("uuid")
    val uuid: ObjectId,

    @JsonProperty("username")
    val username: String,

    @JsonProperty("displayName")
    val displayName: String,

    @JsonProperty("designation")
    val designation: String,

    @JsonProperty("email")
    val email: String,

    @JsonProperty("avatarURL")
    val avatarURL: String,

    @JsonProperty("iamRoles")
    val iamRoles: List<String>,
)
