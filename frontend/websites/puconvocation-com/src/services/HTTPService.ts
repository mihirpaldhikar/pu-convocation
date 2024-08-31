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
import { Response } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";

export default class HTTPService {
  private httpClient: AxiosInstance;

  private REQUEST_TIMEOUT = 1000 * 10;

  public constructor(baseURL: string) {
    this.httpClient = axios.create({
      baseURL: baseURL,
      timeout: this.REQUEST_TIMEOUT,
      withCredentials: true,
    });
  }

  public async get<T>(
    route: string,
    expectedStatusCode: number = 200,
    expectedResponseCode: StatusCode = StatusCode.SUCCESS,
  ): Promise<Response<T | string>> {
    try {
      const response = await this.httpClient.get(`${route}`);

      if (response.status === expectedStatusCode) {
        return {
          statusCode: expectedResponseCode,
          payload: await response.data,
        } as Response<T>;
      }
      throw new AxiosError("INTERNAL:Unknown Error Occurred.");
    } catch (error) {
      return await this.errorHandler(error);
    }
  }

  public async post<T>(
    route: string,
    body?: any,
    expectedStatusCode: number = 200,
    expectedResponseCode: StatusCode = StatusCode.SUCCESS,
  ): Promise<Response<T | string>> {
    try {
      const response = await this.httpClient.post(`${route}`, body);

      if (response.status === expectedStatusCode) {
        return {
          statusCode: expectedResponseCode,
          payload: await response.data,
        } as Response<T>;
      }
      throw new AxiosError("INTERNAL:Unknown Error Occurred.");
    } catch (error) {
      return await this.errorHandler(error);
    }
  }

  public async patch<T>(
    route: string,
    body: any,
    expectedStatusCode: number = 200,
    expectedResponseCode: StatusCode = StatusCode.SUCCESS,
  ): Promise<Response<T | string>> {
    try {
      const response = await this.httpClient.patch(`${route}`, body);

      if (response.status === expectedStatusCode) {
        return {
          statusCode: expectedResponseCode,
          payload: await response.data,
        } as Response<T>;
      }
      throw new AxiosError("INTERNAL:Unknown Error Occurred.");
    } catch (error) {
      return await this.errorHandler(error);
    }
  }

  private async errorHandler(error: any): Promise<Response<string>> {
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
