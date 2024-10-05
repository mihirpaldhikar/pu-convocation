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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";


export default function InstructionsSettingsPage(): JSX.Element {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className={"min-h-screen w-full rounded-xl border bg-white px-4 py-5"}>
      <div className="grid h-full flex-grow grid-cols-2 gap-4">
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>Your Input:</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="mt-1 block h-full w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-red-600 focus:ring-red-600"
            />
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Here’s how it looks:</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="mt-4">{inputValue}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
