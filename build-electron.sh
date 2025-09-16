#!/bin/bash
# Copyright 2021, 2025, Oracle and/or its affiliates.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

do_docker_pull() {
  if [ -z "$JENKINS_URL" ]
  then
    return 0
  fi
  for i in 1 2 3
  do
    if docker pull $1
    then
      return 0
    fi
    sleep $(($i * 30))
  done
  exit 1
}

set -e
set -x
doit_docker() {
  mkdir -p $tmp
  cat > $tmp/script <<!
#!/bin/bash
$NPM_PREP_COMMANDS
export DOWNLOAD_JAVA_URL=$DOWNLOAD_JAVA_URL
export DOWNLOAD_NODE_URL=$DOWNLOAD_NODE_URL
export DOWNLOAD_NODE_BASE=$DOWNLOAD_NODE_BASE
export DOWNLOAD_JAVA_TEMPLATE=$DOWNLOAD_JAVA_TEMPLATE
set -e
if ! type zip > /dev/null 2>&1
then
  # Assume it is Debian linux, which is what the electron builder image is
  apt -qq update -qq
  apt -qq install -y zip -qq
fi
[ -z "$DEBUG" ] || export DEBUG="$DEBUG"
[ -n "$FPM_DEBUG" ] || export DEBUG="$FPM_DEBUG"
export http_proxy=$http_proxy
export https_proxy=$https_proxy
export no_proxy=$no_proxy
if [ -n "$https_proxy" ]
then
  export ELECTRON_GET_USE_PROXY=true GLOBAL_AGENT_HTTPS_PROXY=$https_proxy GLOBAL_AGENT_NO_PROXY="$no_proxy" GLOBAL_AGENT_HTTP_PROXY="$http_proxy"
fi
umask 000
cd /build
export ALREADY_IN_DOCKER=true
mkdir -p /root/.npm
chmod -R 777 /root
./build-electron.sh $*
!
  ELECTRON_BUILDER_IMAGE=${ELECTRON_BUILDER_IMAGE:-wls-docker-dev-local.dockerhub-phx.oci.oraclecorp.com/electronuserland-builder-plus:18}
  if [ -n "$CONSOLE_DOCKER_MOUNT_DIRS" ]
  then
    declare -a EXTRA
    while :
    do
      i="${CONSOLE_DOCKER_MOUNT_DIRS%%,*}"
      EXTRA[${#EXTRA}]=--mount
      EXTRA[${#EXTRA}]="type=bind,source=$i,destination=$i,ro"
      if [ "$i" = "$CONSOLE_DOCKER_MOUNT_DIRS" ]
      then
        break
      fi
      CONSOLE_DOCKER_MOUNT_DIRS="${CONSOLE_DOCKER_MOUNT_DIRS#*,}"
    done
  fi
  do_docker_pull $ELECTRON_BUILDER_IMAGE
  chmod a+x $tmp/script
  build_copy="$PWD/tmp/copy"
  rm -rf "$build_copy"
  mkdir -p "$build_copy"
  find build-tools run runnable electron frontend *.sh | egrep -v '^tmp|/download-bin|/node_modules/' | cpio -pdulm "$build_copy"
  docker run -it \
    --rm \
    --network=host \
    -w /build \
    "${EXTRA[@]}" \
    --name electron-build.$$ \
    --mount type=bind,source="$build_copy",destination=/build \
    --mount type=bind,source="$tmp/script",destination=/tmp/script,ro \
    --entrypoint=/tmp/script \
    $ELECTRON_BUILDER_IMAGE &&
      rm -rf electron/dist &&
      mv "$build_copy"/electron/dist electron/dist
}

# Main
umask 022
if [ ! -f runnable/console.jar ]
then
  if [ ! -f installer/target/console.zip ]
  then
    echo "Must build first before running $0" >&2
    exit 1
  fi
  mkdir -p runnable
  rm -rf runnable/*
  unzip -q -d runnable installer/target/console.zip
  mv runnable/console/* runnable
  rm -rf runnable/console
fi

if [ -d /tmp/rancher-desktop ]
then
  tmp="/tmp/rancher-desktop/${0##*/}.$$"
else
  tmp="/tmp/${0##*/}.$$"
fi
if [ "$PWD" != /build ]
then
  trap "rm -rf $tmp" EXIT
fi

set -e

. run/detect_os.sh

# For linux, we build various different installers/executables and we use the
# electron builder docker image to do so, rather than requiring one to install
# the software to build rpms, debian packages, etc.
if [ -z "$ALREADY_IN_DOCKER" ]
then
  case "$os" in
  linux)
    rm -rf electron/dist electron/extraFiles
    doit_docker "$@"
    exit 0
  esac
fi

buildtype=external
buildarch=$arch
while [ -n "$1" ]
do
  case "$1" in
  --type)
    shift
    buildtype="$1"
    ;;
  --arch)
    shift
    buildarch="$1"
    ;;
  *)
    break
  esac
  shift
