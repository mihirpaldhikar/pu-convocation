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

import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import config from "./config.json";

interface Lang {
  code: string;
  localName: string;
  name: string;
  langDir: string;
  dateFormat: string;
  hrefLang: string;
  enabled: boolean;
  default: boolean;
}

export const routing = defineRouting({
  locales: config
    .filter((lang: Lang) => lang.enabled)
    .map((lang: Lang) => lang.code),

  defaultLocale: config.filter((lang: Lang) => lang.default)[0].code,
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
