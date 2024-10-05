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
import { useRemoteConfig } from "@hooks/index";
import { useQuery } from "@tanstack/react-query";
import { StatusCode } from "@enums/StatusCode";

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
  const { state, dispatch: dispatchRemoteConfig } = useRemoteConfig();

  useQuery({
    queryKey: ["remoteConfig"],
    queryFn: async () => {
      const response = await state.remoteConfigController.getRemoteConfig();
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        dispatchRemoteConfig({
          type: "SET_CONFIG",
          payload: {
            config: response.payload,
          },
        });
        return response.payload;
      }
      return null;
    },
  });

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.config === null) {
    return <div>Err</div>;
  }

  return (
    <div className={"px-5 py-5"}>
      <div
        className={
          "flex w-full items-center justify-evenly space-x-4 rounded-xl border bg-white p-1"
        }
      >
        {tabs.map((tab) => {
          return (
            <Link
              key={tab.name}
              href={`/console/settings${tab.route}`}
              className={`${path === `/console/settings${tab.route}` ? "bg-red-100 text-red-800" : "text-gray-500 hover:bg-gray-200"} flex w-full items-center justify-center rounded-lg p-1 font-semibold transition-all duration-200`}
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
