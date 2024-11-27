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

import { JSX } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { AttendeeControlPlane, AttendeeTable } from "@components/attendee";
import { AttendeeController } from "@controllers/index";
import { cookies } from "next/headers";
import { StatusCode } from "@enums/StatusCode";

export default async function AttendeePage(): Promise<JSX.Element> {
  const agentCookies = await cookies();

  const attendeeController = new AttendeeController({
    cookies: agentCookies.toString(),
  });

  const totalAttendeeResponse =
    await attendeeController.getTotalAttendeesCount();

  const totalAttendeeCount =
    totalAttendeeResponse.statusCode === StatusCode.SUCCESS
      ? totalAttendeeResponse.payload.count
      : 0;

  const attendeesListResponse = await attendeeController.getAllAttendees(0, 10);

  const attendees =
    attendeesListResponse.statusCode === StatusCode.SUCCESS
      ? attendeesListResponse.payload.attendees
      : [];

  return (
    <div className="flex min-h-screen flex-col space-y-10 p-4 md:p-10">
      <div className="space-y-3">
        <h1 className="flex items-center text-2xl font-bold">
          <AcademicCapIcon className="mr-2 h-6 w-6 text-red-600" /> Attendees
        </h1>
        <p className="text-xs text-gray-600">
          View and manage the complete list of attendees for the convocation.
        </p>
      </div>

      <div className="flex min-h-screen flex-col items-center">
        <div className="mb-2 grid w-full grid-cols-1 gap-6 lg:grid-cols-1">
          <AttendeeControlPlane totalAttendeeCount={totalAttendeeCount} />
          <Card>
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
              <CardDescription>
                View detailed information of the attendees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendeeTable
                initialAttendees={attendees}
                totalAttendeeCount={totalAttendeeCount}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
