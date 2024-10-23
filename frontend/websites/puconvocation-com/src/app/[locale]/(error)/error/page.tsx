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
import { SpaceShip } from "@components/graphics";

export default function InternalServerError(): JSX.Element {
  return (
    <div className={"flex min-h-screen"}>
      <div className="m-auto flex flex-col items-center justify-center">
        <SpaceShip />
        <div className={"space-y-5 text-center"}>
          <h2 className={"text-3xl font-black text-red-800"}>Opps!</h2>
          <p className={"font-medium text-gray-600"}>
            Cannot connect to the services at the moment!
            <br />
            Our Engineers have been notified about the issue.
          </p>
        </div>
      </div>
    </div>
  );
}
