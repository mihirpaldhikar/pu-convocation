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
import { Credentials, Response } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";

export default class AuthService {
  private ACCOUNT_SERVICE_URL = (
    process.env.NEXT_PUBLIC_AUTH_SERVICE_URL as string
  ).concat("/accounts");
  private httpClient: AxiosInstance;
  private REQUEST_TIMEOUT = 1000 * 10;

  public constructor() {
    this.httpClient = axios.create({
      baseURL: this.ACCOUNT_SERVICE_URL,
      timeout: this.REQUEST_TIMEOUT,
      withCredentials: true,
    });
  }

  public async sigIn(credentials: Credentials): Promise<Response<string>> {
    try {
      const response = await this.httpClient.post(
        `${this.ACCOUNT_SERVICE_URL}/signin`,
        credentials,
      );

      return {
        statusCode: StatusCode.AUTHENTICATION_SUCCESSFUL,
        payload: response.data["message"] as string,
      } as Response<string>;
    } catch (error) {
      let axiosError = (await error) as AxiosError;
      let errorResponseString = JSON.stringify(
        (await axiosError.response?.data) as string,
      );
      let errorResponse = JSON.parse(errorResponseString);
      return {
        statusCode: StatusCode.AUTHENTICATION_FAILED,
        message: errorResponse["message"],
      } as Response<string>;
    }
  }

  public async getAccount(): Promise<Response<any>> {
    try {
      const response = await this.httpClient.get(
        `${this.ACCOUNT_SERVICE_URL}/`,
      );

      return {
        statusCode: StatusCode.SUCCESS,
        payload: response.data,
      } as Response<string>;
    } catch (error) {
      let axiosError = (await error) as AxiosError;
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
