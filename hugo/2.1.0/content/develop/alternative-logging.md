---
title: Use an alternative logging configuration file
date: 2021-09-01
draft: false
description: Instructions if you want to use an alternative logging.properties file
weight: 3
---

By default, the WebLogic Remote Console uses the `logging.properties` file inside the `runnable/console-backend-server-{version}.jar` file.

If the default configuration is sufficient, then you don't need to do anything. However, if you want to tweak the logger configuration without regenerating the `runnable/console-backend-server-{version}.jar` file, you can pass the `-Djava.util.logging.config.file=<path-to-logging.properties>` Java system property when starting the console.

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