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

import { Response } from "@dto/Response";
import { RemoteConfig } from "@dto/index";
import { HttpService } from "@services/index";

export default class RemoteConfigController {
  private BASE_URL = process.env.NEXT_PUBLIC_DYNAMICS_SERVICE_URL as string;

  private httpService: HttpService;

  private CONFIG_ROUTE = this.BASE_URL.concat("/config");

  public constructor(options?: { cookies?: string }) {
    this.httpService = new HttpService(this.BASE_URL, options);
  }

  public async getRemoteConfig(): Promise<Response<RemoteConfig, string>> {
    return await this.httpService.get(`${this.CONFIG_ROUTE}/`);
  }

  public async changeRemoteConfig(
    remoteConfig: RemoteConfig,
  ): Promise<Response<RemoteConfig, string>> {
    return await this.httpService.patch(
      `${this.CONFIG_ROUTE}/change`,
      remoteConfig,
    );
  }
}
