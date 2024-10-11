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
import { Providers, RemoteConfigProvider } from "@providers/index";
import { Navbar } from "@components/common";
import { ConsoleLayout } from "@components/layouts";
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
    childRoutes: [],
    icon: "HomeIcon",
    requiredIAMRoles: new Set<string>([]),
  },
  {
    name: "Analytics",
    route: "/analytics",
    childRoutes: [],
    icon: "ChartBarIcon",
    requiredIAMRoles: new Set<string>(["read:Analytics"]),
  },
  {
    name: "Attendees",
    route: "/attendees",
    childRoutes: [],
    icon: "UsersIcon",
    requiredIAMRoles: new Set<string>(["read:Attendee", "write:Attendee"]),
  },
  {
    name: "Settings",
    route: "/settings",
    childRoutes: ["/ground", "/instructions"],
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
        className={`min-h-screen bg-white font-sans antialiased ${montserrat.variable}`}
      >
        <Providers locale={locale} translations={translations}>
          <RemoteConfigProvider>
            <div className={"flex h-screen flex-col"}>
              <Navbar />
              <ConsoleLayout navMenu={navMenu}>{children}</ConsoleLayout>
              <Toaster />
            </div>
          </RemoteConfigProvider>
        </Providers>
      </body>
    </html>
  );
}
