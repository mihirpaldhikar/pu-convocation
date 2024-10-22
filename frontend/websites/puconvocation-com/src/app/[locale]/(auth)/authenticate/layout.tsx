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

import type { Metadata } from "next";
import "@app/globals.css";
import { ReactNode } from "react";
import { Toaster } from "@components/ui";
import { Providers } from "@providers/index";
import { getMessages } from "next-intl/server";
import { AuthController } from "@controllers/index";
import { cookies } from "next/headers";
import { StatusCode } from "@enums/StatusCode";
import { SYSTEM_FONT } from "@fonts/system_font";

export const metadata: Metadata = {
  title: "Authenticate | PU Convocation",
  description: "Authenticate into Parul University Convocation System.",
};

interface RootLayout {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayout>) {
  const { locale } = await params;
  const agentCookies = await cookies()

  const translations = await getMessages({
    locale: locale,
  });

  const authController = new AuthController({
    cookies: agentCookies.toString(),
  });

  const authResponse = await authController.getCurrentAccount();

  const account =
    authResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in authResponse &&
    typeof authResponse.payload === "object"
      ? authResponse.payload
      : null;

  return (
    <html lang={locale}>
      <body
        className={`min-h-screen bg-neutral-100 font-sans antialiased ${SYSTEM_FONT.variable}`}
      >
        <Providers
          locale={locale}
          translations={translations}
          account={account}
        >
          <div className={"flex h-screen flex-col"}>
            <main className={`flex-1`}>{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
