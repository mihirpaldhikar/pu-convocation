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
"use client";
import { Fragment, JSX } from "react";
import { Link } from "@i18n/routing";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@components/ui";
import { AnalyticsController, AttendeeController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { format } from "date-fns";
import { useAuth } from "@hooks/index";
import { useQuery } from "@tanstack/react-query";
import {
  PopularCountriesChart,
  TrafficOnDateChart,
} from "@components/analytics";
import { AttendeeTable } from "@components/attendee";
import IAMPolicies from "@configs/IAMPolicies";
import { isAuthorized } from "@lib/iam_utils";
import { AcademicCapIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { ArrowRight } from "lucide-react";

const now = new Date();
const year = Number(format(now, "yyyy"));
const month = Number(format(now, "MM"));
const day = Number(format(now, "dd"));

function AnalyticsSection() {
  const analyticsController = new AnalyticsController();

  const {
    data: dailyVisitors,
    isLoading: dailyVisitorsLoading,
    isError: dailyVisitorsError,
  } = useQuery({
    queryKey: ["dailyVisitorsAnalytics"],
    queryFn: async () => {
      const dailyVisitorAnalyticsResponse =
        await analyticsController.trafficOnDate(year, month, day);

      return dailyVisitorAnalyticsResponse.statusCode === StatusCode.SUCCESS
        ? dailyVisitorAnalyticsResponse.payload
        : [];
    },
  });

  const {
    data: popularCountries,
    isLoading: popularCountriesLoading,
    isError: popularCountriesError,
  } = useQuery({
    queryKey: ["popularCountriesAnalytics"],
    queryFn: async () => {
      const popularCountriesAnalyticsResponse =
        await analyticsController.popularCountries();

      return popularCountriesAnalyticsResponse.statusCode === StatusCode.SUCCESS
        ? popularCountriesAnalyticsResponse.payload
        : [];
    },
  });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div className={"flex items-center space-x-2"}>
          <ChartBarIcon className={"size-6 text-red-600"} />
          <h2 className="text-2xl font-bold">Analytics</h2>
        </div>
        <Button
          size={"icon"}
          variant={"outline"}
          className="rounded-full"
          asChild={true}
        >
          <Link href={`/console/analytics`}>
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="cards mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Demographics Card */}
        <Card className="h-full overflow-hidden p-2 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600">Demographics</CardTitle>
          </CardHeader>
          <CardContent className="h-full py-5">
            {popularCountriesLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : popularCountriesError || popularCountries === undefined ? (
              <Fragment />
            ) : (
              <PopularCountriesChart
                analytics={popularCountries}
                showLegends={false}
              />
            )}
          </CardContent>
        </Card>

        {/* Traffic Card */}
        <Card className="h-fit overflow-hidden p-2 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600">Visitors Today</CardTitle>
          </CardHeader>
          <CardContent className="h-full pt-2">
            {dailyVisitorsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : dailyVisitorsError || dailyVisitors === undefined ? (
              <Fragment />
            ) : (
              <TrafficOnDateChart analytics={dailyVisitors} />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function AttendeesSection() {
  const attendeeController = new AttendeeController();

  const {
    data: attendees,
    isLoading: attendeesLoading,
    isError: attendeesError,
  } = useQuery({
    queryKey: ["homeAttendees"],
    queryFn: async () => {
      const attendeesListResponse = await attendeeController.getAllAttendees(
        0,
        10,
      );

      return attendeesListResponse.statusCode === StatusCode.SUCCESS
        ? attendeesListResponse.payload.attendees
        : [];
    },
  });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div className={"flex items-center space-x-2"}>
          <AcademicCapIcon className={"size-6 text-red-600"} />
          <h2 className="text-2xl font-bold">Attendees</h2>
        </div>
        <Button
          size={"icon"}
          variant={"outline"}
          className="rounded-full"
          asChild={true}
        >
          <Link href={`/console/attendees`}>
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          {attendeesLoading ? (
            <div className={"space-y-3"}>
              <Skeleton className={"h-10 w-full"}></Skeleton>
              <Skeleton className={"h-10 w-full"}></Skeleton>
              <Skeleton className={"h-10 w-full"}></Skeleton>
              <Skeleton className={"h-10 w-full"}></Skeleton>
            </div>
          ) : attendeesError || attendees === undefined ? (
            <Fragment />
          ) : (
            <AttendeeTable initialAttendees={attendees} />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default function ConsolePage(): JSX.Element {
  const { account } = useAuth();

  if (account === null) return <Fragment />;

  return (
    <div className="bg-white-300 flex min-h-screen flex-col space-y-10 p-4 md:p-10 lg:p-16">
      <div className={"pt-5 lg:pt-0"}>
        <h4 className={"text-3xl font-bold leading-tight"}>
          <span className={"text-red-600"}>Hello,</span>{" "}
          {account.designation.length === 0
            ? `${account.displayName.split(" ")[0]}`
            : `${account.designation} ${account.displayName.split(" ")[0]}`}
        </h4>
      </div>
      {isAuthorized(IAMPolicies.READ_ANALYTICS, account.assignedIAMPolicies) ? (
        <AnalyticsSection />
      ) : (
        <Fragment />
      )}
      {isAuthorized(IAMPolicies.READ_ATTENDEES, account.assignedIAMPolicies) ? (
        <AttendeesSection />
      ) : (
        <Fragment />
      )}
    </div>
  );
}
