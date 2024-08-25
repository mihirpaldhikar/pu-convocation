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
"use client";
import { JSX, useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { AuthService } from "@services/index";
import { StatusCode } from "@enums/StatusCode";

const authService = new AuthService();

export default function ConsolePage(): JSX.Element {
  const { state, dispatch } = useAuth();

  useEffect(() => {
    dispatch({
      type: "LOADING",
      payload: {
        loading: true,
      },
    });
    if (state.account === null) {
      authService.getAccount().then((res) => {
        if (
          res.statusCode === StatusCode.SUCCESS &&
          "payload" in res &&
          typeof res.payload === "object"
        ) {
          dispatch({
            type: "SET_ACCOUNT",
            payload: {
              account: res.payload,
            },
          });
        }
      });
    }
    dispatch({
      type: "LOADING",
      payload: {
        loading: false,
      },
    });
  }, [dispatch, state.account]);

  return (
    <div className={"flex min-h-screen"}>
      <div className={"m-auto"}>
        <div>
          <h1 hidden={state.loading} className={"text-2xl font-bold"}>
            {state.account?.displayName}
          </h1>
        </div>
      </div>
    </div>
  );
}
