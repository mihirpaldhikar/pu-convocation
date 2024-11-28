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

import Image from "next/image";
import { AboutUsBlob, Carousel } from "@components/common";
import {
  Convocation,
  LeftGalleryFlags,
  RightGalleryFlags,
} from "@components/graphics";
import { Countdown } from "@components/layouts";
import { Link } from "@i18n/routing";
import { Button } from "@components/ui";
import { IdentifierForm } from "@components/forms";
import { getTranslations } from "next-intl/server";
import { RemoteConfigController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { convertToThumbnailUrl } from "@lib/image_utils";

const remoteConfig = new RemoteConfigController();

export default async function Home() {
  const response = await remoteConfig.getRemoteConfig();

  const pageTranslations = await getTranslations("pages.landingPage");
  const coreTranslations = await getTranslations("core");

  if (response.statusCode === StatusCode.SUCCESS) {
    const { countdown, images, instructions } = response.payload;
    return countdown.show && countdown.endTime > new Date().getTime() ? (
      <section className={"flex min-h-[80dvh]"}>
        <div
          className={
            "m-auto flex flex-col items-center justify-center space-y-10"
          }
        >
          <Image
            src={
              "https://assets.puconvocation.com/logos/full_university_logo.png"
            }
            alt={"Parul University Convocation"}
            width={400}
            height={300}
          />
          <Convocation fillColor={"#ef4444"} />
          <div className="h-22"></div>
          <Countdown futureTimestamp={countdown.endTime} />
        </div>
      </section>
    ) : (
      <section className={"min-h-dvh"}>
        <div className={"h-[calc(50dvh-5rem)] lg:h-[calc(100dvh-5rem)]"}>
          <div className={"relative h-full"}>
            <Image
              alt={pageTranslations("heroImageDescription")}
              src={images.hero.url}
              fill={true}
              sizes={"100vw"}
              placeholder={"blur"}
              blurDataURL={convertToThumbnailUrl(images.hero.url)}
              style={{
                maxWidth: "100vw",
                maxHeight: "auto",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            className={`absolute inset-x-0 ${instructions.show ? "top-32" : "top-20"} z-10 flex h-[calc(50dvh-5rem)] flex-col items-center justify-center bg-black/60 text-white lg:h-[calc(100dvh-5rem)]`}
          >
            <h5 className={"text-3xl font-bold md:text-3xl lg:text-6xl"}>
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
            <div
              className={
                "flex items-center space-x-3 pb-5 pt-3 lg:space-x-6 lg:pt-4"
              }
            >
              <h1 className={"text-4xl font-black md:text-5xl lg:text-8xl"}>
                PU
              </h1>
              <Convocation fillColor={"white"} />
            </div>
            <IdentifierForm />
          </div>
        </div>
        <div>
          <div className={"flex justify-between"}>
            <LeftGalleryFlags />
            <h2
              className={
                "pt-14 text-2xl font-bold text-red-900 md:pl-10 md:text-5xl"
              }
            >
              {pageTranslations("gallery")}
            </h2>
            <RightGalleryFlags />
          </div>
          <div
            className={
              "flex w-full items-center justify-center px-3 pb-10 lg:px-0 lg:pt-10"
            }
          >
            <div className={"w-full lg:w-2/3"}>
              <Carousel width={1920} height={1080} images={images.carousel} />
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
                <Button asChild={true} className={"w-fit rounded-full"}>
                  <Link
                    href={"https://paruluniversity.ac.in"}
                    target={"_blank"}
                  >
                    {pageTranslations("aboutUs.knowMore")}
                  </Link>
                </Button>
              </div>
            </div>
            <div className={"flex flex-1 justify-end px-3 py-3"}>
              <Image
                src={images.aboutUs.url}
                alt={pageTranslations("aboutUs.title")}
                width={1920}
                height={1080}
                placeholder={"blur"}
                blurDataURL={convertToThumbnailUrl(images.aboutUs.url)}
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
}
