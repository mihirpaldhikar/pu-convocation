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

import { type BlockLifecycle, type BlockSchema } from "./index";
import { type JSX } from "react";

interface GenericBlockPlugin<TBlockSchema = BlockSchema> {
  name: string;
  role: string;
  description: string;
  icon: JSX.Element;

  onInitialized: (content: string) => {
    focusBlockId: string;
    setCaretToStart?: boolean;
    inPlace?: boolean;
    template: TBlockSchema;
  };

  serializeToHTMLElement: (block: TBlockSchema) => HTMLElement;

  render: (block: TBlockSchema, lifecycle: BlockLifecycle) => JSX.Element;
}

export default GenericBlockPlugin;
