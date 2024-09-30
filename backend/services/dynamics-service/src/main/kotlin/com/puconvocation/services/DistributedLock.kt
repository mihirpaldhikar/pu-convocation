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

package com.puconvocation.services

import redis.clients.jedis.JedisPool
import java.time.Duration
import java.util.UUID

class DistributedLock(
    private val jedisPool: JedisPool,
) {

    fun acquire(lockName: String, duration: Duration): Boolean {
        val lockValue = UUID.randomUUID().toString().replace("-", "")
        return try {
            jedisPool.resource.use { jedis ->
                if (jedis.get(lockName) != null) {
                    return false
                }
                return jedis.setex(lockName, duration.seconds, lockValue) == "OK"
            }
        } catch (e: Exception) {
            release(lockName)
            false
        }
    }

    fun release(lockName: String) {
        jedisPool.resource.use { jedis ->
            jedis.del(lockName)
        }
    }
}