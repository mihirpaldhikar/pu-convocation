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

package com.puconvocation.utils

import com.yubico.webauthn.data.ByteArray
import org.bson.types.ObjectId

object PasskeyUtils {
    fun toByteArray(uuid: ObjectId): ByteArray {
        return ByteArray(uuid.toByteArray())
    }

    fun toObjectId(byteArray: ByteArray): ObjectId {
        return ObjectId(byteArray.bytes)
    }
}