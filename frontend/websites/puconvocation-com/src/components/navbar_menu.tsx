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

import { JSX, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth, useToast, useWebsiteConfig } from "@hooks/index";
import { StatusCode } from "@enums/StatusCode";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function NavbarMenu(): JSX.Element {
  const router = useRouter();
  const path = usePathname();
  const { toast } = useToast();

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
      const response = await dynamicsService.getWebsiteConfig();
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
    <nav
      className={`flex items-center space-x-5 rounded-xl bg-white px-5 py-3`}
    >
      <Link
        href={"/authenticate"}
        className={`${!path.includes("/authenticate") && !path.includes("/console") && account === null ? "flex" : "hidden"} items-center rounded-2xl bg-black px-4 py-2 text-white`}
      >
        <UserCircleIcon className={"mr-2 size-5"} />
        <span className="mr-2">Login</span>
      </Link>
      <div
        className={`${account !== null && account?.privileges.includes("createNewAccounts") ? "flex" : "hidden"} items-center space-x-2`}
      >
        <Popover
          open={isPopupOpen}
          defaultOpen={false}
          onOpenChange={openPopup}
        >
          <PopoverTrigger className={"flex items-center space-x-3"}>
            <h4 className={"hidden font-medium md:block"}>
              {account?.username}
            </h4>
            <Image
              src={
                account?.avatarURL ??
                "https://assets.puconvocation.com/avatars/default.png"
              }
              alt={account?.displayName ?? "Loading.."}
              width={40}
              height={40}
              draggable={false}
              priority={true}
              fetchPriority={"high"}
              className={"rounded-full border border-border"}
            />
          </PopoverTrigger>
          <PopoverContent
            className={"flex flex-col items-center space-y-3 rounded-md"}
          >
            <h5 className={"text-xs text-primary"}>{account?.email}</h5>
            <div className={"flex flex-col items-center space-y-2"}>
              <Image
                src={
                  account?.avatarURL ??
                  "https://assets.puconvocation.com/avatars/default.png"
                }
                alt={account?.displayName ?? "Loading.."}
                width={80}
                height={80}
                draggable={false}
                priority={true}
                fetchPriority={"high"}
                className={"rounded-full border border-border"}
              />
              <h5 className={"text-lg font-semibold"}>
                Hi, {account?.displayName.split(" ")[0]}
              </h5>
            </div>
            <div className={"flex items-center space-x-3"}>
              <Link
                href={"/console/account"}
                onClick={() => {
                  openPopup(false);
                }}
              >
                <Button variant={"outline"}>Manage Account</Button>
              </Link>
              <Button
                variant={"outline"}
                onClick={async () => {
                  openPopup(false);
                  const response = await authService.signOut();
                  if (response.statusCode === StatusCode.SUCCESS) {
                    dispatchAccountMutation({
                      type: "SIGN_OUT",
                      payload: {
                        account: null,
                      },
                    });
                    router.replace("/authenticate");
                  } else {
                    toast({
                      title: "Error",
                      description: "An error occurred.",
                      duration: 5000,
                    });
                  }
                }}
              >
                Sign Out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
