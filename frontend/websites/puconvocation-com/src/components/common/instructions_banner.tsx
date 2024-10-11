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
import { Button } from "@components/ui";
import { Link, usePathname } from "@i18n/routing";
import { DynamicIcon } from "@components/graphics";

interface InstructionsBannerProps {
  show: boolean;
}

export default function InstructionsBanner({
  show,
}: InstructionsBannerProps): JSX.Element {
  const currentPath = usePathname();
  return (
    <div
      className={`${show && !currentPath.includes("instructions") ? "flex" : "hidden"} h-12 w-full items-center justify-center space-x-4 bg-red-100 font-semibold text-red-800`}
    >
      <h6>Important Instructions</h6>
      <Button asChild={true} className={"rounded-full bg-red-800"}>
        <Link href={"/instructions"}>
          View <DynamicIcon icon={"ChevronRightIcon"} />
        </Link>
      </Button>
    </div>
  );
}
