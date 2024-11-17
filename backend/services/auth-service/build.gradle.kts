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

val kotlinVersion: String by project
val logbackVersion: String by project
val koinVersion: String by project
val mongoDBVersion: String by project
val webauthnVersion: String by project

plugins {
    kotlin("jvm") version "2.0.21"
    id("io.ktor.plugin") version "3.0.1"
}

group = "com.puconvocation"
version = "3.0.0-beta.1"

application {
    mainClass.set("com.puconvocation.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-auth-jvm")
    implementation("io.ktor:ktor-server-auth-jwt-jvm")
    implementation("io.ktor:ktor-server-host-common-jvm")
    implementation("io.ktor:ktor-server-caching-headers-jvm")
    implementation("io.ktor:ktor-server-cors-jvm")
    implementation("io.ktor:ktor-server-default-headers-jvm")
    implementation("io.ktor:ktor-server-call-logging-jvm")
    implementation("io.ktor:ktor-server-content-negotiation-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("io.ktor:ktor-serialization-jackson-jvm")
    implementation("ch.qos.logback:logback-classic:$logbackVersion")

    // Koin Dependencies
    implementation("io.insert-koin:koin-ktor:$koinVersion")
    implementation("io.insert-koin:koin-logger-slf4j:$koinVersion")

    // MongoDB Dependencies
    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:$mongoDBVersion")
    implementation("org.mongodb:bson-kotlinx:$mongoDBVersion")

    // Apache Common Codec
    implementation("commons-codec:commons-codec:1.16.1")

    // Yubico Webauthn
    implementation("com.yubico:webauthn-server-core:$webauthnVersion")
    implementation("com.yubico:webauthn-server-attestation:$webauthnVersion")
    implementation("com.yubico:yubico-util:$webauthnVersion")

    // Caffeine Cache
    implementation("com.github.ben-manes.caffeine:caffeine:3.1.8")

    // Redis
    implementation("redis.clients:jedis:5.1.5")

    // AWS SQS
    implementation("aws.sdk.kotlin:sqs:1.3.32")

    // Test Dependencies
    testImplementation("io.ktor:ktor-server-test-host")
    testImplementation("org.jetbrains.kotlin:kotlin-test:$kotlinVersion")
}
