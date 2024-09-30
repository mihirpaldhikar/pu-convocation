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
import {Attendee} from "@dto/index";
import {JSX} from "react";
import QRCode from "react-qr-code";

interface TicketProps {
  attendee: Attendee;
}

export default function Ticket({ attendee }: TicketProps): JSX.Element {
  return (
    <div
      className={
        "flex h-fit w-full flex-col rounded-xl border-2 border-gray-300 bg-white md:w-3/4"
      }
    >
      <div className={"flex justify-between px-4 pb-2 pt-5"}>
        <div className={"flex flex-col"}>
          <h6 className={"text-xs font-medium"}>{attendee.enrollmentNumber}</h6>
          <h3 className={"pt-4 text-xl font-bold"}>{attendee.studentName}</h3>
          <h4>{attendee.department}</h4>
        </div>
        <div>
          <div
            className={"flex flex-col items-center justify-center space-y-2"}
          >
            <QRCode
              size={100}
              value={
                attendee.degreeReceived
                  ? attendee.verificationToken.concat(
                      parseInt(String(Math.random() * 10)).toString(),
                    )
                  : attendee.verificationToken
              }
              className={`${attendee.degreeReceived ? "blur-md" : ""}`}
            />
            <h6 className={"text-xs"}>{attendee.convocationId}</h6>
          </div>
        </div>
      </div>
      <hr className={"h-0.5 bg-gray-300"} />
      <div className={"flex items-center justify-center py-4"}>
        <div className={"flex w-fit space-x-10"}>
          <div className={"text-center"}>
            <h5 className={"text-lg font-bold"}>
              {attendee.allocation.enclosure}
            </h5>
            <h6 className={"font-semibold"}>Enclosure</h6>
          </div>
          <div className={"px-3 text-center"}>
            <h5 className={"text-lg font-bold"}>{attendee.allocation.row}</h5>
            <h6 className={"font-semibold"}>Row</h6>
          </div>
          <div className={"px-3 text-center"}>
            <h5 className={"text-lg font-bold"}>{attendee.allocation.seat}</h5>
            <h6 className={"font-semibold"}>Seat</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
