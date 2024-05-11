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
  const authResponse = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/accounts/`,
    {
      credentials: "same-origin",
      method: "GET",
      headers: {
        Cookie: req.cookies.toString(),
      },
    },
  );

  if (req.nextUrl.pathname.startsWith("/auth") && authResponse.status === 200) {
    const absoluteURL = new URL("/console", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (
    authResponse.status !== 200 &&
    protectedRoutes.includes(req.nextUrl.pathname)
  ) {
    const absoluteURL = new URL("/auth/signin", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
