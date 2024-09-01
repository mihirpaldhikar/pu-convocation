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
import { Fragment, JSX } from "react";
import { Flags } from "@components/index";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "../i18n/routing";

interface FooterProps {
  whoWeAre: string;
  credits: Array<{
    name: string;
    credits: Array<{
      name: string;
      link: string;
      bold: boolean;
      underline: boolean;
    }>;
  }>;
}

export default function Footer({
  whoWeAre,
  credits,
}: Readonly<FooterProps>): JSX.Element {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Footer");
  return (
    <footer className={"relative z-0 bg-primary-foreground"}>
      <div className={"absolute -top-[2.8rem] right-0 md:-top-[5.3rem]"}>
        <Flags />
      </div>
      <div className={"space-y-10 px-5 pb-10 pt-24 md:px-10 md:pt-10"}>
        <section className={"space-y-3"}>
          <h3 className={"text-xl font-bold"}>{t("whoWeAreTitle")}</h3>
          <p className={"w-full font-medium md:w-2/5"}>{t("whoWeAre")}</p>
        </section>
        <section className={"space-y-3"}>
          <h3 className={"text-xl font-bold"}>{t("credits")}</h3>
          {credits.map((credit, i) => {
            return (
              <p key={i} className={"font-medium"}>
                {t(credit.name)}{" "}
                {credit.credits.map((c, j) => {
                  return (
                    <Fragment key={j}>
                      <Link
                        href={c.link}
                        target={"_blank"}
                        className={` ${c.bold ? "font-bold text-primary" : "font-medium"} ${c.underline ? "underline" : "no-underline"} `}
                      >
                        {t(c.name)}
                      </Link>
                      {j < credit.credits.length - 1 ? ", " : " "}
                    </Fragment>
                  );
                })}
              </p>
            );
          })}
        </section>
        <section>
          <h6 className={"py-3 font-bold"}>Supported Languages</h6>
          <div className={"flex space-x-4 text-xs"}>
            <button
              className={`flex rounded-full px-2 py-1 ${currentLocale === "en" ? "bg-red-200 font-semibold text-red-600" : ""}`}
              onClick={() => {
                router.replace(pathname, { locale: "en" });
              }}
            >
              English
            </button>
            <button
              className={`flex rounded-full px-2 py-1 ${currentLocale === "hi" ? "bg-red-200 font-semibold text-red-600" : ""}`}
              onClick={() => {
                router.replace(pathname, { locale: "hi" });
              }}
            >
              Hindi
            </button>
            <button
              className={`flex rounded-full px-2 py-1 ${currentLocale === "mr" ? "bg-red-200 font-semibold text-red-600" : ""}`}
              onClick={() => {
                router.replace(pathname, { locale: "mr" });
              }}
            >
              Marathi
            </button>
            <button
              className={`flex rounded-full px-2 py-1 ${currentLocale === "gu" ? "bg-red-200 font-semibold text-red-600" : ""}`}
              onClick={() => {
                router.replace(pathname, { locale: "gu" });
              }}
            >
              Gujarati
            </button>
          </div>
        </section>
        <section className={"space-y-10 text-center"}>
          <p className={"text-xs"}>&copy; {t("copyrightNotice")}</p>
          <Link
            href={"https://paruluniversity.ac.in"}
            target={"_blank"}
            className={
              "block text-4xl font-black opacity-30 md:text-6xl lg:text-8xl"
            }
          >
            <span className={"text-primary"}>{t("universityName")}</span>{" "}
            {t("university")}
          </Link>
        </section>
      </div>
    </footer>
  );
}
