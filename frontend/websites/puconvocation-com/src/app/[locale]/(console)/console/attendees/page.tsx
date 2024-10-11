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
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Skeleton,
} from "@components/ui";
import { AttendeeController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { UsersIcon } from "@heroicons/react/24/solid";
import { SpaceShip } from "@components/graphics";
import { useDebounce, useRemoteConfig } from "@hooks/index";
import { useInView } from "react-intersection-observer";
import { Attendee, AttendeeWithPagination } from "@dto/index";

const attendeeController = new AttendeeController();

export default function AttendeePage(): JSX.Element {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [endReached, setEndReached] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
    null,
  );

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (debouncedSearchQuery.length > 1) {
      setPage(0);
      setEndReached(false);
      attendeeController
        .searchAttendees(debouncedSearchQuery)
        .then((response) => {
          if (
            response.statusCode === StatusCode.SUCCESS &&
            "payload" in response &&
            typeof response.payload === "object"
          ) {
            setAttendees(response.payload);
          }
        });
      return;
    }
    if (endReached) return;
    let cancelToken = null;
    if (inView) {
      cancelToken = setTimeout(() => {
        attendeeController.getAllAttendees(page, 10).then((response) => {
          if (
            response.statusCode === StatusCode.SUCCESS &&
            "payload" in response &&
            typeof response.payload === "object"
          ) {
            if (page == 0) {
              setAttendees([...response.payload.attendees]);
            } else {
              setAttendees((prevAttendees) => [
                ...prevAttendees,
                ...(response.payload as AttendeeWithPagination).attendees,
              ]);
            }
            setPage(response.payload.next);
            setEndReached(response.payload.next === 2147483647);
            setLoading(false);
          }
        });
      }, 500);
    }
    return () => {
      if (cancelToken !== null) {
        clearTimeout(cancelToken);
      }
    };
  }, [inView, page, debouncedSearchQuery, endReached]);

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

          <Card className="w-full flex-grow p-4 shadow-none">
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
              {!loading && attendees.length === 0 ? (
                <div
                  className={"flex flex-col items-center justify-center py-5"}
                >
                  <SpaceShip />
                  <p className={"font-semibold"}>Attendees not uploaded.</p>
                </div>
              ) : (
                <div className="flex-grow">
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
                    ref={ref}
                    className={`${searchQuery.length === 0 && !endReached ? "flex" : "hidden"} flex-col space-y-3 py-3`}
                  >
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
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
