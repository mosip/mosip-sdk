/**
 * @fileoverview StorybookRefs content generated according to destination environment
 */

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
export const references = {
  "sign-in-with-esignet_dev": {
    title: "Sign in with Esignet (dev)",
    local: "http://localhost:6001",
    ghpages: "/esignet-plugins/dev/sign-in-with-esignet",
  },
  "secure-biometric-interface-integrator_dev": {
    title: "Secure Biometric Interface Integrator (dev)",
    local: "http://localhost:6002",
    ghpages: "/esignet-plugins/dev/secure-biometric-interface-integrator",
  },
  "react-sign-in-with-esignet_dev": {
    title: "React Sign in with Esignet (dev)",
    local: "http://localhost:6003",
    ghpages: "/esignet-plugins/dev/react-sign-in-with-esignet",
  },
  "react-sbi-integrator_dev": {
    title: "React Secure Biometric Interface Integrator (dev)",
    local: "http://localhost:6004",
    ghpages: "/esignet-plugins/dev/react-sbi-integrator",
  },
  "sign-in-with-esignet": {
    title: "Release/Sign in with Esignet",
    local: "http://localhost:6001",
    ghpages: "/esignet-plugins/release/sign-in-with-esignet",
  },
  "secure-biometric-interface-integrator": {
    title: "Release/Secure Biometric Interface Integrator",
    local: "http://localhost:6002",
    ghpages: "/esignet-plugins/release/secure-biometric-interface-integrator",
  },
  "react-sign-in-with-esignet": {
    title: "Release/React Sign in with Esignet",
    local: "http://localhost:6003",
    ghpages: "/esignet-plugins/release/react-sign-in-with-esignet",
  },
  "react-sbi-integrator": {
    title: "Release/React Secure Biometric Interface Integrator",
    local: "http://localhost:6004",
    ghpages: "/esignet-plugins/release/react-sbi-integrator",
  },
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
  for (const [key, value] of Object.entries(references)) {
    newRefs[key] = {
      title: value.title,
      url: value[urlKey],
    };
  }
  return newRefs;
};
