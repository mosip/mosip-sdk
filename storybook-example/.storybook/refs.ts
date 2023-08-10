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
  const versionList = dotenv.VERSION_LIST.split(",");
  const m = versionList.length;
  const titleList = dotenv.STORY_TITLE.split(",");
  const buildPathList = dotenv.BUILD_FOLDER_PATH.split(",");
  const n = titleList.length;
  let portNo = 6001;

  const refs = {};

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const key = `${buildPathList[j]}_${versionList[i]}`;
      refs[key] = {
        title: `${versionList[i]}/${titleList[j]}`,
        ghpages: `/${dotenv.BASE_PATH}/${versionList[i]}/${buildPathList[j]}`,
        local: `http://localhost:${portNo++}`,
      };
    }
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
  const newRefs = {};
  for (const [key, value] of Object.entries(createRef())) {
    newRefs[key] = {
      title: value.title,
      url: value[urlKey],
    };
  }
  return newRefs;
};
