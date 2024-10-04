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

import { type Coordinates } from "../../interfaces";
import { createRef, Fragment, type JSX } from "react";
import { Button } from "../Button";
import { DialogBox } from "../DialogBox";

interface SizeDialogProps {
  initialSize: {
    width: number;
    height: number;
  };
  coordinates: Coordinates;
  onConfirm: (width: number, height: number) => void;
  onClose: () => void;
}

export default function SizeDialog({
  initialSize,
  coordinates,
  onConfirm,
  onClose,
}: SizeDialogProps): JSX.Element {
  const widthInputRef = createRef<HTMLInputElement>();
  const heightInputRef = createRef<HTMLInputElement>();

  return (
    <DialogBox
      focusElementId={"width-input"}
      coordinates={coordinates}
      onClose={onClose}
      onInitialize={() => {
        if (widthInputRef.current != null && heightInputRef.current != null) {
          widthInputRef.current.value = initialSize.width.toString();
          heightInputRef.current.value = initialSize.height.toString();
        }
      }}
      onConfirm={() => {
        if (
          widthInputRef.current != null &&
          heightInputRef.current != null &&
          widthInputRef.current?.value !== "" &&
          heightInputRef.current?.value !== ""
        ) {
          onConfirm(
            parseInt(widthInputRef.current.value),
            parseInt(heightInputRef.current.value),
          );
        }
      }}
    >
      <Fragment>
        <div className={"flex flex-row items-center space-x-2"}>
          <input
            id={"width-input"}
            type={"number"}
            placeholder={"width"}
            min={10}
            ref={widthInputRef}
            className={
              "w-full rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-blue-600 text-sm"
            }
          />
          <span>x</span>
          <input
            type={"number"}
            placeholder={"height"}
            min={10}
            ref={heightInputRef}
            className={
              "w-full rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-blue-600 text-sm"
            }
          />
        </div>
        <div
          className={
            "flex w-full flex-row items-center justify-between space-x-2"
          }
        >
          <Button
            text={"Confirm"}
            disabled={
              widthInputRef.current?.innerText === "" ||
              heightInputRef.current?.innerText === ""
            }
            onClick={() => {
              if (
                widthInputRef.current != null &&
                heightInputRef.current != null &&
                widthInputRef.current?.innerText !== "" &&
                heightInputRef.current?.innerText !== ""
              ) {
                onConfirm(
                  parseInt(widthInputRef.current?.innerText),
                  parseInt(heightInputRef.current?.innerText),
                );
              }
              onClose();
            }}
          />
        </div>
      </Fragment>
    </DialogBox>
  );
}
