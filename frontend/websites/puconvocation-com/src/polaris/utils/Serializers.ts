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

import { type Blob, type GenericBlockPlugin } from "../interfaces";
import { INLINE_ANNOTATIONS_NODE, NODE_TYPE } from "../constants";

export function serializeBlob(blob: Blob): string {
  if (
    window === undefined ||
    document === undefined ||
    window == null ||
    document == null
  )
    return "";
  const master = document.createElement("html");
  const masterBody = document.createElement("body");
  for (const block of blob.blocks) {
    if (window?.registeredBlocks.has(block.role)) {
      const node = (
        window.registeredBlocks.get(block.role) as GenericBlockPlugin
      ).serializeToHTMLElement(block);
      if (node !== null) {
        masterBody.appendChild(node);
      }
    }
  }

  masterBody.append(`
    <script type="text/javascript">
      window.onmessage = function (messageEvent) {
         const height = messageEvent.data.height;
         const gistFrame = document.getElementById(messageEvent.data.id);
         if (gistFrame != null) {
            gistFrame.style.height = height + "px";
         }
      };
    </script>
  `);

  const head = document.createElement("head");
  head.innerHTML = `
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="${blob.description ?? ""}">
    <meta name="author" content="${blob.author ?? ""}">
    <title>${blob.name ?? ""}</title>
  `;
  master.lang = "en";
  master.appendChild(head);
  master.appendChild(masterBody);
  return "<!doctype html>".concat(
    master.outerHTML
      .replace(/&[l|g]t;/g, function (c) {
        if (c === "&lt;") {
          return "<";
        } else {
          return ">";
        }
      })
      .replaceAll(`${NODE_TYPE}="${INLINE_ANNOTATIONS_NODE}"`, ""),
  );
}

export async function serializeFile(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result?.toString() ?? "");
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}
