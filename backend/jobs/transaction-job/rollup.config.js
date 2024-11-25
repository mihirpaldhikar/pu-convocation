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

import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const rollupConfiguration = [
  {
    input: "./src/index.ts",
    output: {
      dir: "dist",
      format: "cjs",
    },
    external: ["@aws-sdk/client-sqs"],
    plugins: [
      peerDepsExternal(),
      json(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true,
      }),
      commonjs(),
      nodeResolve({
        preferBuiltins: true,
        dedupe: ["mongodb"],
      }),
      typescript({
        declarationDir: "dist",
        outputToFilesystem: true,
        exclude: ["**/tests/", "**/*.test.ts", "**/*.test.tsx"],
      }),
      terser(),
    ],
  },
];

export default rollupConfiguration;
