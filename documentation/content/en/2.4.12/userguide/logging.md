---
title: Check log files
weight: 5
---

You can inspect log files to ensure that the WebLogic Remote Console is functioning correctly.

## Front end

To view the log file for issues related to the front end of the WebLogic Remote Console:

Open **Help** > **Toggle Developer Tools** and select the **Console** tab.

## Back end

To view the log file for issues related to the back end of the WebLogic Remote Console:

Open the `out.log` file in a text editor. The `out.log` file is located in:
- Linux: `$HOME/.config/weblogic-remote-console/out.log`
- macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/out.log`
- Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\out.log`

`out.log` maintains log entries for the current session of the WebLogic Remote Console. When you open a new session, the log entries from the previous session are moved to a new file marked by date: `out-yyyy-mm-dd.log` (in the same folder as `out.log`).

{{< alert title="Tip" color="info" >}}
If you want to change the default logging configuration for back end log files, see [Specify a custom logging configuration file](../advanced-settings#altlog).
{{< /alert >}}

