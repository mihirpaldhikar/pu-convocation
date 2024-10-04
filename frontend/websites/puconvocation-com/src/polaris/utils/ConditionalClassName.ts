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

/**
 * @function conditionalClassName
 * @param classNames
 *
 * @description Creates a string containing classNames when corresponding conditions are satisfied.
 *
 * @author Mihir Paldhikar
 */

function conditionalClassName(
  ...classNames: Array<string | boolean | null | undefined>
): string;

function conditionalClassName(): string {
  let className = "";
  let iterator = 0;
  let args: unknown;

  for (; iterator < arguments.length; ) {
    if (Boolean((args = arguments[iterator++])) && typeof args === "string") {
      className += " ";
      className += args;
    }
  }
  return className;
}

export { conditionalClassName };
export default conditionalClassName;
