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
import { ImageIcon } from "../../assets";
import { generateUUID } from "../../utils";
import ImageBlock from "./ImageBlock";
import { type AttachmentBlockSchema } from "../../schema";
import { kebabCase } from "lodash";

export default class ImageBlockPlugin
  implements GenericBlockPlugin<AttachmentBlockSchema>
{
  description: string;
  icon: React.JSX.Element;
  name: string;
  role: string;

  constructor() {
    this.name = "Image";
    this.description = "Add an image.";
    this.role = "image";
    this.icon = <ImageIcon />;
  }

  onInitialized(content: string): {
    focusBlockId: string;
    setCaretToStart?: boolean;
    inPlace?: boolean;
    template: AttachmentBlockSchema;
  } {
    const focusId = generateUUID();
    return {
      focusBlockId: focusId,
      inPlace: content.length === 0,
      setCaretToStart: true,
      template: {
        id: focusId,
        role: "image",
        data: {
          url: "",
          description: "",
          width: 500,
          height: 300,
        },
        style: [],
      },
    };
  }

  serializeToHTMLElement(block: AttachmentBlockSchema): HTMLElement {
    const node = document.createElement("div");
    for (const style of block.style) {
      node.style.setProperty(kebabCase(style.name), kebabCase(style.value));
    }
    node.style.setProperty("width", "100%");
    node.style.setProperty("padding-top", "15px");
    node.style.setProperty("padding-bottom", "15px");
    const childNode = document.createElement("div");
    childNode.style.setProperty("display", "inline-block");
    childNode.style.setProperty("width", "100%");
    const attachment = block.data;
    const attachmentNode = document.createElement("img");
    attachmentNode.id = block.id;
    attachmentNode.style.setProperty("display", "inline-block");
    attachmentNode.style.setProperty("border", "none");
    attachmentNode.src = attachment.url;
    attachmentNode.alt = attachment.description;
    attachmentNode.width = attachment.width;
    attachmentNode.height = attachment.height;
    childNode.innerHTML = attachmentNode.outerHTML;
    node.appendChild(childNode);
    return node;
  }

  render(
    block: AttachmentBlockSchema,
    lifecycle: BlockLifecycle,
  ): React.JSX.Element {
    return <ImageBlock block={block} blockLifecycle={lifecycle} />;
  }
}
