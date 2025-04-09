import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/DynamicFormBuilder.js",
  output: {
    file: "dist/DynamicFormBuilder.umd.js",
    format: "umd",
    name: "DynamicFormBuilder",
  },
  plugins: [resolve(), commonjs()],
};
