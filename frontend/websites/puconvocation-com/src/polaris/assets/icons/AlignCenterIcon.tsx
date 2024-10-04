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

export default function AlignCenterIcon({
  size,
}: {
  size?: number;
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
        x1="43"
        y1="66.5"
        x2="156"
        y2="66.5"
        stroke="black"
        strokeWidth="7"
      />
      <line
        x1="63"
        y1="96.5"
        x2="134"
        y2="96.5"
        stroke="black"
        strokeWidth="7"
      />
      <line
        x1="43"
        y1="126.5"
        x2="156"
        y2="126.5"
        stroke="black"
        strokeWidth="7"
      />
    </svg>
  );
}
