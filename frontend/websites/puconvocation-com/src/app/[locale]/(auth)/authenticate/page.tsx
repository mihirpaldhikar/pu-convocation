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
import { AuthenticationForm, InvitationFrom } from "@components/forms";
import { getTranslations } from "next-intl/server";
import { LanguageSelector } from "@components/index";

interface AuthenticationProps {
  searchParams: {
    redirect: string;
    invitationToken: string;
  };
}

export default async function AuthenticationPage({
  searchParams,
}: Readonly<AuthenticationProps>): Promise<JSX.Element> {
  const coreTranslations = await getTranslations("core");

  return (
    <section className={"flex min-h-screen w-full"}>
      <div className="m-auto flex h-fit w-full flex-col items-center justify-center space-y-5 px-5 lg:px-0">
        {searchParams.invitationToken === null ||
        searchParams.invitationToken === undefined ||
        searchParams.invitationToken === "" ||
        !searchParams.invitationToken?.match(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        ) ? (
          <AuthenticationForm redirect={searchParams.redirect} />
        ) : (
          <InvitationFrom invitationToken={searchParams.invitationToken} />
        )}
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
