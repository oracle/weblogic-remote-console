#!/bin/bash
do_docker_pull() {
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
doit_docker() {
  mkdir -p $tmp
  cat > $tmp/script <<!
#!/bin/bash
$NPM_PREP_COMMANDS
export DOWNLOAD_JAVA_URL=$DOWNLOAD_JAVA_URL
export DOWNLOAD_NODE_URL=$DOWNLOAD_NODE_URL
set -e
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
cp -rp /build.in/. /build
cd /build
export ALREADY_IN_DOCKER=true
./build-electron.sh $*
rm -rf /build.in/electron/dist
cp -rp electron/dist /build.in/electron
!
  ELECTRON_BUILDER_IMAGE=${ELECTRON_BUILDER_IMAGE:-electronuserland/builder:12}
  do_docker_pull $ELECTRON_BUILDER_IMAGE
  chmod a+x $tmp/script
  docker run \
    --network=host \
    --name electron-build.$$ \
    --mount type=bind,source="$PWD",destination=/build.in \
    --mount type=bind,source="$tmp/script",destination=/tmp/script,ro \
    --entrypoint=/tmp/script \
    $ELECTRON_BUILDER_IMAGE
}

# If we're running inside docker, copy the output out at the end
copyout() {
  chmod -R a+rw /build/electron/dist
  cp -rp /build/electron/dist /build.in/electron
}

# Main
if [ ! -f runnable/console.jar ]
then
  echo "Must build first before running $0" >&2
  exit 1
fi
case "$(uname -a)" in
*indow*|*Msys*)
  os=windows
  # It depends on what shell you are running
  case "$PATH" in
  *';'*';'*)
    pathsep=';'
    ;;
  *)
    pathsep=:
  esac
  ;;
*arwin*)
  os=darwin
  pathsep=:
  ;;
*)
  os=linux
  pathsep=:
esac

if [ -d /tmp/rancher-desktop ]
then
  tmp="/tmp/rancher-desktop/${0##*/}.$$"
else
  tmp="/tmp/${0##*/}.$$"
fi
if [ "$PWD" = /build ]
then
  trap copyout EXIT
else
  trap "rm -rf $tmp" EXIT
fi

set -e

if [ -z "$ALREADY_IN_DOCKER" ]
then
  case "$os" in
  linux)
    rm -rf electron/dist electron/extraFiles
    doit_docker "$@"
    exit 0
  esac
fi

# Legally, the thing we ship must be openjdk
NEW_JAVA_BIN="$(run/get_java --openjdk)"
if [ -n "$NEW_JAVA_BIN" ]
then
  PATH="$NEW_JAVA_BIN$pathsep$PATH"
fi

# For some reason, electron build is failing with 16.  Just use 14 for now.
NEW_NPM="$(run/get_npm.14)"
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

# Make a Custom JRE (if we had modules, we could do more, but this is fine)
jlink --output "$extra"/customjre --no-header-files --no-man-pages --compress=2 --strip-debug --add-modules java.base,java.desktop,java.logging,java.management,java.naming,java.sql,java.xml,jdk.unsupported$extra_modules

mkdir -p "$extra"/backend
cp -rp ../runnable/* "$extra"/backend
cp -p package.json "$extra"
if [ "$1" = internal ]
then
  shift
  cp -p internal-feed-url.json "$extra/feed-url.json"
fi

npm run dist "$@"

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

if set | grep -q CODESIGNBUREAU
then
  case "$os" in
  darwin)
    for mac_dir in dist/mac*
    do
      mac_suffix=${mac_dir#dist/mac}
      ./signMac $mac_dir/"WebLogic Remote Console.app" signed/mac${mac_suffix}/"WebLogic Remote Console.app"
      # Regenerate using the signed version
      "$(npm bin)/electron-builder" -p never --pd="signed/mac${mac_suffix}/WebLogic Remote Console.app"
    done
    ;;
  windows)
    rm -rf "$tmp"/*
    mkdir -p "$tmp"
    mv dist/*.exe "$tmp"
    java -jar CSS-Client.jar sign -user weblogic_remote_console_grp -global_uid lfeigen -signed_location "dist" -sign_method microsoft -file_to_sign "$tmp"/*.exe
    chmod +x dist/*.exe
  esac
fi
