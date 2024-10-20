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
  ProgressBar,
} from "@components/ui";
import { UsersIcon } from "@heroicons/react/24/solid";
import { AttendeeTable } from "@components/attendee/attendee_table";
import { useQuery } from "@tanstack/react-query";
import { AttendeeController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { useRemoteConfig } from "@hooks/index";

const attendeeController = new AttendeeController();

export default function AttendeePage(): JSX.Element {
  const { remoteConfig, dispatch: dispatchRemoteConfig } = useRemoteConfig();

  const {
    data: totalAttendeeCount = 0,
    isLoading: isTotalLoading,
    isError: totalError,
  } = useQuery({
    queryKey: ["totalAttendeeCount"],
    queryFn: async () => {
      const response = await attendeeController.getTotalAttendeesCount();
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        return response.payload.count;
      }
      return 0;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex min-h-screen flex-col space-y-10 p-4 md:p-10">
      <div className="space-y-3">
        <h1 className="flex items-center text-2xl font-bold">
          <UsersIcon className="mr-2 h-6 w-6 text-red-600" /> Attendees
        </h1>
        <p className="text-xs text-gray-600">
          View and manage the complete list of attendees for the convocation.
        </p>
      </div>

      <div className="flex min-h-screen flex-col items-center">
        <div className="mb-2 grid w-full grid-cols-1 gap-6 lg:grid-cols-1">
          <Card className="h-[12rem] w-full p-4">
            <CardHeader>
              <CardTitle>Total Attendees</CardTitle>
              <CardDescription>
                Showing total number of attendees for the convocation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              {isTotalLoading ? (
                <ProgressBar type="circular" />
              ) : totalError ? (
                <p className="text-red-600">
                  Error loading total attendees count
                </p>
              ) : (
                <span className="text-5xl font-bold text-red-600">
                  {totalAttendeeCount}
                </span>
              )}
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
                    !remoteConfig!!.attendeesLocked,
                  );
                }}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {remoteConfig?.attendeesLocked ? "Unlock" : "Lock"}
              </Button>
            </CardContent>
          </Card>

          <AttendeeTable totalAttendeeCount={totalAttendeeCount} />
        </div>
      </div>
    </div>
  );
}
