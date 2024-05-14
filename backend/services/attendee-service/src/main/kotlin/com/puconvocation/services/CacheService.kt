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

package com.puconvocation.services

import com.google.common.cache.Cache
import com.google.common.cache.CacheBuilder
import java.util.concurrent.TimeUnit

class CacheService<T>(expiryDuration: Long, timeUnit: TimeUnit) {
    private var cache: Cache<String, T> = CacheBuilder.newBuilder()
        .expireAfterWrite(expiryDuration, timeUnit)
        .concurrencyLevel(Runtime.getRuntime().availableProcessors())
        .build()

    fun get(key: String): T? = cache.getIfPresent(key)

    fun put(key: String, value: T & Any) {
        cache.put(key, value)
    }
}