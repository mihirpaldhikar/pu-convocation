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

import com.mongodb.client.model.Filters
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.datasources.IpTableDatasource
import com.puconvocation.database.mongodb.entities.IP
import com.puconvocation.utils.ipToLong
import kotlinx.coroutines.flow.firstOrNull

class IpTableRepository(
    database: MongoDatabase
) : IpTableDatasource {
    private val ipTable: MongoCollection<IP> =
        database.getCollection<IP>("iptable")

    override suspend fun getDetails(ip: String): IP? {
        val targetIP = ipToLong(ip)
        val filters = Filters.and(
            Filters.lte(IP::from.name, targetIP),
            Filters.gte(IP::to.name, targetIP)
        )
        return ipTable.withDocumentClass<IP>().find(filters).firstOrNull()
    }
}