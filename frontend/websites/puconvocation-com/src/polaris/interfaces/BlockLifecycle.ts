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

import { type BlockSchema } from "./index";

interface BlockLifecycle {
  editable: boolean;
  previousParentBlock: BlockSchema | null;
  listMetadata?: {
    parent: BlockSchema;
    currentIndex: number;
  };
  onChange: (block: BlockSchema, focus?: boolean) => void;
  onCreate: (
    parentBlock: BlockSchema,
    targetBlock: BlockSchema,
    holder?: BlockSchema[],
    focusOn?: {
      nodeId: string;
      nodeChildIndex?: number;
      caretOffset?: number;
    },
  ) => void;
  onDelete: (
    block: BlockSchema,
    previousBlock: BlockSchema,
    nodeId: string,
    setCursorToStart?: boolean,
    holder?: BlockSchema[],
  ) => void;
  onSelect: (block: BlockSchema) => void;
  onAttachmentRequest: (block: BlockSchema, data: File | string) => void;
  onMarkdown: (block: BlockSchema, focusBlockId?: string) => void;
}

export default BlockLifecycle;
