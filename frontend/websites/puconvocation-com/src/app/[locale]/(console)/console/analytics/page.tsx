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
import { PopularCountriesChart, TrafficOnDateChart, WeeklyTrafficChart } from "@components/charts";
import { DynamicIcon } from "@components/graphics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { AnalyticsController } from "@controllers/index";
import { cookies } from "next/headers";
import { StatusCode } from "@enums/StatusCode";

const now = new Date();
const year = Number(format(now, "yyyy"));
const month = Number(format(now, "MM"));
const day = Number(format(now, "dd"));

const startOfCurrentWeek = startOfWeek(now);
const endOfCurrentWeek = endOfWeek(now);

export default async function AnalyticsPage(): Promise<JSX.Element> {
  const analyticsController = new AnalyticsController({
    cookies: cookies().toString(),
  });

  const dailyVisitorAnalyticsResponse = await analyticsController.trafficOnDate(
    year,
    month,
    day,
  );

  const weeklyVisitorsAnalyticsResponse =
    await analyticsController.weeklyTraffic();

  const popularCountriesAnalyticsResponse =
    await analyticsController.popularCountries();

  const dailyVisitors =
    dailyVisitorAnalyticsResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in dailyVisitorAnalyticsResponse &&
    typeof dailyVisitorAnalyticsResponse.payload === "object"
      ? dailyVisitorAnalyticsResponse.payload
      : [];

  const weeklyVisitors =
    weeklyVisitorsAnalyticsResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in weeklyVisitorsAnalyticsResponse &&
    typeof weeklyVisitorsAnalyticsResponse.payload === "object"
      ? weeklyVisitorsAnalyticsResponse.payload
      : null;

  const popularCountries =
    popularCountriesAnalyticsResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in popularCountriesAnalyticsResponse &&
    typeof popularCountriesAnalyticsResponse.payload === "object"
      ? popularCountriesAnalyticsResponse.payload
      : [];

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
      <Card>
        <CardHeader>
          <CardTitle>Daily Visitors</CardTitle>
          <CardDescription>
            Showing total visitors for {year}-{month}-{day} on the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrafficOnDateChart analytics={dailyVisitors} />
        </CardContent>
      </Card>
      <div className={"grid grid-cols-1 gap-4 md:grid-cols-2"}>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Traffic</CardTitle>
            <CardDescription>
              Showing total visitors between {startOfCurrentWeek.getFullYear()}-
              {startOfCurrentWeek.getMonth()}-{startOfCurrentWeek.getDate()} and{" "}
              {endOfCurrentWeek.getFullYear()}-{endOfCurrentWeek.getMonth()}-
              {endOfCurrentWeek.getDate()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyTrafficChart analytics={weeklyVisitors} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Countries</CardTitle>
            <CardDescription>
              Identify the top 5 countries with the highest visitor volume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PopularCountriesChart analytics={popularCountries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
