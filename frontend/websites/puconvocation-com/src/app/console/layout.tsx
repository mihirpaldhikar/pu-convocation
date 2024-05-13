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

import type { Metadata } from "next";
import { ReactNode } from "react";
import { ConsoleNavbar } from "@components/index";

export const metadata: Metadata = {
  title: "PU Convocation Console",
  description: "Manage PU Convocation System",
};

interface RootLayout {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayout>) {
  return (
    <div className={"min-h-dvh flex-col flex"}>
      <ConsoleNavbar />
      <main className={"flex-1"}>{children}</main>
    </div>
  );
}
