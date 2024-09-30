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
import { AnalyticsService } from "@services/index";
import { useQuery } from "@tanstack/react-query";
import { StatusCode } from "@enums/StatusCode";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

const analyticsService = new AnalyticsService();

const chartConfig = {
  key: {
    label: "Time",
    color: "hsl(var(--chart-2))",
  },
  count: {
    label: "Visitors",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const now = new Date();
const year = Number(format(now, "yyyy"));
const month = Number(format(now, "MM"));
const day = Number(format(now, "dd"));

interface TrafficOnDateChartProps {
  showText?: boolean;  
  showShadowAndBorder?: boolean;
}

export default function TrafficOnDateChart({
  showText = true,
  showShadowAndBorder = true,
}: TrafficOnDateChartProps): JSX.Element {
  const {
    data: analytics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trafficOnDateAnalytics"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await analyticsService.trafficOnDate(year, month, day);
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
    <Card className={`${showShadowAndBorder ? 'shadow border'  : 'shadow-none border-none'} h-fit w-full`}>
      {showText && (
        <CardHeader>
          <CardTitle>Daily Traffic</CardTitle>
          <CardDescription>
            Showing total visitors for {year}-{month}-{day} on the website.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {isLoading ? (
          <Fragment>Loading....</Fragment>
        ) : (
          analytics !== null &&
          analytics !== undefined && (
            <Fragment>
              <ChartContainer config={chartConfig} className={"h-64 w-full"}>
                <AreaChart
                  accessibilityLayer={true}
                  data={analytics}
                  className={"ml-[-2rem]"}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="key"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                    tickFormatter={(value: string) => {
                      return value.length === 1
                        ? "0".concat(value.concat(":00"))
                        : value.concat(":00");
                    }}
                  />
                  <YAxis
                    dataKey="count"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={true}
                    content={
                      <ChartTooltipContent indicator="line" labelKey={"Time"} />
                    }
                  />
                  <Area
                    dataKey="count"
                    type="natural"
                    fill="var(--color-count)"
                    fillOpacity={0.4}
                    stroke="var(--color-count)"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </Fragment>
          )
        )}
      </CardContent>
    </Card>
  );
}
