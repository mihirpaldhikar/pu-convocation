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
        start: 20,
        end: 25,
      },
      {
        letter: "B",
        start: 20,
        end: 25,
      },
      {
        letter: "C",
        start: 20,
        end: 25,
      },
      {
        letter: "D",
        start: 20,
        end: 25,
      },
      {
        letter: "E",
        start: 20,
        end: 25,
      },
      {
        letter: "F",
        start: 20,
        end: 25,
      },
      {
        letter: "G",
        start: 20,
        end: 25,
      },
      {
        letter: "H",
        start: 20,
        end: 25,
      },
      {
        letter: "I",
        start: 20,
        end: 25,
      },
      {
        letter: "J",
        start: 20,
        end: 25,
      },
      {
        letter: "K",
        start: 20,
        end: 25,
      },
    ],
  },
  {
    letter: "2",
    rows: [
      {
        letter: "A",
        start: 7,
        end: 19,
      },
      {
        letter: "B",
        start: 7,
        end: 19,
      },
      {
        letter: "C",
        start: 7,
        end: 19,
      },
      {
        letter: "D",
        start: 7,
        end: 19,
      },
      {
        letter: "E",
        start: 7,
        end: 19,
      },
      {
        letter: "F",
        start: 7,
        end: 19,
      },
      {
        letter: "G",
        start: 7,
        end: 19,
      },
      {
        letter: "H",
        start: 7,
        end: 19,
      },
      {
        letter: "I",
        start: 7,
        end: 19,
      },
      {
        letter: "J",
        start: 7,
        end: 19,
      },
      {
        letter: "K",
        start: 7,
        end: 19,
      },
    ],
  },
  {
    letter: "3",
    rows: [
      {
        letter: "A",
        start: 1,
        end: 6,
      },
      {
        letter: "B",
        start: 1,
        end: 6,
      },
      {
        letter: "C",
        start: 1,
        end: 6,
      },
      {
        letter: "D",
        start: 1,
        end: 6,
      },
      {
        letter: "E",
        start: 1,
        end: 6,
      },
      {
        letter: "F",
        start: 1,
        end: 6,
      },
      {
        letter: "G",
        start: 1,
        end: 6,
      },
      {
        letter: "H",
        start: 1,
        end: 6,
      },
      {
        letter: "I",
        start: 1,
        end: 6,
      },
      {
        letter: "J",
        start: 1,
        end: 6,
      },
      {
        letter: "K",
        start: 1,
        end: 6,
      },
    ],
  },
  {
    letter: "4",
    rows: [
      {
        letter: "L",
        start: 7,
        end: 12,
      },
    ],
  },
  {
    letter: "5",
    rows: [
      {
        letter: "L",
        start: 1,
        end: 6,
      },
    ],
  },
  {
    letter: "6",
    rows: [
      {
        letter: "M",
        start: 17,
        end: 22,
      },
      {
        letter: "N",
        start: 17,
        end: 22,
      },
      {
        letter: "O",
        start: 17,
        end: 22,
      },
      {
        letter: "P",
        start: 17,
        end: 22,
      },
      {
        letter: "Q",
        start: 17,
        end: 22,
      },
      {
        letter: "R",
        start: 17,
        end: 22,
      },
      {
        letter: "S",
        start: 17,
        end: 22,
      },
      {
        letter: "T",
        start: 17,
        end: 22,
      },
      {
        letter: "U",
        start: 17,
        end: 22,
      },
      {
        letter: "V",
        start: 17,
        end: 22,
      },
      {
        letter: "W",
        start: 17,
        end: 22,
      },
    ],
  },
  {
    letter: "7",
    rows: [
      {
        letter: "M",
        start: 12,
        end: 16,
      },
      {
        letter: "N",
        start: 12,
        end: 16,
      },
      {
        letter: "O",
        start: 12,
        end: 16,
      },
      {
        letter: "P",
        start: 12,
        end: 16,
      },
      {
        letter: "Q",
        start: 12,
        end: 16,
      },
      {
        letter: "R",
        start: 12,
        end: 16,
      },
      {
        letter: "S",
        start: 12,
        end: 16,
      },
      {
        letter: "T",
        start: 12,
        end: 16,
      },
      {
        letter: "U",
        start: 12,
        end: 16,
      },
      {
        letter: "V",
        start: 12,
        end: 16,
      },
      {
        letter: "W",
        start: 12,
        end: 16,
      },
    ],
  },
  {
    letter: "8",
    rows: [
      {
        letter: "M",
        start: 7,
        end: 11,
      },
      {
        letter: "N",
        start: 7,
        end: 11,
      },
      {
        letter: "O",
        start: 7,
        end: 11,
      },
      {
        letter: "P",
        start: 7,
        end: 11,
      },
      {
        letter: "Q",
        start: 7,
        end: 11,
      },
      {
        letter: "R",
        start: 7,
        end: 11,
      },
      {
        letter: "S",
        start: 7,
        end: 11,
      },
      {
        letter: "T",
        start: 7,
        end: 11,
      },
      {
        letter: "U",
        start: 7,
        end: 11,
      },
      {
        letter: "V",
        start: 7,
        end: 11,
      },
      {
        letter: "W",
        start: 7,
        end: 11,
      },
    ],
  },
  {
    letter: "9",
    rows: [
      {
        letter: "M",
        start: 1,
        end: 6,
      },
      {
        letter: "N",
        start: 1,
        end: 6,
      },
      {
        letter: "O",
        start: 1,
        end: 6,
      },
      {
        letter: "P",
        start: 1,
        end: 6,
      },
      {
        letter: "Q",
        start: 1,
        end: 6,
      },
      {
        letter: "R",
        start: 1,
        end: 6,
      },
      {
        letter: "S",
        start: 1,
        end: 6,
      },
      {
        letter: "T",
        start: 1,
        end: 6,
      },
      {
        letter: "U",
        start: 1,
        end: 6,
      },
      {
        letter: "V",
        start: 1,
        end: 6,
      },
      {
        letter: "W",
        start: 1,
        end: 6,
      },
    ],
  },
  {
    letter: "10",
    rows: [
      {
        letter: "X",
        start: 15,
        end: 20,
      },
    ],
  },
  {
    letter: "11",
    rows: [
      {
        letter: "X",
        start: 11,
        end: 14,
      },
      {
        letter: "Y",
        start: 11,
        end: 13,
      },
    ],
  },
  {
    letter: "12",
    rows: [
      {
        letter: "X",
        start: 7,
        end: 10,
      },
      {
        letter: "Y",
        start: 7,
        end: 10,
      },
    ],
  },
  {
    letter: "13",
    rows: [
      {
        letter: "X",
        start: 1,
        end: 6,
      },
      {
        letter: "Y",
        start: 1,
        end: 6,
      },
    ],
  },
  {
    letter: "14",
    rows: [
      {
        letter: "Z",
        start: 1,
        end: 14,
      },
    ],
  },
];

