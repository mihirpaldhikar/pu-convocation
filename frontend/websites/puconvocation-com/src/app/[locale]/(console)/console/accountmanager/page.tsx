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

import { SquaresPlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/ui";
import { useState } from "react";

export default function AccountManager() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("read:Attendee");
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState([
    {
      uuid: "1",
      username: "suhani",
      email: "suhani@example.com",
      iamRoles: ["read:Attendee"],
    },
  ]);

  const handleAddAccount = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setAccounts([
      ...accounts,
      {
        uuid: Date.now().toString(),
        username: email.split("@")[0],
        email,
        iamRoles: [role],
      },
    ]);
    setEmail("");
    setRole("read:Attendee");
  };

  const handleRemoveAccount = (uuid: string) => {
    setAccounts(accounts.filter((account) => account.uuid !== uuid));
  };

  const handleRoleChange = (uuid: string, newRole: string) => {
    setAccounts(
      accounts.map((account) =>
        account.uuid === uuid ? { ...account, iamRoles: [newRole] } : account,
      ),
    );
  };

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

      {/* Add New Account */}
      <div className="rounded-3xl border-none bg-card text-card-foreground shadow-none">
        <div className="flex flex-col space-y-1.5 p-4 md:p-6">
          <div className="font-semibold leading-none tracking-tight">
            Add New Account
          </div>
        </div>
        <div className="p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow rounded border border-gray-300 p-2 text-sm focus:outline-none"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded border border-gray-300 p-2 text-sm focus:outline-none"
              >
                <option value="read:Attendee">Read</option>
                <option value="write:Attendee">Write</option>
              </select>
              <button
                onClick={handleAddAccount}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Save
              </button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </div>
      </div>

      {/* Account List */}
      <Card>
        <CardHeader>
          <CardTitle>Account List</CardTitle>
          <CardDescription>
            Manage existing accounts and their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.uuid}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex-grow">
                <p className="font-medium">{account.email}</p>
                <p className="text-xs text-gray-500">{account.iamRoles[0]}</p>
              </div>
              <select
                value={account.iamRoles[0]}
                onChange={(e) => handleRoleChange(account.uuid, e.target.value)}
                className="rounded border border-gray-300 p-2 text-sm focus:outline-none"
              >
                <option value="read:Attendee">Read</option>
                <option value="write:Attendee">Write</option>
              </select>
              <button onClick={() => handleRemoveAccount(account.uuid)}>
                <XMarkIcon className="h-6 w-6 text-black" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
