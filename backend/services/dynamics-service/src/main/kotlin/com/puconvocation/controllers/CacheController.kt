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

package com.puconvocation.controllers

import com.github.benmanes.caffeine.cache.Caffeine
import redis.clients.jedis.JedisPool
import redis.clients.jedis.params.ScanParams
import java.time.Duration
import java.util.concurrent.TimeUnit


class CacheController(
    private val pool: JedisPool
) {

    private val localCache = Caffeine.newBuilder()
        .expireAfterWrite(5, TimeUnit.MINUTES)
        .build<String, String>()

    fun set(key: String, value: String, expiryDuration: Duration? = null) {
        localCache.put(key, value)
        pool.resource.use { jedis ->
            jedis.setex(key, expiryDuration?.seconds ?: TimeUnit.MINUTES.toSeconds(5), value)
        }
    }

    fun get(key: String): String? {
        return localCache.getIfPresent(key) ?: pool.resource.use { jedis ->
            val distributedCache = jedis.get(key)
            if (distributedCache != null) {
                localCache.put(key, distributedCache)
            }
            distributedCache
        }
    }

    fun invalidate(key: String) {
        localCache.invalidate(key)
        pool.resource.use { jedis ->
            jedis.del(key)
        }
    }

    fun invalidateWithPattern(pattern: String) {
        val matchingKeys = HashSet<String>()
        val params = ScanParams()
        params.match(pattern)

        pool.resource.use { jedis ->
            var nextCursor = "0"

            do {
                val scanResult = jedis.scan(nextCursor, params)
                val keys = scanResult.result

                matchingKeys.addAll(keys)
            } while (nextCursor != "0")

            if (matchingKeys.isNotEmpty()) {
                matchingKeys.forEach { key ->
                    invalidate(key)
                }
            }
        }
    }

}