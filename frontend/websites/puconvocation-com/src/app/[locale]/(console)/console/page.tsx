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
import { JSX } from "react";
import { useAuth } from "@hooks/index";
import { ProgressBar } from "@components/index";

export default function ConsolePage(): JSX.Element {
  const { state } = useAuth();

  if (state.loading) {
    return (
      <div className={"flex min-h-screen"}>
        <div className={"m-auto"}>
          <ProgressBar />
        </div>
      </div>
    );
  }

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
