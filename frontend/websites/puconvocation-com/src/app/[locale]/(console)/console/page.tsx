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
import { useAuth } from "@hooks/index";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@i18n/routing";
import { Button } from "@components/ui";
import {
  GeographicalMap,
  ProgressBar,
  TrafficOnDateChart,
} from "@components/index";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { StatusCode } from "@enums/StatusCode";
import { WorldMapData } from "@constants/maps";
import { AnalyticsController, AttendeeController } from "@controllers/index";

const analyticsController = new AnalyticsController();
const attendeeController = new AttendeeController();

export default function ConsolePage(): JSX.Element {
  const router = useRouter();
  const { state } = useAuth();

  const {
    data: attendees,
    isLoading: isAttendeeLoading,
    isError: attendeeError,
  } = useQuery({
    queryKey: ["homeAttendeesList"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await attendeeController.getAllAttendees(0, 10);
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        return response.payload.attendees;
      }
      return null;
    },
  });

  const {
    data: popularCountries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["popularCountriesAnalytics"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await analyticsController.popularCountries();
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

  return (
    <div className="bg-white-300 flex min-h-screen flex-col space-y-10 p-20">
      {/* Analytics Section */}
      {state.account?.iamRoles.includes("read:Analytics") ? (
        <div className="analytics-section">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Analytics</h2>
            <Button
              className="bg-red-600 font-semibold hover:bg-red-700"
              asChild
            >
              <Link href={`/console/analytics`}>View All</Link>
            </Button>
          </div>

          <div className="cards mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Demographics Card */}
            <Card className="max-h-[300px] overflow-hidden border border-gray-300 p-2 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-600">Demographics</CardTitle>
              </CardHeader>
              <CardContent className="h-full pt-2">
                {isLoading ? (
                  <ProgressBar type="circular" />
                ) : isError ? (
                  <p className="text-red-600">Error loading data</p>
                ) : (
                  <GeographicalMap
                    geoMap={WorldMapData}
                    viewBox={"0 0 1011 667"}
                    className={"h-56"}
                    highlight={
                      popularCountries
                        ?.filter(
                          (country: { count: number }) => country.count > 0,
                        )
                        .map((country: { key: any }) => country.key) ?? []
                    }
                  />
                )}
              </CardContent>
            </Card>

            {/* Traffic Card */}
            <Card className="max-h-[300px] overflow-hidden border border-gray-300 p-2 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-600">Traffic</CardTitle>
              </CardHeader>
              <CardContent className="h-full pt-2">
                {isLoading ? (
                  <ProgressBar type="circular" />
                ) : isError ? (
                  <p className="text-red-600">Error loading data</p>
                ) : (
                  <TrafficOnDateChart
                    showText={false}
                    showShadowAndBorder={false}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Fragment />
      )}

      {/* Attendees Section */}
      <div className="attendees-section">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Attendees</h2>
          <Button className="bg-red-600 font-semibold hover:bg-red-700" asChild>
            <Link href={`/console/attendees`}>View All</Link>
          </Button>
        </div>

        <div className="attendees-list mb-4 rounded-t-2xl border border-gray-300 bg-white">
          <div className="ml-2 mt-2 p-4">
            <div className="relative mb-4 flex items-center">
              <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search Attendees..."
                className="w-1/4 rounded-lg bg-gray-100 p-2 pl-10"
              />
            </div>
          </div>
          <div className="h-64 overflow-y-auto">
            <div className="mb-2 border-b border-gray-300" />

            {isAttendeeLoading ? (
              <ProgressBar type="circular" />
            ) : attendeeError ? (
              <p className="text-red-600">Error loading attendees</p>
            ) : attendees !== null && attendees.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                      Convocation Id
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                      Enclosure
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                      Row
                    </th>
                    <th className="w-1/ px-4 py-2 text-center font-semibold text-gray-700">
                      Seat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((a) => (
                    <tr
                      key={a.convocationId}
                      className="border-b text-center transition-colors duration-200 hover:bg-gray-100"
                    >
                      <td className="px-4 py-2">{a.convocationId}</td>
                      <td className="px-4 py-2">{a.studentName}</td>
                      <td className="px-4 py-2">{a.allocation.enclosure}</td>
                      <td className="px-4 py-2">{a.allocation.row}</td>
                      <td className="px-4 py-2">{a.allocation.seat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No attendees found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
