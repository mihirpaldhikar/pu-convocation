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

import axios, { AxiosError, AxiosInstance } from "axios";
import { Response } from "@dto/Response";
import { WebsiteConfig } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";

export default class DynamicsService {
  private BASE_URL = process.env.NEXT_PUBLIC_DYNAMICS_SERVICE_URL as string;

  private CONFIG_ROUTE = this.BASE_URL.concat("/websiteConfig");

  private httpClient: AxiosInstance;

  private REQUEST_TIMEOUT = 1000 * 10;

  public constructor() {
    this.httpClient = axios.create({
      baseURL: this.BASE_URL,
      timeout: this.REQUEST_TIMEOUT,
      withCredentials: true,
    });
  }

  public async getWebsiteConfig(): Promise<Response<WebsiteConfig | string>> {
    try {
      const response = await this.httpClient.get(`${this.CONFIG_ROUTE}/`);

      if (response.status === 200) {
        return {
          statusCode: StatusCode.SUCCESS,
          payload: await response.data,
        };
      }
      throw new AxiosError("INTERNAL:Failed to fetch website config.");
    } catch (error) {
      let axiosError = (await error) as AxiosError;
      if (axiosError.message.includes("INTERNAL:")) {
        return {
          statusCode: StatusCode.FAILURE,
          message: axiosError.message.replaceAll("INTERNAL:", ""),
        } as Response<string>;
      }

      let errorResponseString = JSON.stringify(
        (await axiosError.response?.data) as string,
      );
      let errorResponse = JSON.parse(errorResponseString);

      return {
        statusCode: StatusCode.FAILURE,
        message: errorResponse["message"],
      } as Response<string>;
    }
  }
}
