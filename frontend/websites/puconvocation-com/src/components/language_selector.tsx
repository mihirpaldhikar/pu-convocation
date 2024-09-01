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
import i18nConfig from "@i18n/config.json";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";

export default function LanguageSelector(): JSX.Element {
  const currentLocale = useLocale();

  return (
    <div className={"flex flex-col items-start space-y-3"}>
      <h6 className={"font-semibold"}>
        <GlobeAltIcon className={"inline-block size-5"} /> Supported Languages
      </h6>
      <div className={"flex space-x-4"}>
        {i18nConfig.map((lang) => {
          return (
            <button
              hidden={!lang.enabled}
              key={lang.code}
              className={`${currentLocale === lang.code ? "bg-primary text-primary-foreground" : "border border-border"} rounded-full px-2 py-1 text-xs`}
            >
              {lang.localName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
