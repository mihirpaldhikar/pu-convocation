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

package com.puconvocation

import com.auth0.jwk.JwkProviderBuilder
import com.puconvocation.security.dao.JWTConfig
import java.util.concurrent.TimeUnit

class Environment {
    val developmentMode: Boolean = System.getenv("DEVELOPMENT_MODE").toBoolean()

    val mongoDBConnectionURL = System.getenv("MONGO_DB_CONNECTION_URL").toString()
    val mongoDBName = System.getenv("MONGO_DB_NAME").toString()

    val authServiceURL = System.getenv("AUTH_SERVICE_URL").toString()

    val redisURL = System.getenv("REDIS_URL").toString()

    val kafkaBrokers = System.getenv("KAFKA_BROKERS").toString()

    val jwtConfig: JWTConfig = JWTConfig(
        authorizationTokenPrivateKey = System.getenv("AUTHORIZATION_TOKEN_PRIVATE_KEY"),
        refreshTokenPrivateKey = System.getenv("REFRESH_TOKEN_PRIVATE_KEY"),
        authorizationTokenKeyId = System.getenv("AUTHORIZATION_TOKEN_KEY_ID"),
        refreshTokenKeyId = System.getenv("REFRESH_TOKEN_KEY_ID"),
        audience = System.getenv("API_AUDIENCE"),
        issuer = System.getenv("CREDENTIALS_AUTHORITY"),
        realm = System.getenv("CREDENTIALS_REALM"),
        provider = JwkProviderBuilder(System.getenv("CREDENTIALS_AUTHORITY")).cached(10, 24, TimeUnit.HOURS)
            .rateLimited(10, 1, TimeUnit.MINUTES).build(),
    )
}