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

import { HttpService } from "@services/index";
import { Response } from "@dto/Response";
import { Popular, WeeklyTraffic } from "@dto/index";
import { format, startOfWeek } from "date-fns";

export default class AnalyticsController {
  private BASE_URL = process.env.NEXT_PUBLIC_DYNAMICS_SERVICE_URL as string;

  private httpService: HttpService;

  private ANALYTICS_ROUTE = this.BASE_URL.concat("/analytics");

  public constructor(options?: { cookies?: string }) {
    this.httpService = new HttpService(this.BASE_URL, options);
  }

  public async sendTelemetry(telemetry: string) {
    return await this.httpService.post(
      `${this.ANALYTICS_ROUTE}/telemetry`,
      undefined,
      {
        header: {
          "x-telemetry": telemetry,
        },
      },
    );
  }

  public async weeklyTraffic(): Promise<Response<WeeklyTraffic, string>> {
    return await this.httpService.get<WeeklyTraffic>(
      `${this.ANALYTICS_ROUTE}/weeklyTraffic?date=${this.getStartOfWeekDate(new Date())}`,
    );
  }

  public async trafficOnDate(
    year: number,
    month: number,
    day: number,
  ): Promise<Response<Array<Popular>, string>> {
    return await this.httpService.get<Array<Popular>>(
      `${this.ANALYTICS_ROUTE}/trafficOnDate?date=${year}-${month}-${day}`,
    );
  }

  public async popularLangs(): Promise<Response<Array<Popular>, string>> {
    return await this.httpService.get<Array<Popular>>(
      `${this.ANALYTICS_ROUTE}/popularLangs`,
    );
  }

  public async popularCountries(): Promise<Response<Array<Popular>, string>> {
    return await this.httpService.get<Array<Popular>>(
      `${this.ANALYTICS_ROUTE}/popularCountries`,
    );
  }

  public async popularStatesOfCountry(
    country: string,
  ): Promise<Response<Array<Popular>, string>> {
    return await this.httpService.get<Array<Popular>>(
      `${this.ANALYTICS_ROUTE}/popularStatesOfCountry?country=${country}`,
    );
  }

  public async popularDistrictsWithInStateOfCountry(
    country: string,
    state: string,
  ): Promise<Response<Array<Popular>, string>> {
    return await this.httpService.get<Array<Popular>>(
      `${this.ANALYTICS_ROUTE}/popularDistrictsWithInStateOfCountry?country=${country}&state=${state}`,
    );
  }

  private getStartOfWeekDate(date: Date): string {
    const startOfWeekDate = startOfWeek(date);
    return format(startOfWeekDate, "yyyy-MM-dd");
  }
}
