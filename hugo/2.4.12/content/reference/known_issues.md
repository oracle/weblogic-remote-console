---
title: Known issues
description: Known issues and limitations for the WebLogic Remote Console
weight: 2
---

This page lists the limitations and known issues (and their workarounds if available) of the WebLogic Remote Console.

## Limitations
In the current release of WebLogic Remote Console, you cannot: 

* Record WLST scripts while you configure WebLogic Server using the WebLogic Remote Console.
* Test automatically if an application was successfully deployed. See [Test Application Deployment]({{< relref "userguide/providers/administration-server#app-test" >}}) for a manual option.
* Reorder security providers in WDT model file providers. However, you can download the WDT model file and edit the YAML file manually to rearrange the order of the security providers.

## Limited MBean property support
The WebLogic Remote Console includes the vast majority of the MBean properties that the WebLogic Server Administration Console supports. However, due to limitations in the WebLogic REST API, some are missing, including some that are deprecated. If you need an MBean property that's not currently available in the WebLogic Remote Console, please let us know.

<!-- ## My credentials don't work

If you are sure your login credentials are correct but you're receiving an Unexpected Error Response error, it might be because your credentials contain unsupported characters.

By default, the WebLogic Remote Console uses HTTP Basic Authentication which supports a limited character set. Characters outside that set, for example, Japanese characters, cannot be used within either usernames or passwords.

**Workaround**: If you wish to continue using credentials with these characters, then when you connect to an Administration Server from the WebLogic Remote Console, you must enable **Use Web Authentication** in the provider connection dialog box. The WebLogic Remote Console will send you to the external authentication portal. -->