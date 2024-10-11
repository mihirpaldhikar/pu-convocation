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
import { Fragment, ReactNode } from "react";
import { Toaster } from "@components/ui";
import { Providers, RemoteConfigProvider } from "@providers/index";
import { Navbar } from "@components/common";
import { ConsoleLayout } from "@components/layouts";
import { getMessages } from "next-intl/server";
import { NavMenu } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";
import { AuthController } from "@controllers/index";
import { cookies } from "next/headers";
import RemoteConfigController from "@controllers/RemoteConfigController";
import { SYSTEM_FONT } from "@root/system_font";

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

  const remoteConfigController = new RemoteConfigController({
    cookies: cookies().toString(),
  });

  const authController = new AuthController({
    cookies: cookies().toString(),
  });

  const authResponse = await authController.getCurrentAccount();
  const remoteConfigResponse = await remoteConfigController.getRemoteConfig();

  const account =
    authResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in authResponse &&
    typeof authResponse.payload === "object"
      ? authResponse.payload
      : null;

  const remoteConfig =
    remoteConfigResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in remoteConfigResponse &&
    typeof remoteConfigResponse.payload === "object"
      ? remoteConfigResponse.payload
      : null;

  return (
    <html lang={locale}>
      <body
        className={`min-h-screen bg-white font-sans antialiased ${SYSTEM_FONT.variable}`}
      >
        {account === null ? (
          <Fragment />
        ) : (
          <Providers
            locale={locale}
            translations={translations}
            account={account}
          >
            <RemoteConfigProvider remoteConfig={remoteConfig}>
              <div className={"flex h-screen flex-col"}>
                <Navbar />
                <ConsoleLayout navMenu={navMenu}>{children}</ConsoleLayout>
                <Toaster />
              </div>
            </RemoteConfigProvider>
          </Providers>
        )}
      </body>
    </html>
  );
}
