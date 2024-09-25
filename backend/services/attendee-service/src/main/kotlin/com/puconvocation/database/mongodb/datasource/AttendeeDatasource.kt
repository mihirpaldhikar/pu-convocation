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

package com.puconvocation.database.mongodb.datasource

import com.puconvocation.commons.dto.AttendeeWithEnclosureMetadata
import com.puconvocation.database.mongodb.entities.Attendee

interface AttendeeDatasource {
    suspend fun getAttendee(identifier: String): Attendee?

    suspend fun getAttendeeWithEnclosureMetadata(identifier: String): AttendeeWithEnclosureMetadata?

    suspend fun getAttendeeFromVerificationToken(token: String): Attendee?

    suspend fun uploadAttendees(attendee: List<Attendee>): Boolean

    suspend fun setDegreeReceivedStatus(enrollmentNumber: String, status: Boolean): Boolean

    suspend fun getTotalAttendees(): Int

    suspend fun getAttendees(page: Int, limit: Int): List<Attendee>
}