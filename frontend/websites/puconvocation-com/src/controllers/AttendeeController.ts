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
  Attendee,
  AttendeesInEnclosure,
  AttendeeWithEnclosureMetadata,
  AttendeeWithPagination,
  Response,
} from "@dto/index";
import { HttpService } from "@services/index";

export default class AttendeeController {
  private BASE_URL = process.env.NEXT_PUBLIC_DYNAMICS_SERVICE_URL as string;

  private httpService: HttpService;

  private ATTENDEE_ROUTES = this.BASE_URL.concat("/attendees");

  public constructor(options?: { cookies?: string }) {
    this.httpService = new HttpService(this.BASE_URL, options);
  }

  public async getAttendee(
    identifier: string,
  ): Promise<Response<AttendeeWithEnclosureMetadata, string>> {
    return await this.httpService.get<AttendeeWithEnclosureMetadata>(
      `${this.ATTENDEE_ROUTES}/${identifier}`,
    );
  }

  public async getTotalAttendeesCount(): Promise<
    Response<{ count: number }, string>
  > {
    return await this.httpService.get<{ count: number }>(
      `${this.ATTENDEE_ROUTES}/totalCount`,
    );
  }

  public async getAllAttendees(
    page: number,
    limit: number,
  ): Promise<Response<AttendeeWithPagination, string>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return await this.httpService.get<AttendeeWithPagination>(
      `${this.ATTENDEE_ROUTES}/all?${queryParams.toString()}`,
    );
  }

  public async searchAttendees(
    query: string,
  ): Promise<Response<Array<Attendee>, string>> {
    const queryParams = new URLSearchParams({
      query: query.trim(),
    });

    return await this.httpService.get<Array<Attendee>>(
      `${this.ATTENDEE_ROUTES}/search?${queryParams.toString()}`,
    );
  }

  public async getAttendeeFromVerificationToken(
    token: string,
  ): Promise<Response<Attendee, string>> {
    return await this.httpService.get<Attendee>(
      `${this.ATTENDEE_ROUTES}/verificationToken/${token}`,
    );
  }

  public async uploadAttendeeList(
    file: File,
  ): Promise<Response<string, string>> {
    const form = new FormData();
    form.append(file.name, file);
    return await this.httpService.post<string>(
      `${this.ATTENDEE_ROUTES}/upload`,
      form,
    );
  }

  public async createTransaction(
    studentEnrollmentNumber: string,
  ): Promise<Response<AttendeeWithEnclosureMetadata, string>> {
    return await this.httpService.post<AttendeeWithEnclosureMetadata>(
      `${this.BASE_URL}/transactions/new`,
      {
        studentEnrollmentNumber: studentEnrollmentNumber,
      },
      {
        expectedStatusCode: 200,
      },
    );
  }

  public async mutateAttendeeLock(
    locked: boolean,
  ): Promise<Response<any, string>> {
    return await this.httpService.post<any>(
      `${this.ATTENDEE_ROUTES}/mutateAttendeeLock?locked=${locked}`,
    );
  }

  public async attendeesInEnclosure(
    enclosure: string,
  ): Promise<Response<AttendeesInEnclosure, string>> {
    return await this.httpService.get<any>(
      `${this.ATTENDEE_ROUTES}/enclosure/${enclosure}`,
    );
  }
}
