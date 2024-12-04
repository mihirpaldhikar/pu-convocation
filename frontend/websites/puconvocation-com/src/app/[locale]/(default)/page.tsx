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
  LeftGuestGalleryFlag,
  RightGalleryFlags,
  RightGuestGalleryFlag,
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
            className={"w-96 lg:w-[40vw]"}
          />
          <div
            className={
              "flex flex-col items-center space-x-0 space-y-5 lg:flex-row lg:space-x-4 lg:space-y-0"
            }
          >
            <div className={"flex items-center justify-center space-x-1"}>
              <svg
                width="84"
                height="98"
                fill="none"
                viewBox="0 0 84 98"
                className={"size-24"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M57.5441 26.1413C55.3922 26.1413 53.716 25.5836 52.5155 24.4683C51.3149 23.3297 50.7147 21.645 50.7147 19.4143V2.96268H56.0151V19.3446C56.0151 20.1346 56.219 20.7504 56.6267 21.1919C57.0345 21.6101 57.5894 21.8193 58.2916 21.8193C59.1298 21.8193 59.8433 21.5869 60.4322 21.1222L61.8593 24.9562C61.3156 25.3513 60.6587 25.6533 59.8886 25.8625C59.1411 26.0484 58.3596 26.1413 57.5441 26.1413ZM47.8945 11.7113V7.5287H60.5681V11.7113H47.8945Z"
                  className={"fill-red-600"}
                />
                <path
                  d="M75.9453 6.83159C77.395 6.83159 78.6862 7.13367 79.8188 7.73783C80.974 8.31874 81.8801 9.22498 82.537 10.4565C83.1939 11.6648 83.5223 13.2217 83.5223 15.1271V25.8625H78.2218V15.9636C78.2218 14.4532 77.8934 13.3379 77.2365 12.6175C76.6022 11.8972 75.6962 11.537 74.5183 11.537C73.6802 11.537 72.9213 11.7229 72.2418 12.0947C71.5849 12.4433 71.0639 12.9893 70.6788 13.7329C70.3164 14.4765 70.1352 15.4292 70.1352 16.591V25.8625H64.8347V0H70.1352V12.3038L68.946 10.7354C69.6029 9.48058 70.5429 8.51626 71.7661 7.84239C72.9893 7.16853 74.3824 6.83159 75.9453 6.83159Z"
                  className={"fill-red-600"}
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M59.7613 28.898C58.6076 29.5653 57.2754 29.9461 55.8566 29.9461C51.4595 29.9461 47.8951 26.2895 47.8951 21.779C47.8951 20.8743 48.0385 20.0039 48.3032 19.1905C48.1724 19.1357 48.0408 19.0815 47.9082 19.028C43.5029 17.145 38.3266 16.2035 32.3794 16.2035C26.579 16.2035 21.4394 17.145 16.9606 19.028C12.4818 20.8356 8.99427 23.4341 6.4979 26.8235C4.00153 30.1375 2.75335 34.1294 2.75335 38.7992C2.75335 43.243 3.96482 47.0843 6.38777 50.323C7.82994 52.1506 9.59067 53.7267 11.67 55.0515C8.52772 56.6614 5.95934 58.7382 3.96482 61.2819C1.32161 64.6713 0 68.8138 0 73.7096C0 78.6053 1.35832 82.8985 4.07495 86.5891C6.79159 90.2044 10.5729 93.0289 15.4187 95.0625C20.2646 97.0208 25.9182 98 32.3794 98C38.914 98 44.6042 97.0208 49.4501 95.0625C54.3694 93.0289 58.1874 90.2044 60.904 86.5891C63.6207 82.8985 64.979 78.6053 64.979 73.7096C64.979 68.8138 63.6207 64.6713 60.904 61.2819C58.9646 58.7398 56.4126 56.664 53.2479 55.0545C55.3359 53.7291 57.0803 52.1519 58.4811 50.323C60.9775 47.0843 62.2256 43.243 62.2256 38.7992C62.2256 35.0654 61.4042 31.765 59.7613 28.898ZM42.9522 81.5051C40.3824 83.5387 36.8581 84.5555 32.3794 84.5555C27.974 84.5555 24.4864 83.5387 21.9166 81.5051C19.3469 79.4715 18.062 76.6847 18.062 73.1447C18.062 69.6047 19.3469 66.8555 21.9166 64.8973C24.4864 62.8636 27.974 61.8468 32.3794 61.8468C36.8581 61.8468 40.3824 62.8636 42.9522 64.8973C45.5954 66.8555 46.917 69.6047 46.917 73.1447C46.917 76.6847 45.5954 79.4715 42.9522 81.5051ZM41.1901 46.7077C39.0608 48.4401 36.1239 49.3062 32.3794 49.3062C28.7082 49.3062 25.808 48.4401 23.6788 46.7077C21.5495 44.9754 20.4849 42.6028 20.4849 39.5901C20.4849 36.4267 21.5862 33.9788 23.7889 32.2465C25.9916 30.5141 28.8551 29.648 32.3794 29.648C35.9771 29.648 38.8773 30.5141 41.0799 32.2465C43.356 33.9788 44.4941 36.4267 44.4941 39.5901C44.4941 42.6028 43.3927 44.9754 41.1901 46.7077Z"
                  className={"fill-red-600"}
                />
              </svg>

              <h1 className={"text-8xl font-black text-red-600"}>PU</h1>
            </div>
            <Convocation fillColor={"#dc2626"} />
          </div>
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
                "flex flex-col items-center justify-center space-x-3 space-y-3 pb-5 pt-3 lg:flex-row lg:space-x-6 lg:pt-4"
              }
            >
              <div className={"flex items-center justify-center space-x-1"}>
                <svg
                  width="84"
                  height="98"
                  viewBox="0 0 84 98"
                  fill="none"
                  className={"size-14 lg:size-24"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M57.5441 26.1413C55.3922 26.1413 53.716 25.5836 52.5155 24.4683C51.3149 23.3297 50.7147 21.645 50.7147 19.4143V2.96268H56.0151V19.3446C56.0151 20.1346 56.219 20.7504 56.6267 21.1919C57.0345 21.6101 57.5894 21.8193 58.2916 21.8193C59.1298 21.8193 59.8433 21.5869 60.4322 21.1222L61.8593 24.9562C61.3156 25.3513 60.6587 25.6533 59.8886 25.8625C59.1411 26.0484 58.3596 26.1413 57.5441 26.1413ZM47.8945 11.7113V7.5287H60.5681V11.7113H47.8945Z"
                    fill="white"
                  />
                  <path
                    d="M75.9453 6.83159C77.395 6.83159 78.6862 7.13367 79.8188 7.73783C80.974 8.31874 81.8801 9.22498 82.537 10.4565C83.1939 11.6648 83.5223 13.2217 83.5223 15.1271V25.8625H78.2218V15.9636C78.2218 14.4532 77.8934 13.3379 77.2365 12.6175C76.6022 11.8972 75.6962 11.537 74.5183 11.537C73.6802 11.537 72.9213 11.7229 72.2418 12.0947C71.5849 12.4433 71.0639 12.9893 70.6788 13.7329C70.3164 14.4765 70.1352 15.4292 70.1352 16.591V25.8625H64.8347V0H70.1352V12.3038L68.946 10.7354C69.6029 9.48058 70.5429 8.51626 71.7661 7.84239C72.9893 7.16853 74.3824 6.83159 75.9453 6.83159Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M59.7613 28.898C58.6076 29.5653 57.2754 29.9461 55.8566 29.9461C51.4595 29.9461 47.8951 26.2895 47.8951 21.779C47.8951 20.8743 48.0385 20.0039 48.3032 19.1905C48.1724 19.1357 48.0408 19.0815 47.9082 19.028C43.5029 17.145 38.3266 16.2035 32.3794 16.2035C26.579 16.2035 21.4394 17.145 16.9606 19.028C12.4818 20.8356 8.99427 23.4341 6.4979 26.8235C4.00153 30.1375 2.75335 34.1294 2.75335 38.7992C2.75335 43.243 3.96482 47.0843 6.38777 50.323C7.82994 52.1506 9.59067 53.7267 11.67 55.0515C8.52772 56.6614 5.95934 58.7382 3.96482 61.2819C1.32161 64.6713 0 68.8138 0 73.7096C0 78.6053 1.35832 82.8985 4.07495 86.5891C6.79159 90.2044 10.5729 93.0289 15.4187 95.0625C20.2646 97.0208 25.9182 98 32.3794 98C38.914 98 44.6042 97.0208 49.4501 95.0625C54.3694 93.0289 58.1874 90.2044 60.904 86.5891C63.6207 82.8985 64.979 78.6053 64.979 73.7096C64.979 68.8138 63.6207 64.6713 60.904 61.2819C58.9646 58.7398 56.4126 56.664 53.2479 55.0545C55.3359 53.7291 57.0803 52.1519 58.4811 50.323C60.9775 47.0843 62.2256 43.243 62.2256 38.7992C62.2256 35.0654 61.4042 31.765 59.7613 28.898ZM42.9522 81.5051C40.3824 83.5387 36.8581 84.5555 32.3794 84.5555C27.974 84.5555 24.4864 83.5387 21.9166 81.5051C19.3469 79.4715 18.062 76.6847 18.062 73.1447C18.062 69.6047 19.3469 66.8555 21.9166 64.8973C24.4864 62.8636 27.974 61.8468 32.3794 61.8468C36.8581 61.8468 40.3824 62.8636 42.9522 64.8973C45.5954 66.8555 46.917 69.6047 46.917 73.1447C46.917 76.6847 45.5954 79.4715 42.9522 81.5051ZM41.1901 46.7077C39.0608 48.4401 36.1239 49.3062 32.3794 49.3062C28.7082 49.3062 25.808 48.4401 23.6788 46.7077C21.5495 44.9754 20.4849 42.6028 20.4849 39.5901C20.4849 36.4267 21.5862 33.9788 23.7889 32.2465C25.9916 30.5141 28.8551 29.648 32.3794 29.648C35.9771 29.648 38.8773 30.5141 41.0799 32.2465C43.356 33.9788 44.4941 36.4267 44.4941 39.5901C44.4941 42.6028 43.3927 44.9754 41.1901 46.7077Z"
                    fill="white"
                  />
                </svg>

                <h1 className={"text-5xl font-black lg:text-8xl"}>PU</h1>
              </div>
              <Convocation fillColor={"white"} />
            </div>
            <IdentifierForm />
          </div>
        </div>
        <div>
          {/* Chief guests Section */}
          <div className={"mb-8 flex justify-between"}>
            <LeftGuestGalleryFlag />
            <h2
              className={
                "mb-8 flex items-center space-x-2 p-2 text-center text-2xl font-bold text-red-900 md:p-10 md:text-5xl"
              }
            >
              <span>{pageTranslations("guests")}</span>
            </h2>
            <RightGuestGalleryFlag />
          </div>
          <div className={"flex justify-center px-3 py-3"}>
            <Image
              src="https://assets.puconvocation.com/images/341801f602444fc88d1c1b04e0727eea.avif"
              alt="Chief Guests Image"
              width={950}
              height={700}
              className={"rounded-xl"}
              style={{ objectFit: "cover" }}
            />
          </div>
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
          <div
            className={
              "flex w-full items-center justify-center px-3 pb-10 lg:px-0 lg:pt-10"
            }
          ></div>
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
