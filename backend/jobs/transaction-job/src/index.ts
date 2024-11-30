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

import { SQSEvent, SQSHandler } from "aws-lambda";
import { TransactionRequest } from "./database/dto/index.js";
import { AttendeeRepository, TransactionRepository } from "./database/index.js";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export const handler: SQSHandler = async (event: SQSEvent) => {
  const transactionRepository = new TransactionRepository();
  const attendeeRepository = new AttendeeRepository();
  const sqsClient = new SQSClient();
  const NOTIFICATION_QUEUE_URL = process.env.NOTIFICATION_QUEUE_URL!!;

  for (const record of event.Records) {
    const transactionRequest: TransactionRequest = JSON.parse(record.body);
    const attendee = await attendeeRepository.getAttendee(
      transactionRequest.enrollmentNumber,
    );

    if (
      (await transactionRepository.transactionExists(
        transactionRequest.enrollmentNumber,
      )) ||
      attendee === null ||
      attendee.degreeReceived
    ) {
      continue;
    }

    const transactionId =
      await transactionRepository.createTransaction(transactionRequest);

    if (transactionId === null) {
      continue;
    }

    const received = await attendeeRepository.updateAttendeeDegreeStatus(
      transactionRequest.enrollmentNumber,
      true,
    );

    if (!received) {
      continue;
    }

    const command = new SendMessageCommand({
      QueueUrl: NOTIFICATION_QUEUE_URL,
      MessageGroupId: "emails",
      MessageBody: JSON.stringify({
        type: "transaction",
        sender: "PU Convocation System <noreply@puconvocation.com>",
        recipient: `${transactionRequest.enrollmentNumber}@paruluniversity.ac.in`,
        replyTo: "admin@puconvocation.com",
        payload: {
          recipientName: attendee.studentName,
          transactionId: transactionId,
        },
      }),
    });

    await sqsClient.send(command);
  }
};
