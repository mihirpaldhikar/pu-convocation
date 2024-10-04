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

import { Fragment, type JSX, useState } from "react";
import { type Coordinates } from "../../interfaces";
import { Button } from "../Button";
import { DialogBox } from "../DialogBox";

interface InputDialogProps {
  coordinates: Coordinates;
  active: boolean;
  inputArgs: {
    type: "number" | "text";
    payload: string;
    hint: string;
    regex: RegExp;
    unit?: "px" | "rem" | "em" | "vh" | "wh";
  };
  onConfirm: (data: string, remove?: boolean) => void;
  onClose: () => void;
}

export default function InputDialog({
  coordinates,
  active,
  inputArgs,
  onConfirm,
  onClose,
}: InputDialogProps): JSX.Element {
  const [data, setData] = useState<string>(inputArgs.payload);

  const [disabled, setDisabled] = useState(
    !inputArgs.regex.test(data) || data === "",
  );

  return (
    <DialogBox
      focusElementId={"dialog-input"}
      coordinates={coordinates}
      onClose={onClose}
      onConfirm={() => {
        if (inputArgs.regex.test(data)) {
          onConfirm(data.concat(inputArgs.unit ?? ""));
        }
      }}
    >
      <Fragment>
        <input
          id={"dialog-input"}
          type={inputArgs.type}
          placeholder={inputArgs.hint}
          className={
            "w-full rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-blue-700 text-sm"
          }
          value={data}
          onChange={(event) => {
            setData(event.target.value);
            setDisabled(
              !inputArgs.regex.test(event.target.value) ||
                event.target.value === "",
            );
          }}
        />
        <div>
          <div
            className={
              "flex w-full flex-row items-center justify-between space-x-2"
            }
          >
            <Button
              disabled={disabled}
              text={"Confirm"}
              onClick={() => {
                onConfirm(data.concat(inputArgs.unit ?? ""));
                onClose();
              }}
            />
            <Button
              text={"Cancel"}
              color={"cancel"}
              onClick={() => {
                onClose();
              }}
            />
          </div>
        </div>
        <Button
          hidden={!active}
          text={"Remove"}
          color={"danger"}
          onClick={() => {
            onConfirm("", true);
            onClose();
          }}
        />
      </Fragment>
    </DialogBox>
  );
}
