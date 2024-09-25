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

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.puconvocation.serializers.ObjectIdSerializer
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

data class Invitation(
    @JsonSerialize(using = ObjectIdSerializer::class)
    @JsonProperty("id")
    @BsonId
    val id: ObjectId,

    @JsonProperty("email")
    val email: String,

    @JsonProperty("iamRoles")
    val roles: List<String>,
)