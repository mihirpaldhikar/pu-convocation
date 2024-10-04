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

import { type BlockSchema } from "../interfaces";
import { type Root } from "react-dom/client";

type BlockFunction = (
  block: BlockSchema,
  onChange: (
    block: BlockSchema,
    focusBlockId?: string,
    caretOffset?: number,
  ) => void,
  onDelete: (
    block: BlockSchema,
    focusBlockId?: string,
    caretOffset?: number,
  ) => void,
  popupRoot?: Root,
  dialogRoot?: Root,
) => void;

export default BlockFunction;
