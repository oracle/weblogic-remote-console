---
title: Known issues
date: 2021-09-01
draft: false
description: Known issues and limitations for the WebLogic Remote Console
weight: 2
---

This page lists the limitations and known issues (and their workarounds if available) of the WebLogic Remote Console.

## Limitations
In the current release of WebLogic Remote Console, you are unable to: 

* Record WLST scripts while you configure WebLogic Server using the WebLogic Remote Console.

## Limited MBean property support
The WebLogic Remote Console includes the vast majority of the MBean properties that the WebLogic Server Administration Console supports. However, because of limitations in the WebLogic REST API, some are missing, including some that are deprecated. If you notice that there is an MBean property that you require that is not available in the WebLogic Remote Console, please let us know.

## Unable to reorder collections such as security providers
**Issue** There are separate lists for each type of security provider (such as authentication providers, role mapping providers, authorization providers, and so on).
When you have more than one security provider in a list, WebLogic Server invokes them in the order that they appear in the list.  Sometimes the order is important (for example, you want the server to try the local fast authentication provider before the slow remote one).

Currently, the WebLogic Remote Console doesn't explicitly let you reorder the lists.

**Workaround** To reorder providers, you can delete and recreate them. For example, if the list of authentication providers has A then B, and you want to switch it to B then A, delete A and recreate it. New providers are always added to the end of the list.