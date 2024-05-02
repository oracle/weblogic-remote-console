---
title: Build from source
date: 2021-09-01
draft: false
description: Instructions if you want to build WebLogic Remote Console from source
weight: 1
---

### Prerequisites {id="prerequisites"}

Before you can build the WebLogic Remote Console, you need to install the following software in your local build environment:

* [Java SE 11+](https://www.oracle.com/java/technologies/downloads)
* [Maven 3.6.1+](https://maven.apache.org/download.cgi)
* [Node.js 18.0.0+](https://nodejs.org/en/download/) This download includes npm.
* [Oracle JET 15.1.0 client libraries](https://www.oracle.com/tools/downloads/jet-downloads.html) To install the required Oracle JET software, run `npm install --location=global @oracle/ojet-cli@~15.1.0`. On Linux and macOS, you will need to use `sudo`.

You can verify you've installed the correct versions of the listed software by running the following commands:

```
   java -version
   mvn --version
   node -v
   ojet --version
```

### Build from source {id="source"}

1. Clone the repository at [https://github.com/oracle/weblogic-remote-console](https://github.com/oracle/weblogic-remote-console).
1. Open a command window and navigate to the home directory of the cloned repository.
1. Run `mvn clean install`. After the build finishes, confirm that `/installer/target/console.zip` was created.
1. From the home directory of the repository, run the `build-electron.sh` script.

The WebLogic Remote Console executable file is created under `/electron/dist/`.

To install the WebLogic Remote Console, follow the instructions at [Get Started]({{< relref "setup/_index.md#install" >}}).

{{%expand "It's also possible, though not recommended, to use console.zip to run the WebLogic Remote Console as a browser application."%}}
{{% notice warning %}}
The browser application has significant limitations in terms of both security and functionality. It should be used for development purposes **only**.
{{% /notice %}}
1. After running `mvn clean install`, extract the contents of `/installer/target/console.zip` to a new directory. 
1. Open a command window and navigate to the new directory. 
1. Run `java -jar console.jar`. 
1. Open a browser window and enter `http://localhost:8012` in the address bar.

{{% /expand%}}
