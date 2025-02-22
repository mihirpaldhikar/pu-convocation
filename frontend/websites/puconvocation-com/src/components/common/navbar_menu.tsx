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

import { Fragment, JSX, useEffect, useState } from "react";
import { useAuth } from "@hooks/index";
import { Link, usePathname, useRouter } from "@i18n/routing";
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
import { PopoverClose } from "@radix-ui/react-popover";
import { AnalyticsController, AuthController } from "@controllers/index";
import { isAuthorized } from "@lib/iam_utils";
import IAMPolicies from "@configs/IAMPolicies";
import { formatISO } from "date-fns";
import { useLocale } from "next-intl";

const authController = new AuthController();
const analyticsController = new AnalyticsController();

export default function NavbarMenu(): JSX.Element {
  const router = useRouter();
  const currentLocale = useLocale();
  const path = usePathname();
  const { account, dispatch: dispatchAccountMutation } = useAuth();

  const [isPopupOpen, openPopup] = useState<boolean>(false);

  useEffect(() => {
    if (!path.includes("console")) {
      analyticsController
        .sendTelemetry(`${formatISO(new Date())};${currentLocale};${path}`)
        .then();
    }
  }, [currentLocale, path]);

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
              className={`${!isAuthorized(IAMPolicies.WRITE_TRANSACTIONS, account.assignedIAMPolicies) ? "hidden" : ""} rounded-full`}
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
                  <Avatar className={"size-20"}>
                    <AvatarImage src={account.avatarURL} />
                    <AvatarFallback className={"text-xl"}>
                      {account.displayName.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
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
                          await authController.signOut();
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
                    <Button asChild={true}>
                      {path.includes("console") ? (
                        <Link href={"/"}>Landing Page</Link>
                      ) : (
                        <Link href={"/console"}>Console</Link>
                      )}
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
