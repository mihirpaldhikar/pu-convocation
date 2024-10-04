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

export interface TextBlockConfig {
  fontSize: number;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  lineHeight: number;
}

export interface AttachmentBlockConfig {
  spacing: number;
}

export interface ListBlockConfig {
  spacing: number;
}

interface PolarisConfig {
  block: {
    text: {
      title: TextBlockConfig;
      subTitle: TextBlockConfig;
      heading: TextBlockConfig;
      subHeading: TextBlockConfig;
      paragraph: TextBlockConfig;
      quote: TextBlockConfig;
    };
    attachment: AttachmentBlockConfig;
    list: ListBlockConfig;
  };
}

export default PolarisConfig;
