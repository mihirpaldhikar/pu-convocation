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
import { Footer, InstructionsBanner, Navbar } from "@components/common";
import { getMessages } from "next-intl/server";
import { AuthController, RemoteConfigController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { cookies } from "next/headers";
import { SYSTEM_FONT } from "@fonts/system_font";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "PU Convocation",
  description:
    "Portal to manage everything related to convocation ceremonies at Parul University Convocation.",
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
  const agentCookies = await cookies();

  const translations = await getMessages({
    locale: locale,
  });

  const remoteConfig = new RemoteConfigController();
  const authController = new AuthController({
    cookies: agentCookies.toString(),
  });

  const remoteConfigResponse = await remoteConfig.getRemoteConfig();

  const isServiceOffline =
    remoteConfigResponse.statusCode === StatusCode.NETWORK_ERROR;

  if (isServiceOffline) {
    redirect("/error");
  }

  const config =
    remoteConfigResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in remoteConfigResponse &&
    typeof remoteConfigResponse.payload === "object"
      ? remoteConfigResponse.payload
      : null;

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
        className={`min-h-screen font-sans antialiased ${SYSTEM_FONT.variable}`}
      >
        <Providers
          locale={locale}
          translations={translations}
          account={account}
        >
          <div className={"flex min-h-dvh flex-col"}>
            <Navbar />
            <main className={`flex-1 pt-20`}>
              <InstructionsBanner show={config?.instructions.show ?? false} />
              {children}
            </main>
            <Toaster />
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
