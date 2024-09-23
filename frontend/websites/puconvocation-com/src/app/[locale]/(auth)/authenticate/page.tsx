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
import { JSX } from "react";
import { AuthenticationForm } from "@components/forms";
import { Pattern } from "@components/ui";
import { getTranslations } from "next-intl/server";

interface AuthenticationProps {
  searchParams: { redirect: string };
}

export default async function AuthenticationPage({
  searchParams,
}: Readonly<AuthenticationProps>): Promise<JSX.Element> {
  const pageTranslations = await getTranslations("pages.authenticationPage");

  return (
    <section className={"grid h-dvh grid-cols-1 lg:grid-cols-2"}>
      <div className={"hidden flex-1 lg:flex"}>
        <Pattern />
      </div>
      <div
        className={
          "flex flex-1 items-center justify-center px-3 lg:bg-red-50 lg:px-0"
        }
      >
        <div
          className={
            "flex w-full flex-col space-y-10 rounded-xl border border-gray-300 bg-white px-5 py-10 md:w-2/3"
          }
        >
          <div className={"flex flex-col items-center space-y-5"}>
            <h3 className={"text-xl font-bold"}>{pageTranslations("title")}</h3>
            <h5 className={"font-medium"}>{pageTranslations("subTitle")}</h5>
          </div>
          <AuthenticationForm redirect={searchParams.redirect} />
        </div>
      </div>
    </section>
  );
}
