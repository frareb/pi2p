#!/bin/bash

GIT_COMMIT=$1

# Path to the Node API directory
API_DIR=".."

# Shut down PI2P API before update
# systemctl stop pi2p-api

# Checkout the requested commit
cd ${API_DIR}
git pull origin master
git checkout ${GIT_COMMIT}

npm ci --only=production

# Restart the API service
# systemctl start pi2p-api
