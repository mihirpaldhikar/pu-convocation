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

package com.puconvocation.database.mongodb.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.puconvocation.database.mongodb.datasources.AccountDatasource
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.utils.RegexValidator
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList
import org.bson.types.ObjectId

class AccountRepository(
    private val database: MongoDatabase
) : AccountDatasource {
    private val accountCollection: MongoCollection<Account> =
        database.getCollection<Account>("accounts")

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
        return if (RegexValidator.isValidEmail(identifier)) {
            accountCollection.withDocumentClass<Account>().find(eq(Account::email.name, identifier)).firstOrNull()

        } else if (RegexValidator.isValidUserName(identifier)) {
            accountCollection.withDocumentClass<Account>().find(eq(Account::username.name, identifier)).firstOrNull()

        } else {
            accountCollection.withDocumentClass<Account>().find(eq("_id", ObjectId(identifier))).firstOrNull()
        }
    }

    override suspend fun updateAccount(account: Account): Boolean {
        return accountCollection.withDocumentClass<Account>().updateOne(
            eq("_id", account.uuid),
            Updates.combine(
                Updates.set(Account::username.name, account.username),
                Updates.set(Account::displayName.name, account.displayName),
                Updates.set(Account::email.name, account.email),
                Updates.set(Account::avatarURL.name, account.avatarURL),
                Updates.set(Account::password.name, account.password),
            )
        ).wasAcknowledged()
    }

    override suspend fun deleteAccount(uuid: String): Boolean {
        return accountCollection.withDocumentClass<Account>().deleteOne(eq("_id", ObjectId(uuid))).wasAcknowledged()
    }

}