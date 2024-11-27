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
import { cn } from "@lib/utils";
import { GeoMap } from "@dto/index";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@components/ui";

interface GeographicalMapProps {
  mapType: "world";
  viewBox: string;
  className?: string;
  highlight?: Array<string>;
  highlightColor?: string;
}

export default function GeographicalMap({
  mapType,
  viewBox,
  className,
  highlight = [],
  highlightColor = "#dc2626",
}: GeographicalMapProps): JSX.Element {
  const {
    data: geoMap,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`geographicalMap-${mapType}`],
    queryFn: async () => {
      const response = await fetch(
        `https://assets.puconvocation.com/maps/${mapType}.json`,
        {
          cache: "force-cache",
        },
      );
      return (await response.json()) as GeoMap[];
    },
  });

  if (geoMap === undefined || isError) {
    return <Fragment />;
  }

  if (isLoading) {
    return <Skeleton className={"h-full w-full"} />;
  }

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-72 w-full", className)}
    >
      {geoMap.map((map) => {
        if (typeof map.path === "string") {
          return (
            <path
              key={map.id}
              id={map.id}
              d={map.path}
              stroke="white"
              strokeWidth="0.5"
              fill={`${highlight?.includes(map.id) ? highlightColor : "#d4d4d4"}`}
            />
          );
        } else {
          return (
            <g key={map.id} id={map.id}>
              {map.path.map((subPath, index) => {
                return (
                  <path
                    key={`map.id${index}`}
                    d={subPath}
                    stroke="white"
                    strokeWidth="0.5"
                    fill={`${highlight?.includes(map.id) ? highlightColor : "#d4d4d4"}`}
                  />
                );
              })}
            </g>
          );
        }
      })}
    </svg>
  );
}
