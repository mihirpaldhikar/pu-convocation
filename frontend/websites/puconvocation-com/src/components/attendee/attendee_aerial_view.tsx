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
import { useState } from "react";
import { useRemoteConfig } from "@hooks/index";
import { GroundMapper } from "@components/attendee/index";
import { Formik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { AttendeeController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { Skeleton } from "@components/ui";
import { SpaceShip } from "@components/graphics";
import { AttendeesInEnclosure } from "@dto/index";

const attendeeController = new AttendeeController();

function sortRowsAndAttendeesInEnclosure(
  enclosure: AttendeesInEnclosure,
): AttendeesInEnclosure {
  return {
    ...enclosure,
    rows: enclosure.rows
      .sort((a, b) => parseInt(a.row) - parseInt(b.row))
      .map((row) => ({
        ...row,
        attendees: row.attendees.sort(
          (a, b) => parseInt(a.seat) - parseInt(b.seat),
        ),
      })),
  };
}

export default function AttendeeAerialView() {
  const { remoteConfig } = useRemoteConfig();
  const [enclosure, setEnclosure] = useState(
    remoteConfig.groundMappings[0].letter,
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: [`enclosure-${enclosure}`],
    queryFn: async () => {
      const result = await attendeeController.attendeesInEnclosure(enclosure);
      if (result.statusCode === StatusCode.SUCCESS) {
        return sortRowsAndAttendeesInEnclosure(result.payload);
      }
      return null;
    },
  });

  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <div className={"grid min-h-[80vh] grid-cols-1 lg:grid-cols-2"}>
        <div className={"flex h-full w-fit items-center justify-center"}>
          <GroundMapper
            className={"h-[30rem] w-[20rem] lg:h-[40rem] lg:w-[40rem]"}
            activeEnclosure={enclosure}
            onEnclosureClicked={(enclosure) => {
              if (enclosure !== null) {
                setEnclosure(enclosure);
              }
            }}
            activeColor={"#dc2626"}
          />
        </div>
        <div className={"h-full flex-1"}>
          {isLoading ? (
            <div className={"flex h-fit w-full flex-col space-y-5"}>
              <div className={"flex items-center space-x-5"}>
                <Skeleton className={"h-14 w-20"} />
                <div className={"flex items-center space-x-3"}>
                  <Skeleton className={"block h-14 w-40"} />
                  <Skeleton className={"block h-14 w-40"} />
                  <Skeleton className={"block h-14 w-40"} />
                </div>
              </div>
              <div className={"flex items-center space-x-5"}>
                <Skeleton className={"h-14 w-20"} />
                <div className={"flex items-center space-x-3"}>
                  <Skeleton className={"block h-14 w-40"} />
                  <Skeleton className={"block h-14 w-40"} />
                  <Skeleton className={"block h-14 w-40"} />
                </div>
              </div>
              <div className={"flex items-center space-x-5"}>
                <Skeleton className={"h-14 w-20"} />
                <div className={"flex items-center space-x-3"}>
                  <Skeleton className={"block h-14 w-40"} />
                  <Skeleton className={"block h-14 w-40"} />
                  <Skeleton className={"block h-14 w-40"} />
                </div>
              </div>
              <div className={"flex items-center space-x-5"}>
                <Skeleton className={"h-14 w-20"} />
                <div className={"flex items-center space-x-3"}>
                  <Skeleton className={"block h-14 w-40"} />
                  <Skeleton className={"block h-14 w-40"} />
                  <Skeleton className={"block h-14 w-40"} />
                </div>
              </div>
            </div>
          ) : isError ||
            data === undefined ||
            data === null ||
            data.rows.length === 0 ? (
            <div className={"h-full w-full"}>
              <div className={"flex flex-col items-center justify-center py-5"}>
                <SpaceShip />
                <p className={"font-semibold"}>
                  {data?.rows.length === 0
                    ? "Enclosure is empty."
                    : "Error loading enclosure details."}
                </p>
              </div>
            </div>
          ) : (
            <div className={"max-h-[80vh] overflow-y-auto"}>
              {data.rows.map(({ row, attendees }) => {
                return (
                  <div key={row} className={"flex items-center space-x-5"}>
                    <h6
                      className={
                        "mt-[-1rem] h-fit w-[3rem] rounded-md border bg-gray-100 p-2 text-center font-bold lg:w-[4rem] lg:p-3"
                      }
                    >
                      {row}
                    </h6>
                    <div
                      className={
                        "flex max-w-[60vw] items-center space-x-5 overflow-x-auto pb-5"
                      }
                    >
                      {attendees.map(({ enrollmentNumber, convocationId }) => {
                        return (
                          <div
                            key={enrollmentNumber}
                            className={
                              "flex flex-col rounded-xl border px-3 py-2 text-center text-xs"
                            }
                          >
                            <h6>
                              {enrollmentNumber.includes("DUPLICATE") ||
                              enrollmentNumber.includes("NO-ENR")
                                ? "REDACTED"
                                : enrollmentNumber}
                            </h6>
                            <h6>{convocationId}</h6>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Formik>
  );
}
