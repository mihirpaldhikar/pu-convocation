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
val apacheCSV: String by project

plugins {
    kotlin("jvm") version "2.1.0"
    id("io.ktor.plugin") version "3.0.1"
}

group = "com.puconvocation"
version = "1.0.0-rc.4"

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
    implementation("io.ktor:ktor-server-conditional-headers-jvm")
    implementation("io.ktor:ktor-server-default-headers-jvm")
    implementation("io.ktor:ktor-server-cors-jvm")
    implementation("io.ktor:ktor-server-call-logging-jvm")
    implementation("io.ktor:ktor-server-content-negotiation-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("io.ktor:ktor-client-core")
    implementation("io.ktor:ktor-client-cio")
    implementation("io.ktor:ktor-client-content-negotiation")
    implementation("io.ktor:ktor-serialization-jackson-jvm")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.18.1")
    implementation("ch.qos.logback:logback-classic:$logbackVersion")

    // Koin Dependencies
    implementation("io.insert-koin:koin-ktor:$koinVersion")
    implementation("io.insert-koin:koin-logger-slf4j:$koinVersion")

    // MongoDB Dependencies
    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:$mongoDBVersion")
    implementation("org.mongodb:bson-kotlinx:$mongoDBVersion")

    // Caffeine Cache
    implementation("com.github.ben-manes.caffeine:caffeine:3.1.8")

    // Redis
    implementation("redis.clients:jedis:5.1.5")

    // Apache Kafka
    implementation("org.apache.kafka:kafka-clients:3.8.0")

    // AWS MSK IAM Auth
    implementation("software.amazon.msk:aws-msk-iam-auth:2.2.0")

    // Apace CSV
    implementation("org.apache.commons:commons-csv:$apacheCSV")

    // Apache Common Codec
    implementation("commons-codec:commons-codec:1.16.1")

    // AWS Lambda
    implementation("software.amazon.awssdk:lambda:2.28.2")

    // AWS SQS
    implementation("aws.sdk.kotlin:sqs:1.3.32")

    // AWS S3
    implementation("aws.sdk.kotlin:s3:1.3.71")

    // Test Dependencies
    testImplementation("io.ktor:ktor-server-test-host")
    testImplementation("org.jetbrains.kotlin:kotlin-test:$kotlinVersion")
}
