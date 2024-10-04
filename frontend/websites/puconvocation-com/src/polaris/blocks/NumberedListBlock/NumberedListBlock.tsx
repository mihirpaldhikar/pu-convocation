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

import { createElement, Fragment, type JSX, useContext } from "react";
import { type BlockLifecycle, type BlockSchema, type GenericBlockPlugin } from "../../interfaces";
import { type ListBlockSchema } from "../../schema";
import { setNodeStyle } from "../../utils";
import RootContext from "../../contexts/RootContext/RootContext";

interface NumberedListBlockProps {
  block: ListBlockSchema;
  blockLifecycle: BlockLifecycle;
}

export default function NumberedListBlock({
  block,
  blockLifecycle,
}: NumberedListBlockProps): JSX.Element {
  const { editable } = blockLifecycle;
  const { config } = useContext(RootContext);

  return createElement(
    "ol",
    {
      id: block.id,
      disabled: !editable,
      style: setNodeStyle(block.style),
      spellCheck: true,
      className: "my-4 ml-4 pl-4 block list-decimal",
    },
    block.data.map((childBlock: BlockSchema, index) => {
      if (
        typeof childBlock.role === "string" &&
        childBlock.role.toLowerCase().includes("list")
      ) {
        return <Fragment key={childBlock.id} />;
      }
      return (
        <li
          key={childBlock.id}
          className={"pl-2"}
          style={{
            marginTop: `${config.block.list.spacing}rem`,
          }}
        >
          {window.registeredBlocks.has(block.role) ? (
            (
              window.registeredBlocks?.get(
                childBlock.role,
              ) as GenericBlockPlugin
            ).render(childBlock, {
              listMetadata: {
                parent: block,
                currentIndex: index,
              },
              ...blockLifecycle,
            })
          ) : (
            <Fragment />
          )}
        </li>
      );
    }),
  );
}
