/*
 * Copyright (c) PU Convocation Management System Authors
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

import { Fragment, type JSX } from "react";

interface ProgressBarProps {
  type?: "linear" | "circular";
}

export default function ProgressBar({
  type = "circular",
}: ProgressBarProps): JSX.Element {
  return (
    <Fragment>
      {type === "linear" ? (
        <div className={`w-full`}>
          <div className="linear-progress-bar">
            <div className="linear-progress-bar-value"></div>
          </div>
        </div>
      ) : (
        <progress className="circular-progress-bar" />
      )}
    </Fragment>
  );
}
