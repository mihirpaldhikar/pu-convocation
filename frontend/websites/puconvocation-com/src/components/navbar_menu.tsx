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

import { Fragment, JSX, useState } from "react";
import { useAuth, useWebsiteConfig } from "@hooks/index";
import { StatusCode } from "@enums/StatusCode";
import { useQuery } from "@tanstack/react-query";
import { Link, usePathname, useRouter } from "@i18n/routing";
import { useLocale } from "next-intl";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui";
import { QrCodeIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { PopoverClose } from "@radix-ui/react-popover";

export default function NavbarMenu(): JSX.Element {
  const router = useRouter();
  const path = usePathname();
  const currentLocale = useLocale();

  const {
    state: { account, authService },
    dispatch: dispatchAccountMutation,
  } = useAuth();

  const {
    state: { dynamicsService },
    dispatch: dispatchConfigMutation,
  } = useWebsiteConfig();

  const [isPopupOpen, openPopup] = useState<boolean>(false);

  useQuery({
    queryKey: ["websiteConfig"],
    refetchOnWindowFocus: "always",
    queryFn: async () => {
      const response = await dynamicsService.getWebsiteConfig(
        `${Date.now()};${currentLocale};${path}`,
      );
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        dispatchConfigMutation({
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

  const { isLoading: isAccountLoading, isError: isAccountError } = useQuery({
    queryKey: ["currentAccount"],
    refetchOnWindowFocus: "always",
    queryFn: async () => {
      const response = await authService.getCurrentAccount();
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        dispatchAccountMutation({
          type: "SET_ACCOUNT",
          payload: {
            account: response.payload,
          },
        });
        return response.payload;
      }
      return null;
    },
  });

  if (isAccountLoading || isAccountError) {
    return (
      <nav
        className={`flex items-center space-x-5 rounded-xl bg-white px-5 py-3`}
      >
        <div role="status" className="max-w-sm animate-pulse">
          <div className="h-10 w-28 rounded-lg bg-gray-300 dark:bg-gray-700"></div>
          <span className="sr-only">Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className={"flex items-center justify-center space-x-5"}>
      {account == null && !path.includes("authenticate") ? (
        <Fragment>
          <Button asChild={true} size={"lg"}>
            <Link href={"/authenticate"}>
              <UserCircleIcon className={"mr-3 size-5"} /> Login
            </Link>
          </Button>
        </Fragment>
      ) : (
        account !== null && (
          <Fragment>
            <Button
              asChild={true}
              className={`${!account.iamRoles.includes("write:Transaction") ? "hidden" : ""} rounded-full`}
            >
              <Link href={"/console/scan"}>
                <QrCodeIcon className={"mr-3 size-5"} />
                <span>Scan</span>
              </Link>
            </Button>
            <Popover
              open={isPopupOpen}
              onOpenChange={(open) => {
                openPopup(open);
              }}
            >
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src={account.avatarURL} />
                  <AvatarFallback>
                    {account.displayName.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent
                sideOffset={5}
                className={"mr-5 space-y-5 rounded-xl shadow-sm md:mr-10"}
              >
                <div
                  className={
                    "flex flex-col items-center justify-center space-y-3"
                  }
                >
                  <Image
                    src={account.avatarURL}
                    alt={account.displayName}
                    height={50}
                    width={50}
                    fetchPriority={"high"}
                    className={"h-auto w-auto rounded-full"}
                  />
                  <h5 className={"font-semibold"}>
                    Hello, {account.designation}{" "}
                    {account.displayName.split(" ")[0]}
                  </h5>
                  <span
                    className={
                      "block rounded-full bg-secondary px-2 py-1 text-xs"
                    }
                  >
                    {account.email}
                  </span>
                </div>
                <div className={"flex flex-col space-y-3"}>
                  <div
                    className={
                      "flex flex-row items-center justify-evenly gap-4"
                    }
                  >
                    <PopoverClose asChild={true}>
                      <Button
                        asChild={true}
                        variant={"outline"}
                        className={"flex-grow"}
                      >
                        <Link href={"/console/account"}>Account</Link>
                      </Button>
                    </PopoverClose>
                    <PopoverClose asChild={true}>
                      <Button
                        variant={"outline"}
                        className={"flex-grow"}
                        onClick={async () => {
                          await authService.signOut();
                          dispatchAccountMutation({
                            type: "SIGN_OUT",
                          });
                          router.replace(
                            path.includes("console") ? "/authenticate" : path,
                          );
                        }}
                      >
                        Sign Out
                      </Button>
                    </PopoverClose>
                  </div>
                  <PopoverClose asChild={true}>
                    <Button
                      asChild={true}
                      className={`${path.includes("console") ? "hidden" : ""}`}
                    >
                      <Link href={"/console"}>Console</Link>
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          </Fragment>
        )
      )}
    </nav>
  );
}
