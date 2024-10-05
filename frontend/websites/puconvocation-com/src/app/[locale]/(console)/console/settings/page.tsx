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
import { Fragment, JSX } from "react";
import { useRemoteConfig } from "@hooks/index";
import Image from "next/image";
import { DynamicIcon } from "@components/index";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui";
import { useQuery } from "@tanstack/react-query";
import { StatusCode } from "@enums/StatusCode";
import { AssetsController } from "@controllers/index";

const assetsController = new AssetsController();

export default function GeneralSettingsPage(): JSX.Element {
  const {
    state: { config },
    dispatch,
  } = useRemoteConfig();

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

  if (config === null) {
    return <Fragment />;
  }

  return (
    <div className={"min-h-screen w-full rounded-xl border bg-white px-4 py-5"}>
      <section className={"space-y-5"}>
        <h3 className={"text-2xl font-bold"}>Images</h3>
        <div className={"space-y-5"}>
          <h4 className={"font-xl font-semibold"}>Carousel</h4>
          <div
            className={"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"}
          >
            {config.images.carousel.map((image, index) => {
              return (
                <div key={image.url} className={"relative"}>
                  <Image
                    src={image.url}
                    alt={image.description}
                    width={500}
                    height={250}
                    className={"rounded-xl"}
                  />
                  <div className={"absolute right-0 top-0 z-10 p-2"}>
                    <div
                      className={
                        "flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/60 backdrop-blur"
                      }
                      onClick={() => {
                        const x = config?.images.carousel;
                        x.splice(index, 1);
                        dispatch({
                          type: "SET_CONFIG",
                          payload: {
                            config: {
                              ...config,
                              images: {
                                ...config.images,
                                carousel: [...x],
                              },
                            },
                          },
                        });
                      }}
                    >
                      <DynamicIcon icon={"XMarkIcon"} />
                    </div>
                  </div>
                </div>
              );
            })}

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
                        {imageLibrary.map((image, index) => {
                          return (
                            <DialogClose
                              key={image}
                              onClick={() => {
                                dispatch({
                                  type: "SET_CONFIG",
                                  payload: {
                                    config: {
                                      ...config,
                                      images: {
                                        ...config.images,
                                        carousel: [
                                          ...config.images.carousel,
                                          {
                                            url: image,
                                            description: "Image from Library",
                                          },
                                        ],
                                      },
                                    },
                                  },
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
    </div>
  );
}
