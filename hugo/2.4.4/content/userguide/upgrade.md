---
title: Upgrade the WebLogic Remote Console
date: 2021-09-01
draft: false
description: Instructions for upgrading the WebLogic Remote Console
weight: 4
---

We encourage you to stay up to date with the latest version of the WebLogic Remote Console since it is regularly updated to work with the latest versions of WebLogic Server, including patches.

{{% notice note %}}
The WebLogic Remote Console extension is periodically updated to incorporate new functionality. When upgrading the WebLogic Remote Console, check to see if there's a newer version of the extension available so you can enjoy all of the newest features. 

Delete and replace any previous versions of the extension. Keeping multiple versions of the extension installed can lead to unexpected behavior.

The latest version is `console-rest-ext-3.0.war`. 
{{% /notice %}}

## Desktop application
To check for newer versions of the desktop application, go to **Help** > **Check For Updates**. If a newer version is available, a dialog box will open where you can choose to go to the GitHub webpage for the latest WebLogic Remote Console release. If you're already on the latest version, no further action is required.

If you regularly use `config.json` to customize the default connection settings of the WebLogic Remote Console, consider backing up `config.json` in a separate location to easily restore it following the upgrade.

1. Download the latest version from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases).
1. Close the WebLogic Remote Console.
1. Run the installer for the new version of WebLogic Remote Console. Follow the instructions at [Install WebLogic Remote Console]({{< relref "setup" >}}).

{{% notice note %}}
If you're on Windows and upgrading from 2.2.0 or earlier, the upgrade may fail when attempting to uninstall the previous version. To fix it, edit the `PATH` environment variable to ensure that `%SystemRoot%\system32` is the first entry that contains the `find` command, then retry the upgrade.
{{% /notice %}}


## Browser-based application

1. Download the latest version from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases).
1. Stop the WebLogic Remote Console.
1. Delete the console home directory (where you extracted the files from `console.zip`).
1. Follow the installation instructions at [Install WebLogic Remote Console]({{< relref "setup" >}}).

