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

import { Enclosure } from "@dto/index";

export interface ImageMetadata {
  url: string;
  description: string;
}

export interface RemoteConfigImages {
  carousel: Array<ImageMetadata>;
  aboutUs: ImageMetadata;
  hero: ImageMetadata;
}

export interface RemoteConfigCountdown {
  show: boolean;
  endTime: number;
}

export default interface RemoteConfig {
  id: string;
  active: boolean;
  attendees: {
    locked: boolean;
    updatedAt: string;
    csvFile: string;
  };
  images: RemoteConfigImages;
  countdown: RemoteConfigCountdown;
  instructions: {
    show: boolean;
    document: string;
  };
  groundMappings: Array<Enclosure>;
}
