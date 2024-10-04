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

interface ColorPickerDialogProps {
  coordinates: Coordinates;
  active: boolean;
  inputArgs: {
    type: "color";
    hint: string;
    payload: string;
    regex: RegExp;
  };
  onColorSelected: (colorHexCode: string) => void;
  onClose: () => void;
}

export default function ColorPickerDialog({
  coordinates,
  active,
  inputArgs,
  onColorSelected,
  onClose,
}: ColorPickerDialogProps): JSX.Element {
  const [colorHexCode, setColorHexCode] = useState(
    inputArgs.payload !== "" ? inputArgs.payload : "#000000",
  );

  const [disabled, setDisabled] = useState(!inputArgs.regex.test(colorHexCode));

  const defaultColors: string[] = ["#304FFE", "#0288D1", "#0097A7", "#E53935"];

  return (
    <DialogBox
      focusElementId={"color-input"}
      coordinates={coordinates}
      onClose={onClose}
      onConfirm={() => {
        if (inputArgs.regex.test(colorHexCode)) {
          onColorSelected(colorHexCode);
        }
      }}
    >
      <Fragment>
        <div
          className={
            "grid w-full grid-cols-4 place-items-center justify-center gap-5"
          }
        >
          {defaultColors.map((color, index) => {
            return (
              <div
                key={index}
                className={"h-[28px] w-[28px] cursor-pointer rounded-full"}
                style={{
                  backgroundColor: color,
                }}
                onClick={() => {
                  if (inputArgs.regex.test(color)) {
                    onColorSelected(color);
                  }
                  onClose();
                }}
              ></div>
            );
          })}
        </div>
        <div
          className={"flex flex-row items-center justify-evenly space-x-2 px-2"}
        >
          <div
            className={"min-h-[28px] min-w-[28px] cursor-pointer rounded-full"}
            style={{
              backgroundColor: colorHexCode,
            }}
            onClick={() => {
              if (inputArgs.regex.test(colorHexCode)) {
                onColorSelected(colorHexCode);
              }
              onClose();
            }}
          ></div>
          <input
            id={"color-input"}
            placeholder={inputArgs.hint}
            value={colorHexCode}
            className={
              "w-[90px] rounded-md border text-sm border-gray-300 px-2 py-1 outline-none focus:border-blue-700"
            }
            onChange={(e) => {
              setColorHexCode(e.target.value);
              setDisabled(!inputArgs.regex.test(e.target.value));
            }}
          />
          <Button
            disabled={disabled}
            text={"Select"}
            onClick={() => {
              if (inputArgs.regex.test(colorHexCode)) {
                onColorSelected(colorHexCode);
              }
              onClose();
            }}
          />
        </div>
        <div className={"flex flex-row justify-center space-x-2 px-2"}>
          <Button
            hidden={!active}
            text={"Remove"}
            color={"danger"}
            onClick={() => {
              onColorSelected("");
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
      </Fragment>
    </DialogBox>
  );
}
