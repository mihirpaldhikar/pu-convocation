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

import { JSX } from "react";
import { WorldMapData } from "@constants/maps";
import { GeographicalMap } from "@components/graphics";
import { Popular } from "@dto/analytics";

interface PopularCountriesChartProps {
  analytics: Popular[];
  showLegends?: boolean;
}

export default async function PopularCountriesChart({
  showLegends = true,
  analytics,
}: Readonly<PopularCountriesChartProps>): Promise<JSX.Element> {
  return (
    <div className={"space-y-5"}>
      <GeographicalMap
        geoMap={WorldMapData}
        viewBox={"0 0 1011 667"}
        className={"h-64"}
        highlight={analytics
          .filter((country) => country.count > 0)
          .map((country) => country.key)}
      />
      <div
        className={`${showLegends ? "flex" : "hidden"} w-full items-center justify-center space-x-3`}
      >
        {analytics.map((country) => {
          return (
            <h6 key={country.key} className={"text-xs"}>
              {country.key}: {country.count}
            </h6>
          );
        })}
      </div>
    </div>
  );
}
