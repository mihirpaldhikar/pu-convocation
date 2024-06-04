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

import {
  create as createPasskeyCredentials,
  get as getPublicCredentials,
} from "@github/webauthn-json";
import axios, { AxiosError, AxiosInstance } from "axios";
import { Account, Response } from "@dto/index";
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

  public async getAccount(): Promise<Response<Account | string>> {
    try {
      const response = await this.httpClient.get(
        `${this.ACCOUNT_SERVICE_URL}/`,
      );

      if (response.status === 200) {
        return {
          statusCode: StatusCode.SUCCESS,
          payload: await response.data,
        };
      }
      throw new AxiosError("INTERNAL:Failed to fetch Account.");
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

  public async createAccount(
    authenticationStrategy: "PASSWORD" | "PASSKEY",
    displayName: string,
    username: string,
    email: string,
    password?: string,
  ): Promise<Response<string>> {
    try {
      const response = await this.httpClient.post(
        `${this.ACCOUNT_SERVICE_URL}/new`,
        password === undefined && authenticationStrategy === "PASSKEY"
          ? {
              username: username,
              displayName: displayName,
              email: email,
              authenticationStrategy: authenticationStrategy,
            }
          : {
              username: username,
              displayName: displayName,
              email: email,
              password: password,
              authenticationStrategy: authenticationStrategy,
            },
      );

      if (response.status === 200) {
        if (authenticationStrategy === "PASSKEY") {
          const passkeyChallenge = await response.data;

          const passkeyCredentials =
            await createPasskeyCredentials(passkeyChallenge);

          const challengeResponse = await this.httpClient.post(
            `${this.ACCOUNT_SERVICE_URL}/passkeys/validateRegistrationChallenge`,
            {
              identifier: username,
              passkeyCredentials: JSON.stringify(passkeyCredentials),
            },
          );

          if (challengeResponse.status === 201) {
            return {
              statusCode: StatusCode.PASSKEY_REGISTERED,
              message: "Passkey Registered.",
            } as Response<string>;
          }
        }
        return {
          statusCode: StatusCode.AUTHENTICATION_SUCCESSFUL,
          message: "Account Created Successfully.",
        } as Response<string>;
      }

      throw new AxiosError("INTERNAL:Account Creation Failed.");
    } catch (error) {
      let axiosError = (await error) as AxiosError;
      if (axiosError.message.includes("INTERNAL:")) {
        return {
          statusCode: StatusCode.AUTHENTICATION_FAILED,
          message: axiosError.message.replaceAll("INTERNAL:", ""),
        } as Response<string>;
      }

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

  public async getAuthenticationStrategy(
    identifier: string,
  ): Promise<Response<string>> {
    try {
      const response = await this.httpClient.post(
        `${this.ACCOUNT_SERVICE_URL}/authenticationStrategy`,
        {
          identifier: identifier,
        },
      );

      if (response.status === 200) {
        return {
          statusCode: StatusCode.SUCCESS,
          payload: response.data["authenticationStrategy"],
        } as Response<string>;
      }
      throw new AxiosError("INTERNAL:Request Failed.");
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

  public async authenticate(
    authenticationStrategy: "PASSWORD" | "PASSKEY",
    identifier: string,
    password?: string,
  ): Promise<Response<string>> {
    try {
      const response = await this.httpClient.post(
        `${this.ACCOUNT_SERVICE_URL}/authenticate`,
        password === undefined
          ? {
              identifier: identifier,
            }
          : {
              identifier: identifier,
              password: password,
            },
      );

      if (authenticationStrategy === "PASSKEY") {
        const passkeyChallenge = await response.data;
        const passkeyCredentials = await getPublicCredentials(passkeyChallenge);

        const challengeResponse = await this.httpClient.post(
          `${this.ACCOUNT_SERVICE_URL}/passkeys/validatePasskeyChallenge`,
          {
            identifier: identifier,
            passkeyCredentials: JSON.stringify(passkeyCredentials),
          },
        );

        if (challengeResponse.status === 200) {
          return {
            statusCode: StatusCode.AUTHENTICATION_SUCCESSFUL,
            message: "Authenticated Successfully.",
          } as Response<string>;
        }
      }

      if (response.status === 200) {
        return {
          statusCode: StatusCode.AUTHENTICATION_SUCCESSFUL,
          message: "Authenticated Successfully.",
        } as Response<string>;
      }

      throw new AxiosError("INTERNAL:Authentication Failed.");
    } catch (error) {
      let axiosError = (await error) as AxiosError;
      if (axiosError.message.includes("INTERNAL:")) {
        return {
          statusCode: StatusCode.AUTHENTICATION_FAILED,
          message: axiosError.message.replaceAll("INTERNAL:", ""),
        } as Response<string>;
      }

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

  public async registerPasskey(identifier: string): Promise<Response<string>> {
    try {
      const response = await this.httpClient.post(
        `${this.ACCOUNT_SERVICE_URL}/passkeys/register`,
      );

      if (response.status === 200) {
        const passkeyChallenge = await response.data;
        const passkeyCredentials =
          await createPasskeyCredentials(passkeyChallenge);

        const challengeResponse = await this.httpClient.post(
          `${this.ACCOUNT_SERVICE_URL}/passkeys/validateRegistrationChallenge`,
          {
            identifier: identifier,
            passkeyCredentials: JSON.stringify(passkeyCredentials),
          },
        );

        if (challengeResponse.status === 201) {
          return {
            statusCode: StatusCode.PASSKEY_REGISTERED,
            message: "Passkey Registered.",
          } as Response<string>;
        }
      }

      throw new AxiosError("INTERNAL:Passkey Registration Failed.");
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

  public async signOut(): Promise<Response<string>> {
    try {
      const response = await this.httpClient.post(
        `${this.ACCOUNT_SERVICE_URL}/signout`,
      );
      return {
        statusCode:
          response.status === 200 ? StatusCode.SUCCESS : StatusCode.FAILURE,
        message: response.data["message"],
      };
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
