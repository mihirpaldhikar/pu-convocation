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
import universityLogo from "@public/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import ConsoleNavbarMenu from "@components/console_navbar_menu";

export default function ConsoleNavbar(): JSX.Element {
  return (
    <header
      className={
        "fixed flex h-16 w-full items-center justify-between border-b border-b-border bg-primary-foreground px-5 backdrop-blur-md"
      }
    >
      <Link href={"/console"} className="flex items-center space-x-3">
        <Image
          src={universityLogo}
          alt={"Parul University"}
          priority={true}
          fetchPriority={"high"}
          className={"w-20"}
        />
        <h1 className={"text-xl font-bold"}>
          <span className={"text-red-600"}>Parul</span> University
        </h1>
      </Link>
      <ConsoleNavbarMenu />
    </header>
  );
}
