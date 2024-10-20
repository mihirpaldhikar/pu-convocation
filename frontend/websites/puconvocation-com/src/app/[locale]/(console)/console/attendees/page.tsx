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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui";
import { UsersIcon } from "@heroicons/react/24/solid";
import { AttendeeControlPlane, AttendeeTable } from "@components/attendee";
import { AttendeeController } from "@controllers/index";
import { cookies } from "next/headers";
import { StatusCode } from "@enums/StatusCode";

export default async function AttendeePage(): Promise<JSX.Element> {
  const attendeeController = new AttendeeController({
    cookies: cookies().toString(),
  });

  const response = await attendeeController.getTotalAttendeesCount();

  const totalAttendeeCount =
    response.statusCode === StatusCode.SUCCESS &&
    "payload" in response &&
    typeof response.payload === "object"
      ? response.payload.count
      : 0;

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
          <AttendeeControlPlane totalAttendeeCount={totalAttendeeCount} />
          <Card>
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
              <CardDescription>
                View detailed information of the attendees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendeeTable totalAttendeeCount={totalAttendeeCount} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