done

NEW_JAVA_BIN="$(run/get_java)"
if [ -n "$NEW_JAVA_BIN" ]
then
  PATH="$NEW_JAVA_BIN$pathsep$PATH"
fi

if [ "$arch" != "$buildarch" ]
then
  TARGET_ARCH_DIR=$(run/get_java -a $buildarch)
  # The Mac structures things differently.  Let's
  # just find the JAVA_HOME by finding it
  while [ ! -d "$TARGET_ARCH_DIR/jmods" ]
  do
    TARGET_ARCH_DIR=${TARGET_ARCH_DIR%/*}
    if [ -z "$TARGET_ARCH_DIR" ]
    then
      echo Cannot find jmods directory for $buildarch >&2
      exit 1
    fi
  done
fi

NEW_NPM="$(run/get_npm)"
if [ -n "$NEW_NPM" ]
then
  PATH="$NEW_NPM$pathsep$PATH"
fi

$NPM_PREP_COMMANDS

cd ./electron

if [ -n "$https_proxy" ]
then
  export ELECTRON_GET_USE_PROXY=true GLOBAL_AGENT_HTTPS_PROXY=$https_proxy
fi

npm install

rm -rf dist

extra=extraFiles
rm -rf $extra

case "$os" in
darwin)
  extra=$extra/MacOS
esac
mkdir -p "$extra"

if [ "$os" = windows ]
then
  extra_modules=",jdk.crypto.mscapi"
fi

if [ -n "$TARGET_ARCH_DIR" ]
then
  EXTRA[0]=--module-path
  EXTRA[1]="$TARGET_ARCH_DIR"/jmods
fi
# Make a Custom JRE (if we had modules, we could do more, but this is fine)
jlink --output "$extra"/customjre "${EXTRA[@]}" --no-header-files --no-man-pages --compress=zip-6 --strip-debug --add-modules java.base,java.desktop,java.logging,java.management,java.naming,java.sql,java.xml,jdk.crypto.ec,jdk.unsupported$extra_modules

mkdir -p "$extra"/backend
cp -r ../runnable/* "$extra"/backend

# We allow the building of multiple variants on the image via a custom script.
# For example, if one wants to build a special version for the Memphis office,
# you can create electron/custom/memphis and invoke "build-electron.sh memphis".
cp package.json "$extra"
rm -f electron-builder-custom.json
cp electron-builder.json electron-builder-custom.json
cp electron-builder-custom.json "$extra"

trap 'rm -f "$PWD/electron-builder-custom.json"' 0

if [ -x "custom/pre-$os" ]
then
  "custom/pre-$os" electron-builder-custom.json "$extra"
fi

if [ -f "custom/$buildtype" -a -x "custom/$buildtype" ]
then
  command="custom/$buildtype"
  "$command" electron-builder-custom.json "$extra"
fi

set -- "$@" -c electron-builder-custom.json

./gen-messages "$extra"/resources/nls ../frontend/src/resources/nls/frontend*.properties

set -- --$buildarch "$@"

while [ "$1" = -- ]
do
  shift
done

npx electron-builder -p never "$@"

case "$os" in
darwin)
  for mac_dir in dist/mac*
  do
    mac_suffix=${mac_dir#dist/mac}
    # Create a second copy of the executable for use by WKT UI, so that Mac OS thinks
    # that they are two separate programs and let's you run them.
    cd $mac_dir
    cp -p "WebLogic Remote Console.app/Contents/MacOS/WebLogic Remote Console" "WebLogic Remote Console.app/Contents/MacOS/Embeddable Remote Console"
    zip ../*.zip "WebLogic Remote Console.app/Contents/MacOS/Embeddable Remote Console"
    cd ../..
  done
esac

# Different organizations have different ways of implementing signing.  Therefore,
# we allow for one to plug in custom signing scripts.
if [ -x custom/sign ]
then
  custom/sign "$@"
else
  case "$os" in
  darwin)
    if [ -x custom/signMac ]
    then
      custom/signMac "$@"
    fi
    ;;
  windows)
    if [ -x custom/signWindows ]
    then
      custom/signWindows
    fi
    ;;
  linux)
    if [ -x custom/signLinux ]
    then
      custom/signLinux
    fi
  esac
fi

# Restating from above, we allow the building of multiple variants on the image via a custom script.
# For example, if one wants to build a special version for the Memphis office,
# you can create electron/custom/memphis and invoke "build-electron.sh memphis".
#
# You can create electron/custom/memphis-post to post-process the build as well.
cp package.json "$extra"
if [ -f "custom/$buildtype-post" -a -x "custom/$buildtype-post" ]
then
  command="custom/$buildtype-post"
  "$command"
fi
