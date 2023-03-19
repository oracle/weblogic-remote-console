#!/bin/bash

# Copyright 2021, 2023, Oracle Corporation and/or its affiliates.  All rights reserved.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

set -e

# Run the command via "." to get the DOCKER_ID variable
. ./run-this-in-docker.sh builder "
./prep.sh build
chown -R oracle /build
su oracle -c make
"

rm -rf runnable installer/target frontend/web
mkdir -p runnable installer/target frontend/web
docker cp $DOCKER_ID:/build/runnable/. runnable
docker cp $DOCKER_ID:/build/installer/target/. installer/target
docker cp $DOCKER_ID:/build/frontend/web/. frontend/web
