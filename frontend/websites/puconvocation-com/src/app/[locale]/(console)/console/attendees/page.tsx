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

import { JSX, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  ProgressBar,
} from "@components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { AttendeeController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { useDebounce, useRemoteConfig } from "@hooks/index";
import { Attendee } from "@dto/index";
import { SpaceShip } from "@components/graphics";

const attendeeController = new AttendeeController();

export default function AttendeePage(): JSX.Element {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { remoteConfig, dispatch: dispatchRemoteConfig } = useRemoteConfig();
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
    null,
  );

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

  const {
    data: attendees = [],
    isLoading: isAttendeeLoading,
    isError: attendeeError,
  } = useQuery({
    queryKey: ["attendeesList", debouncedSearchQuery, page],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (debouncedSearchQuery.length > 0) {
        const response =
          await attendeeController.searchAttendees(debouncedSearchQuery);
        if (
          response.statusCode === StatusCode.SUCCESS &&
          "payload" in response &&
          typeof response.payload === "object"
        ) {
          return response.payload;
        }
        return [];
      } else {
        const response = await attendeeController.getAllAttendees(page, 10);
        if (
          response.statusCode === StatusCode.SUCCESS &&
          "payload" in response &&
          typeof response.payload === "object"
        ) {
          return response.payload.attendees;
        }
        return [];
      }
    },
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

      <div className="flex min-h-screen flex-col items-center p-1">
        <div className="mb-2 grid w-full grid-cols-1 gap-6 lg:grid-cols-1">
          <Card className="h-[200px] w-full p-4">
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
                        ...remoteConfig!!,
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
          <Card className="h-[750px] w-full flex-grow p-4 shadow-none">
            <CardHeader>
              <CardTitle>Attendee List</CardTitle>
              <CardDescription>
                Showing detailed list of registered attendees with their
                respective information.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col">
              <div className="flex items-center pb-5">
                <Input
                  type="text"
                  placeholder="Search Attendees..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
              </div>

              {isAttendeeLoading ? (
                <div className="flex h-full items-center justify-center">
                  <ProgressBar type="circular" />
                </div>
              ) : attendeeError ? (
                <p className="text-red-600">Error loading attendees</p>
              ) : attendees.length === 0 ? (
                <div
                  className={"flex flex-col items-center justify-center py-5"}
                >
                  <SpaceShip />
                  <p className={"font-semibold"}>Attendees not uploaded.</p>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto">
                  <Dialog>
                    <table className="min-w-full table-auto border-collapse">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Enrollment Number
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendees.map((a) => (
                          <DialogTrigger
                            asChild={true}
                            key={a.convocationId.concat(
                              Math.random().toString(),
                            )}
                            onClick={() => {
                              setSelectedAttendee(a);
                            }}
                          >
                            <tr className="cursor-pointer rounded-xl border-b transition-colors duration-200 hover:bg-gray-100">
                              <td className="px-4 py-2">
                                {a.enrollmentNumber}
                              </td>
                              <td className="px-4 py-2">{a.studentName}</td>
                            </tr>
                          </DialogTrigger>
                        ))}
                      </tbody>
                    </table>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Attendee Details</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <div>
                        <h4>
                          Enrollment Number:{" "}
                          {selectedAttendee?.enrollmentNumber}
                        </h4>
                        <h4>Name: {selectedAttendee?.studentName}</h4>
                        <h4>Department: {selectedAttendee?.department}</h4>
                        <h4>Institute: {selectedAttendee?.institute}</h4>
                        <h4>
                          Enclosure: {selectedAttendee?.allocation.enclosure}
                        </h4>
                        <h4>Seat: {selectedAttendee?.allocation.seat}</h4>
                        <h4>Row: {selectedAttendee?.allocation.row}</h4>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild={true}>
                          <Button>Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <div
                    className={`${searchQuery.length > 0 ? "hidden" : "flex"} mt-4 items-center justify-end`}
                  >
                    <Button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                      disabled={page === 0}
                      className="flex items-center justify-center bg-white p-2 hover:bg-gray-300"
                    >
                      <ChevronLeftIcon className="h-6 w-6 text-black" />
                    </Button>
                    <span className="mx-2 text-lg">
                      {page + 1}/{Math.ceil(totalAttendeeCount / 10)}
                    </span>
                    <Button
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={attendees.length < 10}
                      className="flex items-center justify-center bg-white p-2 hover:bg-gray-300"
                    >
                      <ChevronRightIcon className="h-6 w-6 text-black" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
