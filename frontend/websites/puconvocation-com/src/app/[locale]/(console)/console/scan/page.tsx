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
import { Fragment, JSX, useState } from "react";
import { useZxing } from "react-zxing";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "use-intl";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@components/ui";
import { AttendeeService } from "@services/index";
import { DynamicIcon, ProgressBar } from "@components/index";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { StatusCode } from "@enums/StatusCode";
import { Attendee } from "@dto/index";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@components/ui/input_otp";
import { useToast } from "@hooks/useToast";

const attendeeService = new AttendeeService();

export default function VerificationPage(): JSX.Element {
  const pageTranslations = useTranslations("pages.scanPage");

  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>("");

  const { ref: qrCodeScanner } = useZxing({
    onDecodeResult(result) {
      const tokenRegex = /^[a-zA-Z0-9]+$/;
      const verificationToken = result.getText();

      if (tokenRegex.test(verificationToken)) {
        setOpen(true);
        attendeeService
          .getAttendeeFromVerificationToken(verificationToken)
          .then((result) => {
            if (
              result.statusCode === StatusCode.SUCCESS &&
              "payload" in result &&
              typeof result.payload === "object"
            ) {
              setAttendee(result.payload);
            }
            setLoading(false);
          });
      }
    },
  });

  return (
    <Fragment>
      <section className={"flex min-h-dvh"}>
        <div className="m-auto flex w-full flex-col items-center justify-center">
          <div
            className={"flex flex-col items-center justify-center space-y-3"}
          >
            <QrCodeIcon className={"size-14 text-red-600"} />
            <h6 className={"text-xl font-semibold"}>
              {pageTranslations("title")}
            </h6>
          </div>
          <div className={"p-10"}>
            <video
              ref={qrCodeScanner}
              style={{
                borderRadius: "1rem",
              }}
            />
          </div>
        </div>
      </section>
      <Sheet open={open} onOpenChange={(currentState) => setOpen(currentState)}>
        <SheetContent side={"bottom"} className={"h-2/3"}>
          <SheetTitle />
          <SheetHeader />
          <SheetDescription />
          <div className={"h-full"}>
            {loading ? (
              <div className={"flex h-full w-full items-center justify-center"}>
                <ProgressBar type={"circular"} />
              </div>
            ) : !loading && attendee === null ? (
              <div
                className={
                  "flex h-full w-full flex-col items-center justify-center space-y-5"
                }
              >
                <DynamicIcon
                  icon={"XCircleIcon"}
                  outline={false}
                  className={"size-14 text-red-600"}
                />
                <h5 className={"text-lg font-semibold"}>Attendee Not Found!</h5>
              </div>
            ) : (
              attendee !== null && (
                <Fragment>
                  <div
                    className={
                      "flex flex-col items-center justify-center space-y-3"
                    }
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
                    <SheetClose asChild={true}>
                      <Button
                        disabled={verificationCode.length !== 6}
                        className={"w-full"}
                        onClick={async () => {
                          if (verificationCode === attendee.verificationCode) {
                            setLoading(true);
                            setVerificationCode("");
                            const response =
                              await attendeeService.createTransaction(
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
                            } else {
                              toast({
                                title: "Success",
                                description:
                                  "Transaction completed successfully.",
                                duration: 5000,
                              });
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
                    </SheetClose>
                  </div>
                </Fragment>
              )
            )}
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
