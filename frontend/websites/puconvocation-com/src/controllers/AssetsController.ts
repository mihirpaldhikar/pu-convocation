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

export default class AssetsController {
  private BASE_URL = process.env.NEXT_PUBLIC_DYNAMICS_SERVICE_URL as string;

  private httpService = new HttpService(this.BASE_URL);

  private ASSETS_ROUTE = this.BASE_URL.concat("/assets");

  public async uploadImage(
    file: File,
  ): Promise<Response<{ url: string } | string>> {
    const form = new FormData();
    form.append(file.name, file);
    return this.httpService.post<{ url: string }>(
      `${this.ASSETS_ROUTE}/images/upload`,
      form,
    );
  }

  public async uploadAvatar(
    file: File,
  ): Promise<Response<{ url: string } | string>> {
    const form = new FormData();
    form.append(file.name, file);
    return this.httpService.post<{ url: string }>(
      `${this.ASSETS_ROUTE}/avatars/upload`,
      form,
    );
  }

  public async uploadDocument(
    file: File,
  ): Promise<Response<{ url: string } | string>> {
    const form = new FormData();
    form.append(file.name, file);
    return this.httpService.post<{ url: string }>(
      `${this.ASSETS_ROUTE}/documents/upload`,
      form,
    );
  }

  public async uploadInstructions(
    instructions: string,
  ): Promise<Response<{ url: string } | string>> {
    const blob = new Blob([instructions], { type: "text/plain" });
    const file = new File([blob], "instructions.md", { type: "text/markdown" });
    const form = new FormData();
    form.append(file.name, file);
    return this.httpService.post<{ url: string }>(
      `${this.ASSETS_ROUTE}/documents/instructions/upload`,
      form,
    );
  }

  public async getImages(): Promise<Response<Array<string> | string>> {
    return this.httpService.get<Array<string>>(`${this.ASSETS_ROUTE}/images`);
  }

  public async getAvatars(): Promise<Response<Array<string> | string>> {
    return this.httpService.get<Array<string>>(`${this.ASSETS_ROUTE}/avatars`);
  }

  public async getDocuments(): Promise<Response<Array<string> | string>> {
    return this.httpService.get<Array<string>>(
      `${this.ASSETS_ROUTE}/documents`,
    );
  }
}
