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
import { Fragment, JSX, useEffect, useState } from "react";
import { AuthService } from "@services/index";
import { Account } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";
import { ProgressBar } from "@components/index";
import { Button } from "@components/ui";
import { useToast } from "@hooks/use-toast";

const authService = new AuthService();

export default function AccountPage(): JSX.Element {
  const { toast } = useToast();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    authService.getAccount().then((response) => {
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        setAccount(response.payload);
      } else if (
        response.statusCode === StatusCode.FAILURE &&
        "message" in response
      ) {
        setError(response.message);
      } else {
        setError("An unknown error occurred!");
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className={"flex min-h-dvh"}>
        <div className="m-auto flex items-center justify-center space-y-5">
          <ProgressBar />
        </div>
      </section>
    );
  }

  if (account !== null) {
    return (
      <Fragment>
        <section className={"space-y-5"}>
          <h2 className={"text-2xl font-bold"}>Hello, {account.displayName}</h2>
          <Button
            onClick={async () => {
              const response = await authService.registerPasskey(account.uuid);
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

  return (
    <section className={"flex min-h-dvh"}>
      <div className="m-auto flex items-center justify-center space-y-5">
        <h3>Cannot fetch account</h3>
        <p>{error}</p>
      </div>
    </section>
  );
}
