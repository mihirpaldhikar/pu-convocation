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
import { JSX, useRef } from "react";
import { useRemoteConfig } from "@hooks/index";
import { Input } from "@components/ui";
import { Enclosure } from "@dto/index";

function totalEnclosureSeats(enclosure: Enclosure): number {
  let seats = 0;
  for (let row of enclosure.rows) {
    const diff = row.end - row.start;
    seats += diff === 0 ? 0 : diff - row.reserved.length + 1;
  }
  return seats;
}

export default function GroundSettingsPage(): JSX.Element {
  const { remoteConfig, dispatch } = useRemoteConfig();

  const focused = useRef<string>("");

  const seatsInEnclosure: Array<number> = remoteConfig.groundMappings.map(
    (enclosure) => {
      return totalEnclosureSeats(enclosure);
    },
  );

  let totalSeats = 0;

  seatsInEnclosure.forEach((enclosure) => {
    totalSeats += enclosure;
  });

  return (
    <div className={"min-h-screen w-full rounded-xl border bg-white px-4 py-5"}>
      <div className={"flex items-center justify-end p-5"}>
        <h4>Total Seats: {totalSeats}</h4>
      </div>
      <div className={"space-y-5"}>
        {remoteConfig.groundMappings.map((enclosure, index) => {
          return (
            <div
              key={enclosure.letter}
              className={"space-y-5 rounded-lg border px-5 py-3"}
            >
              <div>
                <div
                  className={"flex items-center space-x-3 text-lg font-bold"}
                >
                  <h4>Enclosure: </h4>
                  <Input
                    autoFocus={focused.current === `enclosure-input-${index}`}
                    value={enclosure.letter}
                    className={
                      "w-fit border-none bg-gray-100 text-center shadow-none"
                    }
                    onClick={() => {
                      focused.current = `enclosure-input-${index}`;
                    }}
                    onChange={(event) => {
                      enclosure.letter = event.target.value;
                      dispatch({
                        type: "SET_ENCLOSURE",
                        payload: {
                          index: index,
                          enclosure: enclosure,
                        },
                      });
                    }}
                  />
                </div>
                <p className={"text-xs font-medium text-gray-400"}>
                  Seats: {seatsInEnclosure[index]}
                </p>
              </div>
              <div className={"grid grid-cols-4 gap-4"}>
                {enclosure.rows.map((enclosureRow, rIndex) => {
                  return (
                    <div
                      key={`${enclosure.letter}-${enclosureRow.letter}`}
                      className={"rounded-lg border px-5 py-3"}
                    >
                      <div
                        className={"flex items-center space-x-3 font-semibold"}
                      >
                        <Input
                          autoFocus={
                            focused.current ===
                            `input-${enclosure.letter}-row-${index}`
                          }
                          value={enclosureRow.letter}
                          onClick={() => {
                            focused.current = `input-${enclosure.letter}-row-${index}`;
                          }}
                          onChange={(event) => {
                            enclosure.rows[rIndex].letter = event.target.value;
                            dispatch({
                              type: "SET_ENCLOSURE",
                              payload: {
                                index: index,
                                enclosure: enclosure,
                              },
                            });
                          }}
                          className={
                            "w-fit border-none bg-red-100 text-center shadow-none"
                          }
                        />
                      </div>
                    </div>
                  );
                })}
                <div
                  className={"cursor-pointer rounded-lg border px-5 py-3"}
                  onClick={() => {
                    enclosure.rows.push({
                      letter: "",
                      start: 0,
                      end: 0,
                      reserved: [],
                    });
                    dispatch({
                      type: "SET_ENCLOSURE",
                      payload: {
                        index: index,
                        enclosure: enclosure,
                      },
                    });
                  }}
                >
                  <h6>Add Row</h6>
                </div>
              </div>
            </div>
          );
        })}
        <div
          className={"space-y-5 rounded-lg border px-5 py-3"}
          onClick={() => {
            remoteConfig?.groundMappings.push({
              letter: "",
              entryDirection: "NONE",
              rows: [],
            });
            dispatch({
              type: "SET_CONFIG",
              payload: {
                config: remoteConfig,
              },
            });
          }}
        >
          Add new Enclosure
        </div>
      </div>
    </div>
  );
}
