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

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "@components/ui";
import { Providers } from "@providers/index";
import { Footer, Navbar } from "@components/index";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PU Convocation",
  description:
    "Portal to manage everything related to convocation ceremonies at Parul University Convocation.",
};

interface RootLayout {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayout>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen font-sans antialiased ${montserrat.variable}`}
      >
        <Providers>
          <div className={"flex min-h-dvh flex-col"}>
            <Navbar />
            <main className={`flex-1 pt-20`}>{children}</main>
            <Toaster />
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
