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

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.commons.dto.AttendeeWithEnclosureMetadata
import com.puconvocation.commons.dto.Enclosure
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.datasource.AttendeeDatasource
import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.database.mongodb.entities.AttendeeConfig
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList
import java.time.Duration
import java.time.temporal.ChronoUnit

class AttendeeRepository(
    database: MongoDatabase,
    private val mapper: ObjectMapper,
    private val cache: CacheController
) : AttendeeDatasource {

    private val attendeesCollection: MongoCollection<Attendee> =
        database.getCollection<Attendee>("attendees")

    private val attendeesConfigCollection: MongoCollection<Attendee> =
        database.getCollection<Attendee>("attendee_config")

    override suspend fun getAttendee(identifier: String): Attendee? {
        val cachedAttendee = cache.get(CachedKeys.attendeeKey(identifier))
        if (cachedAttendee != null) {
            return mapper.readValue<Attendee>(cachedAttendee)
        }
        val fetchedAttendee = if (identifier.toLongOrNull() != null) {
            attendeesCollection.withDocumentClass<Attendee>().find(eq("_id", identifier)).firstOrNull()
        } else {
            attendeesCollection.withDocumentClass<Attendee>().find(eq(Attendee::convocationId.name, identifier))
                .firstOrNull()
        }

        if (fetchedAttendee != null) {
            cache.set(
                CachedKeys.attendeeKey(identifier),
                mapper.writeValueAsString(fetchedAttendee),
                expiryDuration = Duration.ofMinutes(10)
            )
        }

        return fetchedAttendee
    }

    override suspend fun getAttendeeWithEnclosureMetadata(identifier: String): AttendeeWithEnclosureMetadata? {
        val cachedAttendee = cache.get(CachedKeys.attendeeWithEnclosureMetadataKey(identifier))
        if (cachedAttendee != null) {
            return mapper.readValue<AttendeeWithEnclosureMetadata>(cachedAttendee)
        }

        val fetchedAttendee = getAttendee(identifier) ?: return null

        val enclosure = mapper.readValue<Enclosure>(cache.get(CachedKeys.websiteConfigKey())!!)

        val computedAttendee = AttendeeWithEnclosureMetadata(
            attendee = fetchedAttendee,
            enclosureMetadata = enclosure.enclosureMapping.first {
                it.letter.equals(
                    fetchedAttendee.allocation.enclosure,
                    ignoreCase = true
                )
            }
        )

        cache.set(CachedKeys.attendeeWithEnclosureMetadataKey(identifier), mapper.writeValueAsString(computedAttendee))

        return computedAttendee
    }


    override suspend fun getAttendeeFromVerificationToken(token: String): Attendee? {
        return attendeesCollection.withDocumentClass<Attendee>().find(eq(Attendee::verificationToken.name, token))
            .firstOrNull()
    }

    override suspend fun uploadAttendees(attendee: List<Attendee>): Boolean {
        attendeesCollection.withDocumentClass<Attendee>().drop()
        return attendeesCollection.withDocumentClass<Attendee>().insertMany(attendee).wasAcknowledged()
    }

    override suspend fun setDegreeReceivedStatus(enrollmentNumber: String, status: Boolean): Boolean {
        val acknowledge = attendeesCollection.withDocumentClass<Attendee>().updateOne(
            eq("_id", enrollmentNumber),
            Updates.combine(
                Updates.set(Attendee::degreeReceived.name, status),
            )
        ).wasAcknowledged()

        if (acknowledge) {
            cache.invalidate(CachedKeys.attendeeKey(enrollmentNumber))
        }

        return acknowledge
    }

    override suspend fun getTotalAttendees(): Int {
        return attendeesCollection.withDocumentClass<Attendee>().find().toList().size
    }

    override suspend fun getAttendeeConfig(): AttendeeConfig {
        val cachedConfig = cache.get(CachedKeys.attendeeConfigKey())
        if (cachedConfig != null) {
            return mapper.readValue<AttendeeConfig>(cachedConfig)
        }
        val fetchedConfig =
            attendeesConfigCollection.withDocumentClass<AttendeeConfig>().find(eq("_id", "attendee_config")).first()
        cache.set(
            CachedKeys.attendeeConfigKey(),
            mapper.writeValueAsString(fetchedConfig),
            expiryDuration = Duration.of(1, ChronoUnit.HOURS)
        )
        return fetchedConfig
    }

    override suspend fun updateAttendeeConfig(attendeeConfig: AttendeeConfig): Boolean {
        val acknowledge = attendeesConfigCollection.withDocumentClass<AttendeeConfig>().updateOne(
            eq("_id", "attendee_config"), Updates.combine(
                Updates.set(AttendeeConfig::locked.name, attendeeConfig.locked),
            )
        ).wasAcknowledged()

        if (acknowledge) {
            cache.invalidate(CachedKeys.attendeeConfigKey())
        }

        return acknowledge
    }

    override suspend fun getAttendees(page: Int, limit: Int): List<Attendee> {
        val cachedAttendees = cache.get(CachedKeys.attendeesWithPaginationKey(page, limit))
        if (cachedAttendees != null) {
            return mapper.readValue<List<Attendee>>(cachedAttendees)
        }

        val fetchedAttendees =
            attendeesCollection.withDocumentClass<Attendee>().find().skip((page - 1) * limit).limit(limit)
                .partial(true).toList()

        cache.set(CachedKeys.attendeesWithPaginationKey(page, limit), mapper.writeValueAsString(fetchedAttendees))

        return fetchedAttendees
    }

}