#!/bin/bash

# Copyright 2020, 2021, Oracle and/or its affiliates.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

set -e
set -x

# If we don't have RPM, we can't really fix anything with this script
if ! type rpm > /dev/null 2>&1
then
  exit 0
fi
if ! type npm > /dev/null 2>&1
then
  curl -sL https://rpm.nodesource.com/setup_14.x | bash
fi
if ! rpm -q gcc-c++ make nodejs zip unzip jq util-linux vim-minimal python3-pip > /dev/null 2>&1
then
  yum install -y gcc-c++ make nodejs zip unzip jq util-linux vim-minimal python3-pip
fi

$NPM_PREP_COMMANDS

if ! npm list -g @oracle/ojet-cli@11.1.0 > /dev/null 2>&1
then
  npm install -g @oracle/ojet-cli@~11.1.0
fi

case " $* " in
*" test "*)
  if ! type yq > /dev/null 2>&1
  then
    pip3 install yq
  fi
  if ! rpm -q google-chrome-stable > /dev/null 2>&1
  then
    curl -o chrome.rpm https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
    yum-config-manager --enable ol7_optional_latest
    yum install -y chrome.rpm
  fi
esac

if ! type mvn > /dev/null 2>&1
then
  if [ -f /u01/oracle/oracle_common/modules/thirdparty/apache-maven_bundle/3.6.1.0.0/apache-maven-3.6.1/bin/mvn ]
  then
    ln -s /u01/oracle/oracle_common/modules/thirdparty/apache-maven_bundle/3.6.1.0.0/apache-maven-3.6.1/bin/mvn /bin
  else
    yum install -y maven
  fi
fi

case "$(id)" in
*root*)
  chown -R oracle ~oracle >/dev/null 2>&1 || true
esac
