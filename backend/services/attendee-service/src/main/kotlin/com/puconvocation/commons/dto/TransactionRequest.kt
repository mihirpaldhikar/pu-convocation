package com.puconvocation.commons.dto

import com.google.gson.annotations.Expose

data class TransactionRequest(
    @Expose val studentEnrollmentNumber: String,
)
