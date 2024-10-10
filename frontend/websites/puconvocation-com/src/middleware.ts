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
import { Account, ProtectedRoute } from "@dto/index";
import { PROTECTED_ROUTES } from "./protected_routes";

const i18nMiddleware = createMiddleware(routing);

function matchPath(
  currentPath: string,
  protectedRoutes: Array<ProtectedRoute>,
): ProtectedRoute | null {
  for (let i = 0; i < protectedRoutes.length; i++) {
    if (protectedRoutes[i].pathRegex.test(currentPath)) {
      return protectedRoutes[i];
    }
  }
  return null;
}

export default async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname.substring(3);
  const response = i18nMiddleware(req);

  if (/^\/(_next\/.*|favicon\.ico)$/.test(pathName)) {
    return;
  }

  const matchedProtectedRoute = matchPath(pathName, PROTECTED_ROUTES);

  if (matchedProtectedRoute !== null || pathName.includes("/authenticate")) {
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
        `/authenticate?redirect=${req.nextUrl.pathname}`,
        req.nextUrl.origin,
      );
      return NextResponse.redirect(absoluteURL.toString());
    }

    if (authenticationResponse.status === 200) {
      if (pathName.includes("/authenticate")) {
        const absoluteURL = new URL("/console", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
      }

      const account = (await authenticationResponse.json()) as Account;
      const associatedRoles = new Set<string>(account.iamRoles);

      if (
        matchedProtectedRoute !== null &&
        matchedProtectedRoute.requiredIAMPermissions !== null &&
        matchedProtectedRoute.requiredIAMPermissions.intersection(
          associatedRoles,
        ).size === 0
      ) {
        const absoluteURL = new URL("/console", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
