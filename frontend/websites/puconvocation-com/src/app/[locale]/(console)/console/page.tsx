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
import { Link } from "@i18n/routing";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@components/ui";
import { PopularCountriesChart, TrafficOnDateChart } from "@components/charts";
import { AttendeeTable } from "@components/attendee";
import { AnalyticsController, AuthController } from "@controllers/index";
import { cookies } from "next/headers";
import { StatusCode } from "@enums/StatusCode";
import { format } from "date-fns";

const now = new Date();
const year = Number(format(now, "yyyy"));
const month = Number(format(now, "MM"));
const day = Number(format(now, "dd"));

export default async function ConsolePage(): Promise<JSX.Element> {
  const authController = new AuthController({
    cookies: cookies().toString(),
  });

  const analyticsController = new AnalyticsController({
    cookies: cookies().toString(),
  });

  const authResponse = await authController.getCurrentAccount();

  const account =
    authResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in authResponse &&
    typeof authResponse.payload === "object"
      ? authResponse.payload
      : null;

  const dailyVisitorAnalyticsResponse = await analyticsController.trafficOnDate(
    year,
    month,
    day,
  );

  const popularCountriesAnalyticsResponse =
    await analyticsController.popularCountries();

  const popularCountries =
    popularCountriesAnalyticsResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in popularCountriesAnalyticsResponse &&
    typeof popularCountriesAnalyticsResponse.payload === "object"
      ? popularCountriesAnalyticsResponse.payload
      : [];

  const dailyVisitors =
    dailyVisitorAnalyticsResponse.statusCode === StatusCode.SUCCESS &&
    "payload" in dailyVisitorAnalyticsResponse &&
    typeof dailyVisitorAnalyticsResponse.payload === "object"
      ? dailyVisitorAnalyticsResponse.payload
      : [];

  return (
    <div className="bg-white-300 flex min-h-screen flex-col space-y-10 p-4 md:p-10 lg:p-20">
      {/* Analytics Section */}
      <div
        hidden={
          account === null || !account?.iamRoles.includes("read:Analytics")
        }
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Analytics</h2>
          <Button className="bg-red-600 font-semibold hover:bg-red-700" asChild>
            <Link href={`/console/analytics`}>View All</Link>
          </Button>
        </div>

        <div className="cards mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Demographics Card */}
          <Card className="h-full overflow-hidden p-2 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-600">Demographics</CardTitle>
            </CardHeader>
            <CardContent className="h-full py-5">
              <PopularCountriesChart
                analytics={popularCountries}
                showLegends={false}
              />
            </CardContent>
          </Card>

          {/* Traffic Card */}
          <Card className="h-fit overflow-hidden p-2 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-600">Traffic</CardTitle>
            </CardHeader>
            <CardContent className="h-full pt-2">
              <TrafficOnDateChart analytics={dailyVisitors} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendees Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Attendees</h2>
        <Button className="bg-red-600 font-semibold hover:bg-red-700" asChild>
          <Link href={`/console/attendees`}>View All</Link>
        </Button>
      </div>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <AttendeeTable />
        </CardContent>
      </Card>
    </div>
  );
}
