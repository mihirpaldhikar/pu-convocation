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
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ProgressBar,
} from "@components/ui";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { AttendeeController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { Attendee } from "@dto/index";
import { useDebounce } from "@hooks/index";
import { SpaceShip } from "@components/graphics";

const attendeeController = new AttendeeController();

interface AttendeeTableProps {
  totalAttendeeCount?: number;
  initialAttendees: Attendee[];
}

export default function AttendeeTable({
  totalAttendeeCount,
  initialAttendees,
}: Readonly<AttendeeTableProps>): JSX.Element {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
    null,
  );
  const [isClosing, setIsClosing] = useState(false);

  const {
    data: attendees = [],
    isLoading: isAttendeeLoading,
    isError: attendeeError,
  } = useQuery({
    queryKey: ["attendeesList", debouncedSearchQuery, page],
    refetchOnWindowFocus: false,
    initialData: () => {
      return initialAttendees;
    },
    queryFn: async () => {
      if (debouncedSearchQuery.length > 0) {
        const response =
          await attendeeController.searchAttendees(debouncedSearchQuery);
        if (response.statusCode === StatusCode.SUCCESS) {
          return response.payload;
        }
        return [];
      } else {
        const response = await attendeeController.getAllAttendees(page, 10);
        if (response.statusCode === StatusCode.SUCCESS) {
          return response.payload.attendees;
        }
        return [];
      }
    },
  });

  const handleDialogClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedAttendee(null);
      setIsClosing(false);
    }, 300);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="min-w-1/3 max-w-2/3 flex items-center pb-5">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search Attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
        </div>
      </div>

      {isAttendeeLoading ? (
        <div className="flex h-full items-center justify-center">
          <ProgressBar type="circular" />
        </div>
      ) : attendeeError ? (
        <p className="text-red-600">Error loading attendees</p>
      ) : attendees.length === 0 ? (
        <div className={"flex flex-col items-center justify-center py-5"}>
          <SpaceShip />
          <p className={"font-semibold"}>Attendees not uploaded.</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto">
          <Dialog
            open={!!selectedAttendee && !isClosing}
            onOpenChange={handleDialogClose}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Attendee Details</DialogTitle>
              </DialogHeader>
              {selectedAttendee && (
                <div>
                  <h4>
                    Enrollment Number: {selectedAttendee.enrollmentNumber}
                  </h4>
                  <h4>Name: {selectedAttendee.studentName}</h4>
                  <h4>Department: {selectedAttendee.department}</h4>
                  <h4>Institute: {selectedAttendee.institute}</h4>
                  <h4>
                    Enclosure:{" "}
                    {selectedAttendee.allocation.enclosure === "NULL"
                      ? "Not Assigned"
                      : selectedAttendee.allocation.enclosure}
                  </h4>
                  <h4>
                    Row:{" "}
                    {selectedAttendee.allocation.row === "NULL"
                      ? "Not Assigned"
                      : selectedAttendee.allocation.row}
                  </h4>
                  <h4>
                    Seat:{" "}
                    {selectedAttendee.allocation.seat === "NULL"
                      ? "Not Assigned"
                      : selectedAttendee.allocation.seat}
                  </h4>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>

            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Enrollment Number
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="hidden px-4 py-2 text-left font-semibold text-gray-700 lg:table-cell">
                    Department
                  </th>
                  <th className="hidden px-4 py-2 text-left font-semibold text-gray-700 lg:table-cell">
                    Institute
                  </th>
                  <th className="hidden px-4 py-2 text-left font-semibold text-gray-700 lg:table-cell">
                    Enclosure
                  </th>
                  <th className="hidden px-4 py-2 text-left font-semibold text-gray-700 lg:table-cell">
                    Row
                  </th>
                  <th className="hidden px-4 py-2 text-left font-semibold text-gray-700 lg:table-cell">
                    Seat
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a) => (
                  <tr
                    key={a.convocationId}
                    className="cursor-pointer rounded-xl border-b transition-colors duration-200 hover:bg-gray-100"
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setSelectedAttendee(a);
                      }
                    }}
                  >
                    <td className="px-4 py-2">{a.enrollmentNumber}</td>
                    <td className="px-4 py-2">{a.studentName}</td>
                    <td className="hidden px-4 py-2 lg:table-cell">
                      {a.department}
                    </td>
                    <td className="hidden px-4 py-2 lg:table-cell">
                      {a.institute}
                    </td>
                    <td className="hidden px-4 py-2 lg:table-cell">
                      {a.allocation.enclosure === "NULL"
                        ? "Not Assigned"
                        : a.allocation.enclosure}
                    </td>
                    <td className="hidden px-4 py-2 lg:table-cell">
                      {a.allocation.row === "NULL"
                        ? "Not Assigned"
                        : a.allocation.row}
                    </td>
                    <td className="hidden px-4 py-2 lg:table-cell">
                      {a.allocation.seat === "NULL"
                        ? "Not Assigned"
                        : a.allocation.seat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Dialog>
          {totalAttendeeCount !== undefined ? (
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
                onClick={() =>
                  setPage((prev) => (attendees.length ? prev + 1 : prev))
                }
                disabled={attendees.length < 10}
                className="flex items-center justify-center bg-white p-2 hover:bg-gray-300"
              >
                <ChevronRightIcon className="h-6 w-6 text-black" />
              </Button>
            </div>
          ) : (
            <Fragment />
          )}
        </div>
      )}
    </div>
  );
}
