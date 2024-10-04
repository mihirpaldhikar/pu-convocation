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
import { DeleteIcon } from "../../assets";
import { type BlockSchema } from "../../interfaces";

interface FilePickerProps {
  id: string;
  listMetadata?: {
    parent: BlockSchema;
    currentIndex: number;
  };
  message: string;
  accept: string;
  fileIcon: JSX.Element;
  onFilePicked: (file: File) => void;
  onDelete: () => void;
}

export default function FilePicker({
  id,
  listMetadata,
  message,
  fileIcon,
  accept,
  onFilePicked,
  onDelete,
}: FilePickerProps): JSX.Element {
  return (
    <div
      id={id}
      className={
        "relative h-14 block my-2 w-full cursor-pointer rounded-md border border-gray-300 bg-gray-50"
      }
      data-parent-block-id={
        listMetadata === undefined ? null : listMetadata.parent.id
      }
      data-child-block-index={
        listMetadata === undefined ? null : listMetadata.currentIndex
      }
    >
      <input
        id={`filePicker-${id}`}
        className={
          "filePicker block absolute h-full w-full cursor-pointer select-none"
        }
        type={"file"}
        accept={accept}
        onChange={() => {
          const filePicker = document.getElementById(
            `filePicker-${id}`,
          ) as HTMLInputElement;
          if (filePicker.files !== null) {
            onFilePicked(filePicker.files[0]);
          }
        }}
      />
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
          "flex h-full w-full text-gray-500 items-center justify-center"
        }
      >
        {fileIcon}
        <span className={"font-medium text-sm"}>{message}</span>
      </div>
    </div>
  );
}
