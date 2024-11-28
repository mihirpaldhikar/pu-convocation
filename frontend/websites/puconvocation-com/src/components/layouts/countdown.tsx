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

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { intervalToDuration } from "date-fns";
import { Skeleton } from "@components/ui";

interface CountDownProps {
  futureTimestamp: number;
}

function padZero(num: number) {
  return num.toString().padStart(2, "0");
}

export default function CountDown({
  futureTimestamp,
}: Readonly<CountDownProps>): JSX.Element {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const futureDate = new Date(futureTimestamp);

      const duration = intervalToDuration({ start: now, end: futureDate });
      const { days, hours, minutes, seconds } = duration;
      const timeLeft = `${padZero(days ?? 0)}:${padZero(hours ?? 0)}:${padZero(minutes ?? 0)}:${padZero(seconds ?? 0)}`;
      if (timeLeft === "00:00:00:00") {
        clearInterval(interval);
        router.refresh();
      }
      setRemainingTime(timeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [futureTimestamp]);

  if (remainingTime === "") {
    return (
      <div
        className={"flex items-center justify-between space-x-4 lg:space-x-20"}
      >
        <div className={"space-y-4"}>
          <Skeleton className={"size-20"} />
          <Skeleton className={"h-5 w-20"} />
        </div>
        <div className={"space-y-4"}>
          <Skeleton className={"size-20"} />
          <Skeleton className={"h-5 w-20"} />
        </div>
        <div className={"space-y-4"}>
          <Skeleton className={"size-20"} />
          <Skeleton className={"h-5 w-20"} />
        </div>
        <div className={"space-y-4"}>
          <Skeleton className={"size-20"} />
          <Skeleton className={"h-5 w-20"} />
        </div>
      </div>
    );
  }

  const [days, hours, minutes, seconds] = remainingTime.split(":");

  return (
    <div
      className={
        "flex flex-1 items-center justify-center space-x-5 lg:space-x-10"
      }
    >
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-3xl font-black text-red-600 lg:text-6xl"}>
          {days}
        </h1>
        <h2 className={"text-xl font-bold lg:text-3xl"}>Days</h2>
      </div>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-3xl font-black lg:text-6xl"}>{hours}</h1>
        <h2 className={"text-xl font-bold lg:text-3xl"}>Hours</h2>
      </div>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-3xl font-black text-red-600 lg:text-6xl"}>
          {minutes}
        </h1>
        <h2 className={"text-xl font-bold lg:text-3xl"}>Minutes</h2>
      </div>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-3xl font-black lg:text-6xl"}>{seconds}</h1>
        <h2 className={"text-xl font-bold lg:text-3xl"}>Seconds</h2>
      </div>
    </div>
  );
}
