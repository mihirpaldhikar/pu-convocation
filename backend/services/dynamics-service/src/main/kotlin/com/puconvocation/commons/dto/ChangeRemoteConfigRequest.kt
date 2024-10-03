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

package com.puconvocation.commons.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import com.puconvocation.database.mongodb.entities.RemoteConfig.Countdown
import com.puconvocation.database.mongodb.entities.RemoteConfig.Enclosure
import com.puconvocation.database.mongodb.entities.RemoteConfig.Images

@JsonIgnoreProperties(ignoreUnknown = true)
data class ChangeRemoteConfigRequest(
    @JsonProperty("images") val images: Images?,
    @JsonProperty("countdown") val countdown: Countdown?,
    @JsonProperty("showInstructions") val showInstructions: Boolean?,
    @JsonProperty("groundMappings") val groundMappings: MutableList<Enclosure>?,
)