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

import { Response } from "@dto/Response";
import { WebsiteConfig } from "@dto/index";
import { HTTPService } from "@services/index";

export default class DynamicsService {
  private BASE_URL = process.env.NEXT_PUBLIC_DYNAMICS_SERVICE_URL as string;

  private httpService = new HTTPService(this.BASE_URL);

  private CONFIG_ROUTE = this.BASE_URL.concat("/websiteConfig");

  public async getWebsiteConfig(): Promise<Response<WebsiteConfig | string>> {
    return await this.httpService.get(`${this.CONFIG_ROUTE}/`);
  }
}
