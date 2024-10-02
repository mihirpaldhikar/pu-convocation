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

import { NextRequest, NextResponse } from "next/server";
import { routing } from "@i18n/routing";
import createMiddleware from "next-intl/middleware";
import { Account } from "@dto/index";

const i18nMiddleware = createMiddleware(routing);

const BASE_PROTECTED_ROUTE = "/console";

const protectedRoutes: Array<{
  path: string;
  requiredIAMRoles: Set<string>;
}> = [
  {
    path: "",
    requiredIAMRoles: new Set<string>([]),
  },
  {
    path: "/account",
    requiredIAMRoles: new Set<string>([]),
  },
  {
    path: "/account/new",
    requiredIAMRoles: new Set<string>(["write:Account"]),
  },
  {
    path: "/analytics",
    requiredIAMRoles: new Set<string>(["read:Analytics"]),
  },
  {
    path: "/attendees",
    requiredIAMRoles: new Set<string>(["read:Attendee", "write:Attendee"]),
  },
  {
    path: "/settings",
    requiredIAMRoles: new Set<string>(["write:WebsiteConfig"]),
  },
  {
    path: "/scan",
    requiredIAMRoles: new Set<string>(["write:Transaction"]),
  },
];

const protectedPath = protectedRoutes.map(
  (route) => `${BASE_PROTECTED_ROUTE}${route.path}`,
);

export default async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname.substring(3);
  const response = i18nMiddleware(req);

  if (pathName.includes("_next") || pathName.includes("/favicon.ico")) {
    return;
  }

  if (pathName.includes("/authenticate") || protectedPath.includes(pathName)) {
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
      const absoluteURL = new URL(
        `/authenticate?redirect=${req.nextUrl.href}`,
        req.nextUrl.origin,
      );
      return NextResponse.redirect(absoluteURL.toString());
    }

    if (
      authenticationResponse.status === 200 &&
      pathName.includes("/authenticate")
    ) {
      const absoluteURL = new URL(BASE_PROTECTED_ROUTE, req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
    if (authenticationResponse.status === 200) {
      const account = (await authenticationResponse.json()) as Account;
      const associatedRoles = new Set<string>(account.iamRoles);

      const route = protectedRoutes[protectedPath.indexOf(pathName)];

      if (
        route !== undefined &&
        route.requiredIAMRoles.intersection(associatedRoles).size === 0 &&
        route.requiredIAMRoles.size !== 0
      ) {
        const absoluteURL = new URL(BASE_PROTECTED_ROUTE, req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
