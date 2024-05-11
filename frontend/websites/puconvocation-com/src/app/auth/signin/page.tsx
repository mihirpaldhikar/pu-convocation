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

const authService: AuthService = new AuthService();

export default function SignInPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={"min-h-screen flex"}>
      <div className={"m-auto w-full flex items-center justify-center"}>
        <div
          className={
            "flex flex-col rounded-lg md:border md:border-gray-300 w-full md:w-1/2 lg:w-1/3 px-7 py-5 space-y-5"
          }
        >
          <div
            className={"flex justify-center flex-col items-center space-y-3"}
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
              const credentials: Credentials = {
                identifier: email,
                password: password,
              };
              const response = await authService.sigIn(credentials);
              if (
                response.statusCode === StatusCode.AUTHENTICATION_SUCCESSFUL
              ) {
                router.replace("/console");
              }
            }}
          >
            <input
              className={"border border-gray-300 rounded-md px-3 py-2"}
              type={"email"}
              placeholder={"Email..."}
              required={true}
              name={"email"}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <input
              className={"border border-gray-300 rounded-md px-3 py-2"}
              type={"password"}
              placeholder={"Password..."}
              required={true}
              name={"password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <button
              type="submit"
              disabled={email.length === 0 || password.length === 0}
              className={
                "bg-red-600 text-white font-bold px-2 py-2 rounded-md disabled:bg-gray-300 disabled:text-gray-400"
              }
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
