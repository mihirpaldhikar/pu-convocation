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

import { type BlockSchema, type GenericBlockPlugin } from "../../interfaces";

export default class BlockPlugin {
  private readonly blocks: Map<string, GenericBlockPlugin<BlockSchema>>;

  public constructor() {
    this.blocks = new Map<string, GenericBlockPlugin<BlockSchema>>();
  }

  public registerBlock(block: GenericBlockPlugin): void {
    if (this.blocks.has(block.role)) {
      return;
    }
    this.blocks.set(block.role, block);
  }

  registeredBlocks(): Readonly<Map<string, GenericBlockPlugin<BlockSchema>>> {
    return this.blocks;
  }
}
