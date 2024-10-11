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

import { JSX, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@providers/AuthProvider";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@components/ui";
import { Account } from "@dto/index";

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  account: Account | null;
  translations: AbstractIntlMessages;
}

export default function Providers({
  children,
  locale,
  translations,
  account,
}: Readonly<ProvidersProps>): JSX.Element {
  const queryClient = new QueryClient();
  return (
    <NextIntlClientProvider
      messages={translations}
      locale={locale}
      timeZone={"Asia/Kolkata"}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider account={account}>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}
