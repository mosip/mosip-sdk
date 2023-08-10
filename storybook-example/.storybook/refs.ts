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
// export const references = {
//   "sign-in-with-esignet_dev": {
//     title: `${dotenv.DEV_PREFIX}/Sign in with Esignet`,
//     local: "http://localhost:6001",
//     ghpages: `/esignet-plugins/${dotenv.DEV_PATH}/sign-in-with-esignet`,
//   },
//   "secure-biometric-interface-integrator_dev": {
//     title: `${dotenv.DEV_PREFIX}/Secure Biometric Interface Integrator`,
//     local: "http://localhost:6002",
//     ghpages: `/esignet-plugins/${dotenv.DEV_PATH}/secure-biometric-interface-integrator`,
//   },
//   "react-sign-in-with-esignet_dev": {
//     title: `${dotenv.DEV_PREFIX}/React Sign in with Esignet`,
//     local: "http://localhost:6003",
//     ghpages: `/esignet-plugins/${dotenv.DEV_PATH}/react-sign-in-with-esignet`,
//   },
//   "react-sbi-integrator_dev": {
//     title: `${dotenv.DEV_PREFIX}/React Secure Biometric Interface Integrator`,
//     local: "http://localhost:6004",
//     ghpages: `/esignet-plugins/${dotenv.DEV_PATH}/react-sbi-integrator`,
//   },
//   "sign-in-with-esignet": {
//     title: `${dotenv.RELEASE_PREFIX}/Sign in with Esignet`,
//     local: "http://localhost:6001",
//     ghpages: `/esignet-plugins/${dotenv.RELEASE_PATH}/sign-in-with-esignet`,
//   },
//   "secure-biometric-interface-integrator": {
//     title: `${dotenv.RELEASE_PREFIX}/Secure Biometric Interface Integrator`,
//     local: "http://localhost:6002",
//     ghpages: `/esignet-plugins/${dotenv.RELEASE_PATH}/secure-biometric-interface-integrator`,
//   },
//   "react-sign-in-with-esignet": {
//     title: `${dotenv.RELEASE_PREFIX}/React Sign in with Esignet`,
//     local: "http://localhost:6003",
//     ghpages: `/esignet-plugins/${dotenv.RELEASE_PATH}/react-sign-in-with-esignet`,
//   },
//   "react-sbi-integrator": {
//     title: `${dotenv.RELEASE_PREFIX}/React Secure Biometric Interface Integrator`,
//     local: "http://localhost:6004",
//     ghpages: `/esignet-plugins/${dotenv.RELEASE_PATH}/react-sbi-integrator`,
//   },
// };

const createRef = (): {
  [name: string]: { title: string; ghpages: string; local: string };
} => {
  const versionList = dotenv.VERSION_LIST.split(",");
  const m = versionList.length;
  const titleList = dotenv.STORY_TITLE.split(",");
  const buildPathList = dotenv.BUILD_FOLDER_PATH.split(",");
  const n = titleList.length;
  // const devPath = `${dotenv.DEV_PATH}`;
  // const releasePath = `${dotenv.RELEASE_PATH}`;
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

  // // dev storybook ref
  // for (let i = 0; i < n; i++) {
  //   const key = `${buildPathList[i]}_dev`;
  //   refs[key] = {
  //     title: `${dotenv.DEV_PREFIX}/${titleList[i]}`,
  //     ghpages: `${devPath}/${buildPathList[i]}`,
  //     local: `http://localhost:${portNo++}`,
  //   };
  // }
  // // release storybook ref
  // for (let i = 0; i < n; i++) {
  //   refs[buildPathList[i]] = {
  //     title: `${dotenv.RELEASE_PREFIX}/${titleList[i]}`,
  //     ghpages: `${releasePath}/${buildPathList[i]}`,
  //     local: `http://localhost:${portNo++}`,
  //   };
  // }
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
