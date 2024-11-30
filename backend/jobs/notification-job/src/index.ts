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
import { NotificationRequest } from "./dto/index.js";
import { SendEmailCommandInput, SES } from "@aws-sdk/client-ses";
import AccountCreationInvitationEmail from "./emails/account_invitation_email.js";
import VerificationPasscodeEmail from "./emails/verification_passcode_email.js";
import { render } from "@react-email/components";
import TransactionConfirmationEmail from "./emails/transaction_confirmation_email.js";

export const handler: SQSHandler = async (event: SQSEvent) => {
  const emailClient = new SES();

  for (const record of event.Records) {
    const notificationRequest: NotificationRequest = JSON.parse(record.body);
    const email = await render(
      notificationRequest.type === "invitation"
        ? AccountCreationInvitationEmail({ ...notificationRequest.payload })
        : notificationRequest.type === "transaction"
          ? TransactionConfirmationEmail({ ...notificationRequest.payload })
          : VerificationPasscodeEmail({ ...notificationRequest.payload }),
    );

    const params: SendEmailCommandInput = {
      Source: notificationRequest.sender,
      Destination: {
        ToAddresses: [notificationRequest.recipient],
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
            notificationRequest.type === "invitation"
              ? "Invitation for Parul University Convocation Account"
              : notificationRequest.type === "transaction"
                ? `You have Received your Degree!`
                : `Verification Passcode for ${notificationRequest.payload.convocationNumber}th Parul University Convocation`,
        },
      },
    };

    await emailClient.sendEmail(params);
  }
};
