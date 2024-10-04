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

import { isYouTubeURL } from "./Validators";
import { YoutubeURLRegex } from "../constants";
import { v4 as uuid } from "uuid";

/**
 * @function generateUUID
 *
 * @description Generates a random string of provided length size.
 *
 * @returns string
 *
 * @author Mihir Paldhikar
 */

export function generateUUID(): string {
  return uuid();
}

export function isAllowedActionMenuKey(key: string): boolean {
  switch (key.toLowerCase()) {
    case "a":
    case "b":
    case "c":
    case "d":
    case "e":
    case "f":
    case "g":
    case "h":
    case "i":
    case "j":
    case "k":
    case "l":
    case "m":
    case "n":
    case "o":
    case "p":
    case "q":
    case "r":
    case "s":
    case "t":
    case "u":
    case "v":
    case "w":
    case "x":
    case "y":
    case "z":
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      return true;
    default:
      return false;
  }
}

export function getYouTubeVideoID(url: string): string {
  if (!isYouTubeURL(url)) return "";
  return (url.match(YoutubeURLRegex) as RegExpMatchArray)[1];
}

export function generateGitHubGistURL(url: string): string {
  const githubGistData = url.split("#");
  const gistURL = githubGistData[0];
  let file =
    githubGistData.length === 1
      ? ""
      : "?".concat(githubGistData[1].replace("file-", "file="));
  if (file !== "" && file.includes("-")) {
    const fileMeta = file.split("-");
    file = "";
    for (let i = 0; i < fileMeta.length; i++) {
      if (i === fileMeta.length - 1) {
        file = file.concat(".".concat(fileMeta[i]));
      } else if (i === 0) {
        file = file.concat(fileMeta[i]);
      } else {
        file = file.concat("%20".concat(fileMeta[i]));
      }
    }
  }
  return `${gistURL}.js${file}`;
}
