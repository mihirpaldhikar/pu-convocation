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
import { useAuth } from "@hooks/index";
import { ProgressBar } from "@components/index";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function ConsolePage(): JSX.Element {
  const { state } = useAuth();
  const router = useRouter();

  if (state.loading) {
    return (
      <div className="flex min-h-screen">
        <div className="m-auto">
          <ProgressBar />
        </div>
      </div>
    );
  }

  const handleViewAllAnalytics = () => {
    router.push("/en/console/analytics");
  };

  const handleViewAllAttendees = () => {
    router.push("/en/console/attendees");
  };

  return (
    <div className="bg-white-300 flex min-h-screen flex-col p-24">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Analytics</h2>
        <button
          onClick={handleViewAllAnalytics}
          className="rounded-lg bg-red-600 px-5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          View All
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-6">
        <div className="h-32 rounded-xl border border-gray-300 bg-white p-6 font-semibold text-red-600">
          {" "}
          Demographics
        </div>
        <div className="h-32 rounded-xl border border-gray-300 bg-white p-6 font-semibold text-red-600">
          {" "}
          Traffic
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between mt-10">
        <h2 className="text-xl font-bold">Attendees</h2>
        <button
          onClick={handleViewAllAttendees}
          className="rounded-lg bg-red-600 px-5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          View All
        </button>
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
