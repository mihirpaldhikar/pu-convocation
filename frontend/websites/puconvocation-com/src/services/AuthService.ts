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
import { Account, Response, UpdateUACRuleRequest } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";
import { HTTPService } from "@services/index";

export default class AuthService {
  private BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL as string;

  private httpService = new HTTPService(this.BASE_URL);

  private ACCOUNT_ROUTE = this.BASE_URL.concat("/accounts");
  private UAC_ROUTE = this.BASE_URL.concat("/uac");

  public async getCurrentAccount(): Promise<Response<Account | string>> {
    return await this.httpService.get<Account>(`${this.ACCOUNT_ROUTE}/`);
  }

  public async getAccount(
    identifier: string,
  ): Promise<Response<Account | string>> {
    return await this.httpService.get<Account>(
      `${this.ACCOUNT_ROUTE}/${identifier}`,
    );
  }

  public async getUACRulesForAccount(
    identifier: string,
  ): Promise<Response<Array<string> | string>> {
    return this.httpService.get<Array<string>>(
      `${this.UAC_ROUTE}/${identifier}/rules`,
    );
  }

  public async updateUACRule(
    ruleName: string,
    updateUACRuleRequest: UpdateUACRuleRequest,
  ): Promise<Response<Array<string> | string>> {
    return await this.httpService.patch<Array<string>>(
      `${this.UAC_ROUTE}/rules/${ruleName}/update`,
      updateUACRuleRequest,
    );
  }

  public async createAccount(
    authenticationStrategy: "PASSWORD" | "PASSKEY",
    displayName: string,
    username: string,
    email: string,
    password?: string,
  ): Promise<Response<string>> {
    const handshakeResponse = await this.httpService.post<string>(
      `${this.ACCOUNT_ROUTE}/new`,
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

    if (
      handshakeResponse.statusCode === StatusCode.SUCCESS &&
      "payload" in handshakeResponse &&
      typeof handshakeResponse.payload === "object"
    ) {
      if (authenticationStrategy === "PASSKEY") {
        const passkeyChallenge = handshakeResponse.payload;

        const passkeyCredentials =
          await createPasskeyCredentials(passkeyChallenge);

        return await this.httpService.post(
          `${this.ACCOUNT_ROUTE}/passkeys/validateRegistrationChallenge`,
          {
            identifier: username,
            passkeyCredentials: JSON.stringify(passkeyCredentials),
          },
          201,
          StatusCode.AUTHENTICATION_SUCCESSFUL,
        );
      }

      return handshakeResponse;
    }

    return handshakeResponse;
  }

  public async getAuthenticationStrategy(identifier: string): Promise<
    Response<
      | {
          authenticationStrategy: "UNKNOWN" | "PASSWORD" | "PASSKEY";
        }
      | string
    >
  > {
    return await this.httpService.post<{
      authenticationStrategy: "UNKNOWN" | "PASSWORD" | "PASSKEY";
    }>(`${this.ACCOUNT_ROUTE}/authenticationStrategy`, {
      identifier: identifier,
    });
  }

  public async authenticate(
    authenticationStrategy: "PASSWORD" | "PASSKEY",
    identifier: string,
    password?: string,
  ): Promise<Response<string>> {
    const authenticationHandshake = await this.httpService.post<string>(
      `${this.ACCOUNT_ROUTE}/authenticate`,
      password === undefined
        ? {
            identifier: identifier,
          }
        : {
            identifier: identifier,
            password: password,
          },
    );

    if (
      authenticationHandshake.statusCode === StatusCode.SUCCESS &&
      "payload" in authenticationHandshake &&
      typeof authenticationHandshake.payload === "object"
    ) {
      if (authenticationStrategy === "PASSKEY") {
        const passkeyChallenge = authenticationHandshake.payload;
        const passkeyCredentials = await getPublicCredentials(passkeyChallenge);
        return await this.httpService.post<string>(
          `${this.ACCOUNT_ROUTE}/passkeys/validatePasskeyChallenge`,
          {
            identifier: identifier,
            passkeyCredentials: JSON.stringify(passkeyCredentials),
          },
          200,
          StatusCode.AUTHENTICATION_SUCCESSFUL,
        );
      }

      return authenticationHandshake;
    }

    return authenticationHandshake;
  }

  public async registerPasskey(identifier: string): Promise<Response<string>> {
    const handshakeRequest = await this.httpService.post<string>(
      `${this.ACCOUNT_ROUTE}/passkeys/register`,
    );

    if (
      handshakeRequest.statusCode === StatusCode.SUCCESS &&
      "payload" in handshakeRequest &&
      typeof handshakeRequest.payload === "object"
    ) {
      const passkeyChallenge = handshakeRequest.payload;
      const passkeyCredentials =
        await createPasskeyCredentials(passkeyChallenge);

      return await this.httpService.post(
        `${this.ACCOUNT_ROUTE}/passkeys/validateRegistrationChallenge`,
        {
          identifier: identifier,
          passkeyCredentials: JSON.stringify(passkeyCredentials),
        },
        201,
        StatusCode.PASSKEY_REGISTERED,
      );
    }

    return handshakeRequest;
  }

  public async signOut(): Promise<Response<string>> {
    return await this.httpService.post(`${this.ACCOUNT_ROUTE}/signout`);
  }
}
