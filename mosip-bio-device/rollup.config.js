import pkg from "./package.json";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";

// The banner to add to the top of each file
// Pulls details from the package.json file
let banner = `/*! ${pkg.name} v${pkg.version} | ${
  pkg.description
} | Copyright ${new Date().getFullYear()} | ${pkg.license} license */`;

// The formats to output
// Full list here: https://rollupjs.org/guide/en/#outputformat
let formats = ["iife", "es", "cjs"];

// The files to compile with rollup.js,
// and the settings to use for them
export default formats.map(function (format) {
  return {
    input: "lib/secureBiometricDevice.js",
    output: {
      file: `dist/${format}/index.js`,
      format: format,
      name: "SecureBiometricDevice",
      banner: banner,
      exports: "auto",
    },
    plugins: [
      postcss({
        extensions: [".css"],
      }),
      image(),
      resolve({
        preferBuiltins: true,
        mainFields: ["browser"]
      }),
      commonjs(),
      nodePolyfills(),
      json()
    ],
    // external: ["axios", "jose"],
  };
});
