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
import { JSX } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui";
import { useRemoteConfig } from "@hooks/index";
import { AttendeeController } from "@controllers/index";

const attendeeController = new AttendeeController();

interface AttendeeControllerProps {
  totalAttendeeCount: number;
}

export default function AttendeeControlPlane({
  totalAttendeeCount,
}: Readonly<AttendeeControllerProps>): JSX.Element {
  const { remoteConfig, dispatch: dispatchRemoteConfig } = useRemoteConfig();
  return (
    <Card className="h-[12rem] w-full p-4">
      <CardHeader>
        <CardTitle>Total Attendees</CardTitle>
        <CardDescription>
          Showing total number of attendees for the convocation.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-5xl font-bold text-red-600">
          {totalAttendeeCount}
        </span>
        <Button
          disabled={remoteConfig.attendeesLocked}
          onClick={async () => {
            dispatchRemoteConfig({
              type: "SET_CONFIG",
              payload: {
                config: {
                  ...remoteConfig,
                  attendeesLocked: !remoteConfig?.attendeesLocked,
                },
              },
            });
            await attendeeController.mutateAttendeeLock(
              !remoteConfig.attendeesLocked,
            );
          }}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          {remoteConfig?.attendeesLocked ? "Unlock" : "Lock"}
        </Button>
      </CardContent>
    </Card>
  );
}
