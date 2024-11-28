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

import {
  create as createPasskeyCredentials,
  CredentialCreationOptionsJSON,
  get as getPublicCredentials,
} from "@github/webauthn-json";
import {
  Account,
  AccountInvitation,
  ErrorResponse,
  IAMPolicy,
  Response,
  UpdateAccountIAMPoliciesRequest,
} from "@dto/index";
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

  public async getCurrentAccount(): Promise<Response<Account, string>> {
    return await this.httpService.get<Account>(`${this.ACCOUNT_ROUTE}/`);
  }

  public async getAccount(
    identifier: string,
  ): Promise<Response<Account, string>> {
    return await this.httpService.get<Account>(
      `${this.ACCOUNT_ROUTE}/${identifier}`,
    );
  }

  public async createAccount(
    invitationToken: string,
    displayName: string,
    username: string,
    designation: string,
  ): Promise<Response<string, string>> {
    try {
      const handshakeResponse =
        await this.httpService.post<CredentialCreationOptionsJSON>(
          `${this.ACCOUNT_ROUTE}/new?invitationToken=${invitationToken}`,
          {
            username: username,
            displayName: displayName,
            designation: designation,
          },
        );

      if (handshakeResponse.statusCode === StatusCode.SUCCESS) {
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

      return <ErrorResponse<string>>handshakeResponse;
    } catch (error) {
      return {
        statusCode: StatusCode.FAILURE,
        error: "Authentication operation was cancelled.",
      };
    }
  }

  public async authenticate(
    identifier: string,
  ): Promise<Response<string, string>> {
    try {
      const handshakeResponse =
        await this.httpService.post<CredentialCreationOptionsJSON>(
          `${this.ACCOUNT_ROUTE}/authenticate`,
          {
            identifier: identifier,
          },
        );

      if (handshakeResponse.statusCode === StatusCode.SUCCESS) {
        const passkeyChallenge = handshakeResponse.payload;
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
      return <ErrorResponse<string>>handshakeResponse;
    } catch (error) {
      return {
        statusCode: StatusCode.FAILURE,
        error: "Authentication operation was cancelled.",
      };
    }
  }

  public async registerPasskey(
    identifier: string,
  ): Promise<Response<{ message: string }, string>> {
    try {
      const handshakeResponse =
        await this.httpService.post<CredentialCreationOptionsJSON>(
          `${this.ACCOUNT_ROUTE}/passkeys/register`,
        );

      if (handshakeResponse.statusCode === StatusCode.SUCCESS) {
        const passkeyChallenge = handshakeResponse.payload;
        const passkeyCredentials =
          await createPasskeyCredentials(passkeyChallenge);

        return await this.httpService.post<{ message: string }>(
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

      return <ErrorResponse<string>>handshakeResponse;
    } catch (error) {
      return {
        statusCode: StatusCode.FAILURE,
        error: "Passkey registration  was cancelled.",
      };
    }
  }

  public async sendAccountInvitations(
    invitations: Array<AccountInvitation>,
  ): Promise<Response<never, string>> {
    return await this.httpService.post<never>(
      `${this.ACCOUNT_ROUTE}/sendInvitations`,
      {
        invites: invitations,
      },
      {
        expectedStatusCode: 201,
      },
    );
  }

  public async getIAMPolicies(): Promise<Response<Array<IAMPolicy>, string>> {
    return await this.httpService.get<Array<IAMPolicy>>(
      `${this.IAM_ROUTE}/policies/all`,
    );
  }

  public async updateAccountIAMPolicies(
    updateAccountIAMPoliciesRequest: UpdateAccountIAMPoliciesRequest,
  ): Promise<Response<Array<string>, string>> {
    return await this.httpService.post<Array<string>>(
      `${this.ACCOUNT_ROUTE}/updateIAMPolicies`,
      updateAccountIAMPoliciesRequest,
    );
  }

  public async signOut(): Promise<Response<string, string>> {
    return await this.httpService.post(`${this.ACCOUNT_ROUTE}/signout`);
  }

  public async getAllAccounts(): Promise<Response<Array<Account>, string>> {
    return await this.httpService.get<Array<Account>>(
      `${this.ACCOUNT_ROUTE}/all`,
    );
  }

  public async suspendAccount(
    uuid: string,
    suspend: boolean,
  ): Promise<Response<string, string>> {
    return await this.httpService.patch<string>(
      `${this.ACCOUNT_ROUTE}/update`,
      {
        uuid: uuid,
        suspended: suspend,
      },
    );
  }
}
