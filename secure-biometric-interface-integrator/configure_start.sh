#!/bin/bash

set -e

# Load environment variables from .env file
source .env

# Download the zip file
curl -o secure-biometric-interface-integrator-bundle.zip "$artifactory_url_env/artifactory/libs-release-local/i18n/secure-biometric-interface-integrator-bundle.zip"


# Check if the downloaded file is a valid zip file
if ! unzip -t secure-biometric-interface-integrator-bundle.zip &>/dev/null; then
    echo "[-] Error: The downloaded file is not a valid zip archive."
    rm secure-biometric-interface-integrator-bundle.zip
    exit 1
fi

# Unzip the file
unzip secure-biometric-interface-integrator-bundle.zip -d extracted_contents

# Move the contents to the assets/locales folder
mv extracted_contents/* assets/locales/

# Remove the extracted_contents directory
rm -r extracted_contents

# Remove the downloaded zip file
rm secure-biometric-interface-integrator-bundle.zip

echo "[+] Executed the script successfully"
