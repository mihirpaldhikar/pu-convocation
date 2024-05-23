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
import Image from "next/image";
import { Button, Input } from "@components/ui";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { about } from "@public/assets";
import ConvocationSvg from "@components/convocation";
import AboutCircleSvg from "@components/aboutCircle";
import GallerySvg from "@components/gallery";

export default function Home() {
  const [identifier, setIdentifier] = useState<string>("");
  const router = useRouter();

  return (
    <section className={"min-h-dvh "}>
      {/*HERO SECTION*/}
      <div className={"min-h-[25vh] md:min-h-dvh"}>
        <div className={"relative z-0 h-[25vh] md:min-h-dvh"}>
          <Image
            alt={"Graduating Students"}
            src={"https://assets.puconvocation.com/images/hero.png"}
            fill={true}
            priority={true}
            fetchPriority={"high"}
          />
        </div>
        <div
          className={
            "absolute inset-0 z-10 h-[25vh] pt-16 text-white md:min-h-dvh"
          }
        >
          <div className="flex h-full flex-col items-center justify-center space-y-3 pt-20 md:space-y-5 md:pt-0">
            <h5 className={"text-2xl font-bold md:text-5xl"}>
              Welcome{" "}
              <span className={"text-lg font-medium md:text-2xl"}>to the</span>
            </h5>
            <div className={"flex items-center space-x-3 md:space-x-5"}>
              <h1 className={"text-4xl font-black md:text-7xl"}>PU</h1>
              <ConvocationSvg />
            </div>
            <form
              className="flex w-full flex-col items-center justify-center space-x-4 space-y-3 px-16 pt-5 md:flex-row md:space-y-0 md:px-0"
              onSubmit={(event) => {
                event.preventDefault();
                if (identifier.length !== 0) {
                  router.push(`/attendee/${identifier.toUpperCase()}`);
                }
              }}
            >
              <Input
                className={
                  "w-full rounded-full bg-white font-medium text-black md:w-1/5"
                }
                name={"identifier"}
                type={"text"}
                value={identifier}
                placeholder={"Enter Enrollment or Convocation No."}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                }}
              />
              <Button type={"submit"} className={"space-x-3 rounded-full"}>
                <h5 className={"font-bold"}>Find your Seat</h5>
                <ChevronRightIcon className={"w-5"} />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/*GALLERY*/}
      <div className="bg-[#f5f5f5]">
        <div className="flex w-full ">
          <GallerySvg />
        </div>
        <div className="mt-10 flex items-center justify-center ">
          <Carousel
            infiniteLoop
            swipeable
            autoPlay={true}
            emulateTouch
            showArrows={false}
            showStatus={false}
            showThumbs={false}
            showIndicators={true}
            className="w-4/5 "
          >
            <div className="grid grid-cols-2 place-items-center gap-8 overflow-hidden text-white md:grid-cols-1">
              <Image
                height={1000}
                width={1500}
                className="rounded-[25px]"
                src="https://storage.googleapis.com/puconvocation-assets-storage-bucket/images/DSC01509-min.jpg"
                alt="PIC1"
              />
            </div>
            <div className="grid grid-cols-2 place-items-center gap-8 overflow-hidden text-white md:grid-cols-1">
              <Image
                height={1000}
                width={1500}
                className="rounded-[25px]"
                src="https://storage.googleapis.com/puconvocation-assets-storage-bucket/images/IMG_9342-min.jpg"
                alt="PIC1"
              />
            </div>
            <div className="grid grid-cols-2 place-items-center gap-8 overflow-hidden text-white md:grid-cols-1">
              <Image
                height={1000}
                width={1500}
                className="rounded-[25px]"
                src="https://storage.googleapis.com/puconvocation-assets-storage-bucket/images/c1-min.png"
                alt="PIC1"
              />
            </div>
            <div className="grid grid-cols-2 place-items-center gap-8 overflow-hidden text-white md:grid-cols-1">
              <Image
                height={1000}
                width={1500}
                className="rounded-[25px]"
                src="https://storage.googleapis.com/puconvocation-assets-storage-bucket/images/Rectangle%204447-min.png"
                alt="PIC1"
              />
            </div>
          </Carousel>
        </div>
      </div>

      {/* ABOUT US */}
      <div className="bg-[#f5f5f5] pt-10">
        <div className="text-center text-[40px] font-semibold text-black">
          7th Convocation
        </div>
        <div className=" flex items-start justify-center pt-20">
          <div className="relative flex-1 space-y-20 px-8 pb-4">
            <div className="absolute left-0 top-0">
              <AboutCircleSvg />
            </div>
            <div className="relative text-[40px] font-bold text-black">
              About Us
            </div>
            <div className="relative space-y-10">
              <div className="text-[18px]">
                A multidisciplinary destination of learning and innovation,
                propelling quality in higher education with a record of being
                India's youngest private university to receive NAAC A++
                accreditation in the first cycle. Situated in Vadodara, Gujarat,
                Parul University, is an embodiment of the nation's essence of
                cultural heritage blended with modern innovations and academic
                practices for student enrichment, while fostering national and
                global development.
              </div>
              <Button
                type={"submit"}
                className={"w-1/4 space-x-3 rounded-full py-4"}
              >
                <h5 className={"text-[#F5F5F5] "}>Know More</h5>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <Image
              src={about}
              alt="About"
              width={1000}
              height={1000}
              className="w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
