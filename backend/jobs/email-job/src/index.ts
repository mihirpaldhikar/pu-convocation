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
import { EmailRequest } from "./dto/index.js";
import { SendEmailCommandInput, SES } from "@aws-sdk/client-ses";
import AccountCreationInvitationEmail from "./emails/account_invitation_email.js";
import VerificationPasscodeEmail from "./emails/verification_passcode_email.js";
import { render } from "@react-email/components";

export const handler: SQSHandler = async (event: SQSEvent) => {
  const emailClient = new SES();

  for (const record of event.Records) {
    const emailRequest: EmailRequest = JSON.parse(record.body);
    const email = await render(
      emailRequest.type === "invitation"
        ? AccountCreationInvitationEmail({ ...emailRequest.payload })
        : VerificationPasscodeEmail({ ...emailRequest.payload }),
    );

    const params: SendEmailCommandInput = {
      Source: emailRequest.sender,
      Destination: {
        ToAddresses: [emailRequest.recipient],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: email,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data:
            emailRequest.type === "invitation"
              ? "Invitation for Parul University Convocation Account"
              : `Verification Passcode for ${emailRequest.payload.convocationNumber}th Parul University Convocation`,
        },
      },
    };

    await emailClient.sendEmail(params);
  }
};