export default class AuthService {
  private ATTENDEE_SERVICE_URL = (
    process.env.NEXT_PUBLIC_ATTENDEE_SERVICE_URL as string
  ).concat("/attendees");
  private httpClient: AxiosInstance;
  private REQUEST_TIMEOUT = 1000 * 10;

  public constructor() {
    this.httpClient = axios.create({
      baseURL: this.ATTENDEE_SERVICE_URL,
      timeout: this.REQUEST_TIMEOUT,
      withCredentials: true,
    });
  }

  public async getAttendee(
    identifier: string,
  ): Promise<Response<AttendeeWithEnclosureMetadata | string>> {
    try {
      const response = await this.httpClient.get(
        `${this.ATTENDEE_SERVICE_URL}/${identifier}`,
      );
      if (response.status === 200) {
        const attendee = response.data as Attendee;
        const enclosure = enclosures.filter(
          (e) => e.letter === attendee.enclosure,
        )[0];

        const rowIndex = enclosure.rows.indexOf(
          enclosure.rows.filter((r) => r.letter === attendee.row)[0],
        );

        enclosure.rows = enclosure.rows.slice(
          rowIndex - 2 <= 0 ? 0 : rowIndex - 2,
          rowIndex + 4 >= enclosure.rows.length
            ? enclosure.rows.length
            : rowIndex + 4,
        );

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
}
