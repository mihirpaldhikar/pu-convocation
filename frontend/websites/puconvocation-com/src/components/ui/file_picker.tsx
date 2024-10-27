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

"use client";

import { JSX } from "react";

interface FilePickerProps {
  allowedFileExtensions: string;
  onFilePicked: (file: File | null) => void;
}

export default function FilePicker({
  allowedFileExtensions,
  onFilePicked,
}: Readonly<FilePickerProps>): JSX.Element {
  return (
    <div className={"h-full w-full"}>
      <input
        type={"file"}
        className={"h-full w-full opacity-0"}
        accept={allowedFileExtensions}
        onChange={(state) => {
          if (state.target.files!.length !== 0) {
            const reader = new FileReader();
            reader.onload = function () {
              onFilePicked(state.target.files![0]);
            };
            reader.readAsDataURL(state.target.files![0]);
          } else {
            onFilePicked(null);
          }
        }}
      />
    </div>
  );
}
