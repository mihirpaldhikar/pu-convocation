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
import { createContext } from "react";
import { type Root } from "react-dom/client";
import { type PolarisConfig } from "../../interfaces";
import { DEFAULT_POLARIS_CONFIG } from "../../constants";

interface RootInterface {
  dialogRoot: Root | undefined;
  popUpRoot: Root | undefined;
  config: PolarisConfig;
}

const RootContext = createContext<RootInterface>({
  dialogRoot: undefined,
  popUpRoot: undefined,
  config: DEFAULT_POLARIS_CONFIG,
});

export default RootContext;
