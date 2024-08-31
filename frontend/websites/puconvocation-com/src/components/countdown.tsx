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

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CountDownProps {
  futureTimestamp: number;
}

function convertTimestampToDHMS(timestampInSeconds: number): {
  remainingDays: string;
  remainingHours: string;
  remainingMinutes: string;
  remainingSeconds: string;
} {
  const totalSeconds = Math.floor(timestampInSeconds);

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  const formattedDays = days < 10 ? `0${days}` : days.toString();
  const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

  return {
    remainingDays: formattedDays,
    remainingHours: formattedHours,
    remainingMinutes: formattedMinutes,
    remainingSeconds: formattedSeconds,
  };
}

export default function CountDown({
  futureTimestamp,
}: Readonly<CountDownProps>): JSX.Element {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(
    futureTimestamp - Date.now() / 1000,
  );

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerInterval);
          router.refresh();
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [router]);

  const time = convertTimestampToDHMS(timeRemaining);

  return (
    <div
      className={
        "flex flex-1 items-center justify-center space-x-5 lg:space-x-10"
      }
    >
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-3xl font-black text-red-600 lg:text-6xl"}>
          {time.remainingDays}
        </h1>
        <h2 className={"text-xl font-bold lg:text-3xl"}>Days</h2>
      </div>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-3xl font-black lg:text-6xl"}>
          {time.remainingHours}
        </h1>
        <h2 className={"text-xl font-bold lg:text-3xl"}>Hours</h2>
      </div>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-3xl font-black text-red-600 lg:text-6xl"}>
          {time.remainingMinutes}
        </h1>
        <h2 className={"text-xl font-bold lg:text-3xl"}>Minutes</h2>
      </div>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-3xl font-black lg:text-6xl"}>
          {time.remainingSeconds}
        </h1>
        <h2 className={"text-xl font-bold lg:text-3xl"}>Seconds</h2>
      </div>
    </div>
  );
}
