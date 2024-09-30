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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class Environment(
    @JsonProperty("service") val service: Service,
    @JsonProperty("database") val database: Database,
    @JsonProperty("security") val security: Security,
    @JsonProperty("cloud") val cloud: Cloud
) {

    data class Service(
        @JsonProperty("name") val name: String,
        @JsonProperty("port") val port: Int,
        @JsonProperty("address") val address: String,
        @JsonProperty("discovery") val discovery: String,
        @JsonProperty("developmentMode") val developmentMode: Boolean,
    )

    data class Database(
        @JsonProperty("mongoDb") val mongoDb: GenericDatabase,
        @JsonProperty("redis") val redis: GenericDatabase
    ) {
        data class GenericDatabase(
            @JsonProperty("url") val url: String,
            @JsonProperty("name") val name: String,
        )
    }

    data class Security(
        @JsonProperty("jwt") val jwt: JWT
    ) {
        data class JWT(
            @JsonProperty("audience") val audience: String,
            @JsonProperty("credentialsAuthority") val credentialsAuthority: String,
            @JsonProperty("credentialsRealm") val credentialsRealm: String,
            @JsonProperty("tokens") val tokens: Tokens
        ) {
            data class Tokens(
                @JsonProperty("refresh") val refresh: RSABased,
                @JsonProperty("authorization") val authorization: RSABased,
                @JsonProperty("invitation") val invitation: HMACBased
            ) {
                data class RSABased(
                    @JsonProperty("keyId") val keyId: String,
                    @JsonProperty("privateKey") val privateKey: String
                )

                data class HMACBased(
                    @JsonProperty("secret") val secret: String,
                )
            }
        }
    }

    data class Cloud(
        @JsonProperty("aws") val aws: AWS
    ) {
        data class AWS(
            @JsonProperty("accessKeyId") val accessKeyId: String,
            @JsonProperty("secretAccessKey") val secretAccessKey: String,
            @JsonProperty("region") val region: String,
            @JsonProperty("emailSQS") val emailSQS: SQS,
            @JsonProperty("transactionSQS") val transactionSQS: SQS,
            @JsonProperty("analyticsMSK") val analyticsMSK: MSK
        ) {
            data class SQS(
                @JsonProperty("url") val url: String,
            )

            data class MSK(
                @JsonProperty("brokers") val brokers: String,
            )
        }
    }
}