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

const IAMPolicies = Object.freeze({
  WRITE_IAM_POLICIES: "write:iamPolicies",
  READ_IAM_POLICIES: "read:iamPolicies",
  WRITE_ACCOUNTS: "write:accounts",
  READ_ACCOUNTS: "read:accounts",
  WRITE_ATTENDEES: "write:attendees",
  READ_ATTENDEES: "read:attendees",
  WRITE_REMOTE_CONFIG: "write:remoteConfig",
  READ_REMOTE_CONFIG: "read:remoteConfig",
  WRITE_ASSETS: "write:assets",
  READ_ASSETS: "read:assets",
  WRITE_TRANSACTIONS: "write:transactions",
  READ_ANALYTICS: "read:analytics",
});

export default IAMPolicies;
