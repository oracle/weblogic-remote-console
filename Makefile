# Copyright (c) 2020, 2023, Oracle and/or its affiliates.
# Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

MAVEN_TARGET = clean install

all:
	[ -z "$$https_proxy" ] || export ELECTRON_GET_USE_PROXY=true GLOBAL_AGENT_HTTPS_PROXY=$$https_proxy GLOBAL_AGENT_NO_PROXY="$$no_proxy"; \
	export PUPPETEER_SKIP_DOWNLOAD=true CHROMEDRIVER_SKIP_DOWNLOAD=true; \
	mvn -B ${MAVEN_TARGET} ${MAVEN_FLAGS}
	rm -rf runnable
	unzip -q -d runnable installer/target/console.zip
	mv runnable/console/* runnable
	rm -r runnable/console

clean:
	mvn clean
	rm -rf runnable
