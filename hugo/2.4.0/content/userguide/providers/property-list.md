---
title: Property lists
date: 2022-02-22
draft: false
description: How to configure property lists in the WebLogic Remote Console
weight: 3
---

Property lists are an editable set of key-value pairs.

You can add property lists to WDT model files as WDT variables, which streamline the configuration of WDT model files. Once connected to a WDT model file, you can insert a property into the WDT model file as a [WDT model token]({{< relref "userguide/providers/wdt-model#model_tokens" >}}) and edit token values from within the property list.

{{% notice note %}}
We recommend that you use the desktop application over the browser application when working with property list files.
{{% /notice %}}

## Create a new property list

1. Expand the Kiosk and beside the project name, click &#x022EE;. Select **Create Provider for New Property List**.
1. Enter a name for the property list provider. This is the name that will appear in the Project list of providers so you can identify which provider you're working on.
1. Enter a name for the property list file in the **Property List Filename** field. Include .properties or .props at the end of the file name.
1. Click ![Upload file](/weblogic-remote-console/images/icons/choose-directory-icon-blk_24x24.png) and browse to the directory where you want to save the new property list file.
1. Click **OK** to create the file.

## Upload an existing property list

If you've already created a property list file, you can upload it to WebLogic Remote Console where you can continue to edit it.

Property lists are generally `.properties`  or `.props` files though the WebLogic Remote Console supports other text file formats. In any case, each key-value pair must be on a new line and names and values must be separated by `=`, `:`, or spaces. For example, `key=value` / `key:value` / `key value`. See [Properties (JDK 17)](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Properties.html#load(java.io.Reader)) for more information on Java property list formatting.

1. Expand the Kiosk and beside the project name, click &#x022EE;. Select **Add Property List Provider**.
1. Enter a name for the property list provider. This is the name that will appear in the Project list of providers so you can identify which provider you're working on.
1. Click ![Upload file](/weblogic-remote-console/images/icons/choose-file-icon-blk_24x24.png) and browse to the property list file.
1. Click **OK** to upload the file.

## Edit a property list

{{% notice info %}}
The browser application behaves differently than the desktop application. While changes to the property list file are still saved automatically as you move around the console, they are *not* saved to your computer. This means that once you're satisfied with your changes, you *must* click **Download File** to download the updated property list file to your computer.

Do not refresh the browser page or you will lose all your changes.
{{% /notice %}}

If the property list you edit is connected to a WDT model file as a [WDT variable]({{< relref "userguide/providers/wdt-model#wdt_variables" >}}), any changes you make to a property *name* will not be reflected in the WDT model file. The WDT model file assumes you've added an entirely new property and the former WDT variable becomes a standalone WDT model token that's not associated with the property list.

1. Expand the Kiosk and select the property list you want to edit.
1. Click **Property List Editor** and then the **Properties** node.
1. Click the + in the table header row to add a new row to the table.
1. Enter a new property name and property value.
1. To delete a row, click  beside the property row that you want to delete.
1. You can also reorder the properties alphabetically (or reverse-alphabetically) by clicking the arrows in the title bar.
1. Click **Save Now** (**Download File** in the browser application) to save your changes to the property list file.


## Delete a property list

This will only remove the property list from the WebLogic Remote Console. The file will remain in the location designated on your computer. However, if you are using the browser application (and want to keep this property list file), make sure to download the file before deleting it in WebLogic Remote Console.

If you delete a property list that's connected to a WDT model file, the WDT model file will remain unchanged but all WDT variables are converted to standalone WDT model tokens.

1. Expand the Kiosk and beside the property list you want to delete, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png) icon.