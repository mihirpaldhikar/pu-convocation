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

import { type PolarisConfig, type Style } from "../interfaces";

export const DEFAULT_POLARIS_CONFIG: PolarisConfig = {
  block: {
    text: {
      title: {
        fontSize: 2.0,
        fontWeight: 700,
        lineHeight: 1.75,
      },
      subTitle: {
        fontSize: 1.65,
        fontWeight: 600,
        lineHeight: 1.75,
      },
      heading: {
        fontSize: 1.5,
        fontWeight: 600,
        lineHeight: 1.75,
      },
      subHeading: {
        fontSize: 1.25,
        fontWeight: 500,
        lineHeight: 1.75,
      },
      paragraph: {
        fontSize: 1,
        fontWeight: 400,
        lineHeight: 1.75,
      },
      quote: {
        fontSize: 1,
        fontWeight: 500,
        lineHeight: 1.75,
      },
    },
    attachment: {
      spacing: 1,
    },
    list: {
      spacing: 1,
    },
  },
};

export const DEFAULT_LINK_STYLE: Style[] = [
  {
    name: "text-decoration",
    value: "underline",
  },
];
