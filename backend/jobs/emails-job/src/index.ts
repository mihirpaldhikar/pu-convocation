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

import { SQSEvent, SQSHandler } from "aws-lambda";
import { EmailRequest } from "./dto/index.js";
import { SendTemplatedEmailRequest, SES } from "@aws-sdk/client-ses";

export const handler: SQSHandler = async (event: SQSEvent) => {
  const emailClient = new SES();

  for (const record of event.Records) {
    const emailRequest: EmailRequest = JSON.parse(record.body);
    const template: SendTemplatedEmailRequest = {
      Destination: {
        ToAddresses: [emailRequest.receiver],
      },
      Source: emailRequest.sender,
      ReplyToAddresses: [emailRequest.replyTo],
      Template: emailRequest.templateId,
      TemplateData: JSON.stringify(emailRequest.payload),
    };
    await emailClient.sendTemplatedEmail(template);
  }
};
