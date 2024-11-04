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
import { Fragment, JSX, useState } from "react";
import { useRemoteConfig } from "@hooks/index";
import Image from "next/image";
import { DynamicIcon } from "@components/graphics";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui";
import { useQuery, useMutation } from "@tanstack/react-query";
import { StatusCode } from "@enums/StatusCode";
import { AssetsController } from "@controllers/index";
import { convertToThumbnailUrl } from "@lib/image_utils";
import RemoteConfigController from "@controllers/RemoteConfigController";
import { Button } from "@components/ui";

const assetsController = new AssetsController();
const remoteConfigController = new RemoteConfigController();

export default function GeneralSettingsPage(): JSX.Element {
  const { remoteConfig, dispatch } = useRemoteConfig();
  const [saveMessage, setSaveMessage] = useState("");

  const {
    data: imageLibrary,
    isLoading: imageLibraryLoading,
    refetch: fetchImageLibrary,
  } = useQuery({
    queryKey: ["imageLibrary"],
    enabled: false,
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

  const saveRemoteConfig = useMutation({
    mutationFn: async () => {
      const response =
        await remoteConfigController.changeRemoteConfig(remoteConfig);
      if (response.statusCode === StatusCode.SUCCESS) {
        setSaveMessage("Images saved successfully!");
      } else {
        setSaveMessage("Failed to save images.");
      }
    },
  });

  return (
    <div className={"min-h-screen w-full rounded-xl border bg-white px-4 py-5"}>
      <section className={"space-y-5"}>
        <h3 className={"text-2xl font-bold"}>Images</h3>
        <div className={"space-y-5"}>
          <h4 className={"font-xl font-semibold"}>Carousel</h4>
          <div
            className={"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"}
          >
            {remoteConfig.images.carousel.map((image, index) => (
              <div key={image.url} className={"relative"}>
                <Image
                  src={image.url}
                  alt={image.description}
                  width={500}
                  height={250}
                  placeholder={"blur"}
                  blurDataURL={convertToThumbnailUrl(image.url)}
                  className={"rounded-xl"}
                />
                <div className={"absolute right-0 top-0 z-10 p-2"}>
                  <div
                    className={
                      "flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/60 backdrop-blur"
                    }
                    onClick={() => {
                      const updatedImages = [...remoteConfig.images.carousel];
                      updatedImages.splice(index, 1);
                      dispatch({
                        type: "SET_CONFIG",
                        payload: {
                          config: {
                            ...remoteConfig,
                            images: {
                              ...remoteConfig.images,
                              carousel: updatedImages,
                            }
                          }
                        }
                      });
                    }}
                  >
                    <DynamicIcon icon={"XMarkIcon"} />
                  </div>
                </div>
              </div>
            ))}

            <Dialog>
              <DialogTrigger
                onClick={async () => {
                  await fetchImageLibrary();
                }}
              >
                <div
                  className={
                    "flex min-h-60 w-[22.4rem] cursor-pointer items-center justify-center rounded-xl bg-red-100"
                  }
                >
                  <div className={"rounded-full bg-red-300 p-4"}>
                    <DynamicIcon icon={"PlusIcon"} className={"text-red-800"} />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle asChild={true}>
                    <div className={"space-y-3"}>
                      <h1>Image Library</h1>
                      <p className={"text-xs text-gray-400"}>
                        Click on the image to add it.
                      </p>
                    </div>
                  </DialogTitle>
                  <DialogDescription
                    asChild={true}
                    className={"max-h-72 overflow-y-auto pt-10"}
                  >
                    {imageLibraryLoading ? (
                      <Fragment>Loading...</Fragment>
                    ) : imageLibrary !== null && imageLibrary !== undefined ? (
                      <div className={"grid grid-cols-3 gap-4"}>
                        {imageLibrary.map((image) => {
                          return (
                            <DialogClose
                              key={image}
                              onClick={() => {
                                dispatch({
                                  type: "SET_CONFIG",
                                  payload: {
                                    config: {
                                      ...remoteConfig,
                                      images: {
                                        ...remoteConfig.images,
                                        carousel: [
                                          ...remoteConfig.images.carousel,
                                          {
                                            url: image,
                                            description: "Image from Library"
                                          }
                                        ]
                                      }
                                    }
                                  }
                                });
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
          </div>
        </div>
      </section>

      <div className="mt-5 flex justify-end">
        <Button
          onClick={() => saveRemoteConfig.mutate()}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Save Images
        </Button>
      </div>

      {saveMessage && (
        <div className="mt-2 text-center text-green-600">{saveMessage}</div>
      )}
    </div>
  );
}
