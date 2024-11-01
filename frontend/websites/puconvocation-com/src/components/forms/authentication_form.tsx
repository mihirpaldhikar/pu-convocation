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
import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusCode } from "@enums/StatusCode";
import { PasskeyIcon } from "@icons/index";
import { Button, Input, ProgressBar } from "@components/ui";
import { useToast } from "@hooks/index";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { AuthController } from "@controllers/index";

const authController = new AuthController();

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
  const { toast } = useToast();

  const [authenticationPayload, setAuthenticationPayload] = useState<{
    identifier: string;
    submitting: boolean;
  }>({
    identifier: "",
    submitting: false,
  });

  return (
    <div className={"h-fit w-full rounded-3xl bg-white px-7 pb-20 lg:w-3/4"}>
      <div
        className={authenticationPayload.submitting ? "visible" : "invisible"}
      >
        <ProgressBar type={"linear"} />
      </div>
      <div className={"space-y-3 pt-20"}>
        <Image
          src={
            "https://assets.puconvocation.com/logos/full_university_logo.svg"
          }
          fetchPriority={"high"}
          priority={true}
          alt={"Parul University"}
          width={250}
          height={150}
          className={"h-auto w-64"}
        />
        <div className={"grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-0"}>
          <div className={"space-y-3 pt-5"}>
            <h1 className={"text-3xl font-bold"}>
              {formTranslations("title")}
            </h1>
            <p className={"text-xs text-gray-600"}>
              {formTranslations("description")}
            </p>
          </div>
          <div>
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
                const response = await authController.authenticate(
                  authenticationPayload.identifier,
                );
                if (
                  response.statusCode === StatusCode.AUTHENTICATION_SUCCESSFUL
                ) {
                  router.push(redirect !== undefined ? redirect : "/console");
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
                className={"px-3 py-6"}
                value={authenticationPayload.identifier}
                spellCheck={false}
                placeholder={formTranslations("inputs.identifier")}
                onChange={(event) => {
                  setAuthenticationPayload({
                    ...authenticationPayload,
                    identifier: event.target.value.trim().replace(/\s/g, ""),
                  });
                }}
              />
              <div className={"space-y-4 pt-10"}>
                <Button
                  disabled={
                    authenticationPayload.submitting ||
                    authenticationPayload.identifier.length === 0
                  }
                  type={"submit"}
                  className={`flex w-full space-x-3 bg-red-600 py-5 transition-all duration-300`}
                >
                  <PasskeyIcon color={"#ffffff"} />{" "}
                  <h2>{formTranslations("buttons.passkey")}</h2>
                </Button>
                <p className={"text-xs text-gray-700"}>
                  {formTranslations("secureSignIn")}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
