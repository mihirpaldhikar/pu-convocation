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

package com.puconvocation.database.mongodb.datasources

import com.puconvocation.commons.dto.AccountWithIAMPolicies
import com.puconvocation.database.mongodb.entities.Account
import com.puconvocation.database.mongodb.entities.Invitation
import com.puconvocation.security.dao.FidoCredential

interface AccountDatasource {
    suspend fun accountExists(identifier: String): Boolean

    suspend fun createAccount(account: Account): Boolean

    suspend fun getAccount(identifier: String): Account?

    suspend fun getAllAccounts(): List<AccountWithIAMPolicies>

    suspend fun getAccountWithIAMRoles(identifier: String): AccountWithIAMPolicies?

    suspend fun updateAccount(account: Account): Boolean

    suspend fun deleteAccount(uuid: String): Boolean

    suspend fun addFidoCredentials(uuid: String, fidoCredential: FidoCredential): Boolean

    suspend fun createInvitation(invitation: Invitation): Boolean

    suspend fun findInvitation(invitationId: String): Invitation?

    suspend fun deleteInvitation(invitationId: String): Boolean

}