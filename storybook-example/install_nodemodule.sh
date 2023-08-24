home_dir=$(pwd)
cd $1

echo "*************************************************"
echo "Inside ${PWD##*/} folder, installing node_modules"
echo "*************************************************"

npm ci

echo "****************************************"
echo "Installation of node_modules is complete"
echo "****************************************"

cd $home_dir