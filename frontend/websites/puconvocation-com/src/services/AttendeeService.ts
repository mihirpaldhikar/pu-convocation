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
import {
  Attendee,
  AttendeeWithEnclosureMetadata,
  Enclosure,
  Response,
} from "@dto/index";
import { StatusCode } from "@enums/StatusCode";

const enclosures: Array<Enclosure> = [
  {
    letter: "1",
    rows: [
      {
        letter: "A",
        start: 1,
        end: 25,
      },
      {
        letter: "B",
        start: 1,
        end: 25,
      },
      {
        letter: "C",
        start: 1,
        end: 25,
      },
      {
        letter: "D",
        start: 1,
        end: 25,
      },
    ],
  },
  {
    letter: "2",
    rows: [
      {
        letter: "E",
        start: 1,
        end: 25,
      },
      {
        letter: "F",
        start: 1,
        end: 25,
      },
      {
        letter: "G",
        start: 1,
        end: 25,
      },
      {
        letter: "H",
        start: 1,
        end: 25,
      },
    ],
  },
  {
    letter: "3",
    rows: [
      {
        letter: "I",
        start: 1,
        end: 25,
      },
      {
        letter: "J",
        start: 1,
        end: 25,
      },
      {
        letter: "K",
        start: 1,
        end: 25,
      },
      {
        letter: "L",
        start: 1,
        end: 12,
      },
    ],
  },
  {
    letter: "4",
    rows: [
      {
        letter: "M",
        start: 1,
        end: 22,
      },
      {
        letter: "N",
        start: 1,
        end: 22,
      },
      {
        letter: "O",
        start: 1,
        end: 22,
      },
      {
        letter: "P",
        start: 1,
        end: 22,
      },
    ],
  },
  {
    letter: "5",
    rows: [
      {
        letter: "Q",
        start: 1,
        end: 22,
      },
      {
        letter: "R",
        start: 1,
        end: 22,
      },
      {
        letter: "S",
        start: 1,
        end: 22,
      },
      {
        letter: "T",
        start: 1,
        end: 22,
      },
    ],
  },
  {
    letter: "6",
    rows: [
      {
        letter: "U",
        start: 1,
        end: 22,
      },
      {
        letter: "V",
        start: 1,
        end: 22,
      },
      {
        letter: "W",
        start: 1,
        end: 22,
      },
      {
        letter: "X",
        start: 1,
        end: 20,
      },
      {
        letter: "Y",
        start: 1,
        end: 13,
      },
      {
        letter: "Z",
        start: 1,
        end: 14,
      },
    ],
  },
];

export default class AuthService {
  private BASE_URL = process.env.NEXT_PUBLIC_ATTENDEE_SERVICE_URL as string;

  private ATTENDEE_ROUTES = this.BASE_URL.concat("/attendees");

  private httpClient: AxiosInstance;
  private REQUEST_TIMEOUT = 1000 * 10;

  public constructor() {
    this.httpClient = axios.create({
      baseURL: this.BASE_URL,
      timeout: this.REQUEST_TIMEOUT,
      withCredentials: true,
    });
  }

  public async getAttendee(
    identifier: string,
  ): Promise<Response<AttendeeWithEnclosureMetadata | string>> {
    try {
      const response = await this.httpClient.get(
        `${this.ATTENDEE_ROUTES}/${identifier}`,
      );
      if (response.status === 200) {
        const attendee = response.data as Attendee;
        const enclosure = enclosures.filter(
          (e) => e.letter === attendee.enclosure,
        )[0];

        const attendeeWithEnclosureMetadata: AttendeeWithEnclosureMetadata = {
          attendee: attendee,
          enclosureMetadata: enclosure,
        };

        return {
          statusCode: StatusCode.SUCCESS,
          payload: attendeeWithEnclosureMetadata,
        } as Response<AttendeeWithEnclosureMetadata>;
      }
      return {
        statusCode: StatusCode.FAILURE,
        payload: "Unknown Error occurred.",
      } as Response<string>;
    } catch (error) {
      let axiosError = (await error) as AxiosError;
      let errorResponseString = JSON.stringify(
        (await axiosError.response?.data) as string,
      );
      let errorResponse = JSON.parse(errorResponseString);
      return {
        statusCode: StatusCode.ATTENDEE_NOT_FOUND,
        message: errorResponse["message"],
      } as Response<string>;
    }
  }

  public async getAttendeeFromVerificationToken(
    token: string,
  ): Promise<Response<Attendee | string>> {
    try {
      const response = await this.httpClient.get(
        `${this.ATTENDEE_ROUTES}/verificationToken/${token}`,
      );

      if (response.status === 200) {
        return {
          statusCode: StatusCode.SUCCESS,
          payload: await response.data,
        } as Response<Attendee>;
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

  public async uploadAttendeeList(
    file: File,
  ): Promise<Response<AttendeeWithEnclosureMetadata | string>> {
    try {
      const form = new FormData();
      form.append(file.name, file);

      const response = await this.httpClient.post(
        `${this.ATTENDEE_ROUTES}/upload`,
        form,
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

  public async createTransaction(
    studentEnrollmentNumber: string,
  ): Promise<Response<AttendeeWithEnclosureMetadata | string>> {
    try {
      const response = await this.httpClient.post(
        `${this.BASE_URL}/transactions/new`,
        {
          studentEnrollmentNumber: studentEnrollmentNumber,
        },
      );

      if (response.status === 201) {
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
}
