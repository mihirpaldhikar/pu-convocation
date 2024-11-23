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
import { Fragment, JSX } from "react";
import { AuthController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { Button } from "@components/ui";
import { useAuth, useToast } from "@hooks/index";

const authService = new AuthController();

export default function AccountPage(): JSX.Element {
  const { toast } = useToast();
  const { account } = useAuth();

  if (account === null) {
    return <Fragment />;
  }

  return (
    <Fragment>
      <section className={"space-y-5"}>
        <h2 className={"text-2xl font-bold"}>Hello, {account?.displayName}</h2>
        <Button
          onClick={async () => {
            const response = await authService.registerPasskey(account.uuid!);
            toast({
              title:
                response.statusCode === StatusCode.PASSKEY_REGISTERED
                  ? "Success"
                  : "Failure",
              description:
                response.statusCode === StatusCode.FAILURE
                  ? response.error
                  : response.statusCode === StatusCode.PASSKEY_REGISTERED
                    ? response.payload.message
                    : "",
              duration: 5000,
            });
          }}
        >
          Register New Passkey
        </Button>
      </section>
    </Fragment>
  );
}
