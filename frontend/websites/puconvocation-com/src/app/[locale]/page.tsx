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
import Image from "next/image";
import {
  AboutUsBlob,
  Carousel,
  Convocation,
  CountDown,
  GalleryFlagsLeft,
  GalleryFlagsRight,
  IdentifierForm,
  ProgressBar,
} from "@components/index";
import { useWebsiteConfig } from "@hooks/index";
import { useTranslations } from "use-intl";
import { Link } from "@i18n/routing";

export default function Home() {
  const { state: website } = useWebsiteConfig();
  const pageTranslations = useTranslations("pages.landingPage");
  const coreTranslations = useTranslations("core");

  if (website.loading) {
    return (
      <div className={"flex min-h-screen"}>
        <div className={"m-auto"}>
          <ProgressBar />
        </div>
      </div>
    );
  }

  if (website.config?.showCountDown) {
    return (
      <section className={"flex min-h-dvh"}>
        <div
          className={
            "m-auto flex flex-col items-center justify-center space-y-10"
          }
        >
          <h1 className={"text-2xl font-black md:text-5xl lg:text-3xl"}>
            {coreTranslations.rich("styledUniversityName", {
              highlight: (chunks) => (
                <span className={"text-red-600"}>{chunks}</span>
              ),
            })}
          </h1>
          <Convocation fillColor={"#ef4444"} />
          <div className="h-22"></div>
          <CountDown futureTimestamp={website.config.countDownEndTime ?? 0} />
        </div>
      </section>
    );
  }

  return (
    <section className={"min-h-dvh"}>
      <div className={"min-h-[30vh] md:min-h-[50vh] lg:min-h-dvh"}>
        <div className={"relative z-0 h-[30vh] md:min-h-[50vh] lg:min-h-dvh"}>
          <Image
            alt={pageTranslations("heroImageDescription")}
            src={website.config?.heroImage ?? ""}
            fill={true}
            sizes={"100vw"}
            style={{
              maxWidth: "100vw",
              maxHeight: "auto",
              objectFit: "cover",
            }}
            priority={true}
          />
        </div>
        <div
          className={
            "absolute inset-0 z-10 h-[30vh] pt-16 text-white md:min-h-[50vh] lg:min-h-dvh"
          }
        >
          <div className="flex h-full flex-col items-center justify-center space-y-3 pt-24 md:space-y-5 md:pt-0">
            <h5 className={"text-2xl font-bold md:text-3xl lg:text-5xl"}>
              {pageTranslations.rich("welcomeText", {
                small: (chunks) => (
                  <span
                    className={"text-lg font-medium md:text-xl lg:text-2xl"}
                  >
                    {chunks}
                  </span>
                ),
              })}
            </h5>
            <div className={"flex items-center space-x-3 md:space-x-5"}>
              <h1 className={"text-4xl font-black md:text-5xl lg:text-7xl"}>
                {website.config?.heroTitle}
              </h1>
              <Convocation fillColor={"white"} />
            </div>
            <IdentifierForm />
          </div>
        </div>
      </div>
      <div>
        <div className={"flex justify-between"}>
          <GalleryFlagsLeft />
          <h2
            className={
              "pt-14 text-2xl font-bold text-red-900 md:pl-10 md:text-5xl"
            }
          >
            {pageTranslations("gallery")}
          </h2>
          <GalleryFlagsRight />
        </div>
        <div
          className={
            "flex w-full items-center justify-center px-3 py-10 lg:px-0"
          }
        >
          <div className={"w-full lg:w-2/3"}>
            <Carousel
              width={1920}
              height={1080}
              images={website.config?.gallery ?? []}
            />
          </div>
        </div>
        <div className={"flex flex-col justify-between md:flex-row"}>
          <div className={"flex-1"}>
            <div className={"relative z-0"}>
              <AboutUsBlob />
              <h2
                className={
                  "absolute inset-x-10 inset-y-24 z-10 text-2xl font-bold"
                }
              >
                {pageTranslations("aboutUs.title")}
              </h2>
            </div>
            <div className={"flex flex-col space-y-5 px-10 py-5"}>
              <p>{pageTranslations("aboutUs.description")}</p>
              <Link
                className={
                  "w-fit rounded-full bg-primary px-5 py-2 font-bold text-white"
                }
                href={"https://paruluniversity.ac.in"}
                target={"_blank"}
              >
                {pageTranslations("aboutUs.knowMore")}
              </Link>
            </div>
          </div>
          <div className={"flex flex-1 justify-end px-3 py-3"}>
            <Image
              src={website.config?.aboutUsImage ?? ""}
              alt={pageTranslations("aboutUs.title")}
              width={1920}
              height={1080}
              className={"rounded-lg"}
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
