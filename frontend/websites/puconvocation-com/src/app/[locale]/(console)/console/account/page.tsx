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
"use client";
import {Fragment, JSX} from "react";
import {AuthController} from "@controllers/index";
import {StatusCode} from "@enums/StatusCode";
import {ProgressBar} from "@components/index";
import {Button} from "@components/ui";
import {useAuth, useToast} from "@hooks/index";

const authService = new AuthController();

export default function AccountPage(): JSX.Element {
  const { toast } = useToast();
  const { state } = useAuth();

  if (state.loading) {
    return (
      <section className={"flex min-h-dvh"}>
        <div className="m-auto flex items-center justify-center space-y-5">
          <ProgressBar />
        </div>
      </section>
    );
  }

  return (
    <Fragment>
      <section className={"space-y-5"}>
        <h2 className={"text-2xl font-bold"}>
          Hello, {state.account?.displayName}
        </h2>
        <Button
          onClick={async () => {
            const response = await authService.registerPasskey(
              state.account?.uuid!!,
            );
            if ("message" in response) {
              toast({
                title:
                  response.statusCode === StatusCode.PASSKEY_REGISTERED
                    ? "Success"
                    : "Failure",
                description: response.message,
                duration: 5000,
              });
            }
          }}
        >
          Register New Passkey
        </Button>
      </section>
    </Fragment>
  );
}
