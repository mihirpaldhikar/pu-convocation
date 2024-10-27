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

import { WeeklyTraffic } from "@dto/analytics";

type MergedData = {
  day: string;
  currentWeek: number;
  previousWeek: number;
};

export function mergeWeekData(weeklyTraffic: WeeklyTraffic | null): MergedData[] {
  if (weeklyTraffic === null) {
    return [];
  }
  const previousWeekMap: Record<string, number> =
    weeklyTraffic.previousWeek.reduce(
      (map, data) => {
        map[data.day] = data.requests;
        return map;
      },
      {} as Record<string, number>
    );

  return weeklyTraffic.currentWeek.map((data) => ({
    day: data.day,
    currentWeek: data.requests,
    previousWeek: previousWeekMap[data.day] || 0
  }));
}
