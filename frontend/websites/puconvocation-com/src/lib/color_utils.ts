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

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

export function calculateLuminance(rgb: {
  r: number;
  g: number;
  b: number;
}): number {
  const { r, g, b } = rgb;

  const rNormalized = r / 255;
  const gNormalized = g / 255;
  const bNormalized = b / 255;

  const rGamma =
    rNormalized <= 0.03928
      ? rNormalized / 12.92
      : Math.pow((rNormalized + 0.055) / 1.055, 2.4);
  const gGamma =
    gNormalized <= 0.03928
      ? gNormalized / 12.92
      : Math.pow((gNormalized + 0.055) / 1.055, 2.4);
  const bGamma =
    bNormalized <= 0.03928
      ? bNormalized / 12.92
      : Math.pow((bNormalized + 0.055) / 1.055, 2.4);

  return 0.2126 * rGamma + 0.7152 * gGamma + 0.0722 * bGamma;
}

export function getBestTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);

  const luminance = calculateLuminance(rgb);

  return luminance > 0.5 ? "#000000" : "#ffffff";
}
