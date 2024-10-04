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

import type React from "react";
import { type BlockLifecycle, type GenericBlockPlugin } from "../../interfaces";
import { generateUUID, isInlineAnnotationsNode } from "../../utils";
import TitleBlock from "./TitleBlock";
import { TitleIcon } from "../../assets";
import { type TextBlockSchema } from "../../schema";
import { kebabCase } from "lodash";
import { LINK_ATTRIBUTE } from "../../constants";

export default class TitleBlockPlugin
  implements GenericBlockPlugin<TextBlockSchema>
{
  description: string;
  icon: React.JSX.Element;
  name: string;
  role: string;

  constructor() {
    this.name = "Title";
    this.description = "Big section heading.";
    this.role = "title";
    this.icon = <TitleIcon />;
  }

  onInitialized(content: string): {
    focusBlockId: string;
    setCaretToStart?: boolean;
    inPlace?: boolean;
    template: TextBlockSchema;
  } {
    const focusId = generateUUID();
    return {
      focusBlockId: focusId,
      inPlace: true,
      template: {
        id: focusId,
        role: "title",
        data: content,
        style: [],
      },
    };
  }

  serializeToHTMLElement(block: TextBlockSchema): HTMLElement {
    const node = document.createElement("h1");
    node.id = block.id;
    for (const style of block.style) {
      node.style.setProperty(kebabCase(style.name), kebabCase(style.value));
    }
    node.innerHTML = block.data;
    for (const childNode of node.childNodes) {
      if (isInlineAnnotationsNode(childNode)) {
        const element = childNode as HTMLElement;
        if (element.getAttribute(LINK_ATTRIBUTE) !== null) {
          const anchorNode = document.createElement("a");
          anchorNode.href = element.getAttribute(LINK_ATTRIBUTE) as string;
          anchorNode.target = "_blank";
          anchorNode.innerText = element.innerText;
          anchorNode.style.cssText = element.style.cssText;
          node.replaceChild(anchorNode, element);
        }
      }
    }
    return node;
  }

  render(block: TextBlockSchema, lifecycle: BlockLifecycle): React.JSX.Element {
    return <TitleBlock block={block} blockLifecycle={lifecycle} />;
  }
}
