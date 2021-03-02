#!/bin/bash

# Copyright 2020, Oracle Corporation and/or its affiliates.  All rights reserved.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

mydir=$PWD
cd ..
if find $mydir -name '*.java' | xargs java -jar build-tools/checkstyle-8.36-all.jar -c=build-tools/src/main/resources/checkstyle/customized_google_checks.xml | grep WARN
then
  exit 1
fi
