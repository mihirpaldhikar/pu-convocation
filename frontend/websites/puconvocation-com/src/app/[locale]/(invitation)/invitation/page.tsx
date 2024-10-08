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

import { JSX } from "react";
import { InvitationFrom } from "@components/forms";
import { LanguageSelector, SpaceShip } from "@components/index";
import { getTranslations } from "next-intl/server";
import { Link } from "@i18n/routing";

export default async function InvitationPage({
  searchParams,
}: {
  searchParams: { invitationToken: string };
}): Promise<JSX.Element> {
  const coreTranslations = await getTranslations("core");

  if (
    searchParams.invitationToken === null ||
    searchParams.invitationToken === undefined ||
    searchParams.invitationToken === ""
  ) {
    return (
      <div className="flex h-fit items-center">
        <div className="m-auto space-y-3 text-center">
          <div className={"flex w-full items-center justify-center"}>
            <SpaceShip />
          </div>
          <h3 className={"text-2xl font-bold text-gray-800"}>
            Invitation Token is Missing!
          </h3>
          <p className={"pb-4 text-gray-600"}>
            The token required for creating an account is missing. Please check
            the URL.
          </p>
          <Link
            href={"/"}
            className={"rounded-full bg-gray-900 px-5 py-2 text-white"}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className={"flex min-h-screen w-full"}>
      <div className="m-auto flex h-fit w-full flex-col items-center justify-center space-y-5 px-5 lg:px-0">
        <InvitationFrom invitationToken={searchParams.invitationToken} />
        <LanguageSelector />
        <div className={"text-center"}>
          <p className={"text-xs text-gray-500"}>
            &copy; {new Date().getFullYear()} {coreTranslations("copyright")}
          </p>
        </div>
      </div>
    </section>
  );
}
