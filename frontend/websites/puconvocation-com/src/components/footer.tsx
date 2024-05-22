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
    <footer className={"h-[750px] w-full bg-red-100/40 md:h-[580px]"}>
      <div className={"relative z-0 flex justify-end"}>
        <div className={"mt-[-45px] h-full md:mt-[-85px]"}>
          <Flags />
        </div>
        <div className={"absolute inset-0 z-10"}>
          <div>
            <div
              className={
                "flex h-full flex-col space-y-7  px-4 py-20 md:px-20  md:py-12"
              }
            >
              <div className={"space-y-3"}>
                <h4 className={"text-lg font-bold"}>Who We Are</h4>
                <p className={"font-medium"}>
                  Parul University - Gujarat’s leading private university having
                  the <br />
                  foundation of its first Institution laid in 1993 as Parul
                  Group of <br />
                  Institutes, and later established and incorporated as Parul{" "}
                  <br />
                  University in 2015 under the Gujarat Private Universities
                  (Second <br />
                  Amendment ) Act of 2009.
                </p>
              </div>
              <div className={"space-y-3"}>
                <h4 className={"text-lg font-bold"}>Credits</h4>
                <p className={"font-medium"}>
                  Developed By{" "}
                  <Link
                    href={"https://www.linkedin.com/in/suhani-shah-o13/"}
                    target={"_blank"}
                    className={"font-bold text-primary underline"}
                  >
                    Suhani Shah
                  </Link>{" "}
                  &{" "}
                  <Link
                    href={"https://mihirpaldhikar.com"}
                    target={"_blank"}
                    className={"font-bold text-primary underline"}
                  >
                    Mihir Paldhikar
                  </Link>
                </p>
                <p className={"font-medium"}>Coordinated By Mohit Rathod</p>
                <p className={"font-medium"}>
                  Guided By DR. Swapnil Parikh, Prof. Sumitra Menaria
                </p>
              </div>
            </div>
            <div className={"flex flex-col items-center space-y-5"}>
              <p>
                &copy; {new Date().getFullYear()} CSE Department, PIT, Parul
                University
              </p>
              <Link href={"https://paruluniversity.ac.in"} target={"_blank"}>
                <h1 className={"text-4xl font-black text-black/30 md:text-8xl"}>
                  <span className={"text-primary/30"}>Parul</span> University
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
