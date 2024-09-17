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

package com.puconvocation.constants

object CachedKeys {
    fun accountWithIAMRolesKey(identifier: String): String {
        return "accountWithIAMRoles:$identifier"
    }

    fun attendeeKey(identifier: String): String {
        return "attendee:$identifier"
    }

    fun attendeeWithEnclosureMetadataKey(identifier: String): String {
        return "attendeeWithEnclosureMetadataKey:$identifier"
    }

    fun attendeeConfigKey(): String {
        return "config:attendee"
    }

    fun websiteConfigKey(): String {
        return "config:website"
    }

    fun attendeesWithPaginationKey(page: Int, limit: Int): String {
        return "attendeesWithPagination:$page:$limit"
    }

    fun transactionKey(identifier: String): String {
        return "transaction:$identifier"
    }
}