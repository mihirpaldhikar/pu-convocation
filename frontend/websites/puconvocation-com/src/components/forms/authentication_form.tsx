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
import { Fragment, JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@hooks/use-toast";
import { StatusCode } from "@enums/StatusCode";
import { PasskeyIcon } from "@icons/index";
import { AuthService } from "@services/index";
import { Button, Input } from "@components/ui";
import { useAuth } from "../../providers/AuthProvider";

const authService = new AuthService();

export default function AuthenticationForm(): JSX.Element {
  const router = useRouter();
  const { dispatch } = useAuth();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [authenticationStrategy, setAuthenticationStrategy] = useState<
    "UNKNOWN" | "PASSWORD" | "PASSKEY"
  >("UNKNOWN");

  return (
    <form
      className={"w-full space-y-3"}
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        switch (authenticationStrategy) {
          case "UNKNOWN": {
            const response =
              await authService.getAuthenticationStrategy(identifier);
            if (
              response.statusCode === StatusCode.SUCCESS &&
              "payload" in response
            ) {
              setAuthenticationStrategy(
                response.payload as "UNKNOWN" | "PASSWORD" | "PASSKEY",
              );
            } else if ("message" in response) {
              toast({
                title: "Authentication Failed",
                description: response.message,
                duration: 5000,
              });
            }
            break;
          }
          case "PASSKEY": {
            const response = await authService.authenticate(
              authenticationStrategy,
              identifier,
            );
            if (response.statusCode === StatusCode.AUTHENTICATION_SUCCESSFUL) {
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
                router.replace("/console");
              });
            } else if ("message" in response) {
              toast({
                title: "Authentication Failed",
                description: response.message,
                duration: 5000,
              });
            }
            break;
          }
          case "PASSWORD": {
            const response = await authService.authenticate(
              authenticationStrategy,
              identifier,
              password,
            );
            if (response.statusCode === StatusCode.AUTHENTICATION_SUCCESSFUL) {
              router.replace("/console");
            } else if ("message" in response) {
              toast({
                title: "Authentication Failed",
                description: response.message,
                duration: 5000,
              });
            }
            break;
          }
          default:
            break;
        }
        setSubmitting(false);
      }}
    >
      <Input
        disabled={submitting}
        type={"text"}
        value={identifier}
        placeholder={"Username..."}
        onChange={(event) => {
          setIdentifier(event.target.value.trim());
        }}
      />
      <Input
        className={`${authenticationStrategy === "PASSWORD" ? "flex" : "hidden"} w-full rounded-md border px-3 py-2`}
        disabled={submitting}
        type={"password"}
        value={password}
        placeholder={"Password..."}
        onChange={(event) => {
          setPassword(event.target.value.trim());
        }}
      />
      <Button
        disabled={submitting || identifier.length === 0}
        type={"submit"}
        className={`flex w-full space-x-3`}
      >
        {authenticationStrategy === "PASSKEY" ? (
          <Fragment>
            <PasskeyIcon color={"#ffffff"} /> <h2>Continue With Passkey</h2>
          </Fragment>
        ) : (
          <span>Continue</span>
        )}
      </Button>
    </form>
  );
}
