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

import { Dispatch, Fragment, JSX, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatusCode } from "@enums/StatusCode";
import { AssetsController } from "@controllers/index";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FilePicker,
} from "@components/ui";
import Image from "next/image";

const assetsController = new AssetsController();

interface ImagePickerProps {
  showImagePicker: boolean;
  setShowImagePicker: Dispatch<SetStateAction<boolean>>;
  onImagePicked: (imageURL: string) => void;
}

export default function ImagePicker({
  onImagePicked,
  showImagePicker,
  setShowImagePicker,
}: Readonly<ImagePickerProps>): JSX.Element {
  const {
    data: imageLibrary,
    isLoading: imageLibraryLoading,
    refetch: fetchImageLibrary,
  } = useQuery({
    queryKey: ["imageLibrary"],
    enabled: true,
    queryFn: async () => {
      const response = await assetsController.getImages();
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        return response.payload;
      }
      return null;
    },
  });

  return (
    <Dialog
      open={showImagePicker}
      onOpenChange={async (open) => {
        setShowImagePicker(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild={true}>
            <div className={"space-y-3"}>
              <div className={"flex w-full justify-between"}>
                <h1>Image Library</h1>
                <div className={"relative flex-1 pr-10"}>
                  <div
                    className={
                      "absolute right-10 top-[-1rem] rounded-2xl bg-black px-3 py-2 text-xs text-white"
                    }
                  >
                    Upload
                  </div>
                  <FilePicker
                    allowedFileExtensions={".avif"}
                    onFilePicked={async (file) => {
                      if (file !== null) {
                        const response =
                          await assetsController.uploadImage(file);
                        if (response.statusCode === StatusCode.SUCCESS) {
                          await fetchImageLibrary();
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <p className={"text-xs text-gray-400"}>
                Click on the image to add it.
              </p>
            </div>
          </DialogTitle>
          <DialogDescription
            asChild={true}
            className={"max-h-72 w-full overflow-y-auto pt-10"}
          >
            {imageLibraryLoading ? (
              <Fragment>Loading...</Fragment>
            ) : imageLibrary !== null && imageLibrary !== undefined ? (
              <div className={"grid w-full grid-cols-3 gap-4"}>
                {imageLibrary.map((image) => {
                  return (
                    <DialogClose
                      key={image}
                      onClick={() => {
                        onImagePicked(image);
                      }}
                    >
                      <Image
                        src={image}
                        alt={"Image"}
                        width={200}
                        height={100}
                        className={"h-full w-full rounded-xl"}
                      />
                    </DialogClose>
                  );
                })}
              </div>
            ) : (
              <Fragment>Cannot load Images</Fragment>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
