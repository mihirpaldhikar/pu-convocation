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

package com.puconvocation.serializers

import com.fasterxml.jackson.core.*
import com.fasterxml.jackson.databind.*
import org.bson.types.ObjectId

class ObjectIdSerializer : JsonSerializer<ObjectId>() {
    override fun serialize(value: ObjectId, gen: JsonGenerator, serializers: SerializerProvider) {
        gen.writeString(value.toHexString())
    }
}

class ObjectIdDeserializer : JsonDeserializer<ObjectId>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): ObjectId {
        val value = p.valueAsString
        return ObjectId(value)
    }
}