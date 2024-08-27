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

    private val cache = pool.resource

    fun set(key: String, value: String) {
        cache.set(key, value)
    }

    fun get(key: String): String? {
        return cache.get(key)
    }

    fun remove(key: String) {
        cache.del(key)
    }
}