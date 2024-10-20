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
import { Fragment, JSX } from "react";
import { WorldMapData } from "@constants/maps";
import { GeographicalMap } from "@components/graphics";
import { AnalyticsController } from "@controllers/index";
import { StatusCode } from "@enums/StatusCode";
import { cookies } from "next/headers";

interface PopularCountriesChartProps {
  showLegends?: boolean;
}

export default async function PopularCountriesChart({
  showLegends = true,
}: Readonly<PopularCountriesChartProps>): Promise<JSX.Element> {
  const analyticsService = new AnalyticsController({
    cookies: cookies().toString(),
  });

  const response = await analyticsService.popularCountries();

  const popularCountries =
    response.statusCode === StatusCode.SUCCESS &&
    "payload" in response &&
    typeof response.payload === "object"
      ? response.payload
      : null;

  return (
    <div className={"space-y-5"}>
      {popularCountries !== null ? (
        <GeographicalMap
          geoMap={WorldMapData}
          viewBox={"0 0 1011 667"}
          className={"h-64"}
          highlight={popularCountries
            .filter((country) => country.count > 0)
            .map((country) => country.key)}
        />
      ) : (
        <Fragment></Fragment>
      )}
      <div
        className={`${showLegends ? "flex" : "hidden"} w-full items-center justify-center space-x-3`}
      >
        {popularCountries?.map((country) => {
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
