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

import {Fragment, JSX} from "react";

export default function InvitationPage({
  searchParams,
}: {
  searchParams: { invitationToken: string };
}): JSX.Element {
  if (
    searchParams.invitationToken === null ||
    searchParams.invitationToken === undefined ||
    searchParams.invitationToken === ""
  ) {
    return <Fragment>Invitation Token is missing.</Fragment>;
  }

  return <Fragment>Hello World!</Fragment>;
}
