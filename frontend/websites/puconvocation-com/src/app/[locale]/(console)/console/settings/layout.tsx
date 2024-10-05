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
"use client";
import { JSX, ReactNode } from "react";
import { Link, usePathname } from "@i18n/routing";

interface SettingsLayoutProps {
  children: ReactNode;
}

const tabs: Array<{
  name: string;
  route: string;
}> = [
  {
    name: "General",
    route: "",
  },
  {
    name: "Ground",
    route: "/ground",
  },
  {
    name: "Instructions",
    route: "/instructions",
  },
];

export default function SettingsLayout({
  children,
}: SettingsLayoutProps): JSX.Element {
  const path = usePathname();

  return (
    <div className={"px-5 py-5"}>
      <div
        className={
          "flex w-full items-center justify-evenly rounded-xl border bg-white p-1 space-x-4"
        }
      >
        {tabs.map((tab) => {
          return (
            <Link
              key={tab.name}
              href={`/console/settings${tab.route}`}
              className={`${path === `/console/settings${tab.route}` ? "bg-red-100 text-red-800" : "text-gray-500 hover:bg-gray-200"} transition-all duration-200 w-full rounded-lg flex items-center justify-center p-1 font-semibold`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
      <div className={"pt-5"}>{children}</div>
    </div>
  );
}
