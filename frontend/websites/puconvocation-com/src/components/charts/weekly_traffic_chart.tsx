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

"use client";

import { Fragment, JSX } from "react";
import { AnalyticsController } from "@controllers/index";
import { useQuery } from "@tanstack/react-query";
import { StatusCode } from "@enums/StatusCode";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { endOfWeek, startOfWeek } from "date-fns";
import { mergeWeekData } from "@lib/analytics_utils";
import { DynamicIcon } from "@components/index";

const analyticsService = new AnalyticsController();

const chartConfig = {
  currentWeek: {
    label: "Current",
    color: "hsl(var(--chart-1))",
  },
  previousWeek: {
    label: "Previous",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const today = new Date();

const startOfCurrentWeek = startOfWeek(today);
const endOfCurrentWeek = endOfWeek(today);

export default function WeeklyTrafficChart(): JSX.Element {
  const {
    data: analytics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["weeklyTrafficAnalytics"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await analyticsService.weeklyTraffic();
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        return response.payload;
      }
      return null;
    },
  });

  return (
    <Card className={"h-fit w-full shadow-none"}>
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
        {isLoading ? (
          <Fragment>Loading....</Fragment>
        ) : (
          analytics !== null &&
          analytics !== undefined && (
            <Fragment>
              <ChartContainer config={chartConfig} className={"h-72 w-full"}>
                <BarChart
                  accessibilityLayer={true}
                  data={mergeWeekData(analytics)}
                  className={"ml-[-2rem]"}
                >
                  <CartesianGrid vertical={true} />
                  <XAxis
                    dataKey="day"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                    tickFormatter={(value: string) => {
                      return value.substring(0, 3);
                    }}
                  />

                  <YAxis
                    dataKey="currentWeek"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                  />

                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar
                    dataKey="currentWeek"
                    type="natural"
                    fill="var(--color-currentWeek)"
                    fillOpacity={1}
                    radius={4}
                    stroke="var(--color-currentWeek)"
                    stackId="a"
                  />
                  <Bar
                    dataKey="previousWeek"
                    type="natural"
                    fill="var(--color-previousWeek)"
                    fillOpacity={1}
                    radius={4}
                    stroke="var(--color-previousWeek)"
                    stackId="b"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </Fragment>
          )
        )}
      </CardContent>
      <CardFooter>
        <div
          className={`${(analytics?.surge ?? 0 >= 0) ? "text-green-700" : "text-red-700"} flex w-full items-start gap-2 text-sm`}
        >
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <DynamicIcon
                icon={
                  (analytics?.surge ?? 0 >= 0)
                    ? "ArrowTrendingUpIcon"
                    : "ArrowTrendingDownIcon"
                }
              />{" "}
              Trending {(analytics?.surge ?? 0 >= 0) ? "up" : "down"} by{" "}
              {analytics?.surge ?? 0}% this week as compared to previous week.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
