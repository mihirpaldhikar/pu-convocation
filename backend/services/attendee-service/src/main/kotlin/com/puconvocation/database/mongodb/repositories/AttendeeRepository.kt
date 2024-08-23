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

package com.puconvocation.database.mongodb.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.datasource.AttendeeDatasource
import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.database.mongodb.entities.AttendeeConfig
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList

class AttendeeRepository(
    database: MongoDatabase
) : AttendeeDatasource {

    private val attendeesCollection: MongoCollection<Attendee> =
        database.getCollection<Attendee>("attendees")

    private val attendeesConfigCollection: MongoCollection<Attendee> =
        database.getCollection<Attendee>("attendee_config")

    override suspend fun getAttendee(identifier: String): Attendee? {
        if (identifier.toLongOrNull() != null) {
            return attendeesCollection.withDocumentClass<Attendee>().find(eq("_id", identifier)).firstOrNull()
        }
        return attendeesCollection.withDocumentClass<Attendee>().find(eq(Attendee::convocationId.name, identifier))
            .firstOrNull()
    }

    override suspend fun getAttendeeFromVerificationToken(token: String): Attendee? {
        return attendeesCollection.withDocumentClass<Attendee>().find(eq(Attendee::verificationToken.name, token))
            .firstOrNull()
    }

    override suspend fun uploadAttendees(attendee: List<Attendee>): Boolean {
        attendeesCollection.withDocumentClass<Attendee>().drop()
        return attendeesCollection.withDocumentClass<Attendee>().insertMany(attendee).wasAcknowledged()
    }

    override suspend fun getTotalAttendees(): Int {
        return attendeesCollection.withDocumentClass<Attendee>().find().toList().size
    }

    override suspend fun mutateAttendeeLock(isLocked: Boolean): Boolean {
        val config = attendeesConfigCollection.withDocumentClass<AttendeeConfig>().find(eq("_id", "attendee_config"))
            .firstOrNull()
        if (config == null) {
            return attendeesConfigCollection.withDocumentClass<AttendeeConfig>().insertOne(
                AttendeeConfig(
                    isLocked = isLocked,
                )
            ).wasAcknowledged()
        }

        return attendeesConfigCollection.withDocumentClass<AttendeeConfig>().updateOne(
            eq("_id", "attendee_config"), Updates.combine(
                Updates.set(AttendeeConfig::isLocked.name, isLocked)
            )
        ).wasAcknowledged()
    }

    override suspend fun isAttendeeLockEnforced(): Boolean {
        return attendeesConfigCollection.withDocumentClass<AttendeeConfig>().find(eq("_id", "attendee_config"))
            .firstOrNull()?.isLocked ?: false
    }

}