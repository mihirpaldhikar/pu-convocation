/*
 * Copyright (C) PU Convocation Management System Authors
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

package com.puconvocation.constants

object CachedKeys {
    fun accountKey(identifier: String): String {
        return "account:$identifier"
    }

    fun accountWithIAMRolesKey(identifier: String): String {
        return "accountWithIAMRoles:$identifier"
    }

    fun passkeyPKCKey(identifier: String): String {
        return "passkeyPKC:$identifier"
    }

    fun passkeyAssertionKey(identifier: String): String {
        return "passkeyAssertion:$identifier"
    }

}