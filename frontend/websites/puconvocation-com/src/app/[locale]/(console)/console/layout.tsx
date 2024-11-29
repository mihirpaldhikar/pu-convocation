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
import { Toaster, TooltipProvider } from "@components/ui";
import { Providers, RemoteConfigProvider } from "@providers/index";
import { Navbar } from "@components/common";
import { ConsoleLayout } from "@components/layouts";
import { getMessages } from "next-intl/server";
import { NavMenu } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";
import { AuthController } from "@controllers/index";
import { cookies } from "next/headers";
import RemoteConfigController from "@controllers/RemoteConfigController";
import { SYSTEM_FONT } from "@fonts/system_font";
import { redirect } from "next/navigation";
import {
  AcademicCapIcon as S_AcademicCapIcon,
  ChartBarIcon as S_ChartBarIcon,
  Cog6ToothIcon as S_Cog6ToothIcon,
  HomeIcon as S_HomeIcon,
  UsersIcon as S_UsersIcon,
} from "@heroicons/react/24/solid";
import {
  AcademicCapIcon as O_AcademicCapIcon,
  ChartBarIcon as O_ChartBarIcon,
  Cog6ToothIcon as O_Cog6ToothIcon,
  HomeIcon as O_HomeIcon,
  UsersIcon as O_UsersIcon,
} from "@heroicons/react/24/outline";
import IAMPolicies from "@configs/IAMPolicies";

export const metadata: Metadata = {
  title: "Console | PU Convocation",
  description: "Manage everything related to the from the Console.",
};

interface RootLayout {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

const navMenu: Array<NavMenu> = [
  {
    name: "Home",
    pathRegex: "^/console$",
    route: "",
    childRoutes: [],
    icon: <O_HomeIcon />,
    activeIcon: <S_HomeIcon />,
    requiredIAMPolicy: null,
  },
  {
    name: "Analytics",
    pathRegex: "^/console/analytics(/.*)?$",
    route: "/analytics",
    childRoutes: [],
    icon: <O_ChartBarIcon />,
    activeIcon: <S_ChartBarIcon />,
    requiredIAMPolicy: IAMPolicies.READ_ANALYTICS,
  },
  {
    name: "Attendees",
    pathRegex: "^/console/attendees(/.*)?$",
    route: "/attendees",
    childRoutes: [],
    icon: <O_AcademicCapIcon />,
    activeIcon: <S_AcademicCapIcon />,
    requiredIAMPolicy: IAMPolicies.READ_ATTENDEES,
  },
  {
    name: "Account Manager",
    pathRegex: "^/console/account/manager(/.*)?$",
    route: "/account/manager",
    childRoutes: [],
    icon: <O_UsersIcon />,
    activeIcon: <S_UsersIcon />,
    requiredIAMPolicy: IAMPolicies.READ_ACCOUNTS,
  },
  {
    name: "Settings",
    pathRegex: "^/console/settings(/.*)?$",
    route: "/settings",
    childRoutes: ["/ground", "/instructions"],
    icon: <O_Cog6ToothIcon />,
    activeIcon: <S_Cog6ToothIcon />,
    requiredIAMPolicy: IAMPolicies.READ_REMOTE_CONFIG,
  },
];

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayout>) {
  const { locale } = await params;
  const agentCookies = await cookies();

  const translations = await getMessages({
    locale: locale,
  });

  const remoteConfigController = new RemoteConfigController({
    cookies: agentCookies.toString(),
  });

  const authController = new AuthController({
    cookies: agentCookies.toString(),
  });

  const authResponse = await authController.getCurrentAccount();
  const remoteConfigResponse = await remoteConfigController.getRemoteConfig();

  const isServiceOffline =
    remoteConfigResponse.statusCode === StatusCode.NETWORK_ERROR;

  if (isServiceOffline) {
    redirect("/error");
  }

  const account =
    authResponse.statusCode === StatusCode.SUCCESS
      ? authResponse.payload
      : null;

  const remoteConfig =
    remoteConfigResponse.statusCode === StatusCode.SUCCESS
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
              <TooltipProvider>
                <div className={"flex h-screen flex-col"}>
                  <Navbar />
                  <ConsoleLayout
                    sidebarCollapsed={
                      agentCookies.get("sidebarCollapsed")?.value === "true"
                    }
                    navMenu={navMenu}
                  >
                    {children}
                  </ConsoleLayout>
                  <Toaster />
                </div>
              </TooltipProvider>
            </RemoteConfigProvider>
          </Providers>
        )}
      </body>
    </html>
  );
}
