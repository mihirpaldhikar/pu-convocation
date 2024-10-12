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

import { NextRequest, NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export async function GET(request: NextRequest) {
  const imageURL = request.nextUrl.searchParams.get("imageURL");
  if (
    imageURL === null ||
    !/https:\/\/assets\.puconvocation\.com\/.*\/.*\.(jpg|jpeg|png|gif|bmp|webp|svg|avif)/.test(
      imageURL,
    )
  ) {
    const absoluteURL = new URL("/en", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  const buffer = await fetch(imageURL).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const { ...plaiceholder } = await getPlaiceholder(buffer, { size: 10 });

  return new NextResponse(
    plaiceholder.base64.replace("data:image/png;base64,", ""),
  );
}
