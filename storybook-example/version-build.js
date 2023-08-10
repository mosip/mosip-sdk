const { execSync } = require("child_process");

const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve("./", ".env"),
}).parsed;

// path in which the storybook build will be place
const buildPathList = dotenv.BUILD_FOLDER_PATH.split(",");
// actual path in the current repo
const actualPathList = dotenv.ACTUAL_FOLDER_PATH.split(",");
// creating version using the list
const versionList = dotenv.VERSION_LIST.split(",");
// using the branch name from this list, to create version
const versionBranch = dotenv.VERSION_BRANCH.split(",");

const scriptList = [];
const m = versionList.length;
const n = buildPathList.length;
// default storybook build command
const storybookBuildCmd =
  "npm run build-storybook -- -o ../storybook-example/storybook-static";

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

for (let i = 0; i < m; i++) {
  // add script to checkout the intended branch
  scriptList.push({
    cmd: `git checkout ${versionBranch[i]}`,
    msg: `Checkout to branch ${versionBranch[i]}`,
  });
  for (let j = 0; j < n; j++) {
    // add sccript for every component of every branch
    scriptList.push({
      cmd: `cd ../${actualPathList[j]} && ${storybookBuildCmd}/${versionList[i]}/${buildPathList[j]}`,
      msg: `${versionList[i]} build of ${buildPathList[j]}`,
    });
  }
}

// executing script serially
scriptList.forEach((_) => {
  printMessage(_.msg);
  execSync(_.cmd);
});

// Deploying storybook in github pages
printMessage("Deploying storybook in github pages");
execSync("npm run deploy");
