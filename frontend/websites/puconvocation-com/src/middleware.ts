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

function parseCookie(cookieArray: string[]): Record<string, string> {
  const cookieObject: Record<string, string> = {};

  for (const cookieString of cookieArray) {
    const [key, ...valueParts] = cookieString.split("=");
    const value = valueParts.join("=");

    if (key.toLowerCase() !== "httponly") {
      cookieObject[key] = value;
    }
  }

  return cookieObject;
}

export default async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.includes("/authenticate") ||
    req.nextUrl.pathname.includes("/console")
  ) {
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

    if (
      req.nextUrl.pathname.startsWith("/authenticate") &&
      authenticationResponse.status === 200
    ) {
      const absoluteURL = new URL("/console", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }

    if (
      authenticationResponse.status !== 200 &&
      protectedRoutes.includes(req.nextUrl.pathname)
    ) {
      if (
        authenticationResponse.status === 403 &&
        protectedRoutes.includes(req.nextUrl.pathname)
      ) {
        const absoluteURL = new URL("/authenticate", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
      }

      if (req.cookies.has("__puc_rt__") && !req.cookies.has("__puc_at__")) {
        const refreshSecurityTokenResponse = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/accounts/refresh`,
          {
            credentials: "same-origin",
            method: "POST",
            headers: {
              Cookie: req.cookies.toString(),
            },
          },
        );

        if (refreshSecurityTokenResponse.status !== 200) {
          const absoluteURL = new URL("/authenticate", req.nextUrl.origin);
          return NextResponse.redirect(absoluteURL.toString());
        }

        const cookies = refreshSecurityTokenResponse.headers
          .getSetCookie()
          .toString()
          .split(", __");

        const nextResponse = NextResponse.next();

        const authorizationTokenCookie = parseCookie(cookies[0].split(";"));
        const refreshTokenCookie = parseCookie(cookies[1].split(";"));

        nextResponse.cookies
          .set("__puc_at__", authorizationTokenCookie["__puc_at__"], {
            expires: Date.now() + 3600000,
            domain: authorizationTokenCookie["Domain"],
            path: authorizationTokenCookie["Path"],
            sameSite: "lax",
            httpOnly: true,
          })
          .set("__puc_rt__", refreshTokenCookie["puc_rt__"], {
            expires: Date.now() + 2629800000,
            domain: refreshTokenCookie["Domain"],
            path: refreshTokenCookie["Path"],
            sameSite: "lax",
            httpOnly: true,
          });

        return nextResponse;
      } else {
        const absoluteURL = new URL("/authenticate", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
      }
    }
  } else {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", req.nextUrl.pathname);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}
