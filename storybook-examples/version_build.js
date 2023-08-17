const { execSync } = require("child_process");

const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve("./", ".env"),
}).parsed;

// using the branch name from this list, to create version
const versionBranch = dotenv.VERSION_BRANCH.split(",");

const scriptList = [];
// default storybook build command
const storybookBuildCmd =
  "npm run build -- -o storybook-static";

// method to print message with star header and footer
const printMessage = (message) => {
  console.log("\n\n\n");
  console.log("**************************************************************");
  console.log(message);
  console.log("**************************************************************");
};

// executing the parent storybook which contain about page
printMessage("Start building storybook-example");
execSync("npm run build");
printMessage("Storybook-example building complete");

versionBranch.forEach((currentBranch) => {
  // add script to checkout the current branch
  scriptList.push({
    cmd: `git checkout ${currentBranch}`,
    msg: `Checkout to branch ${currentBranch}`,
  });

  // building storybook for current branch
  scriptList.push({
    cmd: `${storybookBuildCmd}/${currentBranch}`,
    msg: `Building storybook for ${currentBranch} branch`,
  });
});

// executing script serially
scriptList.forEach((_) => {
  printMessage(_.msg);
  execSync(_.cmd);
});

// Deploying storybook in github pages
printMessage("Deploying storybook in github pages");
execSync("npm run deploy");
