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

export default function SubHeadingIcon({
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
        d="M85.8999 73.8H97.0799V134H85.8999V73.8ZM54.7679 134H43.5879V73.8H54.7679V134ZM86.7599 108.2H53.8219V98.654H86.7599V108.2ZM108.051 120.326V112.586L137.721 73.8H149.675L120.435 112.586L114.845 110.866H162.575V120.326H108.051ZM141.075 134V120.326L141.419 110.866V98.74H151.911V134H141.075Z"
        fill="black"
      />
    </svg>
  );
}
