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

import { createElement, JSX } from "react";
import { getBestTextColor } from "@lib/color_utils";

interface GroundMapProps {
  activeEnclosure: string;
  activeColor: string;
  className?: string;
}

type SVGElement = {
  type: string;
  tagName: string;
  properties: { [key: string]: string };
  children: SVGElement[];
};

function groundMapToSVG(
  json: SVGElement[],
  activeEnclosure: string,
  activeColor: string,
  modifier?: string,
): JSX.Element {
  const elementToJSX = (
    element: SVGElement,
    modifier?: string,
  ): JSX.Element => {
    const { tagName, properties, children } = element;

    const jsxAttributes: { [key: string]: any } = {};
    let className = properties.class || "";

    const isActive =
      properties.id !== undefined &&
      ((properties.id.includes("enclosure") &&
        properties.id.includes(activeEnclosure)) ||
        (properties.id.includes("enclosure_name") &&
          properties.id.includes(activeEnclosure)));

    for (const [key, value] of Object.entries(properties)) {
      if (
        isActive &&
        ["fill", "stroke", "strokeWidth"].includes(
          key.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          }),
        )
      ) {
        jsxAttributes[
          key.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          })
        ] = properties.id?.includes("enclosure_name")
          ? getBestTextColor(activeColor)
          : activeColor;
        continue;
      }

      if (key === "class") {
        jsxAttributes.className = value;
      } else if (key.includes("-")) {
        jsxAttributes[
          key.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          })
        ] = value;
      } else {
        jsxAttributes[key] = value;
      }
    }

    jsxAttributes.className = tagName === "svg" ? modifier : className.trim();

    if (children.length === 0) {
      return createElement(tagName, jsxAttributes);
    }

    const childElements = children.map((e) => elementToJSX(e, modifier));
    return createElement(tagName, jsxAttributes, ...childElements);
  };

  const rootElement = json[0];

  return elementToJSX(rootElement, modifier);
}

export default async function GroundMap({
  activeEnclosure,
  activeColor,
  className,
}: GroundMapProps): Promise<JSX.Element> {
  const groundMapResponse = await fetch(
    "https://assets.puconvocation.com/maps/ground.json",
  );
  const groundMap = await groundMapResponse.json();
  return groundMapToSVG(
    groundMap["children"],
    activeEnclosure,
    activeColor,
    className,
  );
}
