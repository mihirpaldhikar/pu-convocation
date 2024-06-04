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
import { JSX } from "react";
import { AuthenticationForm } from "@components/forms";
import Image from "next/image";
import UniversityLogo from "@public/assets/logo.png";

export default function SignInPage(): JSX.Element {
  return (
    <section className={"flex min-h-dvh"}>
      <div className="m-auto flex w-full items-center justify-center px-3 md:px-20 lg:px-0">
        <div className="flex w-full flex-col space-y-5 rounded-lg border bg-white px-3 pb-5 pt-10 lg:w-1/3">
          <div
            className={"flex flex-col items-center justify-center space-y-3"}
          >
            <Image
              src={UniversityLogo}
              alt={"Parul University"}
              className={"w-36"}
            />
            <h2 className={"text-lg font-bold"}>
              Convocation Management System
            </h2>
          </div>
          <AuthenticationForm />
        </div>
      </div>
    </section>
  );
}
