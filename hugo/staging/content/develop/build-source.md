---
title: Build from source
date: 2021-09-01
draft: false
description: Instructions if you want to build WebLogic Remote Console from source
weight: 1
---

### Prerequisites {id="prerequisites"}

Before you can build the WebLogic Remote Console, you need to install the following software in your local build environment:

* [Java SE 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
* [Maven 3.6.1+](https://maven.apache.org/download.cgi)
* [nodejs 14.16+](https://nodejs.org/en/download/) This download includes npm.
* [Oracle JET 12.1.0 client libraries](https://www.oracle.com/tools/downloads/jet-downloads.html) To install the required Oracle JET software, run `npm install -g @oracle/ojet-cli@~12.1.0`. On Linux and macOS, you will need to use `sudo`.

You can verify you've installed the correct versions of the listed software by running the following commands:

```
   java -version
   mvn --version
   node -v
   ojet --version
```

### Build from source {id="source"}
1. Clone the repository at [https://github.com/oracle/weblogic-remote-console](https://github.com/oracle/weblogic-remote-console).
1. In a command window, navigate to the home directory of the cloned repository.
1. Run `mvn clean install`.

When the build is successful, a `console.zip` file is created in the `console-backend/installer/target` directory. You can now install and run the Remote Console as described in [Install the WebLogic Remote Console]({{< relref "setup" >}}).