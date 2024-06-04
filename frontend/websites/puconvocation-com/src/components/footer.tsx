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

import { Fragment, JSX } from "react";
import { Flags } from "@components/index";
import Link from "next/link";

interface FooterProps {
  whoWeAre: string;
  credits: Array<{
    name: string;
    credits: Array<{
      name: string;
      link: string;
      bold: boolean;
      underline: boolean;
    }>;
  }>;
}

export default function Footer({
  whoWeAre,
  credits,
}: Readonly<FooterProps>): JSX.Element {
  return (
    <footer className={"relative z-0 bg-primary-foreground"}>
      <div className={"absolute -top-[2.8rem] right-0 md:-top-[5.3rem]"}>
        <Flags />
      </div>
      <div className={"space-y-10 px-5 pb-10 pt-24 md:px-10 md:pt-10"}>
        <section className={"space-y-3"}>
          <h3 className={"text-xl font-bold"}>We We Are</h3>
          <p className={"w-full font-medium md:w-2/5"}>{whoWeAre}</p>
        </section>
        <section className={"space-y-3"}>
          <h3 className={"text-xl font-bold"}>Credits</h3>
          {credits.map((credit, i) => {
            return (
              <p key={i} className={"font-medium"}>
                {credit.name}{" "}
                {credit.credits.map((c, j) => {
                  return (
                    <Fragment key={j}>
                      <Link
                        href={c.link}
                        target={"_blank"}
                        className={` ${c.bold ? "font-bold text-primary" : "font-medium"} ${c.underline ? "underline" : "no-underline"} `}
                      >
                        {c.name}
                      </Link>
                      {j < credit.credits.length - 1 ? ", " : " "}
                    </Fragment>
                  );
                })}
              </p>
            );
          })}
        </section>
        <section className={"space-y-10 text-center"}>
          <p className={"text-xs"}>
            &copy; 2024 CSE Department, Parul Institute of Technology, FET,
            Parul University
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
