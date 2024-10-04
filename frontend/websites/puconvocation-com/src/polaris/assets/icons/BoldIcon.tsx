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

export default function BoldIcon({ size }: { size?: number }): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={size ?? 22}
      width={size ?? 22}
    >
      <path d="M16.5,9.5A3.5,3.5,0,0,0,13,6H8.5a1,1,0,0,0-1,1V17a1,1,0,0,0,1,1H13a3.49,3.49,0,0,0,2.44-6A3.5,3.5,0,0,0,16.5,9.5ZM13,16H9.5V13H13a1.5,1.5,0,0,1,0,3Zm0-5H9.5V8H13a1.5,1.5,0,0,1,0,3Z" />
    </svg>
  );
}
