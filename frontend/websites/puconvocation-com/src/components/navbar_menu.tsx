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
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function NavbarMenu(): JSX.Element {
  return (
    <nav className="flex items-center space-x-5">
      <Link
        href={"/authenticate"}
        className={`flex items-center rounded-2xl bg-black px-4 py-2 text-white`}
      >
        <UserCircleIcon className={"mr-2 size-5"} />
        <span className="mr-2">Login</span>
      </Link>
    </nav>
  );
}
