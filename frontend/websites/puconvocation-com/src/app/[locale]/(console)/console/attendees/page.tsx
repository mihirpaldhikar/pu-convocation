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
import { Button, Input } from "@components/ui";
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
import { ProgressBar } from "@components/index";
import { useDebounce, useRemoteConfig } from "@hooks/index";

const attendeeController = new AttendeeController();

export default function AttendeePage(): JSX.Element {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    state: {
      config: remoteConfig,
      loading: isRemoteConfigLoading,
      remoteConfigController,
    },
    dispatch: dispatchRemoteConfig,
  } = useRemoteConfig();

  useQuery({
    queryKey: ["remoteConfig"],
    queryFn: async () => {
      if (remoteConfig === undefined || remoteConfig === null) {
        const response = await remoteConfigController.getRemoteConfig();
        if (
          response.statusCode === StatusCode.SUCCESS &&
          "payload" in response &&
          typeof response.payload === "object"
        ) {
          dispatchRemoteConfig({
            type: "SET_CONFIG",
            payload: { config: response.payload },
          });
          return response.payload;
        }
      }
      return remoteConfig;
    },
  });

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
    data: attendees,
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
      } else {
        const response = await attendeeController.getAllAttendees(page, 10);
        if (
          response.statusCode === StatusCode.SUCCESS &&
          "payload" in response &&
          typeof response.payload === "object"
        ) {
          return response.payload.attendees;
        }
      }
      return [];
    },
  });

  const currentAttendees = attendees || [];
  const totalPages = Math.ceil(totalAttendeeCount / 10);

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
                disabled={
                  isRemoteConfigLoading || remoteConfig?.attendeesLocked
                }
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
              ) : currentAttendees.length > 0 ? (
                <div className="flex-grow overflow-y-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          Convocation Id
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          Enclosure
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          Row
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          Seat
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAttendees.map((a) => (
                        <tr
                          key={a.convocationId}
                          className="cursor-pointer border-b text-center transition-colors duration-200 hover:bg-gray-100"
                        >
                          <td className="px-4 py-2">{a.convocationId}</td>
                          <td className="px-4 py-2">{a.studentName}</td>
                          <td className="px-4 py-2">
                            {a.allocation.enclosure}
                          </td>
                          <td className="px-4 py-2">{a.allocation.row}</td>
                          <td className="px-4 py-2">{a.allocation.seat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

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
                      {page + 1}/{totalPages}
                    </span>
                    <Button
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={currentAttendees.length < 10}
                      className="flex items-center justify-center bg-white p-2 hover:bg-gray-300"
                    >
                      <ChevronRightIcon className="h-6 w-6 text-black" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p>No attendees found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
