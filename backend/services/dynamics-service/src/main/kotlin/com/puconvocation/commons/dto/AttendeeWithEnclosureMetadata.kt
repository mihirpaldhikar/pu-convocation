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

package com.puconvocation.commons.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.puconvocation.database.mongodb.entities.Attendee
import com.puconvocation.database.mongodb.entities.RemoteConfig

data class AttendeeWithEnclosureMetadata(
    @JsonProperty("attendee") val attendee: Attendee,
    @JsonProperty("enclosureMetadata") val enclosureMetadata: RemoteConfig.Enclosure,
)