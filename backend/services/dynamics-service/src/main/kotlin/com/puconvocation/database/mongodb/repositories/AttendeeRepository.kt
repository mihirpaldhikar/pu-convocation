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
import com.mongodb.client.model.Aggregates.*
import com.mongodb.client.model.BsonField
import com.mongodb.client.model.Filters.*
import com.mongodb.client.model.Projections.*
import com.mongodb.client.model.Sorts.ascending
import com.mongodb.client.model.Updates
import com.mongodb.client.model.search.FuzzySearchOptions
import com.mongodb.client.model.search.SearchOperator
import com.mongodb.client.model.search.SearchOptions
import com.mongodb.client.model.search.SearchPath
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.commons.dto.AttendeeWithEnclosureMetadata
import com.puconvocation.commons.dto.AttendeesInEnclosure
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.datasources.AttendeeDatasource
import com.puconvocation.database.mongodb.entities.Attendee
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList
import org.bson.Document
import java.time.Duration
import java.time.temporal.ChronoUnit

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
            if (fetchedAttendee.enrollmentNumber.contains(
                    "DUPLICATE",
                    ignoreCase = true
                ) || fetchedAttendee.enrollmentNumber.contains("NO-ENR", ignoreCase = true)
            ) {
                return null
            }

            cache.set(
                CachedKeys.attendeeKey(identifier),
                mapper.writeValueAsString(fetchedAttendee),
                expiryDuration = Duration.ofMinutes(10)
            )
            return fetchedAttendee
        }

        return null
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
        val acknowledge = attendeesCollection.withDocumentClass<Attendee>().insertMany(attendee).wasAcknowledged()
        if (acknowledge) {
            cache.invalidateWithPattern("attendeesWithPagination:*")
            cache.invalidate(CachedKeys.totalAttendeeCountKey())
        }
        return acknowledge
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
        val cachedTotalCount = cache.get(CachedKeys.totalAttendeeCountKey())
        if (cachedTotalCount != null) {
            return cachedTotalCount.toInt()
        }
        val count = attendeesCollection.withDocumentClass<Attendee>().find().toList().size
        cache.set(CachedKeys.totalAttendeeCountKey(), count.toString(), expiryDuration = Duration.of(1, ChronoUnit.HOURS))
        return count
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
            attendeesCollection.withDocumentClass<Attendee>().find(
                and(not(regex("_id", "DUPLICATE")), not(regex("_id", "NO-ENR")))
            ).skip(page * limit)
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
        val aggregationPipeline = search(
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
                limit(10)
            )
        ).toList()
    }

    override suspend fun attendeesInEnclosure(enclosure: String): AttendeesInEnclosure {
        val cachedData = cache.get(CachedKeys.attendeesInEnclosureKey(enclosure))
        if (cachedData != null) {
            return mapper.readValue<AttendeesInEnclosure>(cachedData)
        }
        val pipeline = listOf(
            match(eq("allocation.enclosure", enclosure)),
            sort(ascending("allocation.row", "allocation.seat")),
            group(
                Document("enclosure", "\$allocation.enclosure")
                    .append("row", "\$allocation.row"),
                BsonField(
                    "attendees", Document(
                        "\$push", Document()
                            .append("enrollmentNumber", "\$_id")
                            .append("convocationId", "\$convocationId")
                            .append("seat", "\$allocation.seat")
                    )
                )
            ),
            group(
                "\$_id.enclosure",
                BsonField(
                    "rows", Document(
                        "\$push", Document("row", "\$_id.row")
                            .append("attendees", "\$attendees")
                    )
                )
            ),
            project(
                fields(
                    excludeId(),
                    include("enclosure", "rows")
                )
            )
        )
        val resultsFlow = attendeesCollection.aggregate<Document>(pipeline)
        val results = resultsFlow.toList()
        if (results.isEmpty()) {
            return AttendeesInEnclosure(
                enclosure = enclosure,
                rows = emptyList()
            )
        }
        val bson = results.first()
        val rows = bson.getList("rows", Document::class.java).map { rowDoc ->
            val row = rowDoc.getString("row")

            val attendees = rowDoc.getList("attendees", Document::class.java).map { attendeeDoc ->
                AttendeesInEnclosure.Attendee(
                    enrollmentNumber = attendeeDoc.getString("enrollmentNumber"),
                    convocationId = attendeeDoc.getString("convocationId"),
                    seat = attendeeDoc.getString("seat")
                )
            }

            AttendeesInEnclosure.Row(row = row, attendees = attendees)
        }

        val finalResult = AttendeesInEnclosure(enclosure = enclosure, rows = rows)

        cache.set(CachedKeys.attendeesInEnclosureKey(enclosure), mapper.writeValueAsString(finalResult))
        return finalResult
    }


}