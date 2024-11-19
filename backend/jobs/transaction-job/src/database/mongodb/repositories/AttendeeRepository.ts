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

import {AttendeeDatasource} from "../datasource/index.js";
import {Attendee} from "../entities/index.js";
import {default as Database} from "../MongoDBConnector.js";
import {Collection} from "mongodb";

export default class AttendeeRepository implements AttendeeDatasource {
  private attendeeCollection: Collection<Attendee>;

  public constructor() {
    this.attendeeCollection = Database.collection<Attendee>("attendees");
  }

  async getAttendee(enrollmentNumber: string): Promise<Attendee | null> {
    return await this.attendeeCollection.findOne({
      enrollmentNumber: enrollmentNumber,
    });
  }

  async updateAttendeeDegreeStatus(
    enrollmentNumber: string,
    received: boolean,
  ): Promise<boolean> {
    const { acknowledged } = await this.attendeeCollection.updateOne(
      {
        _id: enrollmentNumber,
      },
      {
        $set: {
          degreeReceived: received,
        },
      },
    );
    return acknowledged;
  }
}
