package com.puconvocation.commons.dto

import com.google.gson.annotations.Expose
import com.puconvocation.database.mongodb.entities.WebsiteConfig

data class UpdateWebsiteConfigRequest(
    @Expose val heroTitle: String?,
    @Expose val gallery: MutableList<WebsiteConfig.Gallery>?,
    @Expose val showInstructionsBanner: Boolean?,
    @Expose val instructionsFileURL: String?,
    @Expose val aboutUs: String?,
    @Expose val aboutUsImage: String?,
    @Expose val heroImage: String?,
    @Expose val showCountDown: Boolean?,
    @Expose val countDownEndTime: Long?,
)