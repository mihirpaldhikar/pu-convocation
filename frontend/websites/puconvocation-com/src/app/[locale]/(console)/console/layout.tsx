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
import { ConsoleDesktop, ConsoleMobile, Navbar } from "@components/index";
import { getMessages } from "next-intl/server";
import { NavMenu } from "@dto/index";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Console | PU Convocation",
  description: "Manage everything related to the from the Console.",
};

interface RootLayout {
  children: ReactNode;
  params: { locale: string };
}

const navMenu: Array<NavMenu> = [
  {
    name: "Home",
    route: "",
    icon: "HomeIcon",
    requiredIAMRoles: new Set<string>([]),
  },
  {
    name: "Analytics",
    route: "/analytics",
    icon: "ChartBarIcon",
    requiredIAMRoles: new Set<string>(["read:Analytics"]),
  },
  {
    name: "Attendees",
    route: "/attendees",
    icon: "UsersIcon",
    requiredIAMRoles: new Set<string>(["read:Attendee", "write:Attendee"]),
  },
  {
    name: "Settings",
    route: "/settings",
    icon: "Cog6ToothIcon",
    requiredIAMRoles: new Set<string>(["write:WebsiteConfig"]),
  },
];

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
          <div className={"flex h-screen flex-col"}>
            <Navbar />
            <ConsoleDesktop navMenu={navMenu}>{children}</ConsoleDesktop>
            <ConsoleMobile navMenu={navMenu}>{children}</ConsoleMobile>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
