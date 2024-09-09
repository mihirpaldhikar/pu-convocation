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

import redis.clients.jedis.JedisPool


class CacheService(
    private val pool: JedisPool,
    private val inMemoryCache: InMemoryCache
) {

    fun set(key: String, value: String) {
        inMemoryCache.set(key, value)
        pool.resource.use { jedis ->
            jedis.set(key, value)
        }
    }

    fun get(key: String): String? {
        val inMemoryValue = inMemoryCache.get(key)

        if (inMemoryValue != null) {
            return inMemoryValue
        }

        val cache = pool.resource.use { jedis ->
            jedis.get(key)
        }

        if (cache != null) {
            inMemoryCache.set(key, cache)
        }
        return cache
    }

    fun remove(key: String) {
        inMemoryCache.remove(key)
        pool.resource.use { jedis ->
            jedis.del(key)
        }
    }
}