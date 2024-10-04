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

export default function AddRowIcon({
  size = 30,
}: {
  size?: number;
}): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="23"
        y="40"
        width="153"
        height="120"
        rx="7"
        stroke="black"
        strokeWidth="6"
      />
      <line
        x1="24"
        y1="71.5"
        x2="174"
        y2="71.5"
        stroke="black"
        strokeWidth="3"
      />
      <line
        x1="24"
        y1="101.5"
        x2="174"
        y2="101.5"
        stroke="black"
        strokeWidth="3"
      />
      <line
        x1="24"
        y1="131.5"
        x2="174"
        y2="131.5"
        stroke="black"
        strokeWidth="3"
      />
      <line x1="101" y1="73" x2="101" y2="160" stroke="black" strokeWidth="4" />
    </svg>
  );
}
