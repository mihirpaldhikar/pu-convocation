/*
 * Copyright (c) PU Convocation Management System Authors
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

import { Fragment, JSX } from "react";
import { AttendeeService } from "@services/index";
import { StatusCode } from "@enums/StatusCode";
import { Seat, SpaceShip, Ticket, VenueMap } from "@components/index";
import Link from "next/link";
import { MapIcon, MapPinIcon } from "@heroicons/react/24/outline";

const attendeeService: AttendeeService = new AttendeeService();

export default async function AttendeePage({
  params,
}: {
  params: { identifier: string };
}): Promise<JSX.Element> {
  const response = await attendeeService.getAttendee(params.identifier);

  if (response.statusCode === StatusCode.ATTENDEE_NOT_FOUND) {
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
            {params.identifier.length > 10 ? "CRR Number" : "Enrollment Number"}{" "}
            to find your seat.
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

  if ("payload" in response && typeof response.payload === "object") {
    const payload = response.payload;

    return (
      <div
        className={
          "grid min-h-dvh grid-cols-1 place-content-center md:grid-cols-2"
        }
      >
        <div className={"flex justify-center"}>
          <div className={"flex flex-col justify-center"}>
            <h3
              className={"flex items-center space-x-3 py-5 text-xl font-bold"}
            >
              <span className={"mr-3 block text-red-500"}>
                <MapIcon className={"w-7"} />
              </span>
              Venue Map
            </h3>
            <VenueMap activeEnclosure={payload.attendee.enclosure} />
          </div>
        </div>
        <div className={"space-y-7"}>
          <Ticket attendee={payload.attendee} />
          <div className={"flex flex-col"}>
            <div className={"flex flex-col py-5"}>
              <h3 className={"flex items-center space-x-3  text-xl font-bold"}>
                <span className={"mr-3 block text-red-500"}>
                  <MapPinIcon className={"w-7"} />
                </span>
                Seat Map
              </h3>
              <h5 className={"pl-10 text-xs"}>
                Enter from{" "}
                <span className={"text-red-500"}>
                  {payload.attendee.enterFrom.toLowerCase()}
                </span>
              </h5>
            </div>
            {payload.enclosureMetadata.rows.map((row) => {
              return (
                <div
                  key={row.letter}
                  className={"flex h-10 items-center space-x-5 text-center"}
                >
                  <h5
                    className={`w-[30px] items-center rounded-md  px-2 py-1 text-xs  ${
                      row.letter === payload.attendee.row
                        ? "border-red-700 bg-red-500 text-white"
                        : "border-gray-300 bg-gray-200 text-gray-500"
                    }`}
                  >
                    {row.letter}
                  </h5>
                  <div
                    className={
                      "flex h-10 max-w-[450px] justify-evenly space-x-3 overflow-x-auto px-5"
                    }
                  >
                    {Array.from(
                      { length: row.end - row.start + 1 },
                      (v, k) => k + row.start,
                    )
                      .reverse()
                      .map((seat) => {
                        return (
                          <Seat
                            key={seat}
                            number={seat}
                            active={
                              row.letter === payload.attendee.row &&
                              seat === parseInt(payload.attendee.seat)
                            }
                          />
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return <Fragment />;
}
