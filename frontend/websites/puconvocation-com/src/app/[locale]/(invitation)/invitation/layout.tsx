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
import { Footer } from "@components/index";
import { getMessages } from "next-intl/server";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Invitation | PU Convocation",
  description:
    "Accept the invitation for creating an account and to continue using Convocation System.",
};

interface RootLayout {
  children: ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<RootLayout>) {
  const translations = await getMessages({
    locale: locale,
  });

  return (
    <html lang={locale}>
      <body
        className={`min-h-screen font-sans antialiased ${montserrat.variable}`}
      >
        <Providers locale={locale} translations={translations}>
          <div className={"flex min-h-dvh flex-col"}>
            <main className={`flex-1`}>{children}</main>
            <Toaster />
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
