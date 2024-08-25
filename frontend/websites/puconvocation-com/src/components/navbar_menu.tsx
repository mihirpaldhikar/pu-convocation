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
import { UserCircleIcon, WindowIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { StatusCode } from "@enums/StatusCode";
import { AuthService } from "@services/index";

const authService = new AuthService();

export default function NavbarMenu(): JSX.Element {
  const { state, dispatch } = useAuth();
  const account = state.account;

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
    setTimeout(() => {
      dispatch({
        type: "LOADING",
        payload: {
          loading: false,
        },
      });
    }, 500);
  }, [dispatch, state.account]);

  return (
    <nav className={`flex items-center space-x-5`}>
      <Link
        href={"/authenticate"}
        className={`${!state.loading && account === null ? "flex" : "hidden"} items-center rounded-2xl bg-black px-4 py-2 text-white`}
      >
        <UserCircleIcon className={"mr-2 size-5"} />
        <span className="mr-2">Login</span>
      </Link>
      <Link
        href={"/console"}
        className={`${!state.loading && account !== null ? "flex" : "hidden"} items-center rounded-2xl bg-black px-4 py-2 text-white`}
      >
        <WindowIcon className={"mr-2 size-5"} />
        <span className="mr-2">Console</span>
      </Link>
    </nav>
  );
}
