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

import { AttendeeDatasource } from "../datasource/index.js";
import { Attendee } from "../entities/index.js";
import { default as Database } from "../MongoDBConnector.js";
import { Collection } from "mongodb";

export default class AttendeeRepository implements AttendeeDatasource {
  private attendeeCollection: Collection<Attendee>;

  public constructor() {
    this.attendeeCollection = Database.collection<Attendee>("attendees");
  }

  async totalAttendees(): Promise<number> {
    return await this.attendeeCollection.countDocuments();
  }

  async getAttendees(page: number, limit: number): Promise<Attendee[]> {
    return await this.attendeeCollection
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
  }

  async updateAttendee(attendee: Attendee): Promise<void> {
    await this.attendeeCollection.updateOne(
      {
        enrollmentNumber: attendee.enrollmentNumber,
      },
      {
        $set: {
          ...attendee,
        },
      },
    );
  }
}
