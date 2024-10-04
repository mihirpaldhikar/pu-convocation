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

export default function CodeIcon({ size }: { size?: number }): JSX.Element {
  return (
    <svg
      height={size ?? 25}
      width={size ?? 25}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M45 99.1394L83.3022 67"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M45.3376 100.392L83.6399 132.531"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M154.302 100.139L116 132.279"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M154.302 99.1394L116 67"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
