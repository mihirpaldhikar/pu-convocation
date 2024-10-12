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

export function convertToThumbnailUrl(imageUrl: string): string {
  const regex = /https:\/\/assets\.puconvocation\.com\/images\/(.*)\.[^.]+$/;
  const match = imageUrl.match(regex);

  if (match && match[1]) {
    const filename = match[1];
    return `https://assets.puconvocation.com/thumbnails/${filename}.png`;
  } else {
    console.error("Invalid image URL format.");
    return imageUrl;
  }
}
