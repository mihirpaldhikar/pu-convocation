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
import { AuthService } from "@services/index";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { StatusCode } from "@enums/StatusCode";
import { Button, Input } from "@components/ui";
import { useToast } from "@hooks/index";

const authService = new AuthService();

export default function NewAccountForm(): JSX.Element {
  const router = useRouter();

  const { toast } = useToast();

  const [credentials, setCredentials] = useState<{
    identifier: string;
    displayName: string;
    email: string;
    authenticationStrategy: "PASSKEY" | "PASSWORD";
    submitting: boolean;
  }>({
    identifier: "",
    displayName: "",
    email: "",
    authenticationStrategy: "PASSKEY",
    submitting: false,
  });

  return (
    <form
      className={"w-full space-y-3"}
      onSubmit={async (event) => {
        event.preventDefault();
        setCredentials((prevState) => {
          return {
            ...prevState,
            submitting: true,
          };
        });

        const response = await authService.createAccount(
          "__NULL__",
          credentials.displayName,
          credentials.identifier,
          credentials.email,
        );
        if (
          response.statusCode === StatusCode.PASSKEY_REGISTERED ||
          response.statusCode === StatusCode.AUTHENTICATION_SUCCESSFUL
        ) {
          router.push("/console");
        } else if ("message" in response) {
          toast({
            title: "Account Creation Failed",
            description: response.message,
            duration: 5000,
          });
        }
        setCredentials((prevState) => {
          return {
            ...prevState,
            submitting: false,
          };
        });
      }}
    >
      <Input
        disabled={credentials.submitting}
        type={"text"}
        value={credentials.identifier}
        placeholder={"Username..."}
        onChange={(event) => {
          setCredentials({
            ...credentials,
            identifier: event.target.value.trim().replace(/\s/g, ""),
          });
        }}
      />

      <Input
        disabled={credentials.submitting}
        type={"text"}
        value={credentials.displayName}
        placeholder={"Name..."}
        onChange={(event) => {
          setCredentials({
            ...credentials,
            displayName: event.target.value.trim().replace(/\s/g, ""),
          });
        }}
      />

      <Input
        disabled={credentials.submitting}
        type={"email"}
        value={credentials.email}
        placeholder={"Email..."}
        onChange={(event) => {
          setCredentials({
            ...credentials,
            email: event.target.value.trim().replace(/\s/g, ""),
          });
        }}
      />

      <div className={"flex justify-end"}>
        <Button
          disabled={
            credentials.identifier.length === 0 ||
            credentials.displayName.length === 0 ||
            credentials.email.length === 0 ||
            credentials.submitting
          }
          type={"submit"}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
