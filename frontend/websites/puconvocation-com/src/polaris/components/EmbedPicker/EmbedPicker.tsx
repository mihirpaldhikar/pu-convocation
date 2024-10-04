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
import { DeleteIcon } from "../../assets";
import RootContext from "../../contexts/RootContext/RootContext";
import { InputDialog } from "../InputDialog";
import { getBlockNode } from "../../utils";
import { type BlockSchema, type Coordinates } from "../../interfaces";

interface EmbedPickerProps {
  id: string;
  message: string;
  icon: JSX.Element;
  listMetadata?: {
    parent: BlockSchema;
    currentIndex: number;
  };
  regex: RegExp;
  onEmbedPicked: (url: string) => void;
  onDelete: () => void;
}

export default function EmbedPicker({
  id,
  message,
  icon,
  regex,
  onEmbedPicked,
  listMetadata,
  onDelete,
}: EmbedPickerProps): JSX.Element {
  const { dialogRoot } = useContext(RootContext);
  return (
    <div
      id={id}
      data-parent-block-id={
        listMetadata === undefined ? null : listMetadata.parent.id
      }
      data-child-block-index={
        listMetadata === undefined ? null : listMetadata.currentIndex
      }
      className={
        "relative h-14 block my-2 w-full cursor-pointer rounded-md border border-gray-300 bg-gray-50"
      }
      onClick={() => {
        if (dialogRoot === undefined) return;

        const currentNode = getBlockNode(id) as HTMLElement;
        const coordinates: Coordinates = {
          x: window.innerWidth > 500 ? window.innerWidth / 2 : 30,
          y: currentNode.getBoundingClientRect().y,
        };

        dialogRoot.render(
          <InputDialog
            coordinates={coordinates}
            active={false}
            inputArgs={{
              type: "text",
              hint: "Add Link...",
              payload: "",
              regex,
            }}
            onConfirm={(data) => {
              onEmbedPicked(data);
            }}
            onClose={() => {
              dialogRoot.render(<Fragment />);
            }}
          />,
        );
      }}
    >
      <span
        className={
          "absolute right-0 top-0 flex w-fit justify-start px-2 py-1 text-sm text-red-600"
        }
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
      >
        <DeleteIcon size={20} color={"red"} />
      </span>
      <div
        className={
          "flex space-x-3 h-full w-full text-gray-500 items-center justify-center"
        }
      >
        {icon}
        <span className={"font-medium text-sm"}>{message}</span>
      </div>
    </div>
  );
}
