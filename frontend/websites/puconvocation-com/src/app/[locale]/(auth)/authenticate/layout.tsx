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
import { Toaster, TooltipProvider } from "@components/ui";
import { getMessages } from "next-intl/server";
import { SYSTEM_FONT } from "@fonts/system_font";
import { NextIntlClientProvider } from "next-intl";

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
  const translations = await getMessages({
    locale: locale,
  });

  return (
    <html lang={locale}>
      <body
        className={`min-h-screen bg-neutral-100 font-sans antialiased ${SYSTEM_FONT.variable}`}
      >
        <NextIntlClientProvider
          messages={translations}
          locale={locale}
          timeZone={"Asia/Kolkata"}
        >
          <TooltipProvider>
            <div className={"flex h-screen flex-col"}>
              <main className={`flex-1`}>{children}</main>
              <Toaster />
            </div>
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
