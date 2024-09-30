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

package com.puconvocation.utils

object RegexValidator {

    private val validUserNamePattern = Regex("^(?=.{3,20}\$)(?![_.])[a-zA-Z0-9._]+(?<![_.])\$")
    private val validEmailPattern = Regex("^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+\$")
    private val validPasswordPattern =
        Regex("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@\$%^&*-]).{8,}\$")

    fun isValidEmail(email: String): Boolean {
        return validEmailPattern.containsMatchIn(email)
    }

    fun isValidUserName(username: String): Boolean {
        return validUserNamePattern.containsMatchIn(username)
    }

    fun isValidPassword(password: String): Boolean {
        return validPasswordPattern.containsMatchIn(password)
    }
}