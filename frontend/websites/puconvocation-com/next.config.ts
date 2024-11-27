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

import createNextIntlPlugin from "next-intl/plugin";
import withPlaiceholder from "@plaiceholder/next";
import { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const server = (phase: any) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const i18n = createNextIntlPlugin();

  const nextConfig: NextConfig = {
    output: "standalone",
    poweredByHeader: false,
    reactStrictMode: true,
    assetPrefix: isDev ? undefined : "https://assets.puconvocation.com",
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "assets.puconvocation.com",
        },
      ],
    },
    experimental: {
      optimizePackageImports: [
        "@components/analytics",
        "@components/attendee",
        "@components/common",
        "@components/forms",
        "@components/graphics",
        "@components/layouts",
        "@components/ui",
        "@controllers",
        "@hooks",
        "@dto",
        "@enums",
        "@fonts",
        "@providers",
        "@services",
        "@i18n",
        "@lib",
        "react-zxing",
      ],
    },
  };

  const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  });

  return withBundleAnalyzer(withPlaiceholder(i18n(nextConfig)));
};

export default server;
