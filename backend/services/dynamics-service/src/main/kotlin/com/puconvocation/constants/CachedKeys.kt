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

package com.puconvocation.constants

object CachedKeys {
    fun accountWithIAMRolesKey(identifier: String): String {
        return "accountWithIAMRoles:$identifier"
    }

    fun remoteConfigKey(): String {
        return "remoteConfig"
    }

    fun weeklyTrafficKey(): String {
        return "analytics:weeklyTraffic"
    }

    fun trafficOnDateKey(date: String): String {
        return "analytics:trafficOn:${date.replace("-", "_")}"
    }

    fun popularLangsKey(): String {
        return "analytics:popularLangs"
    }

    fun popularCountriesKey(): String {
        return "analytics:popularCountries"
    }

    fun popularStatesOfCountryKey(countryCode: String): String {
        return "analytics:popularStates:$countryCode"
    }

    fun popularDistrictsWithInStatesOfCountryKey(countryCode: String, state: String): String {
        return "analytics:popularDistricts:$countryCode:${state.replace(" ", "_").lowercase()}"
    }

    fun attendeeKey(identifier: String): String {
        return "attendee:$identifier"
    }

    fun attendeeWithEnclosureMetadataKey(identifier: String): String {
        return "attendeeWithEnclosureMetadata:$identifier"
    }

    fun attendeesWithPaginationKey(page: Int, limit: Int): String {
        return "attendeesWithPagination:$page:$limit"
    }

    fun transactionKey(identifier: String): String {
        return "transaction:$identifier"
    }

    fun objectsOfFolderKey(folderName: String): String {
        return "cloudStorage:$folderName"
    }
}