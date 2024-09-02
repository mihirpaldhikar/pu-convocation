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
import { JSX } from "react";
import { useZxing } from "react-zxing";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useTranslations } from "use-intl";

export default function VerificationPage(): JSX.Element {
  const router = useRouter();
  const pageTranslations = useTranslations("pages.scanPage");

  const { ref: qrCodeScanner } = useZxing({
    onDecodeResult(result) {
      const tokenRegex = /^[a-zA-Z0-9]+$/;
      const verificationToken = result.getText();

      if (tokenRegex.test(verificationToken)) {
        router.push(`/console/verify?token=${verificationToken}`);
      }
    },
  });

  return (
    <section className={"flex min-h-dvh"}>
      <div className="m-auto flex w-full flex-col items-center justify-center">
        <div className={"flex flex-col items-center justify-center space-y-3"}>
          <QrCodeIcon className={"size-14 text-red-600"} />
          <h6 className={"text-xl font-semibold"}>
            {pageTranslations("title")}
          </h6>
        </div>
        <video ref={qrCodeScanner} className={"h-96 w-96 rounded-lg"} />
        <p className={"text-center text-lg"}>
          {pageTranslations("description")}
        </p>
      </div>
    </section>
  );
}
