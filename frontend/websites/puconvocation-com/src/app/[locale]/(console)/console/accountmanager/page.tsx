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

import { SquaresPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/ui";

export default function AccountManager() {
  return (
    <div className="flex min-h-screen flex-col space-y-10 p-4 md:p-10">
      <div className="space-y-3">
        <h1 className="flex items-center text-2xl font-bold">
          <SquaresPlusIcon className="mr-2 h-6 w-6 text-red-600" /> Account
          Manager
        </h1>
        <p className="text-xs text-gray-600">
          View and manage the list of accounts for the convocation.
        </p>
      </div>
      <div className="flex min-h-screen flex-col items-center">
        <div className="mb-2 grid w-full grid-cols-1 gap-6 lg:grid-cols-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>
                View detailed information of all accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col"></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
