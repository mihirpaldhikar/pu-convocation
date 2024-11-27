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

const i18n = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
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

export default withBundleAnalyzer(withPlaiceholder(i18n(nextConfig)));
