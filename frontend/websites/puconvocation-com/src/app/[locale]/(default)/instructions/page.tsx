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

import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { Link } from "@i18n/routing";

export default async function InstructionsPage() {
  const response = await fetch(
    "https://assets.puconvocation.com/documents/instructions.md",
  );
  return (
    <div className={"min-h-screen w-full p-5 lg:p-10"}>
      <MDXRemote
        source={await response.text()}
        components={{
          h1: (props) => {
            return (
              <h1
                className={"py-5 text-2xl font-black text-red-600 lg:text-3xl"}
              >
                {props.children}
              </h1>
            );
          },
          h2: (props) => {
            return (
              <h2 className={"py-3 text-lg font-bold lg:text-xl text-red-600"}>
                {props.children}
              </h2>
            );
          },
          h3: (props) => {
            return <h3 className={"py-2 font-semibold text-red-600"}>{props.children}</h3>;
          },
          ul: (props) => {
            return (
              <ul
                className={
                  "list-inside list-disc space-y-2 pl-5 marker:text-red-600"
                }
              >
                {props.children}
              </ul>
            );
          },
          ol: (props) => {
            return (
              <ol
                className={
                  "list-inside list-decimal space-y-2 pl-5 marker:text-red-600"
                }
              >
                {props.children}
              </ol>
            );
          },
          img: (props) => {
            return (
              <Image
                src={props.src ?? ""}
                alt={props.alt ?? ""}
                className={"w-full rounded-md"}
                width={500}
                height={300}
              />
            );
          },
          p: (props) => {
            return <p className={"py-3 text-gray-800"}>{props.children}</p>;
          },
          a: (props) => {
            return (
              <Link
                href={props.href ?? ""}
                className={"text-red-800 underline"}
                target={"_blank"}
              >
                {props.children}
              </Link>
            );
          },
        }}
      />
    </div>
  );
}
