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
import ProgressBar from "@components/progress_bar";

export default function GroundSettingsPage(): JSX.Element {
  const [enclosureName, setEnclosureName] = useState("");
  const [startNumber, setStartNumber] = useState<number | string>("");
  const [endNumber, setEndNumber] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    enclosureName: "",
    startNumber: "",
    endNumber: "",
  });

  const handleEnclosureNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.toUpperCase();
    const regex = /^[A-Z]$/; // Only one letter A-Z
    if (regex.test(value) || value === "") {
      setEnclosureName(value);
      setErrorMessages((prev) => ({ ...prev, enclosureName: "" })); // Clear error on valid input
    } else {
      setErrorMessages((prev) => ({
        ...prev,
        enclosureName: "Enclosure name must be a single letter (A-Z).",
      }));
    }
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | string>>,
    fieldName: keyof typeof errorMessages,
  ) => {
    const value = e.target.value;
    const regex = /^(0|[1-9][0-9]*)$/; // Only non-negative integers are allowed

    // Validate the input for numbers
    if (value === "" || regex.test(value)) {
      setter(value);
      setErrorMessages((prev) => ({ ...prev, [fieldName]: "" })); // Clear error on valid input
    } else {
      setErrorMessages((prev) => ({
        ...prev,
        [fieldName]: "Only positive integers are allowed.",
      }));
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | string>>,
    fieldName: keyof typeof errorMessages,
  ) => {
    const key = e.key;
    if (!/^[0-9]$/.test(key) && key !== "Backspace" && key !== "Tab") {
      e.preventDefault();
      setErrorMessages((prev) => ({
        ...prev,
        [fieldName]: "Only positive integers are allowed.",
      }));
    }
  };

  const handleSubmit = async () => {
    // Check for valid inputs before submitting
    if (enclosureName === "" || startNumber === "" || endNumber === "") {
      setErrorMessages({
        enclosureName:
          enclosureName === "" ? "Enclosure name is required." : "",
        startNumber: startNumber === "" ? "Start number is required." : "",
        endNumber: endNumber === "" ? "End number is required." : "",
      });
      return;
    }

    setIsLoading(true);
    setErrorMessages({ enclosureName: "", startNumber: "", endNumber: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setEnclosureName("");
      setStartNumber("");
      setEndNumber("");
    } catch (error) {
      setErrorMessages({
        enclosureName: "An error occurred while saving.",
        startNumber: "",
        endNumber: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center rounded-xl border bg-white px-4 py-5 pt-10">
      <div className="w-full p-10">
        <h2 className="mb-8 text-lg font-semibold text-gray-800">
          Ground Enclosure Settings
        </h2>

        {isLoading && <ProgressBar />}

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
            {errorMessages.enclosureName && (
              <div className="mt-1 text-red-500">
                {errorMessages.enclosureName}
              </div>
            )}
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
              onChange={(e) =>
                handleNumberChange(e, setStartNumber, "startNumber")
              }
              onKeyPress={(e) =>
                handleKeyPress(e, setStartNumber, "startNumber")
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-red-600 focus:ring-red-600"
            />
            {errorMessages.startNumber && (
              <div className="mt-1 text-red-500">
                {errorMessages.startNumber}
              </div>
            )}
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
              onChange={(e) => handleNumberChange(e, setEndNumber, "endNumber")}
              onKeyPress={(e) => handleKeyPress(e, setEndNumber, "endNumber")}
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-red-600 focus:ring-red-600"
            />
            {errorMessages.endNumber && (
              <div className="mt-1 text-red-500">{errorMessages.endNumber}</div>
            )}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Button
            className="px-10 text-lg font-semibold"
            variant="destructive"
            asChild
            onClick={handleSubmit}
          >
            <span>Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
