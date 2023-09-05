const { execSync } = require("child_process");

const profile = process.env.PROFILE.trim();
const path = require("path").resolve("./", profile);
const dotenv = require("dotenv").config({ path }).parsed;

// method to print message with star header and footer
const printMessage = (message) => {
  console.log("\n");
  console.log("**************************************************************");
  console.log(message);
  console.log("**************************************************************");
  console.log("\n");
};

// method for installing node modules
const installNodeModule = () => {
  const path = require("path").resolve("./", profile);
  const dotenv = require("dotenv").config({
    path,
  }).parsed;

  const pluginsFolderList =
    dotenv.PLUGINS_FOLDER.trim() === ""
      ? []
      : dotenv.PLUGINS_FOLDER.split(",").map((_) => _.trim());

  pluginsFolderList.forEach((_) => {
    printMessage(`Changing directory to ../${_} and installing node modules`);
    execSync(`cd ../${_} && (npm ci || npm i)`);
  });
};

// install node module for the current branch
installNodeModule();

// executing the parent storybook which contain about page
printMessage("Start building storybook-example");
execSync("npm run build");
printMessage("Storybook-example building complete");

// default storybook build command
const storybookBuildCmd = `env PROFILE=${profile} npm run build -- -o storybook-static`;

// using the branch name from this list, to create version
const versionBranch =
  dotenv.VERSION_BRANCH.trim() === ""
    ? []
    : dotenv.VERSION_BRANCH.split(",").map((_) => _.trim());

versionBranch.forEach((branch) => {
  // execute script to checkout to the new branch
  printMessage(`Checkout to branch ${branch}`);
  execSync(`git checkout ${branch}`);

  // installing node modules for plugins folder
  // in checkout branch
  installNodeModule();

  // building storybook for checkout branch
  printMessage(`Building storybook for ${branch} branch`);
  execSync(`${storybookBuildCmd}/${branch}`);
});
