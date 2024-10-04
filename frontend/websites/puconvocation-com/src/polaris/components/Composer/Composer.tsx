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

import { type JSX } from "react";
import { type BlockLifecycle, type BlockSchema } from "../../interfaces";
import type GenericBlockPlugin from "../../interfaces/GenericBlockPlugin";

interface ComposerProps {
  block: BlockSchema;
  blockLifecycle: BlockLifecycle;
}

/**
 * @function Composer
 *
 * @param editable
 * @param block
 * @returns JSX.Element
 *
 * @description Composer is responsible for rendering the Node from the BlockSchema. It also manages and updates the content of the block when the Node is mutated.
 *
 * @author Mihir Paldhikar
 */

export default function Composer({
  blockLifecycle,
  block,
}: ComposerProps): JSX.Element {
  if (window?.registeredBlocks?.has(block.role)) {
    return (
      window.registeredBlocks.get(block.role) as GenericBlockPlugin
    ).render(block, blockLifecycle);
  }
  throw new Error(`Block with role '${block.role}' is not registered.`);
}
