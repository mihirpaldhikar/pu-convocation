package com.puconvocation.database.mongodb.entities

import com.google.gson.annotations.Expose
import org.bson.codecs.pojo.annotations.BsonId

data class Transaction(
    @BsonId @Expose val id: String,
    @Expose val timestamp: Long,
    @Expose val studentEnrollmentNumber: String,
    @Expose val approvedBy: String,
)