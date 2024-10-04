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

import { type BlockExecutable } from "./index";
import type TextInputExecutable from "./TextInputExecutable";
import type StyleExecutable from "./StyleExecutable";
import type StyleInputExecutable from "./StyleInputExecutable";
import type LinkInputExecutable from "./LinkInputExecutable";
import type BlockFunctionExecutable from "./BlockFunctionExecutable";

type Executable =
  | BlockExecutable
  | TextInputExecutable
  | StyleExecutable
  | StyleInputExecutable
  | LinkInputExecutable
  | BlockFunctionExecutable;

export default Executable;
