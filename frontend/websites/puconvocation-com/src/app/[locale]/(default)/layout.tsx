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
import { Montserrat } from "next/font/google";
import "@root/globals.css";
import { ReactNode } from "react";
import { Toaster } from "@components/ui";
import { Providers } from "@providers/index";
import { Footer, InstructionsBanner, Navbar } from "@components/index";
import { getMessages } from "next-intl/server";
import { RemoteConfigController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PU Convocation",
  description:
    "Portal to manage everything related to convocation ceremonies at Parul University Convocation.",
};

interface RootLayout {
  children: ReactNode;
  params: { locale: string };
}

const remoteConfig = new RemoteConfigController();

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<RootLayout>) {
  const translations = await getMessages({
    locale: locale,
  });

  const response = await remoteConfig.getRemoteConfig();

  const config =
    response.statusCode === StatusCode.SUCCESS &&
    "payload" in response &&
    typeof response.payload === "object"
      ? response.payload
      : null;

  return (
    <html lang={locale}>
      <body
        className={`min-h-screen font-sans antialiased ${montserrat.variable}`}
      >
        <Providers locale={locale} translations={translations}>
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
