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

export function jsonToCSV<T>(
  jsonData: T[],
  excludeFields: string[] = [],
  replaceFields: Record<string, string> = {},
): string {
  if (!jsonData.length) {
    return "";
  }

  const flattenObject = (obj: any): Record<string, any> =>
    Object.keys(obj).reduce(
      (acc, k) => {
        if (typeof obj[k] === "object" && obj[k] !== null) {
          Object.assign(acc, flattenObject(obj[k]));
        } else {
          acc[k] = obj[k];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

  const flattenedData: Record<string, any>[] = jsonData.map(flattenObject);

  const filteredData: Record<string, any>[] = flattenedData.map((obj) => {
    const newObj: Record<string, any> = {};
    for (let key in obj) {
      if (!excludeFields.includes(key)) {
        const newKey = replaceFields[key] || key;
        newObj[newKey] = obj[key];
      }
    }
    return newObj;
  });

  const keys = Object.keys(filteredData[0]);
  const replacer = (key: string, value: any) => (value === null ? "" : value);

  let csv = keys.join(",") + "\n";

  filteredData.forEach((row) => {
    let values = keys.map((key) => JSON.stringify(row[key], replacer));
    csv += values.join(",") + "\n";
  });

  return csv;
}
