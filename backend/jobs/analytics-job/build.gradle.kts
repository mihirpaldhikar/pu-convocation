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


val koinVersion: String by project
val mongoDBVersion: String by project

plugins {
    kotlin("jvm") version "2.0.20"
}

group = "com.puconvocation"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")

    // Koin
    runtimeOnly("io.insert-koin:koin-core:$koinVersion")
    implementation("io.insert-koin:koin-core-coroutines:$koinVersion")

    // Jackson
    implementation("com.fasterxml.jackson.core:jackson-core:2.18.0-rc1")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.18.0-rc1")


    // Kafka
    implementation("org.apache.kafka:kafka-clients:3.8.0")

    // AWS MSK IAM Auth
    implementation("software.amazon.msk:aws-msk-iam-auth:2.2.0")

    // MongoDB Dependencies
    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:$mongoDBVersion")
    implementation("org.mongodb:bson-kotlinx:$mongoDBVersion")

    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(11)
}