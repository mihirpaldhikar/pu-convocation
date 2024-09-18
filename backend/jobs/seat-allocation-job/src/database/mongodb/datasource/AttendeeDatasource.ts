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

import { Attendee } from "../entities/index.js";

export default interface AttendeeDatasource {
  totalAttendees(): Promise<number>;

  getAttendees(page: number, limit: number): Promise<Array<Attendee>>;

  updateAttendeeAllocation(attendee: Attendee): Promise<void>;
}
