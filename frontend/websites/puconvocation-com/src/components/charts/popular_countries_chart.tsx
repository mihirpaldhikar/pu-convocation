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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { WorldMapData } from "@constants/maps";
import { GeographicalMap } from "@components/graphics";
import { AnalyticsController } from "@controllers/index";
import { useQuery } from "@tanstack/react-query";
import { StatusCode } from "@enums/StatusCode";

const analyticsService = new AnalyticsController();

export default function PopularCountriesChart(): JSX.Element {
  const {
    data: popularCountries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["popularCountriesAnalytics"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await analyticsService.popularCountries();
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

  if (isLoading) {
    return <h1>Loading....</h1>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Countries</CardTitle>
        <CardDescription>
          Showing Top 5 most popular countries from which high traffic
          originates.
        </CardDescription>
        <CardContent>
          {popularCountries !== null && popularCountries !== undefined ? (
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
        </CardContent>
        <CardFooter>
          <div className={"flex w-full items-center justify-center space-x-3"}>
            {popularCountries?.map((country) => {
              return (
                <h6 key={country.key} className={"text-xs"}>
                  {country.key}: {country.count}
                </h6>
              );
            })}
          </div>
        </CardFooter>
      </CardHeader>
    </Card>
  );
}
