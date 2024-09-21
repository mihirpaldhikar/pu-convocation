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

import { HttpService } from "@services/index";
import { Response } from "@dto/Response";
import { WeeklyTraffic } from "@dto/index";
import { format, startOfWeek } from "date-fns";

export default class AnalyticsService {
  private BASE_URL = process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL as string;

  private httpService = new HttpService(this.BASE_URL);

  private ANALYTICS_ROUTE = this.BASE_URL.concat("/analytics");

  public async weeklyTrafficAnalytics(): Promise<
    Response<WeeklyTraffic | string>
  > {
    return await this.httpService.get<WeeklyTraffic>(
      `${this.ANALYTICS_ROUTE}/weeklyTrafficAnalytics?date=${this.getStartOfWeekDate(new Date())}`,
    );
  }

  private getStartOfWeekDate(date: Date): string {
    const startOfWeekDate = startOfWeek(date);
    return format(startOfWeekDate, "yyyy-MM-dd");
  }
}
