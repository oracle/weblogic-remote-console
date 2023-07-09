#!/bin/bash

# Copyright 2020, 2023, Oracle Corporation and/or its affiliates.  All rights reserved.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

set -e

CHECKSTYLE_JAR="target/checkstyle.jar"
DOWNLOAD_CHECKSTYLE_URL=${DOWNLOAD_CHECKSTYLE_URL:-https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.11.0/checkstyle-10.11.0-all.jar}
if ! unzip -v "$CHECKSTYLE_JAR" > /dev/null 2>&1
then
  mkdir -p "${CHECKSTYLE_JAR%/*}"
  if ! curl -s -L -o "$CHECKSTYLE_JAR" ${DOWNLOAD_CHECKSTYLE_URL}
  then
    echo Cannot download checkstyle, exiting >&2
    exit 1
  fi
fi

tmp="/tmp/checkstyle.out"
rm -f "$tmp"

case "$0" in
*/*)
  BTDIR="${0%/*}"
  ;;
*)
  BTDIR="./build-tools"
esac

if ! java -Dorg.checkstyle.google.suppressionfilter.config="$BTDIR"/src/main/resources/checkstyle/suppressions.xml -jar "$CHECKSTYLE_JAR" -c="$BTDIR"/src/main/resources/checkstyle/customized_google_checks.xml $(find * -name '*.java') > $tmp 2>&1 || grep -q WARN "$tmp"
then
  cat $tmp
  exit 1
fi
