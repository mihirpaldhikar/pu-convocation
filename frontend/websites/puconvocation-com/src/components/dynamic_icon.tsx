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

import * as HeroSolidIcons from "@heroicons/react/24/solid";
import * as HeroOutlineIcons from "@heroicons/react/24/outline";
import {JSX} from "react";
import {twMerge} from "tailwind-merge";

type IconName = keyof typeof HeroSolidIcons;

interface DynamicIconProps {
  icon: IconName;
  outline?: boolean;
  className?: string;
}

export default function DynamicIcon({
  icon,
  outline = true,
  className,
}: DynamicIconProps): JSX.Element {
  const SolidIcon = HeroSolidIcons[icon];
  const OutlineIcon = HeroOutlineIcons[icon];

  return outline ? (
    <OutlineIcon className={twMerge("size-5", className)} />
  ) : (
    <SolidIcon className={twMerge("size-5", className)} />
  );
}
