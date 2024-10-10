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

export const PROTECTED_ROUTES: Array<ProtectedRoute> = [
  {
    pathRegex: /^\/console$/,
    requiredIAMPermissions: null,
  },
  {
    pathRegex: /^\/console\/account(\/.*)?$/,
    requiredIAMPermissions: null,
  },
  {
    pathRegex: /^\/console\/analytics(\/.*)?$/,
    requiredIAMPermissions: new Set<string>(["read:Analytics"]),
  },
  {
    pathRegex: /^\/console\/attendees(\/.*)?$/,
    requiredIAMPermissions: new Set<string>([
      "read:Attendee",
      "write:Attendee",
    ]),
  },
  {
    pathRegex: /^\/console\/settings(\/.*)?$/,
    requiredIAMPermissions: new Set<string>(["write:WebsiteConfig"]),
  },
  {
    pathRegex: /^\/console\/scan(\/.*)?$/,
    requiredIAMPermissions: new Set<string>(["write:Transaction"]),
  },
];
