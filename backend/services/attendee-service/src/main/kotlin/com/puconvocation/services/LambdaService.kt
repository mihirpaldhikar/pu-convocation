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

import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.lambda.LambdaClient
import software.amazon.awssdk.services.lambda.model.InvokeRequest

class LambdaService {
    private val lambda = LambdaClient.builder().region(Region.AP_SOUTH_1).build()

    fun invoke(lambdaName: String): Int {
        val invocationRequest = InvokeRequest.builder().functionName(lambdaName).build()
        val status = lambda.invoke(invocationRequest)
        return status.statusCode()
    }
}