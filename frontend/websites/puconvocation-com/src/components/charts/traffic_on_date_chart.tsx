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
  ChartTooltipContent,
} from "@components/ui";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Popular } from "@dto/analytics";

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

interface TrafficOnDateChartProps {
  analytics: Popular[];
}

export default function TrafficOnDateChart({
  analytics,
}: TrafficOnDateChartProps): JSX.Element {
  return (
    <ChartContainer config={chartConfig} className={"h-72 w-full"}>
      <AreaChart
        accessibilityLayer={true}
        data={analytics}
        className={"ml-[-2rem] w-full"}
      >
        <CartesianGrid vertical={true} />
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
        <YAxis dataKey="count" tickLine={true} axisLine={true} tickMargin={8} />
        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent indicator="line" labelKey={"Time"} />}
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
  );
}
