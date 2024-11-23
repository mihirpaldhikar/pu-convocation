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

import { StatusCode } from "@enums/index";

export interface ErrorResponse<E> {
  statusCode:
    | StatusCode.FAILURE
    | StatusCode.NETWORK_ERROR
    | StatusCode.AUTHENTICATION_FAILED
    | StatusCode.ATTENDEE_NOT_FOUND;
  error: E;
}

export interface SuccessResponse<S> {
  statusCode:
    | StatusCode.SUCCESS
    | StatusCode.AUTHENTICATION_SUCCESSFUL
    | StatusCode.PASSKEY_REGISTERED;
  payload: S;
  cookies?: Readonly<string>;
}

export type Response<S, E> = SuccessResponse<S> | ErrorResponse<E>;
