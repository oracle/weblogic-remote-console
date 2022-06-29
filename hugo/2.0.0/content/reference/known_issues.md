---
title: Known issues
date: 2021-09-01
draft: false
description: Known issues and limitations for the WebLogic Remote Console
weight: 2
---

This page lists the known issues and workarounds, if available, as well as the limitations of the console in this release.

## Limitations
The following features are not available in this release of the Remote Console:
* Manage the security data from WebLogic Server security providers that is external to the WebLogic configuration, such as users, groups, roles, policies, credential maps, and so on.
* Record WLST scripts while you configure WebLogic Server using the Remote Console.
* JNDI tree viewer.

## Known issues
The following list summarizes the known issues at the time of this release.

### Limited support for users in a non-administrative role
The Remote Console fully supports only users in the Administrator role. If you are not logged in as an Administrator, unexpected behavior may occur. For example, the Deployer, Monitor and Operator roles are not sufficient for most configuration pages and will result in empty pages and error messages.

### Minimum web browser viewport size
**Issue** The font sizes in the WebLogic Remote Console are governed by the Oracle JET Redwood style. They are larger than the ones used in the WebLogic Server Administration Console, and the entry fields are a bit larger in height and width. As a result, the overall viewing area inside your web browser's viewport (the portion where all the web content appears), needs to be of a minimum size to have an enjoyable experience using the Remote Console.

We have determined that the recommended minimum web browser viewport size is 1592 x 900 pixels. If you resize your web browser to be smaller than 1592 x 900 pixels, then scroll bars appear when the mouse hovers over certain areas. However, some form data may still not be visible until the web browser's viewport height is at least 900 pixels.

**Workaround** Ensure that the browser viewport is set to the recommended minimum. If those values are not available, you can also adjust the Zoom setting to 80%.

## Limited MBean property support
The Remote Console includes the vast majority of the MBean properties that the WebLogic Server Administration Console supports. However, because of limitations in the WebLogic REST API, some are missing, including some that are deprecated. If you notice that there is an MBean property that you require that is not available in the Remote Console, please let us know.

## Unable to reorder collections such as security providers
**Issue** There are separate lists for each type of security provider (such as authentication providers, role mapping providers, authorization providers, and so on).
When you have more than one security provider in a list, WebLogic Server invokes them in the order that they appear in the list.  Sometimes the order is important (for example, you want the server to try the local fast authentication provider before the slow remote one).

Currently, the Remote Console doesn't explicitly let you reorder the lists.

**Workaround** To reorder providers, you can delete and recreate them. For example, if the list of authentication providers has A then B, and you want to switch it to B then A, delete A and recreate it. New providers are always added to the end of the list.

## Can't uninstall the WebLogic Remote Console on Microsoft Windows

**Issue** When attempting to uninstall the WebLogic Remote Console desktop application on Windows computers, the uninstallation program may complain that the WebLogic Remote Console is running and cannot be uninstalled.

**Workaround** Edit the `PATH` environment variable to ensure that `%SystemRoot%\system32` is the first entry that contains the `find` command, then retry the uninstallation.