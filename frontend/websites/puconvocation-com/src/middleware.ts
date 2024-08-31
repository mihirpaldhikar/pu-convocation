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

import { NextRequest, NextResponse } from "next/server";

const protectedRoutes: Array<string> = ["/console"];

export default async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname;

  if (pathName.includes("_next") || pathName.includes("/favicon.ico")) {
    return;
  }

  if (
    pathName.includes("/authenticate") ||
    pathName.includes(protectedRoutes.join(" | "))
  ) {
    const authenticationResponse = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/accounts/`,
      {
        credentials: "same-origin",
        method: "GET",
        headers: {
          Cookie: req.cookies.toString(),
        },
        next: {
          revalidate: 1800,
        },
      },
    );

    if (
      authenticationResponse.status !== 200 &&
      !pathName.includes("/authenticate")
    ) {
      const absoluteURL = new URL("/authenticate", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }

    if (
      authenticationResponse.status === 200 &&
      pathName.includes("/authenticate")
    ) {
      const absoluteURL = new URL("/console", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
  }
}
