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
import { useRemoteConfig } from "@hooks/index";
import { Enclosure } from "@dto/index";
import { GroundMapper } from "@components/attendee";
import { Field, FieldArray, Form, Formik } from "formik";
import { Button, Input } from "@components/ui";
import { DynamicIcon } from "@components/graphics";

function nextChar(input: string): string {
  if (input.length === 1 && /\d/.test(input)) {
    const num = parseInt(input, 10);
    return (num + 1).toString();
  }
  let result = input.split("");
  let i = result.length - 1;

  while (i >= 0) {
    const char = result[i];
    if (char === "Z") {
      result[i] = "A";
    } else {
      result[i] = String.fromCharCode(char.charCodeAt(0) + 1);
      break;
    }

    i--;
  }

  if (result[0] === "A" && result.length === input.length) {
    result = ["A"].concat(result);
  }

  return result.join("");
}

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
  const seatsInEnclosure: Array<number> = remoteConfig.groundMappings.map(
    (enclosure) => {
      return totalEnclosureSeats(enclosure);
    },
  );

  const [enclosureData, setEnclosureData] = useState<Enclosure>(
    remoteConfig.groundMappings[0],
  );

  let totalSeats = 0;

  seatsInEnclosure.forEach((enclosure) => {
    totalSeats += enclosure;
  });

  return (
    <div
      className={
        "flex h-[160vh] w-full flex-col rounded-xl border bg-white px-4 py-5 md:h-[90vh]"
      }
    >
      <h3 className={"py-5 text-center text-2xl font-black"}>
        Total Seats are {totalSeats}
      </h3>
      <Formik
        enableReinitialize={true}
        initialValues={enclosureData}
        onSubmit={(values) => {
          dispatch({
            type: "SET_ENCLOSURE",
            payload: {
              index: remoteConfig.groundMappings.findIndex(
                (e) => e.letter === values.letter,
              )!!,
              enclosure: values,
            },
          });
        }}
      >
        {({ values, handleSubmit }) => (
          <div className={"grid h-full grid-cols-1 gap-4 md:grid-cols-2"}>
            <div className={"flex flex-col items-center justify-center"}>
              <GroundMapper
                className={"w-full"}
                activeColor={"#dc2626"}
                activeEnclosure={enclosureData.letter}
                onEnclosureClicked={async (id) => {
                  if (id !== null) {
                    setEnclosureData(
                      remoteConfig.groundMappings.find(
                        (e) => e.letter === id,
                      )!!,
                    );
                  }
                }}
              />
            </div>
            <div>
              <div className={"rounded-xl border py-4"}>
                <Form>
                  <div
                    className={
                      "mx-3 mb-5 flex items-center justify-between rounded-2xl bg-red-100 px-4 py-5 text-white"
                    }
                  >
                    <div>
                      <h4 className={"text-xl font-bold text-red-600"}>
                        Enclosure: {values.letter}
                      </h4>
                      <p className={"text-xs text-black"}>
                        Enter from: {values.entryDirection}
                      </p>
                    </div>
                    <div>
                      <p className={"font-medium text-black"}>
                        Seats: {totalEnclosureSeats(values)}
                      </p>
                    </div>
                  </div>
                  <FieldArray name={"rows"}>
                    {(arrayHelpers) => (
                      <div
                        className={
                          "h-[60vh] w-full space-y-4 overflow-y-auto px-5"
                        }
                      >
                        {values.rows.map((_row, index) => {
                          return (
                            <div
                              key={index}
                              className={
                                "relative space-y-3 rounded-2xl border px-3 py-2"
                              }
                            >
                              <div className={"absolute right-0 top-0 p-3"}>
                                <div
                                  className={
                                    "cursor-pointer rounded-full bg-red-100 p-1"
                                  }
                                  onClick={() => {
                                    arrayHelpers.remove(index);
                                  }}
                                >
                                  <DynamicIcon
                                    icon={"XMarkIcon"}
                                    className={"text-red-600"}
                                  />
                                </div>
                              </div>
                              <div
                                className={
                                  "flex w-full items-center justify-center"
                                }
                              >
                                <Field name={`rows[${index}].letter`}>
                                  {({ field }: { field: any }) => (
                                    <Input
                                      {...field}
                                      className={"w-20 text-center"}
                                    />
                                  )}
                                </Field>
                              </div>
                              <div
                                className={"flex items-center justify-between"}
                              >
                                <div>
                                  <Field name={`rows[${index}].start`}>
                                    {({ field }: { field: any }) => (
                                      <Input
                                        {...field}
                                        className={"w-20 text-center"}
                                      />
                                    )}
                                  </Field>
                                </div>
                                <div
                                  className={
                                    "mx-3 h-0.5 flex-1 rounded-full bg-red-300"
                                  }
                                ></div>
                                <div>
                                  <Field name={`rows[${index}].end`}>
                                    {({ field }: { field: any }) => (
                                      <Input
                                        {...field}
                                        className={"w-20 text-center"}
                                      />
                                    )}
                                  </Field>
                                </div>
                              </div>
                              <div className={"flex items-center space-x-3"}>
                                <h6>Reserved: </h6>
                                <Field name={`rows[${index}].reserved`}>
                                  {({ field }: { field: any }) => (
                                    <Input {...field} />
                                  )}
                                </Field>
                              </div>
                            </div>
                          );
                        })}
                        <Button
                          className={"w-full"}
                          type={"button"}
                          onClick={() => {
                            handleSubmit();
                            arrayHelpers.push({
                              letter: nextChar(
                                values.rows.length === 0
                                  ? "0"
                                  : values.rows[values.rows.length - 1].letter,
                              ),
                              start: 0,
                              end: 0,
                              reserved: [],
                            });
                          }}
                        >
                          Add Row
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </Form>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
