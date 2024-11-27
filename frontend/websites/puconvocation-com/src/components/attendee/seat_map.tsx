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

import { JSX, useState } from "react";
import { Enclosure } from "@dto/index";
import Seat from "./seat";
import { useInView } from "react-intersection-observer";
import {
  isElementInViewport,
  smoothScrollLeftWithinDiv,
} from "@lib/attendee_utils";

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
  const [activeRowScrolled, setActiveRowScrolled] = useState<boolean>(false);

  const { ref } = useInView({
    threshold: 1,
    delay: 1000,
    onChange: (inView) => {
      if (!activeRowScrolled && inView) {
        setActiveRowScrolled(true);
        const rowContainer = document.getElementById(
          activeArrangement.row,
        ) as HTMLElement;
        const activeSeat = document.getElementById(
          `active-${activeArrangement.seat}`,
        ) as HTMLElement;
        if (!isElementInViewport(activeSeat, rowContainer)) {
          const x = activeSeat.getBoundingClientRect().x;
          smoothScrollLeftWithinDiv(rowContainer, x, 1000);
        }
      }
    },
  });

  return (
    <div className={"flex flex-col space-y-5"}>
      {enclosure.rows.map((row) => {
        return (
          <div key={row.letter} className={"flex justify-center"}>
            <h5
              className={`h-fit w-[2rem] rounded-md px-3 py-2 text-center text-xs font-bold ${
                row.letter === activeArrangement.row
                  ? "border-red-700 bg-red-500 text-white"
                  : "border border-gray-300 text-gray-500"
              }`}
            >
              {row.letter}
            </h5>
            <div
              id={row.letter}
              ref={row.letter === activeArrangement.row ? ref : undefined}
              className={
                "mx-3 mt-0.5 flex h-12 max-w-[350px] justify-evenly space-x-4 overflow-x-auto px-2 md:max-w-[470px]"
              }
            >
              {Array.from(
                { length: row.end - row.start + 1 },
                (_v, k) => k + row.start,
              ).map((seat) => {
                return (
                  <Seat
                    key={seat}
                    number={seat}
                    activeRow={row.letter === activeArrangement.row}
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
    </div>
  );
}
