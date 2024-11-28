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
import { Fragment, JSX, useEffect, useState } from "react";
import { useAuth, useRemoteConfig } from "@hooks/index";
import Image from "next/image";
import { convertToThumbnailUrl } from "@lib/image_utils";
import { ImagePicker } from "@components/common";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui";
import {
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { isAuthorized } from "@lib/iam_utils";
import IAMPolicies from "@configs/IAMPolicies";
import { Switch } from "@components/ui/switch";
import { Calendar } from "@components/ui/calendar";
import { RemoteConfigController } from "@controllers/index";

const remoteConfigController = new RemoteConfigController();

export default function GeneralSettingsPage(): JSX.Element {
  const { account } = useAuth();
  const { remoteConfig, dispatch } = useRemoteConfig();
  const [save, setSave] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImageSection, setSelectedImageSection] = useState<
    "carousel" | "hero" | null
  >(null);

  useEffect(() => {
    remoteConfigController.changeRemoteConfig(remoteConfig).then();
  }, [remoteConfig, save]);

  return (
    <Fragment>
      <ImagePicker
        showImagePicker={showImagePicker}
        setShowImagePicker={setShowImagePicker}
        onImagePicked={(imageURL) => {
          switch (selectedImageSection) {
            case "carousel": {
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
                          url: imageURL,
                          description: "Image from Library",
                        },
                      ],
                    },
                  },
                },
              });
              break;
            }
            case "hero": {
              dispatch({
                type: "SET_CONFIG",
                payload: {
                  config: {
                    ...remoteConfig,
                    images: {
                      ...remoteConfig.images,
                      hero: {
                        ...remoteConfig.images.hero,
                        url: imageURL,
                      },
                    },
                  },
                },
              });
              break;
            }
          }
          setSave(!save);
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Set the preferences for home page.</CardDescription>
        </CardHeader>
        <CardContent className={"space-y-10"}>
          <div className={"space-y-5"}>
            <div className={"flex items-center justify-between"}>
              <div>
                <h6 className={"font-medium"}>Show Countdown</h6>
                <p className={"text-xs text-gray-600"}>
                  If enabled, a countdown will be shown instead of default home
                  page.
                </p>
              </div>
              <Switch
                checked={remoteConfig.countdown.show}
                onCheckedChange={(checked: boolean) => {
                  dispatch({
                    type: "SET_CONFIG",
                    payload: {
                      config: {
                        ...remoteConfig,
                        countdown: {
                          ...remoteConfig.countdown,
                          show: checked,
                        },
                      },
                    },
                  });
                  setSave(!save);
                }}
              />
            </div>
            <div hidden={!remoteConfig.countdown.show} className={"space-y-3"}>
              <h6 className={"font-medium"}>Select Convocation Date</h6>
              <Calendar
                mode={"single"}
                className={"w-fit rounded-xl border"}
                selected={new Date(remoteConfig.countdown.endTime)}
                onSelect={(date) => {
                  if (date !== undefined) {
                    dispatch({
                      type: "SET_CONFIG",
                      payload: {
                        config: {
                          ...remoteConfig,
                          countdown: {
                            ...remoteConfig.countdown,
                            endTime: date.getTime(),
                          },
                        },
                      },
                    });
                    setSave(!save);
                  }
                }}
              />
            </div>
          </div>
          <hr />
          <div className={"flex items-center justify-between"}>
            <div>
              <h6 className={"font-medium"}>Show Instructions Banner</h6>
              <p className={"text-xs text-gray-600"}>
                If enabled, a Instructions banner will be displayed in home and
                attendee page.
              </p>
            </div>
            <Switch
              checked={remoteConfig.instructions.show}
              onCheckedChange={(checked: boolean) => {
                dispatch({
                  type: "SET_CONFIG",
                  payload: {
                    config: {
                      ...remoteConfig,
                      instructions: {
                        ...remoteConfig.instructions,
                        show: checked,
                      },
                    },
                  },
                });
                setSave(!save);
              }}
            />
          </div>
        </CardContent>
        <hr />
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>
            Customize images shown on the home page.
          </CardDescription>
        </CardHeader>
        <CardContent className={"space-y-10"}>
          <section className={"space-y-5"}>
            <div className={"space-y-5"}>
              <h6>Hero Image</h6>
              <div className={"w-full"}>
                <div className={"relative w-full"}>
                  <Image
                    src={remoteConfig.images.hero.url}
                    alt={remoteConfig.images.hero.description}
                    width={500}
                    height={250}
                    placeholder={"blur"}
                    blurDataURL={convertToThumbnailUrl(
                      remoteConfig.images.hero.url,
                    )}
                    className={"w-full rounded-xl"}
                  />
                  {isAuthorized(
                    IAMPolicies.WRITE_REMOTE_CONFIG,
                    account!!.assignedIAMPolicies,
                  ) ? (
                    <div className={"absolute right-0 top-0 z-10 p-2"}>
                      <div
                        className={
                          "flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/60 backdrop-blur"
                        }
                        onClick={() => {
                          setShowImagePicker(true);
                          setSelectedImageSection("hero");
                        }}
                      >
                        <ArrowPathIcon className={"size-5"} />
                      </div>
                    </div>
                  ) : (
                    <Fragment />
                  )}
                </div>
              </div>
            </div>
          </section>
          <section className={"space-y-5"}>
            <div className={"space-y-5"}>
              <h6>Carousel</h6>
              <div
                className={
                  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                }
              >
                {remoteConfig.images.carousel.map((image, index) => {
                  return (
                    <div
                      key={image.url.concat(Math.random().toString())}
                      className={"relative"}
                    >
                      <Image
                        src={image.url}
                        alt={image.description}
                        width={500}
                        height={250}
                        placeholder={"blur"}
                        blurDataURL={convertToThumbnailUrl(image.url)}
                        className={"rounded-xl"}
                      />
                      {isAuthorized(
                        IAMPolicies.WRITE_REMOTE_CONFIG,
                        account!!.assignedIAMPolicies,
                      ) ? (
                        <div className={"absolute right-0 top-0 z-10 p-2"}>
                          <div
                            className={
                              "flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/60 backdrop-blur"
                            }
                            onClick={() => {
                              const x = remoteConfig.images.carousel;
                              x.splice(index, 1);
                              dispatch({
                                type: "SET_CONFIG",
                                payload: {
                                  config: {
                                    ...remoteConfig,
                                    images: {
                                      ...remoteConfig.images,
                                      carousel: [...x],
                                    },
                                  },
                                },
                              });
                              setSave(!save);
                            }}
                          >
                            <XMarkIcon className={"size-5"} />
                          </div>
                        </div>
                      ) : (
                        <Fragment />
                      )}
                    </div>
                  );
                })}

                {isAuthorized(
                  IAMPolicies.WRITE_REMOTE_CONFIG,
                  account!!.assignedIAMPolicies,
                ) ? (
                  <div
                    className={
                      "flex min-h-60 w-[22.4rem] cursor-pointer items-center justify-center rounded-xl bg-red-100"
                    }
                    onClick={() => {
                      setSelectedImageSection("carousel");
                      setShowImagePicker(true);
                    }}
                  >
                    <div className={"rounded-full bg-red-300 p-4"}>
                      <PlusIcon className={"size-5 text-red-800"} />
                    </div>
                  </div>
                ) : (
                  <Fragment />
                )}
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </Fragment>
  );
}
