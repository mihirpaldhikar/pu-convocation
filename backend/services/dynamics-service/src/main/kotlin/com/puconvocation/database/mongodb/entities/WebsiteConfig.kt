package com.puconvocation.database.mongodb.entities

import com.google.gson.annotations.Expose
import org.bson.codecs.pojo.annotations.BsonId

data class WebsiteConfig(
    @BsonId @Expose val id: String = "website_config",
    @Expose val heroTitle: String,
    @Expose val gallery: MutableList<Gallery>,
    @Expose val showInstructionsBanner: Boolean,
    @Expose val instructionsFileURL: String,
    @Expose val aboutUs: String,
    @Expose val aboutUsImage: String,
    @Expose val heroImage: String,
    @Expose val showCountDown: Boolean,
    @Expose val countDownEndTime: Long,
    @Expose val encloserMapping: MutableList<Enclosure>,
) {
    data class Gallery(
        @Expose val title: String,
        @Expose val url: String,
        @Expose val description: String,
    )

    data class Enclosure(
        @Expose val letter: String,
        @Expose val rows: MutableList<Row>,
    ) {
        data class Row(
            @Expose val letter: String,
            @Expose val start: Int,
            @Expose val end: Int,
        )
    }
}