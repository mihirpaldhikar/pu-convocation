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

package com.puconvocation.enums

enum class ResponseCode {
    OK,
    FILE_UPLOADED,
    ATTENDEE_NOT_FOUND,
    INVALID_FILE_FORMAT,
    FILE_NOT_UPLOADED,
    INVALID_OR_NULL_IDENTIFIER,
    TOKEN_EXPIRED,
    INVALID_OR_NULL_TOKEN,
    NOT_PERMITTED,
    REQUEST_NOT_FULFILLED,
    ALREADY_LOCKED,
    ALREADY_UNLOCKED,
    NOT_FOUND,
    INVALID_TOKEN,
    BAD_REQUEST
}