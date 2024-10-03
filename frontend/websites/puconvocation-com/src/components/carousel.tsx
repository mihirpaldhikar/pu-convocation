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

import { JSX, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@components/ui";

interface CarouselProps {
  autoPlay?: boolean;
  interval?: number;
  width: number;
  height: number;
  images: Array<{
    url: string;
    description: string;
  }>;
}

export default function Carousel({
  autoPlay = true,
  interval = 5000,
  width,
  height,
  images,
}: Readonly<CarouselProps>): JSX.Element {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (autoPlay) {
      intervalId = setInterval(() => {
        setImageIndex((imageIndex + 1) % images.length);
      }, interval);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [autoPlay, imageIndex, images, interval]);

  return (
    <div className={"relative h-full w-full"}>
      <div
        className={
          "flex h-full w-full flex-shrink-0 flex-grow-0 overflow-hidden"
        }
      >
        {images.map((image) => {
          return (
            <Image
              key={image.url}
              src={image.url}
              alt={image.description}
              width={width}
              height={height}
              className={`block h-full w-full rounded-lg object-cover`}
              style={{
                translate: `${-100 * imageIndex}%`,
                transition: "translate 300ms ease-in-out",
              }}
            />
          );
        })}
      </div>
      <div
        className={
          "absolute bottom-0 left-0 top-0 flex items-center justify-center p-2"
        }
      >
        <Button
          aria-label="Previous Slide"
          size={"icon"}
          className={
            "rounded-full bg-red-100/80 text-black backdrop-blur-lg hover:bg-red-100"
          }
          onClick={() => {
            if (imageIndex == 0) {
              setImageIndex(images.length - 1);
            } else {
              setImageIndex((imageIndex - 1) % images.length);
            }
          }}
        >
          <ChevronLeftIcon className={"size-7"} />
        </Button>
      </div>

      <div
        className={
          "absolute bottom-0 right-0 top-0 flex items-center justify-center p-2"
        }
      >
        <Button
          aria-label="Next Slide"
          size={"icon"}
          className={
            "rounded-full bg-red-100/80 text-black backdrop-blur-lg hover:bg-red-100"
          }
          onClick={() => {
            setImageIndex((currentIndex) => (currentIndex + 1) % images.length);
          }}
        >
          <ChevronRightIcon className={"size-7"} />
        </Button>
      </div>
      <div
        className={
          "absolute flex space-x-3 rounded-full bg-white/70 px-4 py-1 backdrop-blur-lg"
        }
        style={{
          translate: "-50%",
          left: "50%",
          bottom: "0.8rem",
        }}
      >
        {images.map((image, index) => {
          return (
            <Button
              aria-label={`Slide ${index + 1}`}
              key={image.url}
              size={"icon"}
              className={`size-3 rounded-full ${index === imageIndex ? "bg-red-600" : "bg-gray-400/70"}`}
              onClick={() => {
                setImageIndex(index);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
