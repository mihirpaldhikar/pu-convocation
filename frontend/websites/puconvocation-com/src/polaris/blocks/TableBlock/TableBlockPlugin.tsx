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
import { TableIcon } from "../../assets";
import { generateUUID, isInlineAnnotationsNode } from "../../utils";
import TableBlock from "./TableBlock";
import { type TableBlockSchema } from "../../schema";
import { kebabCase } from "lodash";
import { LINK_ATTRIBUTE } from "../../constants";

export default class TableBlockPlugin
  implements GenericBlockPlugin<TableBlockSchema>
{
  description: string;
  icon: React.JSX.Element;
  name: string;
  role: string;

  constructor() {
    this.name = "Table";
    this.description = "Add tabular content.";
    this.role = "table";
    this.icon = <TableIcon size={32} />;
  }

  onInitialized(content: string): {
    focusBlockId: string;
    setCaretToStart?: boolean;
    inPlace?: boolean;
    template: TableBlockSchema;
  } {
    const focusId = generateUUID();
    return {
      focusBlockId: focusId,
      inPlace: content.length === 0,
      setCaretToStart: true,
      template: {
        id: generateUUID(),
        role: "table",
        style: [],
        data: {
          rows: [
            {
              id: generateUUID(),
              columns: [
                {
                  id: focusId,
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
              ],
            },
            {
              id: generateUUID(),
              columns: [
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
              ],
            },
            {
              id: generateUUID(),
              columns: [
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
              ],
            },
            {
              id: generateUUID(),
              columns: [
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
                {
                  id: generateUUID(),
                  role: "paragraph",
                  data: "",
                  style: [],
                },
              ],
            },
          ],
        },
      },
    };
  }

  serializeToHTMLElement(block: TableBlockSchema): HTMLElement {
    const node = document.createElement("table");
    node.id = block.id;
    node.style.setProperty("display", "block");
    node.style.setProperty("table-layout", "auto");
    node.style.setProperty("border-collapse", "collapse");
    node.style.setProperty("overflow-x", "auto");
    const tableData = block.data;
    const tableBody = document.createElement("tbody");
    for (let i = 0; i < tableData.rows.length; i++) {
      const row = document.createElement("tr");
      row.id = tableData.rows[i].id;
      for (let j = 0; j < tableData.rows[i].columns.length; j++) {
        const cell = document.createElement(i === 0 ? "th" : "td");
        cell.id = tableData.rows[i].columns[j].id;
        cell.innerHTML = tableData.rows[i].columns[j].data;
        for (const style of tableData.rows[i].columns[j].style) {
          cell.style.setProperty(kebabCase(style.name), kebabCase(style.value));
        }
        cell.style.setProperty("padding-left", "0.75rem");
        cell.style.setProperty("padding-right", "0.75rem");
        cell.style.setProperty("padding-top", "0.5rem");
        cell.style.setProperty("padding-bottom", "0.5rem");
        cell.style.setProperty("border", "1px solid #d1d5db");
        for (const childNode of cell.childNodes) {
          if (isInlineAnnotationsNode(childNode)) {
            const element = childNode as HTMLElement;
            if (element.getAttribute(LINK_ATTRIBUTE) !== null) {
              const anchorNode = document.createElement("a");
              anchorNode.href = element.getAttribute(LINK_ATTRIBUTE) as string;
              anchorNode.target = "_blank";
              anchorNode.innerText = element.innerText;
              anchorNode.style.cssText = element.style.cssText;
              cell.replaceChild(anchorNode, element);
            }
          }
        }
        row.appendChild(cell);
      }
      tableBody.appendChild(row);
    }
    node.appendChild(tableBody);
    return node;
  }

  render(
    block: TableBlockSchema,
    lifecycle: BlockLifecycle,
  ): React.JSX.Element {
    return <TableBlock block={block} blockLifecycle={lifecycle} />;
  }
}
