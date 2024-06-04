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
import { Fragment, JSX, useEffect, useState } from "react";
import { AuthService } from "@services/index";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui";
import { Account } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@hooks/use-toast";
import Link from "next/link";

const authService: AuthService = new AuthService();

export default function ConsoleNavbarMenu(): JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    authService.getAccount().then((response) => {
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        setAccount(response.payload);
      }
    });
  }, []);

  if (account === null) {
    return <Fragment />;
  }

  return (
    <nav className="flex items-center space-x-5">
      <div
        className={`${account.type === "SUPER_ADMIN" || account.type === "ADMIN" ? "flex items-center space-x-2" : "hidden"}`}
      >
        <Button className={"font-medium"}>Upload</Button>
        <div className={"h-10 w-0.5 bg-foreground/10"}></div>
        <Link
          href={"/console/account/new"}
          className={
            "rounded-md border-2 border-primary px-2 py-1 font-medium text-primary"
          }
        >
          New Account
        </Link>
      </div>
      <Popover>
        <PopoverTrigger className={"flex items-center space-x-3"}>
          <h4 className={"hidden font-medium md:block"}>{account.username}</h4>
          <Image
            src={account.avatarURL}
            alt={account.displayName}
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
          <h5 className={"text-xs text-primary"}>{account.email}</h5>
          <div className={"flex flex-col items-center space-y-2"}>
            <Image
              src={account.avatarURL}
              alt={account.displayName}
              width={80}
              height={80}
              draggable={false}
              priority={true}
              fetchPriority={"high"}
              className={"rounded-full border border-border"}
            />
            <h5 className={"text-lg font-semibold"}>
              Hi, {account.displayName.split(" ")[0]}
            </h5>
          </div>
          <div className={"flex items-center space-x-3"}>
            <Button variant={"outline"}>Manage Account</Button>
            <Button
              variant={"outline"}
              onClick={async () => {
                const response = await authService.signOut();
                if (response.statusCode === StatusCode.SUCCESS) {
                  router.refresh();
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
    </nav>
  );
}
