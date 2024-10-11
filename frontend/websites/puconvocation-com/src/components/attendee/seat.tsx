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

import { JSX } from "react";

interface SeatProps {
  number: number;
  active?: boolean;
  hidden?: boolean;
}

export default function Seat({
  number,
  active = false,
}: SeatProps): JSX.Element {
  return (
    <div className={"relative z-0 block h-5 w-5"}>
      <svg
        width="24"
        height="28"
        viewBox="0 0 24 28"
        fill="none"
        className={`border ${
          active ? "border-red-700" : "border-gray-400"
        } rounded-t-full`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          y="7.67126"
          width="24"
          height="20.3288"
          className={`${active ? "fill-red-500" : "fill-gray-100"}`}
        />
        <ellipse
          cx="12"
          cy="8.18265"
          rx="12"
          ry="8.18265"
          className={`${active ? "fill-red-500" : "fill-gray-100"}`}
        />
      </svg>
      <span
        className={`absolute inset-0 z-10 flex items-center justify-center pl-1 pt-3 text-xs font-medium 
        ${active ? "text-white" : "text-gray-500"}`}
      >
        {number}
      </span>
    </div>
  );
}
