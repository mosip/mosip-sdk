#!/bin/bash
# installing node module in various plugin folder 
# plugin folder is taken from env variable

printMessage () {
    echo "**************************************"
    echo $1
    echo "**************************************"
}

getPluginFolderThenInstallNode () {
    set -a
    source ./.env
    set +a

    IFS="," read -r -a pluginFolderPath <<< $PLUGINS_FOLDER
    for element in "${pluginFolderPath[@]}"
    do
        folderPath="../$(echo -e "${element}" | tr -d '[:space:]')"
        source ./install_nodemodule.sh $folderPath
    done
}

getPluginFolderThenInstallNode

printMessage "Start building storybook-example"
npm run build
printMessage "Storybook-example building complete"


# getting branch list if available
[ -z "$VERSION_BRANCH" ] && versionBranchList=() || IFS="," read -r -a versionBranchList <<< $VERSION_BRANCH
for version in "${versionBranchList[@]}"
do
    versionBranch="$(echo -e "${version}" | tr -d '[:space:]')"
    printMessage "git checkout ${versionBranch}"
    git checkout ${versionBranch}

    printMessage "Started Installing node module for ${versionBranch} branch"
    getPluginFolderThenInstallNode

    printMessage "Building storybook ${versionBranch} branch"
    npm run build -- -o storybook-static/${versionBranch}
done

# Deploying storybook in github pages
printMessage "Deploying storybook in github pages"
npm run deploy
