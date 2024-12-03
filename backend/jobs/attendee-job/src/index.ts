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

import { Handler } from "aws-lambda";
import {
  Attendee,
  AttendeeRepository,
  RemoteConfigRepository,
} from "./database/index.js";
import { jsonToCSV, totalEnclosureSeats } from "./utils/index.js";
import {
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UUID } from "mongodb";
import { createZippedBufferWithPassword } from "./utils/ZIPUtils.js";

export const handler: Handler = async (event, context) => {
  const attendeeRepository = new AttendeeRepository();
  const remoteConfigRepository = new RemoteConfigRepository();

  const isAttendeeListLocked =
    await remoteConfigRepository.isAttendeeListLocked();
  const attendees = await attendeeRepository.getAttendees();

  if (!isAttendeeListLocked) {
    let totalAttendees = attendees.length;

    const attendeesCSVInput: Array<Attendee> = [];

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
        if (totalAttendees === 0) {
          break;
        }
        const reserved = row.reserved
          .split(",")
          .filter((r) => !isNaN(parseInt(r)));

        const seats = row.end - row.start - reserved.length + 1;
        const attendeesForCurrentRow = attendees.slice(
          allocatedSeats,
          allocatedSeats + seats,
        );

        if (attendeesForCurrentRow.length === 0) {
          break;
        }

        let i = 0;
        for (let seat of Array.from(
          { length: row.end - row.start + 1 },
          (_, k) => k + row.start,
        )) {
          if (totalAttendees === 0) {
            break;
          }
          if (reserved.includes(seat.toString())) continue;
          const a = {
            ...attendeesForCurrentRow[i],
            allocation: {
              enclosure: enclosure.letter,
              seat: seat.toString(),
              row: row.letter,
            },
          };
          await attendeeRepository.updateAttendeeAllocation(a);
          attendeesCSVInput.push(a);
          totalAttendees -= 1;
          ++i;
        }
        allocatedSeats += seats;
      }
    }

    const attendeesCSV = jsonToCSV(
      attendeesCSVInput,
      ["verificationCode", "verificationToken", "degreeReceived"],
      {
        _id: "enrollmentNumber",
      },
    );
    const s3Client = new S3Client();

    const fileName = new UUID().toString().replace(/-/g, "");

    const archiveBuffer = await createZippedBufferWithPassword(
      attendeesCSV,
      "attendees.csv",
      process.env.ATTENDEE_ZIP_PASSWORD!!,
    );

    const uploadParams = {
      Bucket: "assets.puconvocation.com",
      Key: `documents/${fileName}.zip`,
      Body: archiveBuffer,
      ContentType: "application/zip",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    await remoteConfigRepository.updateAttendeeCSVFileURL(
      `https://assets.puconvocation.com/documents/${fileName}.zip`,
    );
  } else {
    const sqsClient = new SQSClient();
    const NOTIFICATION_QUEUE_URL = process.env.NOTIFICATION_QUEUE_URL!!;
    const BATCH_SIZE = 10;

    for (let i = 0; i < attendees.length; i += BATCH_SIZE) {
      const attendeeBatch = attendees.splice(i, i + BATCH_SIZE);
      const messageBatch: Array<SendMessageBatchRequestEntry> = [];
      for (let attendee of attendeeBatch) {
        if (
          attendee._id.includes("DUPLICATE") ||
          attendee._id.includes("NO-ENR")
        ) {
          continue;
        }

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
          QueueUrl: NOTIFICATION_QUEUE_URL,
          Entries: messageBatch,
        }),
      );
    }
  }
};
