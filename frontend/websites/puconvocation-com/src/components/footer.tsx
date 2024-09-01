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
import { Flags } from "@components/index";
import Link from "next/link";

export default function Footer(): JSX.Element {
  return (
    <footer className={"relative z-0 bg-primary-foreground"}>
      <div className={"absolute -top-[2.8rem] right-0 md:-top-[5.3rem]"}>
        <Flags />
      </div>
      <div className={"space-y-10 px-5 pb-10 pt-24 md:px-10 md:pt-10"}>
        <section className={"space-y-3"}>
          <h3 className={"text-xl font-bold"}>Who We Are</h3>
          <p className={"w-full font-medium md:w-2/5"}>
            Parul University - Gujarat’s leading private university having the
            foundation of its first Institution laid in 1993 as Parul Group of
            Institutes, and later established and incorporated as Parul
            University in 2015 under the Gujarat Private Universities (Second
            Amendment) Act of 2009.
          </p>
        </section>
        <section className={"space-y-3"}>
          <h3 className={"text-xl font-bold"}>Credits</h3>
          <h6 className={"font-semibold"}>
            Developed By{" "}
            <Link
              target={"_blank"}
              href={"https://mihirpaldhikar.com"}
              className={"text-red-600 underline"}
            >
              Mihir Paldhikar
            </Link>{" "}
            &{" "}
            <Link
              target={"_blank"}
              href={"https://www.linkedin.com/in/suhani-shah-o13"}
              className={"text-red-600 underline"}
            >
              Suhani Shah
            </Link>
          </h6>
        </section>
        <section className={"space-y-10 text-center"}>
          <p className={"text-xs"}>
            &copy; {new Date().getFullYear()} CSE Department, Parul Institute of
            Technology, FET, Parul University
          </p>
          <Link
            href={"https://paruluniversity.ac.in"}
            target={"_blank"}
            className={
              "block text-4xl font-black opacity-30 md:text-6xl lg:text-8xl"
            }
          >
            <span className={"text-primary"}>Parul</span> University
          </Link>
        </section>
      </div>
    </footer>
  );
}
