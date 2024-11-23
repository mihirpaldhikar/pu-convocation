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

import { Fragment, JSX } from "react";
import { Link } from "@i18n/routing";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/ui";
import {
  AnalyticsController,
  AttendeeController,
  AuthController,
} from "@controllers/index";
import { cookies } from "next/headers";
import { StatusCode } from "@enums/StatusCode";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { Account } from "@dto/index";

const now = new Date();
const year = Number(format(now, "yyyy"));
const month = Number(format(now, "MM"));
const day = Number(format(now, "dd"));

interface ProtectedSectionProps {
  account: Account | null;
  cookies: string;
}

async function AnalyticsSection({
  account,
  cookies,
}: Readonly<ProtectedSectionProps>) {
  if (account === null || !account?.iamRoles.includes("read:Analytics")) {
    return <Fragment />;
  }

  const PopularCountriesChart = dynamic(
    () => import("@components/analytics/popular_countries_chart"),
    {
      loading: () => <p>Loading...</p>,
    },
  );

  const TrafficOnDateChart = dynamic(
    () => import("@components/analytics/traffic_on_date_chart"),
    {
      loading: () => <p>Loading...</p>,
    },
  );

  const analyticsController = new AnalyticsController({
    cookies: cookies,
  });

  const dailyVisitorAnalyticsResponse = await analyticsController.trafficOnDate(
    year,
    month,
    day,
  );

  const popularCountriesAnalyticsResponse =
    await analyticsController.popularCountries();

  const popularCountries =
    popularCountriesAnalyticsResponse.statusCode === StatusCode.SUCCESS
      ? popularCountriesAnalyticsResponse.payload
      : [];

  const dailyVisitors =
    dailyVisitorAnalyticsResponse.statusCode === StatusCode.SUCCESS
      ? dailyVisitorAnalyticsResponse.payload
      : [];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Analytics</h2>
        <Button
          className="bg-red-600 font-semibold hover:bg-red-700"
          asChild={true}
        >
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
    </section>
  );
}

async function AttendeesSection({
  account,
  cookies,
}: Readonly<ProtectedSectionProps>) {
  if (
    account === null ||
    (!account?.iamRoles.includes("write:Attendee") &&
      !account?.iamRoles.includes("read:Attendee"))
  ) {
    return <Fragment />;
  }
  const AttendeeTable = dynamic(
    () => import("@components/attendee/attendee_table"),
    {
      loading: () => <p>Loading...</p>,
    },
  );

  const attendeeController = new AttendeeController({
    cookies: cookies,
  });

  const attendeesListResponse = await attendeeController.getAllAttendees(0, 10);

  const attendees =
    attendeesListResponse.statusCode === StatusCode.SUCCESS
      ? attendeesListResponse.payload.attendees
      : [];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Attendees</h2>
        <Button className="bg-red-600 font-semibold hover:bg-red-700" asChild>
          <Link href={`/console/attendees`}>View All</Link>
        </Button>
      </div>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <AttendeeTable initialAttendees={attendees} />
        </CardContent>
      </Card>
    </section>
  );
}

export default async function ConsolePage(): Promise<JSX.Element> {
  const agentCookies = await cookies();

  const authController = new AuthController({
    cookies: agentCookies.toString(),
  });

  const authResponse = await authController.getCurrentAccount();

  const account =
    authResponse.statusCode === StatusCode.SUCCESS
      ? authResponse.payload
      : null;

  return (
    <div className="bg-white-300 flex min-h-screen flex-col space-y-10 p-4 md:p-10 lg:p-20">
      <AnalyticsSection account={account} cookies={agentCookies.toString()} />
      <AttendeesSection account={account} cookies={agentCookies.toString()} />
    </div>
  );
}
