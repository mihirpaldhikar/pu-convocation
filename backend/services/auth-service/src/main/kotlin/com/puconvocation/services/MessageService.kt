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

import aws.sdk.kotlin.services.sqs.SqsClient
import aws.sdk.kotlin.services.sqs.model.SendMessageBatchRequest
import aws.sdk.kotlin.services.sqs.model.SendMessageBatchRequestEntry
import aws.sdk.kotlin.services.sqs.model.SendMessageRequest
import com.puconvocation.Environment

class MessageQueue(
    private val sqsClient: SqsClient,
    private val awsConfig: Environment.Cloud.AWS
) {
    suspend fun sendMessage(message: String, groupId: String, queueType: QueueType) {
        val messageRequest = SendMessageRequest {
            messageBody = message
            messageGroupId = groupId
            queueUrl = if (queueType == QueueType.EMAIL) awsConfig.sqs.emailQueue else awsConfig.sqs.transactionQueue
        }

        sqsClient.sendMessage(messageRequest)
    }

    suspend fun sendBatchMessages(
        messages: MutableList<SendMessageBatchRequestEntry>,
        queueType: QueueType
    ) {
        val batchMessages = SendMessageBatchRequest {
            entries = messages
            queueUrl = if (queueType == QueueType.EMAIL) awsConfig.sqs.emailQueue else awsConfig.sqs.transactionQueue
        }

        sqsClient.sendMessageBatch(batchMessages)
    }

    enum class QueueType {
        EMAIL,
        TRANSACTION
    }
}