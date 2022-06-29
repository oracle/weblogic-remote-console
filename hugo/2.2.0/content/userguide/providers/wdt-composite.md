---
title: WDT composite models
date: 2021-09-01
draft: false
description: How to manage WDT composite models
weight: 5
---

WDT composite models are read-only representations of multiple, merged [WDT model files]({{< relref "userguide/providers/wdt-model" >}}).

## Create a WDT composite model

1. Create or upload two or more WDT model files to the WebLogic Remote Console.
1. Expand the Kiosk and beside the project name, click &#x022EE;. Select **Add WDT Composite Model File Provider**.
1. Enter a name for the WDT Composite Model. This is the name that will appear in the Project list of providers so you can identify which provider you’re working on.
1. Click inside the **WDT Models** field to see a list of available WDT Models. Select the WDT models that you want to appear in the WDT Composite Model in the order that you want them to appear. Only WDT model files in the current project will appear.

    Pay attention to the order that the WDT model files are added - each subsequent WDT model file overrides the properties of the previous file. That is, if there are any conflicting properties, the properties of the last WDT model file added to the composite takes precedence.
1. Click **OK** to create the WDT composite model.

## Edit a WDT composite model

You can add or remove WDT model files from a WDT composite model as necessary.

1. Expand the Kiosk and beside the WDT composite model file provider that you want to edit, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-manage-icon-brn_24x24.png) icon.
1. Edit the WDT composite model provider name if you want.
1. Add or remove WDT model files.
1. Click **OK** to save your changes.

## View the details of a WDT composite model

It's easy to check which WDT model files are contained within a WDT composite model.

1. Expand the Kiosk and beside the WDT composite model file provider, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-info-icon-brn_24x24.png) icon.

A list of the WDT models within that WDT composite model appears. The provider ID is also shown.

## Delete a WDT composite model

This will not delete the individual WDT models contained within the WDT composite model.

1. Expand the Kiosk and beside the WDT composite model file provider that you want to delete, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png) icon.

