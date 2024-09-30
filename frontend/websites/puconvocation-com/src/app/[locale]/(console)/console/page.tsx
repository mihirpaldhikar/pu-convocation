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
import { Fragment, JSX } from "react";
import { useAuth } from "@hooks/index";
import { useQuery } from "@tanstack/react-query";
import { useRouter, Link } from "@i18n/routing";
import { Button } from "@components/ui";
import { GeographicalMap } from "@components/index";
import { TrafficOnDateChart } from "@components/index";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { StatusCode } from "@enums/StatusCode";
import { WorldMapData } from "@constants/maps";
import AnalyticsService from "@services/AnalyticsService";
import { AttendeeService } from "@services/index";

const analyticsService = new AnalyticsService();
const attendeeService = new AttendeeService();

// Spinner 
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-3 border-b-3 border-red-600"></div>
  </div>
);

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
      const response = await attendeeService.getAllAttendees(0, 10);
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

  return (
    <div className="bg-white-300 flex min-h-screen flex-col space-y-10 p-20">
      {/* Analytics Section */}
      {state.account?.iamRoles.includes("read:Analytics") ? (
        <div className="analytics-section">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Analytics</h2>
            <Button className="bg-red-600 font-semibold hover:bg-red-700" asChild>
              <Link href={`/console/analytics`}>View All</Link>
            </Button>
          </div>
  
          <div className="cards grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            {/* Demographics Card */}
            <Card className="p-2 shadow-none max-h-[300px] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-600">Demographics</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 h-full">
                {isLoading ? (
                  <Spinner />
                ) : isError ? (
                  <p className="text-red-600">Error loading data</p>
                ) : (
                  <GeographicalMap
                    geoMap={WorldMapData}
                    viewBox={"0 0 1011 667"}
                    className={"h-56"} 
                    highlight={
                      popularCountries
                        ?.filter((country: { count: number }) => country.count > 0)
                        .map((country: { key: any }) => country.key) ?? []
                    }
                  />
                )}
              </CardContent>
            </Card>
  
            {/* Traffic Card */}
            <Card className="p-2 shadow-none max-h-[300px] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-600">Traffic</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 h-full">
                {isLoading ? (
                  <Spinner />
                ) : isError ? (
                  <p className="text-red-600">Error loading data</p>
                ) : (
                  <TrafficOnDateChart showText={false} showShadowAndBorder={false} />
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
  
        <div className="attendees-list mb-4 rounded-t-2xl border border-gray-300 bg-white p-4">
          <div className="relative mb-4 flex items-center">
            <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search Attendees..."
              className="w-1/4 rounded-lg bg-gray-100 p-2 pl-10"
            />
          </div>
  
          <div className="h-64 overflow-y-auto">
            {isAttendeeLoading ? (
              <Spinner />
            ) : attendeeError ? (
              <p className="text-red-600">Error loading attendees</p>
            ) : attendees !== null && attendees.length > 0 ? (
              <Fragment>
                {attendees.map((a) => {
                  return <h1 key={a.id}>{a.studentName}</h1>;
                })}
              </Fragment>
            ) : (
              <p>No attendees found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}

