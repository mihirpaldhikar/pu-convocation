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

package com.puconvocation.database.mongodb.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.mongodb.client.model.Aggregates
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.client.model.search.FuzzySearchOptions
import com.mongodb.client.model.search.SearchOperator
import com.mongodb.client.model.search.SearchOptions
import com.mongodb.client.model.search.SearchPath
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.commons.dto.AttendeeWithEnclosureMetadata
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.datasources.AttendeeDatasource
import com.puconvocation.database.mongodb.entities.Attendee
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList
import java.time.Duration

class AttendeeRepository(
    database: MongoDatabase,
    private val mapper: ObjectMapper,
    private val cache: CacheController,
    private val remoteConfigRepository: RemoteConfigRepository
) : AttendeeDatasource {

    private val attendeesCollection: MongoCollection<Attendee> =
        database.getCollection<Attendee>("attendees")

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

        val remoteConfig = remoteConfigRepository.getConfig()

        val computedAttendee = AttendeeWithEnclosureMetadata(
            attendee = fetchedAttendee,
            enclosureMetadata = remoteConfig.groundMappings.first {
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

    override suspend fun getAttendees(page: Int, limit: Int): HashMap<String, Any> {
        val cachedAttendees = cache.get(CachedKeys.attendeesWithPaginationKey(page, limit))
        if (cachedAttendees != null) {
            return hashMapOf(
                "page" to page,
                "next" to page + 1,
                "attendees" to mapper.readValue<List<Attendee>>(cachedAttendees)
            )
        }

        val fetchedAttendees =
            attendeesCollection.withDocumentClass<Attendee>().find().skip(page * limit)
                .limit(limit)
                .partial(true).toList()

        val nextFetchedAttendees =
            attendeesCollection.withDocumentClass<Attendee>().find()
                .skip((page + 1) * limit).limit(limit)
                .partial(true).toList()

        cache.set(CachedKeys.attendeesWithPaginationKey(page, limit), mapper.writeValueAsString(fetchedAttendees))

        if (nextFetchedAttendees.isNotEmpty()) {
            cache.set(
                CachedKeys.attendeesWithPaginationKey(page + 1, limit),
                mapper.writeValueAsString(nextFetchedAttendees)
            )
        }

        return return hashMapOf(
            "page" to page,
            "next" to if (nextFetchedAttendees.isNotEmpty()) page + 1 else Int.MAX_VALUE,
            "attendees" to fetchedAttendees
        )
    }

    override suspend fun searchAttendees(query: String): List<Attendee> {
        val aggregationPipeline = Aggregates.search(
            SearchOperator.compound().filter(
                listOf(
                    SearchOperator.text(
                        SearchPath.fieldPath(Attendee::studentName.name),
                        query
                    ).fuzzy(FuzzySearchOptions.fuzzySearchOptions().maxEdits(2)),
                )
            ),
            SearchOptions.searchOptions().index("searchAttendees")
        )

        return attendeesCollection.withDocumentClass<Attendee>().aggregate(
            listOf(
                aggregationPipeline,
                Aggregates.limit(10)
            )
        ).toList()
    }

}