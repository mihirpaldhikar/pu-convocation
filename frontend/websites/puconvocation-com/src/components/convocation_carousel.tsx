/*
 * Copyright (c) PU Convocation Management System Authors
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
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const carouselImages: Array<{
  url: string;
  alt: string;
}> = [
  {
    url: "https://assets.puconvocation.com/carousel/1.png",
    alt: "Parul University Convocation",
  },
  {
    url: "https://assets.puconvocation.com/carousel/2.png",
    alt: "Parul University Convocation",
  },
  {
    url: "https://assets.puconvocation.com/carousel/3.png",
    alt: "Parul University Convocation",
  },
  {
    url: "https://assets.puconvocation.com/carousel/4.png",
    alt: "Parul University Convocation",
  },
  {
    url: "https://assets.puconvocation.com/carousel/5.png",
    alt: "Parul University Convocation",
  },
];

export default function ConvocationCarousel(): JSX.Element {
  return (
    <Carousel
      infiniteLoop
      swipeable
      autoPlay={true}
      showArrows={false}
      showStatus={false}
      showThumbs={false}
      showIndicators={true}
      dynamicHeight={true}
      className="w-full rounded-lg md:w-3/4 md:rounded-2xl"
    >
      {carouselImages.map((image, index) => {
        return (
          <div key={index}>
            <Image
              height={1000}
              width={1500}
              className="rounded-lg md:rounded-2xl"
              src={image.url}
              alt={image.alt}
              priority={true}
            />
          </div>
        );
      })}
    </Carousel>
  );
}
