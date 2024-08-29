package com.puconvocation.routes

import com.puconvocation.commons.dto.UpdateWebsiteConfigRequest
import com.puconvocation.controllers.WebsiteController
import com.puconvocation.utils.getSecurityTokens
import com.puconvocation.utils.sendResponse
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.websiteConfigRoute(
    websiteController: WebsiteController
) {
    route("/websiteConfig") {
        get("/") {
            val result = websiteController.getWebsiteConfig()
            sendResponse(result)
        }

        patch("/update") {
            val authorizationToken = getSecurityTokens().authorizationToken
            val updateWebsiteConfigRequest = call.receive<UpdateWebsiteConfigRequest>()
            val result = websiteController.updateWebsiteConfig(authorizationToken,updateWebsiteConfigRequest)
            sendResponse(result)
        }
    }
}