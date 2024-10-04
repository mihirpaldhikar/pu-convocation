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

export default function DeleteColumnIcon({
  size = 30,
}: {
  size?: number;
}): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="65"
        y="27"
        width="96"
        height="36"
        rx="3"
        transform="rotate(90 65 27)"
        stroke="black"
        strokeWidth="4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M77 120V30C77 29.4477 77.4477 29 78 29H108C108.552 29 109 29.4477 109 30V61.2237H113V30C113 27.2386 110.761 25 108 25H78C75.2386 25 73 27.2386 73 30V120C73 122.761 75.2386 125 78 125H108C110.761 125 113 122.761 113 120V92.6923H109V120C109 120.552 108.552 121 108 121H78C77.4477 121 77 120.552 77 120Z"
        fill="black"
      />
      <line x1="111" y1="66" x2="111" y2="88" stroke="black" strokeWidth="4" />
    </svg>
  );
}
