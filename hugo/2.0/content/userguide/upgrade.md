---
title: Upgrade the WebLogic Remote Console
date: 2021-09-01
draft: false
description: Instructions for upgrading the WebLogic Remote Console
weight: 4
---

While not required, it's recommended that you keep WebLogic Remote Console up to date as it is updated to work with the latest versions of WebLogic Server, including patches.

## Desktop application
If you regularly use `config.json` to customize the default connection settings of the WebLogic Remote Console, consider backing up `config.json` in a separate location to easily restore it following the upgrade.

1. Download the latest version from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases).
1. Stop the WebLogic Remote Console.
1. Uninstall the WebLogic Remote Console application according to the guidelines for your operating system.
1. Follow the installation instructions at [Install WebLogic Remote Console]({{< relref "setup" >}}).

## Browser-based application

1. Download the latest version from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases).
1. Stop the WebLogic Remote Console.
1. Delete the console home directory (where you extracted the files from `console.zip`).
1. Follow the installation instructions at [Install WebLogic Remote Console]({{< relref "setup" >}}).

