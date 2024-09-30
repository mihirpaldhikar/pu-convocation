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

package com.puconvocation.security.passkeys

import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.yubico.webauthn.RelyingParty
import com.yubico.webauthn.data.RelyingPartyIdentity

class PasskeyRelyingParty(
    private val developmentMode: Boolean,
    private val accountRepository: AccountRepository,
) {
    fun getRelyingParty(): RelyingParty {
        val rpIdentity: RelyingPartyIdentity = RelyingPartyIdentity.builder()
            .id(
                if (developmentMode) {
                    "localhost"
                } else "puconvocation.com"
            )
            .name("PU Convocation")
            .build()

        val rp: RelyingParty = RelyingParty.builder()
            .identity(rpIdentity)
            .credentialRepository(
                PasskeyCredentialRepository(
                    accountRepository = accountRepository
                )
            )
            .allowOriginPort(true)
            .allowOriginSubdomain(true)
            .build()
        return rp;
    }
}