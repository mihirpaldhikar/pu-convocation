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
import { Button } from "@components/ui";

export default function GroundSettingsPage(): JSX.Element {
  const [enclosureName, setEnclosureName] = useState("");
  const [startNumber, setStartNumber] = useState("");
  const [endNumber, setEndNumber] = useState("");

  const handleEnclosureNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    const regex = /^[A-Z]$/;
    if (regex.test(value) || value === "") {
      setEnclosureName(value);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    if (!value.includes("e")) {
      setter(value);
    }
  };

  return (
    <div className="flex min-h-screen justify-center rounded-xl border bg-white px-4 py-5 pt-10">
      <div className="w-full p-10">
        <h2 className="mb-8 text-lg font-semibold text-gray-800">
          Ground Enclosure Settings
        </h2>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="enclosureName"
              className="block text-sm font-medium text-gray-700"
            >
              Enclosure Name
            </label>
            <input
              type="text"
              id="enclosureName"
              value={enclosureName}
              onChange={handleEnclosureNameChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-red-600 focus:ring-red-600"
              maxLength={1} 
            />
          </div>

          <div>
            <label
              htmlFor="startNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Start Number
            </label>
            <input
              type="number"
              id="startNumber"
              value={startNumber}
              min="0"
              onChange={(e) => handleNumberChange(e, setStartNumber)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-red-600 focus:ring-red-600"
            />
          </div>

          <div>
            <label
              htmlFor="endNumber"
              className="block text-sm font-medium text-gray-700"
            >
              End Number
            </label>
            <input
              type="number"
              id="endNumber"
              value={endNumber}
              min="0"
              onChange={(e) => handleNumberChange(e, setEndNumber)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-red-600 focus:ring-red-600"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Button
            className="px-10 text-lg font-semibold"
            variant="destructive"
            asChild
          >
            <span>Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
