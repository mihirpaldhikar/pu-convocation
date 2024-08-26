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
import { AttendeeService } from "@services/index";
import { Attendee } from "@dto/index";
import { StatusCode } from "@enums/StatusCode";
import NotFound from "next/dist/client/components/not-found-error";
import { ProgressBar } from "@components/index";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@components/ui/input_otp";
import { Button } from "@components/ui";
import { useToast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";

const attendeeService = new AttendeeService();

export default function VerificationPage({
  searchParams,
}: {
  searchParams: { token: string };
}): JSX.Element {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>("");

  useEffect(() => {
    attendeeService
      .getAttendeeFromVerificationToken(searchParams.token)
      .then((res) => {
        if (
          res.statusCode === StatusCode.SUCCESS &&
          "payload" in res &&
          typeof res.payload === "object"
        ) {
          setAttendee(res.payload);
        }
        setLoading(false);
      });
  }, [searchParams.token]);

  if (loading) {
    return (
      <div className={"flex h-dvh"}>
        <div className={"m-auto w-1/2 lg:w-1/6"}>
          <ProgressBar type={"linear"} />
        </div>
      </div>
    );
  }

  if (attendee === null) {
    return <NotFound />;
  }

  return (
    <section className={"flex h-dvh"}>
      <div className="m-auto w-full md:w-1/2">
        <div className="flex flex-col space-y-5 rounded-xl border-2 border-gray-300 px-5 py-7">
          <div
            className={"flex flex-col items-center justify-center space-y-3"}
          >
            <CheckBadgeIcon className={"size-14 text-green-600"} />
            <h4 className={"text-xl font-bold"}>Confirmation</h4>
          </div>
          <div>
            <div className={"space-y-3"}>
              <h4 className={"text-lg font-semibold"}>
                Student Name: {attendee.studentName}
              </h4>
              <h4 className={"text-lg font-semibold"}>
                Enrollment No: {attendee.enrollmentNumber}
              </h4>
              <h4 className={"text-lg font-semibold"}>
                Department: {attendee.department}
              </h4>
              <h4 className={"text-lg font-semibold"}>
                Institute: {attendee.institute}
              </h4>
            </div>
            <div
              className={
                "flex w-full flex-col items-center justify-center space-y-3 py-5"
              }
            >
              <h5>Enter Verification Code</h5>
              <InputOTP
                maxLength={6}
                onChange={(code) => {
                  setVerificationCode(code);
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              disabled={verificationCode.length !== 6}
              className={"w-full"}
              onClick={async () => {
                if (verificationCode === attendee.verificationCode) {
                  setLoading(true);
                  const response = await attendeeService.createTransaction(
                    attendee.enrollmentNumber,
                  );

                  if (
                    response.statusCode === StatusCode.FAILURE &&
                    "message" in response
                  ) {
                    toast({
                      title: "Transaction Failed",
                      description: response.message,
                      duration: 5000,
                    });
                    setVerificationCode("");
                    setLoading(false);
                  } else {
                    router.push("/console/scan");
                  }
                } else {
                  toast({
                    title: "Transaction Failed",
                    description: "Invalid Verification Code.",
                    duration: 5000,
                  });
                }
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
