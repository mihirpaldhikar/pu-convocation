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

import com.google.gson.annotations.Expose
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

data class AccountWithUACRules(
    @BsonId @Expose val uuid: ObjectId,
    @Expose val username: String,
    @Expose val displayName: String,
    @Expose val email: String,
    @Expose val avatarURL: String,
    @Expose val privileges: List<String>,
)
