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
import {
  ProgressBar,
} from "@components/index";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { StatusCode } from "@enums/StatusCode";

export default function ConsolePage(): JSX.Element {
  const router = useRouter();
  const {
    state: { account, authService },
    dispatch: dispatchAccountMutation,
  } = useAuth();

  const { isLoading: isAccountLoading, isError: isAccountError } = useQuery({
    queryKey: ["currentAccount"],
    refetchOnWindowFocus: "always",
    queryFn: async () => {
      const response = await authService.getCurrentAccount();
      if (
        response.statusCode === StatusCode.SUCCESS &&
        "payload" in response &&
        typeof response.payload === "object"
      ) {
        dispatchAccountMutation({
          type: "SET_ACCOUNT",
          payload: {
            account: response.payload,
          },
        });
        return response.payload;
      }
      return null;
    },
  });

  if (isAccountLoading || isAccountError) {
    return (
      <div className="flex min-h-screen">
        <div className="m-auto">
          <ProgressBar />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white-300 flex min-h-screen flex-col p-24">
      {/* Analytics Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Analytics</h2>
        <Button className="bg-red-600 py-1.5 px-5 hover:bg-red-700 font-semibold" asChild>
          <Link href={`/console/analytics`}>View All</Link>
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-6">
        <Card className="p-1">
          <CardHeader className="pb-1">
            <CardTitle className="text-red-600">Demographics</CardTitle>
          </CardHeader>
          {/* <PopularCountriesChart hideText={true} />{" "} */}
        </Card>

        <Card className="p-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600">Traffic</CardTitle>
          </CardHeader>
          {/* <TrafficOnDateChart hideText={true} />{" "} */}
        </Card>
      </div>

      {/* Attendees Section */}
      <div className="mb-6 mt-10 flex items-center justify-between">
        <h2 className="text-xl font-bold">Attendees</h2>
        <Button className="bg-red-600 py-1.5 px-5 hover:bg-red-700 font-semibold" asChild>
          <Link href={`/console/attendees`}>View All</Link>
        </Button>
      </div>

      <div className="mb-4 rounded-t-2xl border border-gray-300 bg-white p-4">
        <div className="relative mb-4 flex items-center">
          <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Attendees..."
            className="w-1/4 rounded-lg bg-gray-100 p-2 pl-10"
          />
        </div>
        <div className="h-64 overflow-y-auto">
          <p>Data from DB goes here...</p>
        </div>
      </div>
    </div>
  );
}
