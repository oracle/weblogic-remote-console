---
title: Troubleshoot WebLogic Remote Console
date: 2021-04-27
draft: false
description: Troubleshooting recommendations 
weight: 7
---

This page provides guidelines to help troubleshoot console issues.
- [Diagnose Invalid WebLogic Configuration Issues](#invalid)
- [Unresponsive Remote Console Browser Window](#unresponsive)

## Diagnose Invalid WebLogic Configuration Issues {id="invalid"}
The WebLogic Remote Console catches most validation errors when you click Save, or when you commit the change using the shopping cart. If an error message displays, you need to identify and correct the problem that caused the error before you can activate the changes.

{{% notice note %}}
**Note:**  If you installed the console extension, you can view the contents of the shopping cart to see all of the pending changes. If you did not install the console extension, you can view the pending changes using the WebLogic Server Administration Console.
{{% /notice %}}

If the cause of the configuration error is not obvious:
* Check the output from the Remote Console and the domain Administration Server.
* Check the WebLogic Administration Server log.

If you are unable to determine the cause of the error, cancel the edits and make the configuration changes again.

## Unresponsive Remote Console Browser Window {id="unresponsive"}
If the Remote Console running in the browser becomes unresponsive, verify that the Administration Server to which you are connected is still running. If the server is down, restart it, then refresh the browser window.
