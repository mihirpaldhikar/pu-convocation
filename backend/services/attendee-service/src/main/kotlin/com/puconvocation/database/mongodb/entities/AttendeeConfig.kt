package com.puconvocation.database.mongodb.entities

import com.google.gson.annotations.Expose
import org.bson.codecs.pojo.annotations.BsonId

data class AttendeeConfig(
    @BsonId @Expose val configId: String = "attendee_config",
    @Expose val isLocked: Boolean,
)
