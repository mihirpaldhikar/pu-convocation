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

export default function TextSizeIcon({ size }: { size?: number }): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={size ?? 22}
      width={size ?? 22}
    >
      <path fill="none" d="M0 0h24v24H0V0z"></path>
      <path
        fillOpacity=".36"
        d="M2 20h20c1.1 0 2 .9 2 2s-.9 2-2 2H2c-1.1 0-2-.9-2-2s.9-2 2-2z"
      ></path>
      <path d="M10.63 3.93L6.06 15.58c-.27.68.23 1.42.97 1.42.43 0 .82-.27.98-.68L8.87 14h6.25l.87 2.32c.15.41.54.68.98.68.73 0 1.24-.74.97-1.42L13.37 3.93C13.14 3.37 12.6 3 12 3c-.6 0-1.15.37-1.37.93zM9.62 12L12 5.67 14.38 12H9.62z"></path>
    </svg>
  );
}
