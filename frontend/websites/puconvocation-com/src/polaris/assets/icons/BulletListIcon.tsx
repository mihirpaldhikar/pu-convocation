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

export default function BulletListIcon({
  size,
}: {
  size?: number;
}): JSX.Element {
  return (
    <svg
      width={size ?? 40}
      height={size ?? 40}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="54"
        y1="70.5"
        x2="167"
        y2="70.5"
        stroke="black"
        strokeWidth="7"
      />
      <line
        x1="54"
        y1="100.5"
        x2="132"
        y2="100.5"
        stroke="black"
        strokeWidth="7"
      />
      <line
        x1="54"
        y1="130.5"
        x2="143"
        y2="130.5"
        stroke="black"
        strokeWidth="7"
      />
      <circle cx="39.5" cy="70.5" r="7.5" fill="black" />
      <circle cx="39.5" cy="100.5" r="7.5" fill="black" />
      <circle cx="39.5" cy="130.5" r="7.5" fill="black" />
    </svg>
  );
}
