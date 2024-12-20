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
import { Fragment, JSX, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FilePicker,
} from "@components/ui";
import { useAuth, useRemoteConfig, useToast } from "@hooks/index";
import { AttendeeController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { isAuthorized } from "@lib/iam_utils";
import IAMPolicies from "@configs/IAMPolicies";

const numberFormatter = Intl.NumberFormat("en", {
  maximumFractionDigits: 2,
  notation: "compact",
});
const attendeeController = new AttendeeController();

interface AttendeeControllerProps {
  totalAttendeeCount: number;
}

export default function AttendeeControlPlane({
  totalAttendeeCount,
}: Readonly<AttendeeControllerProps>): JSX.Element {
  const { remoteConfig, dispatch: dispatchRemoteConfig } = useRemoteConfig();
  const { account } = useAuth();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Attendees</CardTitle>
        <CardDescription>
          Showing total number of attendees for the convocation.
        </CardDescription>
      </CardHeader>
      <CardContent className={"space-y-5"}>
        <div className="flex items-center justify-between">
          <span className="text-5xl font-bold text-red-600">
            {numberFormatter.format(totalAttendeeCount)}
          </span>
          {isAuthorized(
            IAMPolicies.WRITE_ATTENDEES,
            account!!.assignedIAMPolicies,
          ) ? (
            <Button
              onClick={async () => {
                const response = await attendeeController.mutateAttendeeLock(
                  !remoteConfig.attendees.locked,
                );
                if (response.statusCode === StatusCode.FAILURE) {
                  toast({
                    title: "Operation Failed",
                    description: response.error,
                    duration: 5000,
                  });
                } else {
                  dispatchRemoteConfig({
                    type: "TOGGLE_ATTENDEE_LOCK",
                    payload: {
                      locked: !remoteConfig.attendees.locked,
                    },
                  });
                }
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {remoteConfig?.attendees.locked ? "Unlock" : "Lock"}
            </Button>
          ) : (
            <Fragment />
          )}
        </div>
        {remoteConfig.attendees.locked ||
        !isAuthorized(
          IAMPolicies.WRITE_ATTENDEES,
          account!!.assignedIAMPolicies,
        ) ? (
          <Fragment />
        ) : (
          <div
            className={
              "relative cursor-pointer rounded-xl border border-dashed border-neutral-600 py-7"
            }
          >
            <div
              className={
                "absolute right-0 top-0 h-full w-full cursor-pointer rounded-xl bg-neutral-50"
              }
            >
              <div
                className={
                  "flex h-full cursor-pointer flex-col items-center justify-center space-y-3"
                }
              >
                <div className={"flex space-x-3 text-neutral-700"}>
                  <ArrowUpTrayIcon className={"size-5"} />
                  <h6 className={"font-medium"}>Upload Attendee List</h6>
                </div>
                <p className={"text-xs text-gray-500"}>
                  Drag or Click here to upload CSV File
                </p>
              </div>
            </div>
            <FilePicker
              disabled={remoteConfig.attendees.locked || uploading}
              allowedFileExtensions={".csv"}
              onFilePicked={async (file) => {
                if (file !== null) {
                  setUploading(true);
                  const response =
                    await attendeeController.uploadAttendeeList(file);
                  if (response.statusCode === StatusCode.SUCCESS) {
                    setUploading(false);
                    await queryClient.invalidateQueries({
                      queryKey: ["attendeesList"],
                    });
                    router.refresh();
                  } else if (response.statusCode === StatusCode.FAILURE) {
                    setUploading(false);
                    toast({
                      title: "Upload Failed",
                      description: response.error,
                      duration: 5000,
                    });
                  }
                }
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
