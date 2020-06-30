#!/bin/bash

GIT_COMMIT=$1

# Path to the Node API directory
API_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )/.."

# Checkout the requested commit
cd ${API_DIR}
git checkout .
git pull origin master
git checkout ${GIT_COMMIT}

npm ci --only=prod

# Restart the API service
systemctl restart pi2p
