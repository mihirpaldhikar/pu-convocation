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
import { StatusCode } from "@enums/StatusCode";
import { PasskeyIcon } from "@icons/index";
import { Button, Input } from "@components/ui";
import { useAuth, useToast } from "@hooks/index";
import { useTranslations } from "use-intl";

interface AuthenticationFormProps {
  redirect?: string;
}

export default function AuthenticationForm({
  redirect,
}: Readonly<AuthenticationFormProps>): JSX.Element {
  const formTranslations = useTranslations(
    "components.forms.authenticationForm",
  );

  const router = useRouter();
  const { state, dispatch } = useAuth();
  const { toast } = useToast();

  const [authenticationPayload, setAuthenticationPayload] = useState<{
    identifier: string;
    submitting: boolean;
  }>({
    identifier: "",
    submitting: false,
  });

  return (
    <form
      className={"w-full space-y-3"}
      onSubmit={async (event) => {
        event.preventDefault();
        setAuthenticationPayload((prevState) => {
          return {
            ...prevState,
            submitting: true,
          };
        });
        const response = await state.authService.authenticate(
          authenticationPayload.identifier,
        );
        if (response.statusCode === StatusCode.AUTHENTICATION_SUCCESSFUL) {
          state.authService.getCurrentAccount().then((res) => {
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
            router.replace(redirect ?? "/console");
          });
        } else if ("message" in response) {
          toast({
            title: "Authentication Failed",
            description: response.message,
            duration: 5000,
          });
          setAuthenticationPayload((prevState) => {
            return {
              ...prevState,
              submitting: false,
            };
          });
        }
      }}
    >
      <Input
        disabled={authenticationPayload.submitting}
        type={"text"}
        value={authenticationPayload.identifier}
        placeholder={formTranslations("inputs.identifier")}
        onChange={(event) => {
          setAuthenticationPayload({
            ...authenticationPayload,
            identifier: event.target.value.trim().replace(/\s/g, ""),
          });
        }}
      />
      <Button
        disabled={
          authenticationPayload.submitting ||
          authenticationPayload.identifier.length === 0
        }
        type={"submit"}
        className={`flex w-full space-x-3`}
      >
        {authenticationPayload.submitting ? (
          <Fragment>
            <h2>Authenticating...</h2>
          </Fragment>
        ) : (
          <Fragment>
            <PasskeyIcon color={"#ffffff"} />{" "}
            <h2>{formTranslations("buttons.passkey")}</h2>
          </Fragment>
        )}
      </Button>
    </form>
  );
}
