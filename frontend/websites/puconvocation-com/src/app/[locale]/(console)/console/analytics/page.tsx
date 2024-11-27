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
import {
  PopularCountriesChart,
  TrafficOnDateChart,
  WeeklyTrafficChart,
} from "@components/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@components/ui";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { AnalyticsController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";

const now = new Date();
const year = Number(format(now, "yyyy"));
const month = Number(format(now, "MM"));
const day = Number(format(now, "dd"));

const startOfCurrentWeek = startOfWeek(now);
const endOfCurrentWeek = endOfWeek(now);

const analyticsController = new AnalyticsController();

export default function AnalyticsPage(): JSX.Element {
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

  const {
    data: weeklyVisitors,
    isLoading: weeklyVisitorsLoading,
    isError: weeklyVisitorsError,
  } = useQuery({
    queryKey: ["weeklyVisitorsAnalytics"],
    queryFn: async () => {
      const weeklyVisitorsAnalyticsResponse =
        await analyticsController.weeklyTraffic();

      return weeklyVisitorsAnalyticsResponse.statusCode === StatusCode.SUCCESS
        ? weeklyVisitorsAnalyticsResponse.payload
        : null;
    },
  });

  return (
    <div className={"flex min-h-screen flex-col space-y-10 p-4 md:p-10"}>
      <div className={"space-y-3"}>
        <h1 className={"text-2xl font-bold"}>
          <ChartBarIcon className={"inline-block size-6 fill-red-600"} />{" "}
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
          {dailyVisitorsLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : dailyVisitorsError ||
            dailyVisitors === undefined ||
            dailyVisitors === null ? (
            <Fragment />
          ) : (
            <TrafficOnDateChart analytics={dailyVisitors} />
          )}
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
            {weeklyVisitorsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : weeklyVisitorsError || weeklyVisitors === undefined ? (
              <Fragment />
            ) : (
              <WeeklyTrafficChart analytics={weeklyVisitors} />
            )}
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
            {popularCountriesLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : popularCountriesError || popularCountries === undefined ? (
              <Fragment />
            ) : (
              <PopularCountriesChart
                analytics={popularCountries}
                showLegends={true}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
