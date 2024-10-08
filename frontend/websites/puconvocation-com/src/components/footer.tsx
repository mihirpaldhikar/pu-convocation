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
import { Flags, LanguageSelector } from "@components/index";
import { getTranslations } from "next-intl/server";
import { Link } from "@i18n/routing";

export default async function Footer(): Promise<JSX.Element> {
  const coreTranslations = await getTranslations("core");
  const footerTranslations = await getTranslations("components.footer");

  return (
    <footer className={"relative z-0 bg-primary-foreground"}>
      <div className={"absolute -top-[2.8rem] right-0 md:-top-[5.3rem]"}>
        <Flags />
      </div>
      <div className={"space-y-10 px-5 pb-10 pt-24 md:px-10 md:pt-10"}>
        <section className={"space-y-3"}>
          <h3 className={"text-xl font-bold"}>
            {footerTranslations("whoWeAre.title")}
          </h3>
          <p className={"w-full font-medium md:w-2/5"}>
            {footerTranslations("whoWeAre.description")}
          </p>
        </section>
        <section className={"space-y-3"}>
          <h3 className={"text-xl font-bold"}>
            {footerTranslations("credits.title")}
          </h3>
          <p className={"font-semibold"}>
            {footerTranslations("credits.developedBy")}{" "}
            <Link
              target={"_blank"}
              href={"https://mihirpaldhikar.com"}
              className={"text-red-800 underline"}
            >
              {coreTranslations("mihirPaldhikar")}
            </Link>{" "}
            &{" "}
            <Link
              target={"_blank"}
              href={"https://www.linkedin.com/in/suhani-shah-o13"}
              className={"text-red-800 underline"}
            >
              {coreTranslations("suhaniShah")}
            </Link>
          </p>
        </section>
        <section>
          <LanguageSelector />
        </section>
        <section className={"space-y-10 text-center"}>
          <p className={"text-xs"}>
            &copy; {new Date().getFullYear()} {coreTranslations("copyright")}
          </p>
          <Link
            href={"https://paruluniversity.ac.in"}
            target={"_blank"}
            className={
              "block text-4xl font-black opacity-30 md:text-6xl lg:text-8xl"
            }
          >
            {coreTranslations.rich("styledUniversityName", {
              highlight: (chunks) => (
                <span className={"text-red-800"}>{chunks}</span>
              ),
            })}
          </Link>
        </section>
      </div>
    </footer>
  );
}
