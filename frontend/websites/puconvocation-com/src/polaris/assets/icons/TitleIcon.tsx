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

export default function TitleIcon({ size }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size ?? 36}
      height={size ?? 36}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M98.5785 69H111.579V139H98.5785V69ZM62.3785 139H49.3785V69H62.3785V139ZM99.5785 109H61.2785V97.9H99.5785V109ZM136.536 139V74L142.236 79.9H121.736V69H149.536V139H136.536Z"
        fill="black"
      />
    </svg>
  );
}
