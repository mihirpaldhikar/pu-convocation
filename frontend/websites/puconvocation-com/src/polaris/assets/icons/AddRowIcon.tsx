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
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="12"
        y="30"
        width="126"
        height="36"
        rx="3"
        stroke="black"
        strokeWidth="4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 78H135C135.552 78 136 78.4477 136 79V109C136 109.552 135.552 110 135 110H92.9091V114H135C137.761 114 140 111.761 140 109V79C140 76.2386 137.761 74 135 74H15C12.2386 74 10 76.2386 10 79V109C10 111.761 12.2386 114 15 114H52V110H15C14.4477 110 14 109.552 14 109V79C14 78.4477 14.4477 78 15 78Z"
        fill="black"
      />
      <line
        x1="72.4546"
        y1="100.714"
        x2="72.4546"
        y2="122.714"
        stroke="black"
        strokeWidth="4"
      />
      <line
        x1="61.4546"
        y1="111.714"
        x2="83.4546"
        y2="111.714"
        stroke="black"
        strokeWidth="4"
      />
    </svg>
  );
}
