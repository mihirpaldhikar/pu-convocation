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

import { create as createPasskeyCredentials, get as getPublicCredentials } from "@github/webauthn-json";
import { Account, AccountInvitation, IAMPolicy, Response } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";
import { HttpService } from "@services/index";

export default class AuthController {
  private BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL as string;

  private httpService: HttpService;

  private ACCOUNT_ROUTE = this.BASE_URL.concat("/accounts");
  private IAM_ROUTE = this.BASE_URL.concat("/iam");

  public constructor(options?: { cookies?: string }) {
    this.httpService = new HttpService(this.BASE_URL, options);
  }

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

  public async updateIAMPoliciesAssignedForAccount(
    uuid: string,
    iamOperations: Array<{
      id: string;
      operation: "ADD" | "REMOVE";
    }>,
  ): Promise<Response<Array<string> | string>> {
    return await this.httpService.post<Array<string>>(
      `${this.ACCOUNT_ROUTE}/updateIAMPolicies`,
      {
        uuid: uuid,
        iamOperations: iamOperations,
      },
    );
  }

  public async createAccount(
    invitationToken: string,
    displayName: string,
    username: string,
    designation: string,
  ): Promise<Response<string>> {
    const handshakeResponse = await this.httpService.post<string>(
      `${this.ACCOUNT_ROUTE}/new?invitationToken=${invitationToken}`,
      {
        username: username,
        displayName: displayName,
        designation: designation,
      },
    );

    if (
      handshakeResponse.statusCode === StatusCode.SUCCESS &&
      "payload" in handshakeResponse &&
      typeof handshakeResponse.payload === "object"
    ) {
      const passkeyChallenge = handshakeResponse.payload;

      const passkeyCredentials =
        await createPasskeyCredentials(passkeyChallenge);

      return await this.httpService.post(
        `${this.ACCOUNT_ROUTE}/passkeys/validateRegistrationChallenge`,
        {
          identifier: username,
          passkeyCredentials: JSON.stringify(passkeyCredentials),
        },
        {
          expectedStatusCode: 201,
          expectedResponseCode: StatusCode.AUTHENTICATION_SUCCESSFUL,
        },
      );
    }

    return handshakeResponse;
  }

  public async authenticate(identifier: string): Promise<Response<string>> {
    const authenticationHandshake = await this.httpService.post<string>(
      `${this.ACCOUNT_ROUTE}/authenticate`,
      {
        identifier: identifier,
      },
    );

    if (
      authenticationHandshake.statusCode === StatusCode.SUCCESS &&
      "payload" in authenticationHandshake &&
      typeof authenticationHandshake.payload === "object"
    ) {
      const passkeyChallenge = authenticationHandshake.payload;
      const passkeyCredentials = await getPublicCredentials(passkeyChallenge);
      return await this.httpService.post<string>(
        `${this.ACCOUNT_ROUTE}/passkeys/validatePasskeyChallenge`,
        {
          identifier: identifier,
          passkeyCredentials: JSON.stringify(passkeyCredentials),
        },
        {
          expectedStatusCode: 200,
          expectedResponseCode: StatusCode.AUTHENTICATION_SUCCESSFUL,
        },
      );
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
        {
          expectedStatusCode: 201,
          expectedResponseCode: StatusCode.PASSKEY_REGISTERED,
        },
      );
    }

    return handshakeRequest;
  }

  public async sendAccountInvitations(
    invitations: Array<AccountInvitation>,
  ): Promise<Response<any | string>> {
    return await this.httpService.post<any>(
      `${this.ACCOUNT_ROUTE}/sendInvitations`,
      {
        invites: invitations,
      },
      {
        expectedStatusCode: 201,
      },
    );
  }

  public async getIAMPolicy(
    invitations: Array<AccountInvitation>,
  ): Promise<Response<any | string>> {
    return await this.httpService.post<any>(
      `${this.ACCOUNT_ROUTE}/sendInvitations`,
      {
        invites: invitations,
      },
      {
        expectedStatusCode: 201,
      },
    );
  }

  public async getAllIAMPolicies(): Promise<
    Response<Array<IAMPolicy> | string>
  > {
    return await this.httpService.get<Array<IAMPolicy>>(
      `${this.IAM_ROUTE}/allPolicies`,
    );
  }

  public async signOut(): Promise<Response<string>> {
    return await this.httpService.post(`${this.ACCOUNT_ROUTE}/signout`);
  }
}
