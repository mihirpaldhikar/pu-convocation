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

const authService: AuthService = new AuthService();

export default function ConsoleNavbarMenu(): JSX.Element {
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
      <Button>Upload</Button>
      <div className={"h-10 bg-foreground/20 w-0.5"}></div>
      <Popover>
        <PopoverTrigger className={"flex items-center space-x-3"}>
          <h4 className={"hidden md:block font-medium"}>{account.username}</h4>
          <Image
            src={account.avatarURL}
            alt={account.displayName}
            width={40}
            height={40}
            className={"rounded-full border border-border"}
          />
        </PopoverTrigger>
        <PopoverContent
          className={"rounded-md flex flex-col space-y-3 items-center"}
        >
          <h5 className={"text-xs text-primary"}>{account.email}</h5>
          <div className={"flex flex-col items-center space-y-2"}>
            <Image
              src={account.avatarURL}
              alt={account.displayName}
              width={80}
              height={80}
              className={"rounded-full border border-border"}
            />
            <h5 className={"font-semibold text-lg"}>
              Hi, {account.displayName.split(" ")[0]}
            </h5>
          </div>
          <div className={"flex items-center space-x-3"}>
            <Button variant={"outline"}>Manage Account</Button>
            <Button variant={"outline"}>Sign Out</Button>
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
}
