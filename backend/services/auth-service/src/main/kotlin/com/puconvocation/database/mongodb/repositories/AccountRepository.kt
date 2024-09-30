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

package com.puconvocation.database.mongodb.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.commons.dto.AccountWithIAMRoles
import com.puconvocation.constants.CachedKeys
import com.puconvocation.controllers.CacheController
import com.puconvocation.database.mongodb.datasources.AccountDatasource
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.entities.Invitation
import com.puconvocation.security.dao.FidoCredential
import com.puconvocation.utils.RegexValidator
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList
import org.bson.types.ObjectId
import java.time.Duration
import java.time.temporal.ChronoUnit

class AccountRepository(
    database: MongoDatabase,
    private val iamRepository: IAMRepository,
    private val cache: CacheController,
    private val mapper: ObjectMapper,
) : AccountDatasource {
    private val accountCollection: MongoCollection<Account> =
        database.getCollection<Account>("accounts")

    private val invitationCollection: MongoCollection<Invitation> =
        database.getCollection<Invitation>("invitations")

    override suspend fun accountExists(identifier: String): Boolean {
        return if (RegexValidator.isValidEmail(identifier)) {
            accountCollection.withDocumentClass<Account>().find(eq(Account::email.name, identifier)).toList()
                .isNotEmpty()
        } else if (RegexValidator.isValidUserName(identifier)) {
            accountCollection.withDocumentClass<Account>().find(eq(Account::username.name, identifier)).toList()
                .isNotEmpty()
        } else {
            accountCollection.withDocumentClass<Account>().find(eq("_id", ObjectId(identifier))).toList().isNotEmpty()
        }
    }

    override suspend fun createAccount(account: Account): Boolean {
        return accountCollection.withDocumentClass<Account>().insertOne(account).wasAcknowledged()
    }

    override suspend fun getAccount(identifier: String): Account? {
        val cacheAccount = cache.get(CachedKeys.accountKey(identifier))

        if (cacheAccount != null) {
            return mapper.readValue<Account>(cacheAccount)
        }

        val account = try {
            if (RegexValidator.isValidEmail(identifier)) {
                accountCollection.withDocumentClass<Account>().find(eq(Account::email.name, identifier)).firstOrNull()
            } else if (RegexValidator.isValidUserName(identifier)) {
                accountCollection.withDocumentClass<Account>().find(eq(Account::username.name, identifier))
                    .firstOrNull()
            } else {
                accountCollection.withDocumentClass<Account>().find(eq("_id", ObjectId(identifier))).firstOrNull()
            }
        } catch (e: IllegalArgumentException) {
            null
        }

        if (account != null) {
            cache.set(CachedKeys.accountKey(identifier), mapper.writeValueAsString(account))
        }

        return account
    }

    override suspend fun getAccountWithIAMRoles(identifier: String): AccountWithIAMRoles? {
        val cacheAccount = cache.get(CachedKeys.accountWithIAMRolesKey(identifier))

        if (cacheAccount != null) {
            return mapper.readValue<AccountWithIAMRoles>(cacheAccount)
        }

        val account = getAccount(identifier) ?: return null

        if (account.suspended) {
            return null
        }

        val iamRoles = iamRepository.listRulesForAccount(account.uuid.toHexString())

        val computedAccount = AccountWithIAMRoles(
            uuid = account.uuid,
            email = account.email,
            username = account.username,
            avatarURL = account.avatarURL,
            displayName = account.displayName,
            iamRoles = iamRoles,
            designation = account.designation,
        )

        cache.set(
            key = CachedKeys.accountWithIAMRolesKey(identifier),
            value = mapper.writeValueAsString(computedAccount),
            expiryDuration = Duration.of(10, ChronoUnit.MINUTES)
        )

        return computedAccount
    }

    override suspend fun updateAccount(account: Account): Boolean {
        val acknowledged = accountCollection.withDocumentClass<Account>().updateOne(
            eq("_id", account.uuid),
            Updates.combine(
                Updates.set(Account::username.name, account.username),
                Updates.set(Account::displayName.name, account.displayName),
                Updates.set(Account::email.name, account.email),
                Updates.set(Account::avatarURL.name, account.avatarURL),
            )
        ).wasAcknowledged()

        if (acknowledged) {
            cache.invalidate(CachedKeys.accountKey(account.uuid.toHexString()))
            cache.invalidate(CachedKeys.accountWithIAMRolesKey(account.uuid.toHexString()))
        }

        return acknowledged
    }

    override suspend fun deleteAccount(uuid: String): Boolean {
        val acknowledged =
            accountCollection.withDocumentClass<Account>().deleteOne(eq("_id", ObjectId(uuid))).wasAcknowledged()

        if (acknowledged) {
            cache.invalidate(CachedKeys.accountKey(uuid))
            cache.invalidate(CachedKeys.accountWithIAMRolesKey(uuid))
        }

        return acknowledged
    }

    override suspend fun addFidoCredentials(uuid: String, fidoCredential: FidoCredential): Boolean {
        val account =
            getAccount(uuid) ?: return false

        val fidoCredentialSet = account.fidoCredential
        fidoCredentialSet.add(fidoCredential)

        val acknowledged = accountCollection.withDocumentClass<Account>().updateOne(
            eq("_id", ObjectId(uuid)),
            Updates.combine(
                Updates.set(Account::fidoCredential.name, fidoCredentialSet),
            )
        ).wasAcknowledged()

        if (acknowledged) {
            cache.invalidate(CachedKeys.accountKey(uuid))
            cache.invalidate(CachedKeys.accountWithIAMRolesKey(uuid))
        }

        return acknowledged
    }

    override suspend fun createInvitation(
        invitation: Invitation,
    ): Boolean {
        return invitationCollection.withDocumentClass<Invitation>().insertOne(
            invitation
        ).wasAcknowledged()
    }

    override suspend fun findInvitation(identifier: String): Invitation? {
        return if (RegexValidator.isValidEmail(identifier)) {
            invitationCollection.withDocumentClass<Invitation>().find(eq(Invitation::email.name, identifier))
                .firstOrNull()
        } else {
            invitationCollection.withDocumentClass<Invitation>().find(eq("_id", ObjectId(identifier)))
                .firstOrNull()
        }
    }

    override suspend fun deleteInvitation(invitationId: String): Boolean {
        return invitationCollection.withDocumentClass<Invitation>().deleteOne(eq("_id", ObjectId(invitationId)))
            .wasAcknowledged()

    }
}