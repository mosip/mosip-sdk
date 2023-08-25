#!/bin/bash

set -e

# Load environment variables from .env file
source .env

# Download the zip file
curl -o secure-biometric-interface-integrator-bundle.zip "$artifactory_url_env/artifactory/libs-release-local/i18n/secure-biometric-interface-integrator-bundle.zip"

# Unzip the file
unzip secure-biometric-interface-integrator-bundle.zip -d extracted_contents

# Move the contents to the assets/locales folder
mv extracted_contents/* assets/locales/

# Remove the extracted_contents directory
rm -r extracted_contents

# Remove the downloaded zip file
rm secure-biometric-interface-integrator-bundle.zip

echo "[+] Executed the script successfully"
