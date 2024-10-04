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
import { GitHubIcon } from "../../assets";
import { generateGitHubGistURL, generateUUID } from "../../utils";
import GitHubGistBlock from "./GitHubGistBlock";
import { type AttachmentBlockSchema } from "../../schema";
import { kebabCase } from "lodash";

export default class GithubGistBlockPlugin
  implements GenericBlockPlugin<AttachmentBlockSchema>
{
  description: string;
  icon: React.JSX.Element;
  name: string;
  role: string;

  constructor() {
    this.name = "GitHub Gist";
    this.description = "Add a GitHub Gist.";
    this.role = "githubGist";
    this.icon = <GitHubIcon size={32} />;
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
        role: "githubGist",
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
    const gistDocument = `
   data:text/html;charset=utf-8,
   <head>
     <base target="_blank" />
     <title></title>
   </head>
   <body id="gist-${block.id}" onload="adjustFrame()">
     <style>
       * {
         margin: 0;
         padding: 0;
       }
     </style>
     <script src="${generateGitHubGistURL(attachment.url)}"></script>
     <script>
       function adjustFrame() {
         window.top.postMessage({
           height: document.body.scrollHeight,
           id: document.body.id.replace("gist-", "") 
         }, "*");
       }
     </script>
   </body>
      `;
    const attachmentNode = document.createElement("iframe");
    attachmentNode.id = block.id;
    attachmentNode.style.setProperty("display", "inline-block");
    attachmentNode.style.setProperty("border", "none");
    attachmentNode.width = "100%";
    attachmentNode.style.border = "none";
    attachmentNode.src = gistDocument;
    childNode.innerHTML = attachmentNode.outerHTML;

    node.appendChild(childNode);
    return node;
  }

  render(
    block: AttachmentBlockSchema,
    lifecycle: BlockLifecycle,
  ): React.JSX.Element {
    return <GitHubGistBlock block={block} blockLifecycle={lifecycle} />;
  }
}
