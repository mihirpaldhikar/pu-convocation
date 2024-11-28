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
import { parseCookie } from "@lib/cookie_utils";
import { isAuthorized } from "@lib/iam_utils";

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
  try {
    const pathName = req.nextUrl.pathname.substring(3);
    const response = i18nMiddleware(req);

    const matchedProtectedRoute = matchPath(pathName, PROTECTED_ROUTES);

    let authCookies = null;

    if (matchedProtectedRoute !== null || pathName.includes("/authenticate")) {
      const authenticationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/accounts/`,
        {
          credentials: "same-origin",
          method: "GET",
          headers: {
            Cookie: req.cookies.toString(),
          },
        },
      );

      authCookies = authenticationResponse.headers.get("set-cookie");

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

        if (
          matchedProtectedRoute !== null &&
          matchedProtectedRoute.requiredIAMPolicy !== null &&
          !isAuthorized(
            matchedProtectedRoute.requiredIAMPolicy,
            account.assignedIAMPolicies,
          )
        ) {
          const absoluteURL = new URL("/console", req.nextUrl.origin);
          return NextResponse.redirect(absoluteURL.toString());
        }
      }
    }

    if (authCookies !== null) {
      const split = authCookies.split(", __");
      const authorizationTokenCookie = parseCookie(split[0]);
      const refreshTokenCookie = parseCookie("__".concat(split[1]));
      response.cookies
        .set(authorizationTokenCookie.name, authorizationTokenCookie.value, {
          ...authorizationTokenCookie.options,
        })
        .set(refreshTokenCookie.name, refreshTokenCookie.value, {
          ...refreshTokenCookie.options,
        });
    }

    return response;
  } catch {
    const absoluteURL = new URL("/error", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)"],
};
