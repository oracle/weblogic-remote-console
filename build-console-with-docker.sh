#!/bin/bash

# Copyright 2021, 2025, Oracle Corporation and/or its affiliates.  All rights reserved.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

set -e

# Run the command via "." to get the DOCKER_ID variable
. ./run-this-in-docker.sh builder "
./prep.sh build
. ./prep-paths.sh
chown -R oracle /build
su oracle -c \"make $*\"
"

rm -rf runnable installer/target frontend/web
mkdir -p runnable installer/target frontend/web
if ! docker cp $DOCKER_ID:/build/runnable/. runnable
then
  # Seems to be a timing issue intermittently in podman,
  # so try again
  sleep 3
  docker cp $DOCKER_ID:/build/runnable/. runnable
fi
docker cp $DOCKER_ID:/build/installer/target/. installer/target
docker cp $DOCKER_ID:/build/frontend/web/. frontend/web
docker cp $DOCKER_ID:/build/sample-security-providers/target sample-security-providers || true
docker cp $DOCKER_ID:/build/on-weblogic/target on-weblogic || true
docker cp $DOCKER_ID:/build/console-rest-ext/target console-rest-ext || true
docker cp $DOCKER_ID:/build/wls-remote-console-helper-war/war/target wls-remote-console-helper-war/war || true
if [ -f console-rest-ext/target/*.war ]
then
  cp console-rest-ext/target/*.war runnable || true
fi
