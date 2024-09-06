package com.puconvocation.database.mongodb.entities

import com.fasterxml.jackson.annotation.JsonProperty
import org.bson.codecs.pojo.annotations.BsonId

data class WebsiteConfig(
    @BsonId @JsonProperty("id") val id: String = "website_config",
    @JsonProperty("heroTitle") val heroTitle: String,
    @JsonProperty("gallery") val gallery: MutableList<Gallery>,
    @JsonProperty("showInstructionsBanner") val showInstructionsBanner: Boolean,
    @JsonProperty("instructionsFileURL") val instructionsFileURL: String,
    @JsonProperty("aboutUs") val aboutUs: String,
    @JsonProperty("aboutUsImage") val aboutUsImage: String,
    @JsonProperty("heroImage") val heroImage: String,
    @JsonProperty("showCountDown") val showCountDown: Boolean,
    @JsonProperty("countDownEndTime") val countDownEndTime: Long,
    @JsonProperty("enclosureMapping") val enclosureMapping: MutableList<Enclosure>,
) {
    data class Gallery(
        @JsonProperty("title") val title: String,
        @JsonProperty("url") val url: String,
        @JsonProperty("description") val description: String,
    )

    data class Enclosure(
        @JsonProperty("letter") val letter: String,
        @JsonProperty("rows") val rows: MutableList<Row>,
    ) {
        data class Row(
            @JsonProperty("letter") val letter: String,
            @JsonProperty("start") val start: Int,
            @JsonProperty("end") val end: Int,
        )
    }
}