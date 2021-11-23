---
title: Troubleshoot issues
date: 2021-09-01
draft: false
description: Common issues with simple troubleshooting steps.
weight: 3
---

This page provides guidelines to help troubleshoot console issues.

## Check log files for errors

The WebLogic Remote Console provides log files for both front and back end processes. For instructions on how to access these log files, see [Check Log Files]({{< relref "userguide/logging" >}}).

## Diagnose invalid WebLogic configuration issues {id="invalid"}

### Administration Server
The WebLogic Remote Console catches most validation errors when you click Save, or when you commit the change using the shopping cart. If an error message displays, you need to identify and correct the problem that caused the error before you can activate the changes.

{{% notice note %}}
If you installed the console extension, you can view the contents of the shopping cart to see all of the pending changes. If you did not install the console extension, you can view the pending changes using the WebLogic Server Administration Console.
{{% /notice %}}

If the cause of the configuration error is not obvious:
* Check the output from the Remote Console and the domain Administration Server.
* Check the WebLogic Administration Server log.

If you are unable to determine the cause of the error, cancel the edits and make the configuration changes again.

### WDT model files
The WebLogic Remote Console *does not* validate WDT model file settings. As a result, the WebLogic Remote Console may accept changes or values that are invalid and which may present problems when the model file is used to build or update a domain. For example, adding integer values that are invalid or out of range for a specific setting, or removing a server or target but not updating the deployments to select a different server or target can cause issues.

For more information on acceptable values, refer to the [WebLogic Deploy Tooling](https://oracle.github.io/weblogic-deploy-tooling/) documentation.

## Unresponsive WebLogic Remote Console browser window {id="unresponsive"}
If the WebLogic Remote Console running in the browser becomes unresponsive, verify that the Administration Server to which you are connected is still running. If the server is down, restart it, then refresh the browser window.

## Error: Failure reading auto prefs {id="autoprefs"}

If the WebLogic Remote Console desktop application shuts down unexpectedly with this error: `Failure reading auto prefs`, the `auto-prefs.json` file may be corrupted. `auto-prefs.json` saves state information about the WebLogic Remote Console and should not be modified by users unless it is corrupted.

If the file is corrupted, you can reset it but you will lose all data regarding your projects.

To reset the file, delete the `auto-prefs.json` file, then relaunch WebLogic Remote Console.

`auto-prefs.json` is located in:
- Linux: `$HOME/.config/weblogic-remote-console/auto-prefs.json`
- macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/auto-prefs.json`
- Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\auto-prefs.json`
