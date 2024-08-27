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

package com.puconvocation.constants

object CachedKeys {
    fun getAccountStrategyKey(identifier: String): String {
        return "accountStrategy:$identifier"
    }

    fun getAccountKey(identifier: String): String {
        return "account:$identifier"
    }

    fun getAccountPrivilegesKey(identifier: String): String {
        return "accountPrivileges:$identifier"
    }

    fun getAccountWithPrivilegesKey(identifier: String): String {
        return "accountWithPrivileges:$identifier"
    }

    fun getPasskeyPKCKey(identifier: String): String {
        return "passkeyPKCKey:$identifier"
    }

    fun getPasskeyAssertionKey(identifier: String): String {
        return "passkeyAssertionKey:$identifier"
    }
}