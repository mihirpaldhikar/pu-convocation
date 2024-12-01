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

import { JSX, ReactNode, useState } from "react";
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
  const rows: ReactNode[] = [];
  const seats: ReactNode[][] = [];
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
          smoothScrollLeftWithinDiv(
            rowContainer,
            (rowContainer.scrollWidth - x) * 4,
            1000,
          );
        }
      }
    },
  });

  const activeRowIndex = enclosure.rows.indexOf(
    enclosure.rows.filter((r) => r.letter === activeArrangement.row)[0],
  );

  const rowStartIndex = activeRowIndex - 3 <= 0 ? 0 : activeRowIndex - 3;
  const rowEndIndex =
    activeRowIndex + 3 >= enclosure.rows.length
      ? enclosure.rows.length
      : activeRowIndex + 3;

  let tempHolder: ReactNode[] = [];
  for (let i = rowStartIndex; i < rowEndIndex; i++) {
    const reserved = enclosure.rows[i].reserved
      .split(",")
      .filter((r) => !isNaN(parseInt(r)));
    for (let j = 0; j <= enclosure.rows[i].end; j++) {
      if (j >= enclosure.rows[i].start) {
        tempHolder.push(
          <Seat
            key={j}
            number={j}
            reserved={reserved.includes(j.toString())}
            activeRow={enclosure.rows[i].letter === activeArrangement.row}
            active={
              enclosure.rows[i].letter === activeArrangement.row &&
              j === parseInt(activeArrangement.seat)
            }
          />,
        );
      }
    }
    seats[i] = [...tempHolder];
    tempHolder = [];
  }

  for (let i = rowStartIndex; i < rowEndIndex; i++) {
    rows.push(
      <div key={enclosure.rows[i].letter} className={"flex"}>
        <h5
          className={`h-fit w-fit min-w-[2rem] rounded-md px-3 py-2 text-center text-xs font-bold ${
            enclosure.rows[i].letter === activeArrangement.row
              ? "border-red-700 bg-red-500 text-white"
              : "border border-gray-300 text-gray-500"
          }`}
        >
          {enclosure.rows[i].letter}
        </h5>
        <div
          id={enclosure.rows[i].letter}
          ref={
            enclosure.rows[i].letter === activeArrangement.row ? ref : undefined
          }
          className={
            "mx-3 mt-0.5 flex h-12 max-w-[350px] justify-evenly space-x-4 overflow-x-auto px-2 md:max-w-[470px]"
          }
        >
          {seats[i]}
        </div>
      </div>,
    );
  }

  return (
    <div className={"flex flex-col space-y-5"}>
      {rows.map((row) => {
        return row;
      })}
      <div className={"space-y-5 text-xs font-medium text-gray-500"}>
        <div className={"space-y-3"}>
          <div className={"flex items-center"}>
            <Seat number={0} reserved={false} active={true} activeRow={false} />
            <p className={"pl-2 pt-2.5"}> &nbsp; = Your Seat</p>
          </div>
          <div className={"flex items-center"}>
            <Seat number={0} reserved={true} activeRow={false} />
            <p className={"pl-2 pt-2.5"}>&nbsp; = Reserved / Faculty Seat</p>
          </div>
        </div>
        <p>
          If your seat is not visible in the Seat Map, Please scroll the
          Highlighted row.
        </p>
      </div>
    </div>
  );
}
