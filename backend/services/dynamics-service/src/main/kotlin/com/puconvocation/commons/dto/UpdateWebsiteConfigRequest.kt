package com.puconvocation.commons.dto

import com.puconvocation.database.mongodb.entities.WebsiteConfig
import com.puconvocation.database.mongodb.entities.WebsiteConfig.Enclosure

data class UpdateWebsiteConfigRequest(
    val heroTitle: String?,
    val gallery: MutableList<WebsiteConfig.Gallery>?,
    val showInstructionsBanner: Boolean?,
    val instructionsFileURL: String?,
    val aboutUs: String?,
    val aboutUsImage: String?,
    val heroImage: String?,
    val showCountDown: Boolean?,
    val countDownEndTime: Long?,
    val enclosureMapping: MutableList<Enclosure>?,
)