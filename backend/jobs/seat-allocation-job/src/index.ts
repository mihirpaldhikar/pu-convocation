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

import {AttendeeRepository, SystemConfigRepository,} from "./database/index.js";
import {totalEnclosureSeats} from "./utils/index.js";
import {Handler} from "aws-lambda";

export const handler: Handler = async (event, context) => {
  const attendeeRepository = new AttendeeRepository();
  const systemConfigRepository = new SystemConfigRepository();

  const attendees = await attendeeRepository.getAttendees();

  let totalAttendees = attendees.length;

  const enclosureMapping = await systemConfigRepository.enclosureMapping();
  let totalSeats = 0;
  for (let enclosure of enclosureMapping) {
    totalSeats += totalEnclosureSeats(enclosure);
  }

  if (totalAttendees > totalSeats) {
    return;
  }

  let allocatedSeats = 0;

  for (let enclosure of enclosureMapping) {
    if (totalAttendees === 0) {
      break;
    }

    for (let row of enclosure.rows) {
      const seats = row.end - row.start - row.reserved.length + 1;
      const attendeesForCurrentRow = attendees.slice(
        allocatedSeats,
        allocatedSeats + seats,
      );

      totalAttendees -= attendeesForCurrentRow.length;

      if (attendeesForCurrentRow.length === 0) {
        break;
      }

      let i = 0;
      for (let seat of Array.from(
        { length: row.end - row.start + 1 },
        (_, k) => k + row.start,
      ).reverse()) {
        if (row.reserved.includes(seat)) continue;

        await attendeeRepository.updateAttendeeAllocation({
          ...attendeesForCurrentRow[i],
          allocation: {
            enclosure: enclosure.letter,
            seat: seat.toString(),
            row: row.letter,
          },
        });
        ++i;
      }
      allocatedSeats += seats;
    }
  }
};
