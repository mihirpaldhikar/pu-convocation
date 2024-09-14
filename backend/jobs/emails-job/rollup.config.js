/*
 * Copyright (c) PU Convocation Management System Authors
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

import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import pluginPeerDepsExternalModule from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import eslint from "@rollup/plugin-eslint";

const rollupConfiguration = [
    {
        input: "./src/index.ts",
        output: {
            dir: "dist",
            format: "esm",
        },
        plugins: [
            eslint({
                throwOnError: true,
                throwOnWarning: true,
                include: ["eslint.config.js"],
                exclude: ["node_modules/**"],
            }),
            commonjs({
                transformMixedEsModules: true,
                include: [],
            }),
            pluginPeerDepsExternalModule(),
            typescript({
                tsconfig: "./tsconfig.json",
                declarationDir: "dist",
                outputToFilesystem: true,
                exclude: ["**/tests/", "**/*.test.ts", "**/*.test.tsx"],
            }),
            terser(),
        ],
    },
];

export default rollupConfiguration;