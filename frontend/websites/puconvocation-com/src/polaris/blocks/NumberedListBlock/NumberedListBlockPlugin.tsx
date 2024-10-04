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

import { type BlockLifecycle, type GenericBlockPlugin } from "../../interfaces";
import type React from "react";
import { NumberedListIcon } from "../../assets";
import { generateUUID } from "../../utils";
import NumberedListBlock from "./NumberedListBlock";
import { type ListBlockSchema } from "../../schema";

export default class NumberedListBlockPlugin
  implements GenericBlockPlugin<ListBlockSchema>
{
  description: string;
  icon: React.JSX.Element;
  name: string;
  role: string;

  constructor() {
    this.name = "Numbered List";
    this.description = "Create list with numbers.";
    this.role = "numberedList";
    this.icon = <NumberedListIcon />;
  }

  onInitialized(content: string): {
    focusBlockId: string;
    setCaretToStart?: boolean;
    inPlace?: boolean;
    template: ListBlockSchema;
  } {
    const focusId = generateUUID();
    return {
      focusBlockId: focusId,
      inPlace: true,
      setCaretToStart: true,
      template: {
        id: generateUUID(),
        role: "numberedList",
        data: [
          {
            id: focusId,
            data: content,
            role: "paragraph",
            style: [],
          },
        ],
        style: [],
      },
    };
  }

  serializeToHTMLElement(block: ListBlockSchema): HTMLElement {
    const node = document.createElement("ol");
    for (let i = 0; i < block.data.length; i++) {
      node.style.setProperty("list-style-position", "outside");
      node.style.setProperty("list-style-type", "decimal");
      const listNode = document.createElement("li");
      listNode.style.setProperty("margin-left", "3px");
      listNode.style.setProperty("margin-right", "3px");
      if (window?.registeredBlocks.has(block.data[i].role)) {
        const listChild = (
          window.registeredBlocks.get(block.data[i].role) as GenericBlockPlugin
        ).serializeToHTMLElement(block.data[i]);
        if (listChild !== null) {
          listNode.innerHTML = listChild.outerHTML;
        }
        node.appendChild(listNode);
      }
    }
    return node;
  }

  render(block: ListBlockSchema, lifecycle: BlockLifecycle): React.JSX.Element {
    return <NumberedListBlock block={block} blockLifecycle={lifecycle} />;
  }
}
