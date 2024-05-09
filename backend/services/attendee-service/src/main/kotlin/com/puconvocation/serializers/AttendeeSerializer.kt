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

package com.puconvocation.serializers

import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.enums.Direction
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import java.io.InputStreamReader

class AttendeeSerializer {
    fun serializeCSV(reader: InputStreamReader): List<Attendee> {
        val attendees: MutableList<Attendee> = emptyList<Attendee>().toMutableList()
        val csvFormat = CSVFormat.DEFAULT
            .builder()
            .setHeader(
                "enrollmentNumber",
                "convocationId",
                "studentName",
                "department",
                "institute",
                "enclosure",
                "row",
                "seat",
                "enterFrom"
            )
            .setIgnoreHeaderCase(true)
            .setIgnoreEmptyLines(true)
            .setSkipHeaderRecord(true)
            .build()

        val csvParser = CSVParser(reader, csvFormat)
        for (attendee in csvParser.records) {
            attendees.add(
                Attendee(
                    enrollmentNumber = attendee.get("enrollmentNumber").toLong(),
                    convocationId = attendee.get("convocationId"),
                    studentName = attendee.get("studentName"),
                    department = attendee.get("department"),
                    institute = attendee.get("institute"),
                    enclosure = attendee.get("enclosure"),
                    row = attendee.get("row").toInt(),
                    seat = attendee.get("seat").toInt(),
                    enterFrom = Direction.valueOf(attendee.get("enterFrom").uppercase())
                )
            )
        }

        return attendees.toList()
    }
}