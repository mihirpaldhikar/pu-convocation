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

import { JSX } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@components/ui";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { mergeWeekData } from "@lib/analytics_utils";
import { WeeklyTraffic } from "@dto/analytics";

const chartConfig = {
  currentWeek: {
    label: "Current",
    color: "hsl(var(--chart-1))"
  },
  previousWeek: {
    label: "Previous",
    color: "hsl(var(--chart-2))"
  }
} satisfies ChartConfig;

interface WeeklyTrafficChartProps {
  analytics: WeeklyTraffic | null;
}

export default function WeeklyTrafficChart({
                                             analytics
                                           }: Readonly<WeeklyTrafficChartProps>): JSX.Element {
  return (
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
  );
}
