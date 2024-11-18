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

import { createElement, Fragment, JSX, useEffect } from "react";
import { getBestTextColor } from "@lib/color_utils";
import { useQuery } from "@tanstack/react-query";
import { useFormikContext } from "formik";

interface GroundMapperProps {
  activeEnclosure: string;
  onEnclosureClicked: (id: string | null) => void;
  activeColor: string;
  className?: string;
}

type SVGElement = {
  type: string;
  tagName: string;
  properties: { [key: string]: string };
  children: SVGElement[];
};

function extractIdentifier(str: string): string | null {
  const underscoreMatch = str.match(/_(.*)$/);
  if (underscoreMatch) {
    return underscoreMatch[1];
  }

  const colonMatch = str.match(/:(.*)$/);
  if (colonMatch) {
    return colonMatch[1];
  }

  return null;
}

interface RenderMapToSVGProps {
  json: SVGElement[];
  activeEnclosure: string;
  activeColor: string;
  onClickHandler: (id: string | null) => void;
  modifier?: string;
}

function RenderMapToSVG({
  json,
  activeEnclosure,
  activeColor,
  onClickHandler,
  modifier,
}: Readonly<RenderMapToSVGProps>): JSX.Element {
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

    jsxAttributes.className =
      tagName === "svg"
        ? modifier
        : (properties.id ?? "").includes("enclosure")
          ? className.concat(" cursor-pointer")
          : className.trim();

    if (/^enclosure_(?!name:).*$/.test(properties.id ?? "")) {
      jsxAttributes.onClick = () => {
        onClickHandler(extractIdentifier(properties.id ?? ""));
      };
    }

    if (children.length === 0) {
      return createElement(tagName, jsxAttributes);
    }

    const childElements = children.map((e) => elementToJSX(e, modifier));
    return createElement(tagName, jsxAttributes, ...childElements);
  };

  const rootElement = json[0];

  return elementToJSX(rootElement, modifier);
}

export default function GroundMapper({
  activeEnclosure,
  activeColor,
  className,
  onEnclosureClicked,
}: GroundMapperProps): JSX.Element {
  const { submitForm } = useFormikContext();

  const { data: ground, isLoading } = useQuery({
    queryKey: [`groundMapper`],
    queryFn: async () => {
      const response = await fetch(
        "https://assets.puconvocation.com/maps/ground.json",
      );
      return await response.json();
    },
  });

  useEffect(() => {
    return () => {
      submitForm().then();
    };
  }, [submitForm]);

  if (isLoading) {
    return <Fragment />;
  }

  return (
    <RenderMapToSVG
      json={ground["children"]}
      activeEnclosure={activeEnclosure}
      activeColor={activeColor}
      onClickHandler={async (id) => {
        await submitForm();
        onEnclosureClicked(id);
      }}
      modifier={className}
    />
  );
}
