import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
};
module.exports = {
  preset: 'ts-jest',
  "testEnvironment": "jest-environment-jsdom",
  transform: {
    '\\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|mp4|webm)$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
  },
};

export default config;
