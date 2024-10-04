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

export default function ImageIcon({ size }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size ?? 36}
      height={size ?? 36}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="44"
        y="44"
        width="112"
        height="112"
        rx="17"
        stroke="black"
        strokeWidth="6"
      />
      <circle cx="80" cy="86" r="12.5" stroke="black" strokeWidth="5" />
      <line
        x1="58.5251"
        y1="156.142"
        x2="116.525"
        y2="98.1415"
        stroke="black"
        strokeWidth="7"
      />
      <line
        x1="112.543"
        y1="98.8587"
        x2="157.419"
        y2="120.907"
        stroke="black"
        strokeWidth="7"
      />
    </svg>
  );
}
