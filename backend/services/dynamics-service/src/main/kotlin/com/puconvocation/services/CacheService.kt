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