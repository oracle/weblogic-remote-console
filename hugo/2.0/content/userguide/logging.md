---
title: Check Log Files
date: 2021-09-01
draft: false
description: Instructions for the accessing log files for the WebLogic Remote Console
weight: 5
---

You can inspect log files to ensure that the WebLogic Remote Console is functioning correctly.

## Front end

To view the log file for issues related to the front end of the WebLogic Remote Console:

#### Desktop application
Open **View** > **Toggle Developer Tools** and select the **Console** tab.

#### Browser application
In the browser tab with WebLogic Remote Console, open the Developer Tools and select the **Console** tab.

## Back end

To view the log file for issues related to the back end of the WebLogic Remote Console:

#### Desktop application
Open the `out.log` file in a text editor. The `out.log` file is located in:
- Linux: `$HOME/.config/weblogic-remote-console/out.log`
- macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/out.log`
- Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\out.log`

`out.log` maintains log entries for the current session of the WebLogic Remote Console. Once you close your current session, those log entries are moved to `out-1.log` (in the same folder as `out.log`). `out-1.log` only keeps a copy of the most recently ended session's log entries, not all previous sessions.

This feature is not supported in the browser application.

{{% notice tip %}}
If you want to change the default logging configuration for back end log files, see [Use an alternative logging configuration file]({{< relref "develop/alternative-logging" >}}).
{{% /notice %}}

