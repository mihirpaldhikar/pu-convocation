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

import {Attendee, AttendeeWithEnclosureMetadata, AttendeeWithPagination, Response,} from "@dto/index";
import {HttpService} from "@services/index";

export default class AttendeeController {
  private BASE_URL = process.env.NEXT_PUBLIC_DYNAMICS_SERVICE_URL as string;

  private httpService = new HttpService(this.BASE_URL);

  private ATTENDEE_ROUTES = this.BASE_URL.concat("/attendees");

  public async getAttendee(
    identifier: string,
  ): Promise<Response<AttendeeWithEnclosureMetadata | string>> {
    return this.httpService.get<AttendeeWithEnclosureMetadata>(
      `${this.ATTENDEE_ROUTES}/${identifier}`,
    );
  }

  public async getAllAttendees(
    page: number,
    limit: number,
  ): Promise<Response<AttendeeWithPagination | string>> {
    return this.httpService.get<AttendeeWithPagination>(
      `${this.ATTENDEE_ROUTES}/all?page=${page}&limit=${limit}`,
    );
  }

  public async getAttendeeFromVerificationToken(
    token: string,
  ): Promise<Response<Attendee | string>> {
    return this.httpService.get<Attendee>(
      `${this.ATTENDEE_ROUTES}/verificationToken/${token}`,
    );
  }

  public async uploadAttendeeList(file: File): Promise<Response<string>> {
    const form = new FormData();
    form.append(file.name, file);

    return this.httpService.post<string>(
      `${this.ATTENDEE_ROUTES}/upload`,
      form,
    );
  }

  public async createTransaction(
    studentEnrollmentNumber: string,
  ): Promise<Response<AttendeeWithEnclosureMetadata | string>> {
    return this.httpService.post(
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
  ): Promise<Response<AttendeeWithEnclosureMetadata | string>> {
    return this.httpService.post(
      `${this.ATTENDEE_ROUTES}/mutateAttendeeLock?locked=${locked}`,
    );
  }
}
