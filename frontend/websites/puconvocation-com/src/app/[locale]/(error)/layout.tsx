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
import { SYSTEM_FONT } from "@fonts/system_font";

export const metadata: Metadata = {
  title: "Internal Server Error",
  description: "An Error Occurred While fulfilling your request.",
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

  return (
    <html lang={locale}>
      <body
        className={`min-h-screen bg-neutral-100 font-sans antialiased ${SYSTEM_FONT.variable}`}
      >
        <div className={"flex h-screen flex-col"}>
          <main className={`flex-1`}>{children}</main>
        </div>
      </body>
    </html>
  );
}
