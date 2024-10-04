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

import { JSX, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/ui/card";
import { Button } from "@components/ui";

export default function SettingsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className={"flex min-h-screen flex-col space-y-10 p-4 md:p-10"}>
      <div className={"space-y-3"}>
        <h1 className={"flex items-center text-2xl font-bold"}>
          <Cog6ToothIcon className={"mr-2 h-6 w-6 fill-red-600"} /> Settings
        </h1>
        <p className={"text-xs text-gray-600"}>
          Manage your preferences and configure your account settings here.
        </p>
      </div>

      {/* Adjusted the main container to take up full height */}
      <div className={"flex h-full flex-1 flex-col space-y-0"}>
        <div className={"ml-6 flex space-x-2"}>
          <button
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === 1
                ? "border-b-0 bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-300"
            } rounded-t-2xl border`}
            onClick={() => handleTabClick(1)}
          >
            Instructions
          </button>

          <button
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === 2
                ? "border-b-0 bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-300"
            } rounded-t-2xl border`}
            onClick={() => handleTabClick(2)}
          >
            Enclosure Settings
          </button>

          <button
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === 3
                ? "border-b-0 bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-300"
            } rounded-t-2xl border`}
            onClick={() => handleTabClick(3)}
          >
            Picture Settings
          </button>
        </div>

        <div className="relative h-full w-full flex-1 border-2 border-gray-300 bg-gray-100">
          <div className="flex h-full flex-col justify-between p-8">
            <div className="mb-4 flex justify-end">
              <Button variant="default">Save</Button>
            </div>

            <div className="grid h-full flex-grow grid-cols-2 gap-4">
              {activeTab === 1 && (
                <>
                  <Card className={"flex h-full flex-col"}>
                    <CardHeader>
                      <CardTitle>Instructions</CardTitle>
                      <CardDescription>Your Input:</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={
                          "mt-1 block h-full w-full rounded-md border border-gray-300 p-2 shadow-sm"
                        }
                      />
                    </CardContent>
                  </Card>

                  <Card className={"flex h-full flex-col"}>
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                      <CardDescription>Here’s how it looks:</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className={"mt-4"}>{inputValue}</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === 2 && (
                <Card className={"col-span-2 flex h-full flex-col"}>
                  <CardHeader>
                    <CardTitle>Enclosure Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p>This is the content for Enclosure Settings.</p>
                  </CardContent>
                </Card>
              )}

              {activeTab === 3 && (
                <Card className={"col-span-2 flex h-full flex-col"}>
                  <CardHeader>
                    <CardTitle>Picture Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p>This is the content for Picture Settings.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
