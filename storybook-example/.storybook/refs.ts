/**
 * @fileoverview StorybookRefs content generated according to destination environment
 */
const path = require("path").resolve("./", `${process.env.PROFILE?.trim()}`);
const dotenv = require("dotenv").config({ path }).parsed;

/**
 * Generates a Storybook ref (`{ title: string; url: string }`) for each child storybook.
 *  `url` is chosen based on destination environment
 * @returns {Object.<string, import('@storybook/core-common').StorybookRefs>}
 */
export const getBranchRefs: any = (config, { configType }) => {
  // if version branch is not present
  // then returning empty reference
  if (!dotenv?.VERSION_BRANCH) {
    return {};
  }

  // version branch as a list/array
  const versionBranch = dotenv.VERSION_BRANCH.split(",").map((_) => _.trim());

  // getting base path, if not present taking default "mosip-plugins"
  let basePath = dotenv.BASE_PATH.trim() || "mosip-plugins";

  // if forward slash or http is not present
  // then adding a forward slash
  if (!basePath.match(/^(\/|http)/)) {
    basePath = "/" + basePath;
  }

  // creating a branch reference object with
  // {
  //   ...
  //   branchName1: { title: branchTitle1, url: branchUrl1 },
  //   ...
  // }
  return versionBranch.reduce(
    (branchRef, branch) => (
      (branchRef[branch] = { title: branch, url: `${basePath}/${branch}` }),
      branchRef
    ),
    {}
  );
};
