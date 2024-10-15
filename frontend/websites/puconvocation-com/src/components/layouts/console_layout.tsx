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
import { Fragment, JSX, ReactNode, useState } from "react";
import { Button } from "@components/ui";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Link, usePathname } from "@i18n/routing";
import { DynamicIcon } from "@components/graphics";
import { NavMenu } from "@dto/index";
import { useAuth } from "@hooks/index";

interface ConsoleLayoutProps {
  children: ReactNode;
  navMenu: Array<NavMenu>;
}

export default function ConsoleLayout({
  children,
  navMenu,
}: ConsoleLayoutProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const path = usePathname();
  const { account } = useAuth();

  if (account === null) return <Fragment />;

  const accountIamRoles = new Set<string>(account?.iamRoles ?? []);

  return (
    <div className={`flex-1 pt-20 lg:flex`}>
      <aside
        className={`${collapsed ? "w-20" : "w-72"} fixed left-0 top-0 z-40 hidden h-dvh flex-col bg-white pb-10 pt-20 transition-all duration-150 ease-in-out lg:flex`}
      >
        <nav
          className={`flex grow flex-col pt-20 ${collapsed ? "items-center" : "pr-10"} space-y-5`}
        >
          {navMenu.map((menu) => {
            const isChildPathMatched = menu.childRoutes
              .map((route) => `/console${menu.route}${route}`)
              .includes(path);

            return (
              <Link
                key={menu.name}
                href={`/console${menu.route}`}
                className={`cursor-pointer rounded-tr-full ${
                  path === `/console${menu.route}` || isChildPathMatched
                    ? "bg-red-100"
                    : "bg-transparent hover:bg-gray-100"
                } ${collapsed ? "rounded-full p-3" : "rounded-br-full py-3 pl-5"} ${menu.requiredIAMRoles.intersection(accountIamRoles).size > 0 || menu.requiredIAMRoles.size === 0 ? "flex" : "hidden"} space-x-4 transition-all duration-150 ease-in-out`}
              >
                <DynamicIcon
                  icon={menu.icon}
                  outline={
                    !(path === `/console${menu.route}` || isChildPathMatched)
                  }
                  className={
                    path === `/console${menu.route}` ||
                    path === `/console${menu.route}` ||
                    isChildPathMatched
                      ? "text-red-700"
                      : "text-black"
                  }
                />
                <span
                  className={`${collapsed ? "hidden" : "font-semibold"} transition-all duration-150 ease-in-out ${
                    path === `/console${menu.route}` || isChildPathMatched
                      ? "text-red-700"
                      : "text-black"
                  }`}
                >
                  {menu.name}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex h-10 items-center justify-start pl-5">
          <Button
            variant={"secondary"}
            size={"icon"}
            className={"rounded-full"}
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            <ChevronRightIcon
              className={`size-5 ${collapsed ? "rotate-0" : "rotate-180"} transition-all duration-300`}
            />
          </Button>
        </div>
      </aside>
      <main
        className={`ml-0 flex-1 ${collapsed ? "lg:ml-20" : "lg:ml-72"} mb-20 bg-neutral-100 transition-all duration-150 ease-in-out lg:mb-0 lg:rounded-tl-3xl`}
      >
        {children}
      </main>
      <nav
        className={
          "fixed bottom-0 z-50 flex h-20 w-full flex-row items-center justify-evenly bg-white lg:hidden"
        }
      >
        {navMenu.map((menu) => {
          const isChildPathMatched = menu.childRoutes
            .map((route) => `/console${menu.route}${route}`)
            .includes(path);
          return (
            <Link
              key={menu.name}
              href={`/console${menu.route}`}
              className={`cursor-pointer rounded-tr-full ${
                path === `/console${menu.route}` || isChildPathMatched
                  ? "bg-red-100"
                  : "bg-transparent hover:bg-gray-100"
              } ${menu.requiredIAMRoles.intersection(accountIamRoles).size > 0 || menu.requiredIAMRoles.size === 0 ? "flex" : "hidden"} space-x-4 rounded-full p-3 transition-all duration-150 ease-in-out`}
            >
              <DynamicIcon
                icon={menu.icon}
                outline={
                  !(path === `/console${menu.route}` || isChildPathMatched)
                }
                className={
                  path === `/console${menu.route}` || isChildPathMatched
                    ? "size-6 text-red-700"
                    : "size-6 text-black"
                }
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}