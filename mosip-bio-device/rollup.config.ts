import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import image from "@rollup/plugin-image";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: false,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: false,
      },
    ],
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        https: require.resolve("https-browserify"),
        url: require.resolve("url"),
        http: require.resolve("stream-http"),
        path: require.resolve("path-browserify"),
        zlib: require.resolve("browserify-zlib"),
        buffer: require.resolve("buffer"),
        fs: require.resolve("fs"),
        util: require.resolve("util"),
      },
    },
    plugins: [
      peerDepsExternal(),
      typescript({ tsconfig: "./tsconfig.json" }),
      resolve(),
      commonjs(),
      json(),
      postcss(),
      image(),
    ],
    external: [
      "@storybook/addon-essentials",
      "@storybook/addon-interactions",
      "@storybook/addon-links",
      "@storybook/blocks",
      "@storybook/preset-scss",
      "@storybook/react",
      "@storybook/react-webpack5",
      "@storybook/testing-library",
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  },
];
