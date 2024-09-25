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

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.puconvocation.security.dao.FidoCredential
import com.puconvocation.security.dao.SaltedHash
import com.puconvocation.serializers.ObjectIdSerializer
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

@JsonIgnoreProperties(ignoreUnknown = true)
data class Account(
    @JsonSerialize(using = ObjectIdSerializer::class)
    @JsonProperty("uuid")
    @BsonId
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

    @JsonIgnore @JsonProperty("suspended")
    val suspended: Boolean,

    @JsonIgnore @JsonProperty("password")
    val password: SaltedHash? = null,

    @JsonIgnore @JsonProperty("fidoCredential")
    val fidoCredential: MutableSet<FidoCredential>
)