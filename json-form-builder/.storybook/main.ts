/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

export default config;
