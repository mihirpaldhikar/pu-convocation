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
import { SpaceShip } from "@components/graphics";
import { Link } from "@i18n/routing";
import { GroundMap, SeatMap, Ticket } from "@components/attendee";
import { AcademicCapIcon, MapPinIcon } from "@heroicons/react/24/solid";

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
      <section className={"pb-10"}>
        <div className={"hidden min-h-[85dvh] grid-cols-2 lg:grid"}>
          <div className={"flex items-center"}>
            <GroundMap
              className={"max-h-[85dvh]"}
              activeEnclosure={attendee.allocation.enclosure}
              activeColor={"#dc2626"}
            />
          </div>
          <div className={"space-y-10"}>
            <div>
              <div className={"flex items-center space-x-2 py-5"}>
                <AcademicCapIcon className={"size-8 text-red-600"} />
                <h4 className={"text-xl font-bold"}>Your Info</h4>
              </div>
              <Ticket attendee={attendee} />
            </div>
            <div>
              <div className={"flex items-center space-x-2 pb-10 pt-5"}>
                <MapPinIcon className={"size-8 text-red-600"} />
                <div className={"space-y-3"}>
                  <h4 className={"text-xl font-bold"}>Seat Map</h4>
                  <h6 className={"text-xs text-gray-500"}>
                    Enter from{" "}
                    <span
                      className={
                        "rounded-xl bg-red-100 px-3 py-1 font-medium text-red-600"
                      }
                    >
                      {enclosureMetadata.entryDirection}
                    </span>
                  </h6>
                </div>
              </div>
              <SeatMap
                enclosure={enclosureMetadata}
                activeArrangement={attendee.allocation}
              />
            </div>
          </div>
        </div>
        <div className={"grid min-h-dvh grid-cols-1 px-3 lg:hidden"}>
          <div>
            <div>
              <div className={"flex items-center space-x-2 py-5"}>
                <AcademicCapIcon className={"size-8 text-red-600"} />
                <h4 className={"text-xl font-bold"}>Your Info</h4>
              </div>
              <Ticket attendee={attendee} />
            </div>
          </div>
          <div>
            <div>
              <GroundMap
                className={"max-h-[60dvh] max-w-[90dvw]"}
                activeEnclosure={attendee.allocation.enclosure}
                activeColor={"#dc2626"}
              />
            </div>
            <div>
              <div className={"flex items-center space-x-2 pb-10 pt-5"}>
                <MapPinIcon className={"size-8 text-red-600"} />
                <div className={"space-y-3"}>
                  <h4 className={"text-xl font-bold"}>Seat Map</h4>
                  <h6 className={"text-xs text-gray-500"}>
                    Enter from{" "}
                    <span
                      className={
                        "rounded-xl bg-red-100 px-3 py-1 font-medium text-red-600"
                      }
                    >
                      {enclosureMetadata.entryDirection}
                    </span>
                  </h6>
                </div>
              </div>
              <SeatMap
                enclosure={enclosureMetadata}
                activeArrangement={attendee.allocation}
              />
            </div>
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
