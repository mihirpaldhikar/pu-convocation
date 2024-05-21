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

import { JSX } from "react";
import { Seat } from "@components/index";

export default function AttendeePage(): JSX.Element {
  const target = {
    enclosure: "1",
    row: "A",
    seat: 1,
  };
  const enclosures = [
    {
      enclosure: "1",
      rows: [
        {
          letter: "A",
          start: 1,
          end: 5,
        },
        {
          letter: "B",
          start: 1,
          end: 5,
        },
        {
          letter: "C",
          start: 1,
          end: 5,
        },
        {
          letter: "D",
          start: 1,
          end: 5,
        },
      ],
    },
  ];
  return (
    <section>
      {enclosures
        .filter((enc) => enc.enclosure === target.enclosure)[0]
        .rows.map((rows) => {
          return (
            <div
              key={rows.letter}
              className={"flex h-10 items-center space-x-5"}
            >
              <h5>{rows.letter}</h5>
              <div
                className={
                  "flex h-10 max-w-[450px] space-x-3 overflow-x-auto px-5"
                }
              >
                {Array.from(
                  { length: rows.end - rows.start + 1 },
                  (v, k) => k + rows.start,
                ).map((seat) => {
                  return (
                    <Seat
                      key={seat}
                      number={seat}
                      active={
                        rows.letter === target.row && seat === target.seat
                      }
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
    </section>
  );
}
