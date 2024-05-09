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
    ACCOUNT_CREATED,
    ACCOUNT_EXISTS,
    ACCOUNT_NOT_FOUND,
    INVALID_PASSWORD,
    PASSWORD_NOT_SECURE,
    ACCOUNT_CREATION_ERROR,
    INVALID_IDENTIFIER,
    ACCOUNT_SUSPENDED,
    ACCOUNT_NOT_VERIFIED,
    INVALID_OR_NULL_TOKEN,
    INVALID_OR_NULL_AUTHENTICATION,
    REQUEST_NOT_COMPLETED,
    INVALID_REQUEST,
    TOKEN_EXPIRED,
    INVALID_TOKEN,
    SESSION_EXPIRED
}