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

import { type JSX } from "react";
import { type Action, type Coordinates, type Executable } from "../../interfaces";

interface ContextMenuProps {
  coordinates: Coordinates;
  menu: readonly Action[];
  onClick: (execute: Executable) => void;
  onClose: () => void;
}

export default function ContextMenu({
  coordinates,
  menu,
  onClick,
  onClose,
}: ContextMenuProps): JSX.Element {
  const CONTEXT_MENU_WIDTH: number = 176;

  const xAxis =
    coordinates.x + CONTEXT_MENU_WIDTH > window.innerWidth
      ? coordinates.x - CONTEXT_MENU_WIDTH - 50
      : coordinates.x;

  return (
    <div
      className={
        "fixed overflow-y-auto z-40 max-h-96 flex w-44 flex-col space-y-0.5 px-1 py-1 rounded-lg border border-gray-300 bg-white shadow-md"
      }
      style={{
        top: coordinates.y,
        left: xAxis,
      }}
    >
      {menu.map((m) => {
        return (
          <span
            key={m.id}
            id={m.id}
            className={
              "flex w-full cursor-pointer font-medium select-none flex-row items-center space-x-1 rounded-md px-1 text-xs outline-none ring-0 hover:bg-gray-100 focus:bg-gray-200"
            }
            onClick={() => {
              onClick(m.execute);
              onClose();
            }}
          >
            {m.icon}
            {m.name}
          </span>
        );
      })}
    </div>
  );
}
