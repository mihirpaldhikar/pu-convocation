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

import com.google.gson.annotations.Expose

data class Enclosure(
    @Expose val enclosureMapping: MutableList<EnclosureMapping>,
) {
    data class EnclosureMapping(
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