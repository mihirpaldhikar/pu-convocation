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

import { type JSX } from "react";

export default function DeleteIcon({
  size,
  color = "black",
}: {
  size?: number;
  color?: string;
}): JSX.Element {
  return (
    <svg
      width={size ?? 36}
      height={size ?? 36}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="63.0711"
        y1="59"
        x2="138"
        y2="133.929"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <line
        x1="62.958"
        y1="133.929"
        x2="137.887"
        y2="59"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
