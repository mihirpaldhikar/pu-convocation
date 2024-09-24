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

import { JSX } from "react";
import {
  PopularCountriesChart,
  TrafficOnDateChart,
  WeeklyTrafficChart,
} from "@components/charts";
import { DynamicIcon } from "@components/index";

export default function AnalyticsPage(): JSX.Element {
  return (
    <div className={"flex min-h-screen flex-col space-y-10 p-4 md:p-10"}>
      <div className={"space-y-3"}>
        <h1 className={"text-2xl font-bold"}>
          <DynamicIcon
            icon={"ChartBarIcon"}
            className={"inline-block size-6 fill-red-600"}
            outline={false}
          />{" "}
          Analytics
        </h1>
        <p className={"text-xs text-gray-600"}>
          Gain valuable insights into your data with Analytics. Track your br
          performance, identify trends, and make informed decisions to drive
          your success.
        </p>
      </div>
      <TrafficOnDateChart />
      <div className={"grid grid-cols-1 gap-4 md:grid-cols-2"}>
        <WeeklyTrafficChart />
        <PopularCountriesChart />
      </div>
    </div>
  );
}
