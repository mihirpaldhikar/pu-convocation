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

package com.puconvocation.utils

fun ipToLong(ip: String): Long {
    val parts = ip.split(".")
    require(parts.size == 4) { "Invalid IP address format" }

    var result: Long = 0
    for (i in 0..3) {
        val part = parts[i].toIntOrNull() ?: throw IllegalArgumentException("Invalid IP address part")
        require(part in 0..255) { "Invalid IP address part range" }
        result = result or (part.toLong() shl (24 - 8 * i))
    }
    return result
}