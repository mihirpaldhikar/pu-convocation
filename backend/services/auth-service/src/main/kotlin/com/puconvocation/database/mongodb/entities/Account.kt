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
import com.puconvocation.enums.AccountType
import com.puconvocation.security.dao.FidoCredential
import com.puconvocation.security.dao.SaltedHash
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

data class Account(
    @BsonId @Expose val uuid: ObjectId,
    @Expose val username: String,
    @Expose val displayName: String,
    @Expose val email: String,
    @Expose val avatarURL: String,
    @Expose val type: AccountType,
    val suspended: Boolean,
    val password: SaltedHash? = null,
    val fidoCredential: MutableSet<FidoCredential>
)