import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import image from "@rollup/plugin-image";

const packageJson = require("./package.json");

// The banner to add to the top of each file
// Pulls details from the package.json file
let banner = `/******************************************************************************
${new Date()}
${packageJson.name} v${packageJson.version}
${packageJson.description}
Copyright ${new Date().getFullYear()}
${packageJson.license} license 
******************************************************************************/`;

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: false,
        banner: banner,
        name: "SignInWithEsignetButton",
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: false,
        banner: banner,
        name: "SignInWithEsignetButton",
      },
      {
        file: packageJson.bundle,
        format: "iife",
        sourcemap: false,
        banner: banner,
        name: "SignInWithEsignetButton",
      },
    ],
    plugins: [
      peerDepsExternal(),
      typescript({ tsconfig: "./tsconfig.json" }),
      resolve(),
      commonjs(),
      json(),
      postcss(),
      image(),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  },
];
