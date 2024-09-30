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
import { Button } from "@components/ui";
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

const attendeeController = new AttendeeController();

export default function AttendeePage(): JSX.Element {
  const [showAttendees, setShowAttendees] = useState(false);
  const [page, setPage] = useState(0);
  const [attendeeCount, setAttendeeCount] = useState(0);

  const {
    data: attendees,
    isLoading: isAttendeeLoading,
    isError: attendeeError,
  } = useQuery({
    queryKey: ["homeAttendeesList", page],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await attendeeController.getAllAttendees(page, 10);
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        setAttendeeCount(response.payload.totalCount);
        return response.payload.attendees;
      }
      return [];
    },
  });

  const currentAttendees = attendees || [];

  return (
    <div className={"flex min-h-screen flex-col space-y-10 p-4 md:p-10"}>
      <div className={"space-y-3"}>
        <h1 className={"flex items-center text-2xl font-bold"}>
          <UsersIcon className="mr-2 h-6 w-6 text-red-600" /> Attendees
        </h1>
        <p className={"text-xs text-gray-600"}>
          View and manage the complete list of attendees for the convocation.
        </p>
      </div>

      <div className={"flex min-h-screen flex-col items-center p-1"}>
        <div className="mb-2 grid w-full grid-cols-1 gap-6 lg:grid-cols-1">
          {/* Total Attendees */}
          <Card className="h-fit w-full border border-gray-300 p-4">
            <CardHeader>
              <CardTitle>Total Attendees</CardTitle>
              <CardDescription>
                Showing total number of attendees for the convocation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-lg">{attendeeCount}</span>
              <Button
                onClick={() => setShowAttendees(!showAttendees)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {showAttendees ? "Unlock" : "Lock"}
              </Button>
            </CardContent>
          </Card>

          {/* Attendee List */}
          <Card className="h-fit w-full border border-gray-300 p-4 shadow-none">
            <CardHeader>
              <CardTitle>Attendee List</CardTitle>
              <CardDescription>
                Showing detailed list of registered attendees with their
                respective information.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-96 flex-col overflow-y-auto">
              {isAttendeeLoading ? (
                <div className="flex h-full items-center justify-center">
                  <ProgressBar type="circular" />
                </div>
              ) : attendeeError ? (
                <p className="text-red-600">Error loading attendees</p>
              ) : currentAttendees.length > 0 ? (
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
                        className="border-b text-center transition-colors duration-200 hover:bg-gray-100"
                      >
                        <td className="px-4 py-2">{a.convocationId}</td>
                        <td className="px-4 py-2">{a.studentName}</td>
                        <td className="px-4 py-2">{a.allocation.enclosure}</td>
                        <td className="px-4 py-2">{a.allocation.row}</td>
                        <td className="px-4 py-2">{a.allocation.seat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No attendees found</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex w-full justify-end">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-300"
            >
              <ChevronLeftIcon className="h-8 w-8 text-black" />
            </Button>
            <span className="text-lg">Page {page + 1}</span>
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={currentAttendees.length < 10}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-300"
            >
              <ChevronRightIcon className="h-8 w-8 text-black" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
