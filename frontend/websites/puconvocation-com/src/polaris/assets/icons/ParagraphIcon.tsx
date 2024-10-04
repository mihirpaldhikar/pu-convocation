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

export default function ParagraphIcon({
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
      <path
        d="M72.6207 137V67H101.421C107.621 67 112.921 68 117.321 70C121.787 72 125.221 74.8667 127.621 78.6C130.021 82.3333 131.221 86.7667 131.221 91.9C131.221 97.0333 130.021 101.467 127.621 105.2C125.221 108.933 121.787 111.8 117.321 113.8C112.921 115.8 107.621 116.8 101.421 116.8H79.8207L85.6207 110.7V137H72.6207ZM85.6207 112.1L79.8207 105.8H100.821C106.554 105.8 110.854 104.6 113.721 102.2C116.654 99.7333 118.121 96.3 118.121 91.9C118.121 87.4333 116.654 84 113.721 81.6C110.854 79.2 106.554 78 100.821 78H79.8207L85.6207 71.6V112.1Z"
        fill="black"
      />
    </svg>
  );
}
