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
import { AttendeeController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { GroundMap, SeatMap, Ticket } from "@components/attendee";
import { SpaceShip } from "@components/graphics";
import { MapPinIcon, TicketIcon } from "@heroicons/react/24/solid";
import { Link } from "@i18n/routing";

const attendeeService: AttendeeController = new AttendeeController();

interface AttendeePageProps {
  params: Promise<{ identifier: string }>;
}

export default async function AttendeePage({
  params,
}: Readonly<AttendeePageProps>): Promise<JSX.Element> {
  const { identifier } = await params;

  const response = await attendeeService.getAttendee(identifier.toUpperCase());

  if (response.statusCode === StatusCode.SUCCESS) {
    const { attendee, enclosureMetadata } = response.payload;

    return (
      <section
        className={"grid grid-cols-1 gap-10 px-3 pt-5 lg:grid-cols-2 lg:pt-10"}
      >
        <div className={"order-2 flex-1 lg:order-1 lg:min-h-screen"}>
          <div
            className={
              "flex h-full flex-col items-center justify-center space-y-6"
            }
          >
            <GroundMap
              className={"h-[500px] w-[350px] lg:h-[400px] lg:w-[400px]"}
              activeColor={"#dc2626"}
              activeEnclosure={attendee.allocation.enclosure}
            />
            <div className={"flex flex-col space-y-5"}>
              <div className={"flex flex-col space-y-2"}>
                <div className={"flex w-full items-center space-x-2"}>
                  <MapPinIcon className={"w-7 text-primary"} />
                  <h2 className={"text-xl font-bold"}>Seat Map</h2>
                </div>
                <h6
                  className={"pl-9 text-xs font-medium"}
                  hidden={enclosureMetadata.entryDirection === "NONE"}
                >
                  Enter from{" "}
                  <span className={"font-bold text-primary"}>
                    {enclosureMetadata.entryDirection}
                  </span>
                </h6>
              </div>
              <SeatMap
                enclosure={enclosureMetadata}
                activeArrangement={{
                  row: attendee.allocation.row,
                  seat: attendee.allocation.seat,
                }}
              />
            </div>
            <div className={"flex flex-col space-y-5 pt-0 md:pt-10"}></div>
          </div>
        </div>
        <div
          className={
            "order-1 flex flex-1 flex-col items-center pt-7 lg:order-2 lg:min-h-screen lg:pt-10"
          }
        >
          <div className={"flex w-full flex-col space-y-5"}>
            <div className={"flex w-full items-center space-x-2"}>
              <TicketIcon className={"size-7 text-primary"} />
              <h2 className={"text-xl font-bold"}>Pass</h2>
            </div>
            <Ticket attendee={attendee} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex h-fit items-center">
      <div className="m-auto space-y-3 text-center">
        <div className={"flex w-full items-center justify-center"}>
          <SpaceShip />
        </div>
        <h3 className={"text-2xl font-bold text-gray-800"}>
          Attendee Not Found!
        </h3>
        <p className={"pb-4 text-gray-600"}>
          Please use{" "}
          {identifier.length > 10 ? "CRR Number" : "Enrollment Number"} to find
          your seat.
        </p>
        <Link
          href={"/"}
          className={"rounded-full bg-gray-900 px-5 py-2 text-white"}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
