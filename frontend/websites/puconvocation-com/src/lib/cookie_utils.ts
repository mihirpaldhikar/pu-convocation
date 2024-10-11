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

export function parseCookie(cookieString: string): {
  name: string;
  value: string;
  options: { httpOnly: boolean; [key: string]: any };
} {
  const cookieParts = cookieString.split(";");
  const [name, value] = cookieParts[0].trim().split("=");
  const options: { httpOnly: boolean; [key: string]: any } = {
    httpOnly: false,
  };

  for (let i = 1; i < cookieParts.length; i++) {
    const part = cookieParts[i].trim();
    const [key, val] = part.split("=");

    switch (key.toLowerCase()) {
      case "httponly":
        options.httpOnly = true;
        break;
      case "secure":
        options.secure = true;
        break;
      case "max-age":
        options.maxAge = parseInt(val, 10);
        break;
      case "expires":
        options.expires = new Date(val);
        break;
      case "path":
        options.path = val;
        break;
      case "domain":
        options.domain = val;
        break;
      case "samesite":
        options.sameSite = val;
        break;
      default:
        options[key] = val;
    }
  }

  return { name, value, options };
}