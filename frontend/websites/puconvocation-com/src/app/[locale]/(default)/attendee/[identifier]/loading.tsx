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

import {JSX} from "react";
import {ProgressBar} from "@components/index";

export default function PageLoading(): JSX.Element {
  return (
    <div className={"flex h-screen"}>
      <div className={"m-auto w-1/2 lg:w-1/6"}>
        <ProgressBar type={"linear"} />
      </div>
    </div>
  );
}
