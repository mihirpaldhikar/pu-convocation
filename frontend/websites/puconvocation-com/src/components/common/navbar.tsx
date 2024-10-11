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
"use client";

import { JSX } from "react";
import { Logo } from "@components/ui";
import NavbarMenu from "./navbar_menu";
import { Link, usePathname } from "@i18n/routing";

export default function Navbar(): JSX.Element {
  const path = usePathname();

  return (
    <header
      className={`fixed z-50 flex h-20 w-full items-center justify-between bg-white/70 px-3 backdrop-blur-3xl md:px-16`}
    >
      <div className="flex items-center">
        <Link
          href={path.includes("/console") ? "/console" : "/"}
          aria-label={
            path.includes("/console") ? "Go To Console Home" : "Go To Home"
          }
        >
          <Logo />
        </Link>
      </div>
      <NavbarMenu />
    </header>
  );
}
