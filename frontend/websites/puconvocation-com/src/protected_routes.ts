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

import { ProtectedRoute } from "@dto/index";
import IAMPolicies from "@configs/IAMPolicies";

export const PROTECTED_ROUTES: Array<ProtectedRoute> = [
  {
    pathRegex: /^\/console$/,
    requiredIAMPolicy: null,
  },
  {
    pathRegex: /^\/console\/account$/,
    requiredIAMPolicy: null,
  },
  {
    pathRegex: /^\/console\/analytics(\/.*)?$/,
    requiredIAMPolicy: IAMPolicies.READ_ANALYTICS,
  },
  {
    pathRegex: /^\/console\/attendees(\/.*)?$/,
    requiredIAMPolicy: IAMPolicies.READ_ATTENDEES,
  },
  {
    pathRegex: /^\/console\/settings(\/.*)?$/,
    requiredIAMPolicy: IAMPolicies.READ_REMOTE_CONFIG,
  },
  {
    pathRegex: /^\/console\/scan(\/.*)?$/,
    requiredIAMPolicy: IAMPolicies.WRITE_TRANSACTIONS,
  },
  {
    pathRegex: /^\/console\/account\/manager(\/.*)?$/,
    requiredIAMPolicy: IAMPolicies.READ_ACCOUNTS,
  },
];
