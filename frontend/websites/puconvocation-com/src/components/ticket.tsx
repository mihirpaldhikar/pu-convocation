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

import { Attendee } from "@dto/index";
import { StarIcon, TicketIcon } from "@heroicons/react/24/outline";

interface TicketProps {
  attendee: Attendee;
  className?: string;
}

export default function Ticket({
  attendee,
  className,
}: TicketProps): JSX.Element {
  return (
    <div className={"".concat(" ").concat(className ?? "")}>
      <div className={"mb-5 mt-5 flex w-fit md:mt-10"}>
        <div className={"mr-2 w-7 text-red-600"}>
          <TicketIcon />
        </div>
        <div>
          <h2 className={"text-xl font-bold"}>Pass</h2>
        </div>
      </div>
      <div
        className={
          "w-full rounded-md border-2 border-dotted border-yellow-400 bg-yellow-50 px-2 py-3 text-black md:w-[350px]"
        }
      >
        <div className={"space-y-3 border-b border-yellow-400"}>
          <div className={"flex justify-between text-xs font-semibold"}>
            <div className={"flex items-center"}>
              <div className={"mr-2 w-5"}>
                <StarIcon />
              </div>
              <h3>CRR: {attendee.convocationId}</h3>
            </div>
            <h3>ERN: {attendee.enrollmentNumber}</h3>
          </div>
          <h2 className={"text-lg font-bold"}>{attendee.studentName}</h2>
        </div>
        <div className={"flex items-center justify-evenly pt-3"}>
          <div className={"flex flex-col items-center"}>
            <h2 className={"text-xl font-bold"}>{attendee.enclosure}</h2>
            <h3 className={"text-xs font-semibold"}>Enclosure</h3>
          </div>
          <div className={"flex flex-col items-center"}>
            <h2 className={"text-xl font-bold"}>{attendee.row}</h2>
            <h3 className={"text-xs font-semibold"}>Row</h3>
          </div>
          <div className={"flex flex-col items-center"}>
            <h2 className={"text-xl font-bold"}>{attendee.seat}</h2>
            <h3 className={"text-xs font-semibold"}>Seat</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
