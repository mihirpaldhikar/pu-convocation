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
import { Button, Input } from "@components/ui";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function IdentifierForm(): JSX.Element {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  return (
    <form
      className="flex w-full flex-col items-center justify-center space-x-4 space-y-3 px-16 pt-5 md:flex-row md:space-y-0 md:px-0"
      onSubmit={(event) => {
        event.preventDefault();
        if (identifier.length !== 0) {
          router.push(`/attendee/${identifier.toUpperCase()}`);
        }
      }}
    >
      <Input
        className={"w-full bg-white font-medium text-black md:w-1/5"}
        name={"identifier"}
        type={"text"}
        value={identifier}
        placeholder={"Enter Enrollment or Convocation No."}
        onChange={(event) => {
          setIdentifier(event.target.value.trim());
        }}
      />
      <Button type={"submit"} className={"space-x-3 rounded-full"}>
        <p className={"text-lg font-bold"}>Find your Seat</p>
        <ChevronRightIcon className={"w-5"} />
      </Button>
    </form>
  );
}
