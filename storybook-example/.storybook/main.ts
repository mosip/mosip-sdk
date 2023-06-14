import type { StorybookConfig } from "@storybook/web-components-webpack5";

const path = require("path");
const SRC_PATH = path.join(__dirname, "../../sign-in-with-esignet/src");
const STORIES_PATH = path.join(__dirname, "../stories");

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/web-components-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  core: {
    disableTelemetry: true,
  },
  webpackFinal: async (config) => {
    config?.module?.rules?.push({
      test: /\.(ts|tsx)$/,
      include: [SRC_PATH, STORIES_PATH],
      use: [
        {
          loader: require.resolve("ts-loader"),
        },
      ],
    });
    config?.resolve?.extensions?.push(".ts", ".tsx");
    return config;
  },
};
export default config;
