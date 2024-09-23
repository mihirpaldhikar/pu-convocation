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

"use client";
import { JSX, ReactNode } from "react";
import * as Icons from "@heroicons/react/24/solid";
import { Link, usePathname } from "@i18n/routing";
import { DynamicIcon } from "@components/index";

interface ConsoleDesktopProps {
  children: ReactNode;
  navMenu: Array<{
    name: string;
    route: string;
    icon: keyof typeof Icons;
  }>;
}

export default function ConsoleMobile({
  children,
  navMenu,
}: ConsoleDesktopProps): JSX.Element {
  const path = usePathname();

  return (
    <div className={`flex flex-1 flex-col pt-20 lg:hidden`}>
      <main
        className={`mb-20 ml-0 flex-1 bg-zinc-50 transition-all duration-150 ease-in-out`}
      >
        {children}
      </main>
      <nav
        className={
          "fixed bottom-0 flex h-20 w-full flex-row items-center justify-evenly border-t bg-white"
        }
      >
        {navMenu.map((menu) => (
          <Link
            key={menu.name}
            href={`/console${menu.route}`}
            className={`cursor-pointer rounded-tr-full ${
              path === `/console${menu.route}`
                ? "bg-red-200"
                : "bg-transparent hover:bg-gray-100"
            } flex space-x-4 rounded-full p-3 transition-all duration-150 ease-in-out`}
          >
            <DynamicIcon
              icon={menu.icon}
              outline={!(path === `/console${menu.route}`)}
              className={
                path === `/console${menu.route}`
                  ? "size-6 text-red-700"
                  : "size-6 text-black"
              }
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}
