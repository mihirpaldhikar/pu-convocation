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

import com.puconvocation.Environment
import redis.clients.jedis.JedisPool


class CacheService(
    environment: Environment,
) {
    private val pool = JedisPool(
        environment.redisURL
    )

    fun set(key: String, value: String) {
        pool.resource.use { jedis ->
            jedis.set(key, value)
        }
        pool.resource.close()
    }

    fun get(key: String): String? {
        val cache = pool.resource.use { jedis ->
            jedis.get(key)
        }
        pool.resource.close()
        return cache?.toString()
    }

    fun remove(key: String) {
        pool.resource.use { jedis ->
            jedis.del(key)
        }
        pool.resource.close()
    }
}