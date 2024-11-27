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

import {AttendeeRepository, RemoteConfigRepository,} from "./database/index.js";
import {totalEnclosureSeats} from "./utils/index.js";
import {Handler} from "aws-lambda";
import {SendMessageBatchCommand, SendMessageBatchRequestEntry, SQSClient,} from "@aws-sdk/client-sqs";

export const handler: Handler = async (event, context) => {
  const attendeeRepository = new AttendeeRepository();
  const remoteConfigRepository = new RemoteConfigRepository();

  const isAttendeeListLocked =
    await remoteConfigRepository.isAttendeeListLocked();
  const attendees = await attendeeRepository.getAttendees();

  if (!isAttendeeListLocked) {
    let totalAttendees = attendees.length;

    const enclosureMapping = await remoteConfigRepository.getGroundMappings();
    let totalSeats = 0;
    for (let enclosure of enclosureMapping) {
      totalSeats += totalEnclosureSeats(enclosure);
    }

    if (totalAttendees > totalSeats) {
      return;
    }

    let allocatedSeats = 0;

    for (let enclosure of enclosureMapping) {
      if (totalAttendees === 0) {
        break;
      }

      for (let row of enclosure.rows) {
        const reserved = row.reserved
          .split(",")
          .filter((r) => !isNaN(parseInt(r)));

        const seats = row.end - row.start - reserved.length + 1;
        const attendeesForCurrentRow = attendees.slice(
          allocatedSeats,
          allocatedSeats + seats,
        );

        totalAttendees -= attendeesForCurrentRow.length;

        if (attendeesForCurrentRow.length === 0) {
          break;
        }

        let i = 0;
        for (let seat of Array.from(
          { length: row.end - row.start + 1 },
          (_, k) => k + row.start,
        )) {
          if (reserved.includes(seat.toString())) continue;

          await attendeeRepository.updateAttendeeAllocation({
            ...attendeesForCurrentRow[i],
            allocation: {
              enclosure: enclosure.letter,
              seat: seat.toString(),
              row: row.letter,
            },
          });
          ++i;
        }
        allocatedSeats += seats;
      }
    }
  } else {
    const sqsClient = new SQSClient();
    const EMAIL_QUEUE_URL = process.env.EMAIL_QUEUE_URL!!;
    const BATCH_SIZE = 10;

    for (let i = 0; i < attendees.length; i += BATCH_SIZE) {
      const attendeeBatch = attendees.splice(i, i + BATCH_SIZE);
      const messageBatch: Array<SendMessageBatchRequestEntry> = [];
      for (let attendee of attendeeBatch) {
        messageBatch.push({
          Id: attendee._id,
          MessageGroupId: "emails",
          MessageBody: JSON.stringify({
            type: "passcode",
            sender: "PU Convocation System <noreply@puconvocation.com>",
            recipient: `${attendee._id}@paruluniversity.ac.in`,
            replyTo: "admin@puconvocation.com",
            payload: {
              passcode: attendee.verificationCode,
              passURL: `https://puconvocation.com/attendee/${attendee._id}`,
              recipientName: attendee.studentName,
              convocationNumber: "8",
            },
          }),
        });
      }

      await sqsClient.send(
        new SendMessageBatchCommand({
          QueueUrl: EMAIL_QUEUE_URL,
          Entries: messageBatch,
        }),
      );
    }
  }
};
