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
import { conditionalClassName } from "../../utils";

interface ButtonProps {
  text: string;
  onClick: () => void;
  hidden?: boolean;
  disabled?: boolean;
  color?: "primary" | "danger" | "cancel";
  fullWidth?: boolean;
}

export default function Button({
  text,
  onClick,
  color = "primary",
  hidden = false,
  disabled = false,
  fullWidth = true,
}: ButtonProps): JSX.Element {
  return (
    <button
      hidden={hidden}
      disabled={disabled}
      type={"button"}
      onClick={onClick}
      className={conditionalClassName(
        "rounded-md p-1 font-medium text-sm disabled:bg-gray-200 disabled:text-gray-400",
        color === "primary"
          ? "bg-blue-700 text-white"
          : color === "cancel"
          ? "text-gray-400 border hover:bg-gray-100 border-gray-300"
          : "bg-red-700 text-white",
        fullWidth ? "w-full" : "w-fit",
      )}
    >
      {text}
    </button>
  );
}
