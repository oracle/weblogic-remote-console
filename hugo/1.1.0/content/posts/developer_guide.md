---
title: Developer Guide
date: 2021-04-27
draft: false
description: Developer guide
weight: 4
---

- [Prerequisites](#prerequisites)
- [Build the Remote Console From Source](#build)
- [Use an Alternate logging.properties file](#logging)

## Prerequisites {id="prerequisites"}
To build the WebLogic Remote Console, you need the following software installed in your local build environment:
* [Java SE 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
* [Maven 3.6.1+](https://maven.apache.org/download.cgi)
* [nodejs 12.16+](https://nodejs.org/en/download/) This download includes npm.
* [Oracle JET 10.1.0 client libraries](https://www.oracle.com/tools/downloads/jet-downloads.html). To install the required Oracle JET software, run:
   ```
   npm install -g @oracle/ojet-cli@~10.1.0
   ```
   On Linux and macOS, you will need to use `sudo`.

### Verify Prerequisites
```
   java -version
   mvn --version
   node -v
   ojet --version

```
## Build the Remote Console From Source {id="build"}
1. Clone the repository at [https://github.com/oracle/weblogic-remote-console](https://github.com/oracle/weblogic-remote-console).
1. In a command window, navigate to the home directory of the cloned repository.
2. Run `mvn clean install`.

When the build is successful, a `console.zip` file is created in the `console-backend/installer/target` directory. You can now install and run the Remote Console as described in [Install and Configure the WebLogic Remote Console]({{< relref "install_config" >}})


## Use an Alternate `logging.properties` File {id="logging"}
By default, the WebLogic Remote Console uses the `logging.properties` file inside the `runnable/console-backend-server-{version}.jar` file.

If the default configuration is sufficient, then you don't need to do anything. However, if you need to tweak the logger configuration WITHOUT regenerating the `runnable/console-backend-server-{version}.jar` file, you can pass the `-Djava.util.logging.config.file=<path-to-logging.properties>` Java system property when starting the console.

For example:
```
-Djava.util.logging.config.file=runnable/etc/logging.properties
```
If there is a problem using the specified path, then the `logging.properties` inside the `runnable/console-backend-server-{version}.jar` file is used. Either way, a log message is written to `STDOUT` stating which file was used:
```
Logging configured using /gitlab-odx/weblogic/console-backend/runnable/etc/logging.properties
```
or
```
Logging configured using /logging.properties
```

For examples of entries that can be placed into the custom `logging.properties` specified above, see the repository source file located at `server/src/main/resources/logging.properties`.
