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

import { Fragment, type JSX, useContext } from "react";
import { conditionalClassName, getBlockNode, getEditorRoot, setNodeStyle } from "../../utils";
import { type Action, type Attachment, type BlockSchema, type Coordinates } from "../../interfaces";
import RootContext from "../../contexts/RootContext/RootContext";
import { MoreOptionsIcon } from "../../assets";
import { ContextMenu } from "../../components/ContextMenu";

interface AttachmentHolderProps {
  children: JSX.Element;
  parentBlock?: BlockSchema;
  block: BlockSchema;
  actions: readonly Action[];
  onDelete: () => void;
  onChange: (block: BlockSchema) => void;
}

export default function AttachmentHolder({
  block,
  children,
  actions,
  onDelete,
  onChange,
}: AttachmentHolderProps): JSX.Element {
  const { popUpRoot, dialogRoot } = useContext(RootContext);
  const { config } = useContext(RootContext);

  return (
    <div
      className={`w-full`}
      style={{
        paddingTop: `${config.block.attachment.spacing}rem`,
        paddingBottom: `${config.block.attachment.spacing}rem`,
        ...setNodeStyle(block.style),
      }}
    >
      <div
        className={conditionalClassName(
          "relative",
          (block.data as Attachment).url.startsWith("https://gist.github.com/")
            ? "w-full block"
            : "w-fit inline-block",
        )}
      >
        {children}
        <div
          className={
            "absolute right-0 top-0 m-1 flex w-fit cursor-pointer items-center justify-end rounded-md border border-gray-300 bg-white/60 backdrop-blur"
          }
        >
          <div
            onClick={() => {
              const currentNode = getBlockNode(block.id) as HTMLElement;
              const coordinates: Coordinates = {
                y: currentNode.getBoundingClientRect().y,
                x:
                  window.innerWidth > 500
                    ? currentNode.getBoundingClientRect().right
                    : 30,
              };

              if (popUpRoot !== undefined && dialogRoot !== undefined) {
                const editorRoot = getEditorRoot();
                editorRoot.addEventListener(
                  "click",
                  () => {
                    popUpRoot.render(<Fragment />);
                    dialogRoot.render(<Fragment />);
                  },
                  {
                    once: true,
                  },
                );
                popUpRoot.render(
                  <ContextMenu
                    coordinates={coordinates}
                    menu={actions}
                    onClick={(execute) => {
                      if (execute.type === "blockFunction") {
                        execute.args(
                          block,
                          onChange,
                          onDelete,
                          popUpRoot,
                          dialogRoot,
                        );
                      }
                    }}
                    onClose={() => {
                      popUpRoot.render(<Fragment />);
                    }}
                  />,
                );
              }
            }}
          >
            <MoreOptionsIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
