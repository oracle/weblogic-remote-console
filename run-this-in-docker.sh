#!/bin/bash
# Copyright 2020, 2023, Oracle Corporation and/or its affiliates.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

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

cleanup() {
  rm -rf $tmpdir
  if [ -n "$DOCKER_ID" ]
  then
    docker kill $DOCKER_ID > /dev/null 2>&1 || true
    docker rm $DOCKER_ID || true
  fi
}

set -e
case "$1" in
builder|runner)
  IMAGE=${CONSOLE_BUILD_IMAGE:-wls-docker-dev-local.dockerhub-phx.oci.oraclecorp.com/remote-console-build:2.4.2}
  ;;
weblogic)
  IMAGE=${CONSOLE_WEBLOGIC_IMAGE:-container-registry.oracle.com/middleware/weblogic:14.1.1.0}
  ;;
*)
  echo "Usage: $0 [builder|runner|weblogic] command" >&2
  exit 1
esac

shift

if [ -d /tmp/rancher-desktop ]
then
  tmpdir="/tmp/rancher-desktop/console-build.$$"
else
  tmpdir="/tmp/console-build.$$"
fi
mkdir -p $tmpdir
tmp="$tmpdir/script"

cat > $tmp <<!
#!/bin/bash
set -e
set -x
umask 000
$PREP_COMMANDS
export DOWNLOAD_JAVA_URL=$DOWNLOAD_JAVA_URL
export DOWNLOAD_NODE_URL=$DOWNLOAD_NODE_URL
export NPM_PREP_COMMANDS="$NPM_PREP_COMMANDS"
export JAVA_OPTS="$JAVA_OPTS"
export MW_HOME=/u01/oracle
export WL_HOME=\$MW_HOME/wlserver
. \$WL_HOME/server/bin/setWLSEnv.sh
set -o allexport
$(set | grep '^CONSOLE' | grep -v /home/)
rm -rf /build
mkdir -p /build
mkdir -p ~/.m2
cp /tmp/mvn_settings.xml ~/.m2/settings.xml
cp -rp /build.in/. /build
cd /build
# Commands are in the arguments
$*
!
chmod 777 $tmp
trap "cleanup" EXIT

{
  echo "<settings>"
  echo "$MAVEN_SETTINGS"
  echo "</settings>"
} > $tmpdir/mvn_settings.xml

# Docker doesn't like use of the interactive option when not running on a
# terminal, but it's nice to be able to hit <ctrl-C>.
if [ -t 0 -a -t 1 ]
then
  it_option=-it
else
  it_option=
fi
set -x
do_docker_pull $IMAGE
DOCKER_ID=$(docker run -d \
  --name console-build.$$ \
  --network=host \
  -w /tmp \
  -e CONSOLE_TEST_PASSWORD="$CONSOLE_TEST_PASSWORD" \
  --mount type=bind,source="$PWD",destination=/build.in \
  --mount type=bind,source="$tmp",destination=/tmp/script,ro \
  --mount type=bind,source="$tmpdir/mvn_settings.xml",destination=/tmp/mvn_settings.xml,ro \
  --user=root \
  $it_option \
  --entrypoint=/tmp/script \
  $IMAGE
)
#timeout 28800 docker attach --no-stdin $DOCKER_ID
docker attach --no-stdin $DOCKER_ID
