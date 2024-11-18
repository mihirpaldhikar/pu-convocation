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

import { JSX, useRef, useState } from "react";
import { useRemoteConfig } from "@hooks/index";
import { Input } from "@components/ui";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@components/ui";
import { Enclosure } from "@dto/index";
import { GroundMapper } from "@components/attendee";

function totalEnclosureSeats(enclosure: Enclosure): number {
  let seats = 0;
  for (const row of enclosure.rows) {
    const diff = row.end - row.start;
    seats += diff === 0 ? 0 : diff - row.reserved.length + 1;
  }
  return seats;
}

export default function GroundSettingsPage(): JSX.Element {
  const { remoteConfig, dispatch } = useRemoteConfig();
  const [selectedEnclosure, setSelectedEnclosure] = useState<string | null>(
    null,
  );
  const [currentEnclosureIndex, setCurrentEnclosureIndex] = useState<
    number | null
  >(null);

  const seatsInEnclosure: Array<number> = remoteConfig.groundMappings.map(
    (enclosure) => {
      return totalEnclosureSeats(enclosure);
    },
  );

  let totalSeats = 0;
  seatsInEnclosure.forEach((enclosure) => {
    totalSeats += enclosure;
  });

  const handleEnclosureClick = (id: string | null) => {
    const index = remoteConfig.groundMappings.findIndex(
      (enclosure) => enclosure.letter === id,
    );
    setSelectedEnclosure(id);
    setCurrentEnclosureIndex(index >= 0 ? index : null);
  };

  const handleRowChange = (
    enclosureIndex: number,
    rowIndex: number,
    field: "start" | "end",
    value: number,
  ) => {
    const mutatedEnclosure = { ...remoteConfig.groundMappings[enclosureIndex] };
    mutatedEnclosure.rows[rowIndex][field] = value;
    dispatch({
      type: "SET_ENCLOSURE",
      payload: {
        index: enclosureIndex,
        enclosure: mutatedEnclosure,
      },
    });
  };

  return (
    <div className="min-h-screen w-full rounded-xl border bg-white px-4 py-5">
      <section className="space-y-5">
        {/* Header with Total Seats */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Ground Settings</h3>
            <h6 className="mt-1 text-sm font-light">
              Manage the ground enclosures and seating configuration.
            </h6>
          </div>
          <h4 className="mt-1 text-xl font-semibold">
            Total Seats: {totalSeats}
          </h4>
        </div>

        <div className="space-y-5">
          <Card className="mx-auto max-w-6xl p-4">
            <CardContent>
              <div className="flex flex-col space-y-5 lg:flex-row lg:space-x-8 lg:space-y-0">
                {/* Left col for SVG */}
                <div className="w-full lg:w-1/2">
                  <GroundMapper
                    activeEnclosure={selectedEnclosure || ""}
                    activeColor="black"
                    onEnclosureClicked={handleEnclosureClick}
                    className="h-[500px] w-full"
                  />
                </div>

                {/* Right col for inputs */}
                <div className="w-full space-y-5 lg:w-1/2">
                  {currentEnclosureIndex !== null &&
                    remoteConfig.groundMappings[currentEnclosureIndex].rows.map(
                      (row, rowIndex) => (
                        <div
                          key={`${row.letter}-${rowIndex}`}
                          className="space-y-3 rounded-lg border p-4"
                        >
                          <h4 className="text-lg font-bold">
                            Row: {row.letter}
                          </h4>
                          <div className="flex items-center justify-center space-x-4">
                            <Input
                              type="number"
                              value={row.start}
                              onChange={(e) =>
                                handleRowChange(
                                  currentEnclosureIndex,
                                  rowIndex,
                                  "start",
                                  parseInt(e.target.value, 10),
                                )
                              }
                              className="w-[120px] px-3 py-2 text-center text-base"
                              placeholder="Start"
                            />
                            <span>to</span>
                            <Input
                              type="number"
                              value={row.end}
                              onChange={(e) =>
                                handleRowChange(
                                  currentEnclosureIndex,
                                  rowIndex,
                                  "end",
                                  parseInt(e.target.value, 10),
                                )
                              }
                              className="w-[120px] px-3 py-2 text-center text-base"
                              placeholder="End"
                            />
                          </div>
                        </div>
                      ),
                    )}
                  {/* Add Row Btn */}
                  {currentEnclosureIndex !== null && (
                    <div
                      className="mt-4 cursor-pointer rounded-lg border px-5 py-3 text-center hover:bg-gray-100"
                      onClick={() => {
                        remoteConfig.groundMappings[
                          currentEnclosureIndex
                        ].rows.push({
                          letter: "",
                          start: 0,
                          end: 0,
                          reserved: [],
                        });
                        dispatch({
                          type: "SET_ENCLOSURE",
                          payload: {
                            index: currentEnclosureIndex,
                            enclosure:
                              remoteConfig.groundMappings[
                                currentEnclosureIndex
                              ],
                          },
                        });
                      }}
                    >
                      <h6 className="text-sm font-medium text-gray-700">
                        + Add Row
                      </h6>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
