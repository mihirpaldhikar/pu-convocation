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
import { AlignCenterIcon, AlignEndIcon, AlignStartIcon } from "../icons";

const BlockActions: readonly Action[] = [
  {
    id: generateUUID(),
    name: "Align Start",
    description: `Align text to start`,
    icon: <AlignStartIcon size={32} />,
    execute: {
      type: "style",
      args: [
        {
          name: "textAlign",
          value: "start",
        },
      ],
    },
  },
  {
    id: generateUUID(),
    name: "Align Center",
    description: `Align text at the center`,
    icon: <AlignCenterIcon size={32} />,
    execute: {
      type: "style",
      args: [
        {
          name: "textAlign",
          value: "center",
        },
      ],
    },
  },
  {
    id: generateUUID(),
    name: "Align End",
    description: `Align text at the end`,
    icon: <AlignEndIcon size={32} />,
    execute: {
      type: "style",
      args: [
        {
          name: "textAlign",
          value: "end",
        },
      ],
    },
  },
];

export default BlockActions;
