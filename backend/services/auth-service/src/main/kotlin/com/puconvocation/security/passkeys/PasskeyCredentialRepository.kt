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

package com.puconvocation.security.passkeys

import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.repositories.AccountRepository
import com.puconvocation.security.dao.FidoCredential
import com.puconvocation.utils.PasskeyUtils
import com.yubico.webauthn.CredentialRepository
import com.yubico.webauthn.RegisteredCredential
import com.yubico.webauthn.data.ByteArray
import com.yubico.webauthn.data.PublicKeyCredentialDescriptor
import com.yubico.webauthn.data.PublicKeyCredentialType
import com.yubico.webauthn.data.exception.Base64UrlException
import kotlinx.coroutines.runBlocking
import org.bson.types.ObjectId
import java.util.*
import java.util.stream.Collectors

class PasskeyCredentialRepository(
    private val accountRepository: AccountRepository,
) : CredentialRepository {
    override fun getCredentialIdsForUsername(username: String): MutableSet<PublicKeyCredentialDescriptor> {
        val account: Account?
        runBlocking {
            account = accountRepository.getAccount(username)
        }
        if (account == null) {
            return mutableSetOf()
        }

        return account.fidoCredential.stream().map {
            toPublicKeyCredentialDescriptor(
                it
            )
        }.collect(Collectors.toSet())
    }

    override fun getUserHandleForUsername(username: String): Optional<ByteArray> {
        val account: Account?
        runBlocking {
            account = accountRepository.getAccount(username)
        }
        if (account == null) {
            return Optional.empty()
        }

        return Optional.of(PasskeyUtils.toByteArray(account.uuid))
    }

    override fun getUsernameForUserHandle(userHandle: ByteArray): Optional<String> {
        val account: Account?
        runBlocking {
            account = accountRepository.getAccount(PasskeyUtils.toObjectId(userHandle).toHexString())
        }
        if (account == null) {
            return Optional.empty()
        }

        return Optional.of(account.username)
    }

    override fun lookup(credentialId: ByteArray, userHandle: ByteArray): Optional<RegisteredCredential> {
        val account: Account?
        runBlocking {
            account = accountRepository.getAccount(PasskeyUtils.toObjectId(userHandle).toHexString())
        }
        if (account == null) {
            return Optional.empty()
        }
        val fidoCredential = account.fidoCredential.firstOrNull { credentialId == ByteArray.fromBase64Url(it.keyId) }
            ?: return Optional.empty()

        return Optional.of(
            toRegisteredCredential(
                uuid = account.uuid,
                fidoCredential = fidoCredential
            )
        )
    }

    override fun lookupAll(credentialId: ByteArray): MutableSet<RegisteredCredential> {
        return mutableSetOf()
    }

    private fun toRegisteredCredential(uuid: ObjectId, fidoCredential: FidoCredential): RegisteredCredential {
        try {
            return RegisteredCredential.builder()
                .credentialId(ByteArray.fromBase64Url(fidoCredential.keyId))
                .userHandle(PasskeyUtils.toByteArray(uuid))
                .publicKeyCose(ByteArray.fromBase64Url(fidoCredential.publicKeyCose))
                .build()
        } catch (e: Base64UrlException) {
            throw java.lang.RuntimeException(e)
        }
    }

    private fun toPublicKeyCredentialDescriptor(
        cred: FidoCredential
    ): PublicKeyCredentialDescriptor {
        try {
            return PublicKeyCredentialDescriptor.builder()
                .id(ByteArray.fromBase64Url(cred.keyId))
                .type(PublicKeyCredentialType.valueOf(cred.keyType))
                .build()
        } catch (e: Base64UrlException) {
            throw RuntimeException(e)
        }
    }
}