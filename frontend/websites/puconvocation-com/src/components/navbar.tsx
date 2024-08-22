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
import Link from "next/link";
import { Logo } from "@components/ui";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function Navbar(): JSX.Element {
  const path = usePathname();

  return (
    <header
      className={`fixed z-50 flex h-20 w-full items-center justify-between border-b border-b-gray-300 bg-white/70 px-16 backdrop-blur-3xl`}
    >
      <div className="flex items-center">
        <Link href={"/"}>
          <Logo />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href={"/authenticate"}
          className={`${path.includes("/authenticate") ? "hidden" : "flex"} items-center rounded-2xl bg-black px-4 py-2 text-white`}
        >
          <UserCircleIcon className={"mr-2 size-5"} />
          <span className="mr-2">Login</span>
        </Link>
      </div>
    </header>
  );
}
