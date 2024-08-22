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
import Link from "next/link";
import { Logo } from "@components/ui";
import { usePathname } from "next/navigation";
import ConsoleNavbarMenu from "@components/console_navbar_menu";
import NavbarMenu from "@components/navbar_menu";

export default function Navbar(): JSX.Element {
  const path = usePathname();

  return (
    <header
      className={`fixed z-50 flex h-20 w-full items-center justify-between border-b border-b-gray-300 bg-white/70 px-3 backdrop-blur-3xl md:px-16`}
    >
      <div className="flex items-center">
        <Link href={path.includes("/console") ? "/console" : "/"}>
          <Logo />
        </Link>
      </div>
      {path.includes("/console") ? (
        <ConsoleNavbarMenu />
      ) : !path.includes("/authenticate") ? (
        <NavbarMenu />
      ) : (
        <Fragment />
      )}
    </header>
  );
}
