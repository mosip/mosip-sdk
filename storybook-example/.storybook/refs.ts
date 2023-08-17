/**
 * @fileoverview StorybookRefs content generated according to destination environment
 */
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve("./", ".env"),
}).parsed;

/**
 * StorybookRefs content for one Storybook instance
 * @typedef {Object} StorybookReferences
 * @property {string} title - Title of the Storybook instance
 * @property {string} local - Local URL with port for the Storybook instance
 * @property {string} ghpages - GitHub Pages path for the Storybook instance
 */

/**
 * StorybookRefs content for all Storybook instances
 * @typedef {Object.<string, StorybookReferences>} StorybookRefs
 */
const createRef = (): {
  [name: string]: { title: string; ghpages: string; local: string };
} => {
  const versionBranch = dotenv.VERSION_BRANCH.split(",");
  const noOfBranch = versionBranch.length;
  let portNo = 6001;

  const refs = {};

  for (let i = 0; i < noOfBranch; i++) {
    const key = versionBranch[i];
    refs[key] = {
      title: key,
      ghpages: `/${dotenv.BASE_PATH}/${key}`,
      local: `http://localhost:${portNo++}`,
    };
  }

  return refs;
};

/**
 * Generates a Storybook ref (`{ title: string; url: string }`) for each child storybook.
 *  `url` is chosen based on destination environment
 * @returns {Object.<string, import('@storybook/core-common').StorybookRefs>}
 */
export const refs: any = (config, { configType }) => {
  let urlKey = "ghpages";
  if (configType === "DEVELOPMENT") {
    urlKey = "local";
  }
  const refs = Object.entries(createRef());
  if (refs.length < 1) {
    return undefined;
  }
  const newRefs = {};
  for (const [key, value] of Object.entries(createRef())) {
    newRefs[key] = {
      title: value.title,
      url: value[urlKey],
    };
  }
  return newRefs;
};
