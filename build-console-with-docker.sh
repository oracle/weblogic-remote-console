#!/bin/bash

# Copyright 2021, 2025, Oracle Corporation and/or its affiliates.  All rights reserved.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

set -e

# Run the command via "." to get the DOCKER_ID variable
. ./run-this-in-docker.sh builder "
./prep.sh build
. ./prep-paths.sh
make $*
"
