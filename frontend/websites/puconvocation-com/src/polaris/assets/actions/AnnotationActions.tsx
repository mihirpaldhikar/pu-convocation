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

import { type Action } from "../../interfaces";
import { generateUUID } from "../../utils";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  SubscriptIcon,
  SuperscriptIcon,
  TextBackgroundColorIcon,
  TextColorIcon,
  TextSizeIcon,
  UnderlineIcon
} from "../icons";

const AnnotationActions: readonly Action[] = [
  {
    id: generateUUID(),
    name: "Bold",
    icon: <BoldIcon />,
    execute: {
      type: "style",
      args: [
        {
          name: "font-weight",
          value: "bold",
        },
      ],
    },
  },
  {
    id: generateUUID(),
    name: "Italic",
    icon: <ItalicIcon />,
    execute: {
      type: "style",
      args: [
        {
          name: "font-style",
          value: "italic",
        },
      ],
    },
  },
  {
    id: generateUUID(),
    name: "Underline",
    icon: <UnderlineIcon />,
    execute: {
      type: "style",
      args: [
        {
          name: "text-decoration",
          value: "underline",
        },
      ],
    },
  },
  {
    id: generateUUID(),
    name: "Link",
    separator: true,
    icon: <LinkIcon />,
    execute: {
      type: "linkInput",
      args: {
        hint: "Add Link..",
        payload: "",
        regex:
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&/=]*)/,
      },
    },
  },
  {
    id: generateUUID(),
    name: "Text Size",
    separator: true,
    icon: <TextSizeIcon />,
    execute: {
      type: "styleInput",
      args: {
        hint: "Text Size..",
        inputType: "number",
        unit: "px",
        payload: {
          name: "font-size",
          value: "",
        },
        regex: /^[0-9]*$/,
      },
    },
  },
  {
    id: generateUUID(),
    name: "Text Color",
    icon: <TextColorIcon />,
    execute: {
      type: "styleInput",
      args: {
        hint: "HEX Code",
        inputType: "color",
        payload: {
          name: "color",
          value: "",
        },
        regex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      },
    },
  },
  {
    id: generateUUID(),
    name: "Text Background Color",
    icon: <TextBackgroundColorIcon />,
    execute: {
      type: "styleInput",
      args: {
        hint: "HEX Code",
        inputType: "color",
        payload: {
          name: "background-color",
          value: "",
        },
        regex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      },
    },
  },
  {
    id: generateUUID(),
    name: "Code",
    icon: <CodeIcon />,
    execute: {
      type: "style",
      args: [
        {
          name: "font-family",
          value: "monospace",
        },
        {
          name: "background-color",
          value: "#e8e6e6",
        },
        {
          name: "border-radius",
          value: "3px",
        },
        {
          name: "padding",
          value: "2px",
        },
      ],
    },
  },
  {
    id: generateUUID(),
    name: "Superscript",
    icon: <SuperscriptIcon />,
    execute: {
      type: "style",
      args: [
        {
          name: "vertical-align",
          value: "super",
        },
        {
          name: "line-height",
          value: "1",
        },
      ],
    },
  },
  {
    id: generateUUID(),
    name: "Subscript",
    icon: <SubscriptIcon />,
    execute: {
      type: "style",
      args: [
        {
          name: "vertical-align",
          value: "sub",
        },
        {
          name: "line-height",
          value: "1",
        },
      ],
    },
  },
];

export default AnnotationActions;
