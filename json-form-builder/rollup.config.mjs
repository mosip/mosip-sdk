import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/JsonFormBuilder.js",
  output: {
    file: "dist/JsonFormBuilder.umd.js",
    format: "umd",
    name: "JsonFormBuilder",
  },
  plugins: [resolve(), commonjs()],
};
