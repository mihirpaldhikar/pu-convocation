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
import Link from "next/link";
import ConsoleNavbarMenu from "@components/console_navbar_menu";
import { Logo } from "@components/ui";

export default function ConsoleNavbar(): JSX.Element {
  return (
    <header
      className={
        "fixed z-50 flex h-20 w-full items-center justify-between border-b border-b-gray-300 bg-white/70 px-5 backdrop-blur-3xl"
      }
    >
      <Link href={"/console"}>
        <Logo />
      </Link>
      <ConsoleNavbarMenu />
    </header>
  );
}
