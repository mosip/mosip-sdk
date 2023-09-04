import { StorybookConfig } from "@storybook/react-webpack5";
import { getBranchRefs } from "./refs";

const path = require("path");
// component which created with typescript has to added in ts-loader
const SIGNIN_PATH = path.join(__dirname, "../../sign-in-with-esignet/src");
const REACT_SIGNIN_PATH = path.join(__dirname, "../../react-sign-in-with-esignet/src");
const SBI_PATH = path.join(__dirname, "../../mosip-bio-device/src");
const STORIES_PATH = path.join(__dirname, "../stories");

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  core: {
    disableTelemetry: true,
  },
  refs: getBranchRefs,
  webpackFinal: async (config) => {
    config?.module?.rules?.push({
      test: /\.(ts|tsx)$/,
      include: [REACT_SIGNIN_PATH, SBI_PATH, SIGNIN_PATH, STORIES_PATH],
      use: [
        {
          loader: require.resolve("ts-loader"),
        },
      ],
    });
    config?.module?.rules?.push({
      test: /\.scss$/,
      use: [
        {
          loader: require.resolve("style-loader"),
        },
        {
          loader: require.resolve("css-loader"),
        },
        {
          loader: require.resolve("sass-loader"),
        },
      ],
      include: [SBI_PATH],
      exclude: /node_modules/,
    });
    config?.resolve?.extensions?.push(".ts", ".tsx");
    if (config?.resolve) {
      config.resolve.alias = { react: path.resolve("./node_modules/react") };
    }
    return config;
  },
};
export default config;
