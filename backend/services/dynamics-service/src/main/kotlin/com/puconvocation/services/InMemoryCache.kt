package com.puconvocation.services

import com.github.benmanes.caffeine.cache.Caffeine
import java.util.concurrent.TimeUnit

class InMemoryCache(expiryDuration: Long, timeUnit: TimeUnit) {
    private val cache = Caffeine.newBuilder()
        .expireAfterWrite(expiryDuration, timeUnit)
        .build<String, String>()

    fun get(key: String): String? = cache.getIfPresent(key)

    fun set(key: String, value: String) {
        cache.put(key, value)
    }

    fun remove(key: String) {
        cache.invalidate(key)
    }
}