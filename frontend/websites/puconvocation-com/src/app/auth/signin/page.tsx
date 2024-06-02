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
import { JSX, useState } from "react";
import Image from "next/image";
import universityLogo from "@public/assets/logo.png";
import { AuthService } from "@services/index";
import { Credentials } from "@dto/index";
import { useRouter } from "next/navigation";
import { StatusCode } from "@enums/StatusCode";
import { Button, Input } from "@components/ui";
import { useToast } from "@hooks/use-toast";

const authService: AuthService = new AuthService();

export default function SignInPage(): JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className={"flex min-h-screen flex-col"}>
      <div className={"m-auto flex w-full items-center justify-center"}>
        <div
          className={
            "flex w-full flex-col space-y-5 rounded-lg px-7 py-5 md:w-1/2 md:border md:border-gray-300 lg:w-1/3"
          }
        >
          <div
            className={"flex flex-col items-center justify-center space-y-3"}
          >
            <Image
              src={universityLogo}
              alt={"Parul University"}
              priority={true}
              fetchPriority={"high"}
              className={"w-36"}
            />
            <h2 className={"text-lg font-bold"}>
              Convocation Management System
            </h2>
          </div>
          <form
            className={"flex flex-col space-y-3"}
            onSubmit={async (event) => {
              event.preventDefault();
              if (email.endsWith("@paruluniversity.ac.in")) {
                setLoading(true);
                const credentials: Credentials = {
                  identifier: email,
                  password: password,
                };
                const response = await authService.authenticate(credentials);
                if (
                  response.statusCode === StatusCode.AUTHENTICATION_SUCCESSFUL
                ) {
                  router.replace("/console");
                } else if ("message" in response) {
                  toast({
                    title: "Authentication Failed",
                    description: response.message,
                    duration: 5000,
                  });
                  setLoading(false);
                }
              } else {
                toast({
                  title: "Invalid Email",
                  description: "Please use University Email Address.",
                  duration: 5000,
                });
              }
            }}
          >
            <Input
              name="email"
              placeholder={"Email.."}
              value={email}
              type={"email"}
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              name="password"
              placeholder={"Password.."}
              type={"password"}
              disabled={loading}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              type={"submit"}
              disabled={email.length === 0 || password.length === 0 || loading}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
      <div className={"flex justify-center pb-10"}>
        <p>Parul University &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
