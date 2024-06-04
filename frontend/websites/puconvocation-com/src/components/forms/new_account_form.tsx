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
import { useToast } from "@hooks/use-toast";

const authService = new AuthService();

export default function NewAccountForm(): JSX.Element {
  const router = useRouter();

  const { toast } = useToast();

  const [identifier, setIdentifier] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [authenticationStrategy, setAuthenticationStrategy] = useState<
    "PASSKEY" | "PASSWORD"
  >("PASSKEY");

  return (
    <form
      className={"w-full space-y-3"}
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        const response = await authService.createAccount(
          authenticationStrategy,
          displayName,
          identifier,
          email,
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
        setSubmitting(false);
      }}
    >
      <Input
        disabled={submitting}
        type={"text"}
        value={identifier}
        placeholder={"Username..."}
        onChange={(event) => {
          setIdentifier(event.target.value);
        }}
      />

      <Input
        disabled={submitting}
        type={"text"}
        value={displayName}
        placeholder={"Name..."}
        onChange={(event) => {
          setDisplayName(event.target.value);
        }}
      />

      <Input
        disabled={submitting}
        type={"email"}
        value={email}
        placeholder={"Email..."}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />

      <div className={"flex justify-end"}>
        <Button
          disabled={
            identifier.length === 0 ||
            displayName.length === 0 ||
            email.length === 0 ||
            submitting
          }
          type={"submit"}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
