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
import java.util.*
import kotlin.random.Random

class CSVSerializer {
    fun serializeAttendeesCSV(reader: InputStreamReader): List<Attendee> {
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
                    enrollmentNumber = attendee.get("enrollmentNumber").toString(),
                    convocationId = attendee.get("convocationId").toString(),
                    studentName = attendee.get("studentName").toString(),
                    department = attendee.get("department").toString(),
                    institute = attendee.get("institute").toString(),
                    enclosure = attendee.get("enclosure").toString(),
                    row = attendee.get("row").toString(),
                    seat = attendee.get("seat").toString(),
                    enterFrom = Direction.valueOf(attendee.get("enterFrom").uppercase()),
                    verificationToken = UUID.randomUUID().toString().replace("-", ""),
                    verificationCode = "${Random.nextInt(0, 9)}${
                        Random.nextInt(
                            0,
                            9
                        )
                    }${Random.nextInt(0, 9)}${
                        Random.nextInt(
                            0,
                            9
                        )
                    }${Random.nextInt(0, 9)}${Random.nextInt(0, 9)}"
                )
            )
        }

        return attendees.toList()
    }
}