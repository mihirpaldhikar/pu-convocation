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

import {JSX} from "react";
import {GeoMap} from "@dto/index";
import {cn} from "@lib/utils";

interface GeographicalMapProps {
  geoMap: Array<GeoMap>;
  viewBox: string;
  className?: string;
  highlight?: Array<string>;
  highlightColor?: string;
}

export default function GeographicalMap({
  geoMap,
  viewBox,
  className,
  highlight = [],
  highlightColor = "#dc2626",
}: GeographicalMapProps): JSX.Element {
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
