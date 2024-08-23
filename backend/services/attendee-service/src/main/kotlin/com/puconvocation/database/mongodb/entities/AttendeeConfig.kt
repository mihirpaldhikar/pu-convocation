package com.puconvocation.database.mongodb.entities

import com.google.gson.annotations.Expose
import org.bson.codecs.pojo.annotations.BsonId

data class AttendeeConfig(
    @BsonId @Expose val configId: String,
    @BsonId @Expose val isLocked: Boolean,
)
