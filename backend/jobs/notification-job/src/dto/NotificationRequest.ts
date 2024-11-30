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

export interface AccountCreationInvitationEmailRequest {
  senderName: string;
  invitationToken: string;
}

export interface VerificationPasscodeEmailRequest {
  passcode: string;
  passURL: string;
  recipientName: string;
  convocationNumber: string;
}

export interface TransactionConfirmationEmailRequest {
  transactionId: string;
  recipientName: string;
}

export type NotificationRequest =
  | {
      type: "invitation";
      sender: string;
      recipient: string;
      replyTo: string;
      payload: AccountCreationInvitationEmailRequest;
    }
  | {
      type: "passcode";
      sender: string;
      recipient: string;
      replyTo: string;
      payload: VerificationPasscodeEmailRequest;
    }
  | {
      type: "transaction";
      sender: string;
      recipient: string;
      replyTo: string;
      payload: TransactionConfirmationEmailRequest;
    };
