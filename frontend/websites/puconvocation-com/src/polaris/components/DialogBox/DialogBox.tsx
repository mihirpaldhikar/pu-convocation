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

import { type JSX, useEffect } from "react";
import { type Coordinates } from "../../interfaces";
import { getEditorRoot } from "../../utils";

interface DialogBoxProps {
  focusElementId: string;
  coordinates: Coordinates;
  children: JSX.Element;
  onClose: () => void;
  onConfirm: () => void;
  onInitialize?: () => void;
}

export default function DialogBox({
  focusElementId,
  coordinates,
  children,
  onConfirm,
  onClose,
  onInitialize,
}: DialogBoxProps): JSX.Element {
  useEffect(() => {
    function onKeyboardEvent(event: KeyboardEvent): void {
      switch (event.key.toLowerCase()) {
        case "escape": {
          event.preventDefault();
          onClose();
          break;
        }
        case "enter": {
          event.preventDefault();
          onConfirm();
          onClose();
          break;
        }
      }
    }

    function onMouseEvent(): void {
      onClose();
    }

    const editorRootNode = getEditorRoot();

    const dialogBoxNode = document.getElementById("dialog-box") as HTMLElement;

    dialogBoxNode.addEventListener("keydown", onKeyboardEvent);
    editorRootNode.addEventListener("mousedown", onMouseEvent);

    const focusElement = document.getElementById(focusElementId);
    if (focusElement != null) {
      focusElement.focus();
    }

    if (onInitialize !== undefined) {
      onInitialize();
    }

    return () => {
      dialogBoxNode.removeEventListener("keydown", onKeyboardEvent);
      editorRootNode.removeEventListener("mousedown", onMouseEvent);
    };
  }, [focusElementId, onClose, onConfirm, onInitialize]);

  const DIALOG_WIDTH: number = 250;

  const xAxis: number =
    window.innerWidth > 500
      ? coordinates.x + DIALOG_WIDTH > window.innerWidth
        ? coordinates.x - DIALOG_WIDTH
        : coordinates.x
      : 30;

  return (
    <div
      id={"dialog-box"}
      style={{
        top: coordinates.y - 60,
        left: xAxis,
      }}
      data-y-coordinate={coordinates.y - 60}
      data-x-coordinate={xAxis}
      className={
        "fixed flex w-[250px] flex-col z-30 space-y-3 rounded-lg border border-gray-300 bg-white px-2 py-3 shadow-lg"
      }
    >
      {children}
    </div>
  );
}
