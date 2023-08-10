const { execSync } = require("child_process");

const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve("./", ".env"),
}).parsed;

const buildPathList = dotenv.BUILD_FOLDER_PATH.split(",");
const actualPathList = dotenv.ACTUAL_FOLDER_PATH.split(",");
const versionList = dotenv.VERSION_LIST.split(",");
const versionBranch = dotenv.VERSION_BRANCH.split(",");

const scriptList = [];
const m = versionList.length;
const n = buildPathList.length;
const storybookBuildCmd =
  "npm run build-storybook -- -o ../storybook-example/storybook-static";

const printMessage = (message) => {
  console.log("\n\n\n");
  console.log("**************************************************************");
  console.log(message);
  console.log("**************************************************************");
};

printMessage("Start building storybook-example");
execSync("npm run build");
printMessage("Storybook-example building complete");


for (let i = 0; i < m; i++) {
    scriptList.push({
        cmd: `git checkout ${versionBranch[i]}`,
        msg: `Checkout to branch ${versionBranch[i]}`
    });
    for (let j=0;j<n;j++) {
        scriptList.push({
            cmd: `cd ../${actualPathList[j]} && ${storybookBuildCmd}/${versionList[i]}/${buildPathList[j]}`,
            msg: `${versionList[i]} build of ${buildPathList[j]}`
        })
    }
}

scriptList.forEach((_) => {
    printMessage(_.msg);
    execSync(_.cmd);
})

// const devScriptArray = [];
// const releaseScriptArray = [];
// // for dev path
// for (let i = 0; i < n; i++) {
//   devScriptArray.push({
//     cmd: `cd ../${actualPathList[i]} && ${storybookBuildCmd}/${dotenv.DEV_PATH}/${buildPathList[i]}`,
//     msg: `${dotenv.DEV_PREFIX} build of ${buildPathList[i]}`,
//   });
// }

// // for release path
// for (let i = 0; i < n; i++) {
//   releaseScriptArray.push({
//     cmd: `cd ../${actualPathList[i]} && ${storybookBuildCmd}/${dotenv.RELEASE_PATH}/${buildPathList[i]}`,
//     msg: `${dotenv.RELEASE_PREFIX} build of ${buildPathList[i]}`,
//   });
// }

// // executing dev environment storybook build
// devScriptArray.forEach((_) => {
//   printMessage(_.msg);
//   execSync(_.cmd);
// });

// // checkout to release branch
// printMessage("Git Checkout to release branch");
// execSync("npm run checkout:release");

// // executing release environment storybook build
// releaseScriptArray.forEach((_) => {
//   printMessage(_.msg);
//   execSync(_.cmd);
// });
