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
import { Enclosure } from "@dto/index";
import Seat from "@components/seat";

interface SeatMapProps {
  enclosure: Enclosure;
  activeArrangement: {
    row: string;
    seat: string;
  };
}

export default function SeatMap({
  enclosure,
  activeArrangement,
}: SeatMapProps): JSX.Element {
  return (
    <Fragment>
      {enclosure.rows.map((row) => {
        return (
          <div key={row.letter} className={"flex items-center"}>
            <h5
              className={`h-fit w-[25px] rounded-md px-2 py-1 text-center text-xs font-medium ${
                row.letter === activeArrangement.row
                  ? "border-red-700 bg-red-500 text-white"
                  : "border-gray-300 bg-gray-200 text-gray-500"
              }`}
            >
              {row.letter}
            </h5>
            <div
              className={
                "no-scrollbar mx-3 flex h-7 max-w-[470px] justify-evenly space-x-4 overflow-x-auto px-2"
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
                        row.letter === activeArrangement.row &&
                        seat === parseInt(activeArrangement.seat)
                      }
                    />
                  );
                })}
            </div>
          </div>
        );
      })}
      <h3 className={"text-xs font-medium text-gray-500"}>
        If your seat is not visible in the Seat Map, Please scroll the
        Highlighted row.
      </h3>
    </Fragment>
  );
}
