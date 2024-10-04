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

import "./styles/global.css";

export type { BlockSchema, PolarisConfig } from "./interfaces";
export { generateUUID } from "./utils";
export { serializeBlob } from "./utils";
export {
  dispatchEditorEvent,
  subscribeToEditorEvent,
  unsubscribeFromEditorEvent,
} from "./utils";
export { serializeFile } from "./utils";
export type { Blob } from "./interfaces";
export { Editor } from "./components";
export { DEFAULT_POLARIS_CONFIG } from "./constants";
