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

export default interface Account {
  uuid: string;
  username: string;
  displayName: string;
  designation: string;
  email: string;
  avatarURL: string;
  suspended: boolean;
  assignedIAMPolicies: Array<string>;
}
