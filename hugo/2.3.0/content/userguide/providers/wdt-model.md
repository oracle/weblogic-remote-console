---
title: WDT model files
date: 2021-09-01
draft: false
description: How to configure WDT model files in the WebLogic Remote Console
weight: 4
---

WDT metadata models are descriptions of a WebLogic Server domain configuration, generally written in YAML but occasionally JSON. These models are not connected to a live domain and you edit them 'offline' before using the WebLogic Deploy Tooling (WDT) to build or modify live domains from the models.

See the [WebLogic Deploy Tooling](https://oracle.github.io/weblogic-deploy-tooling/) documentation for more information.

{{% notice note %}}
We recommend that you use the desktop application over the browser application when working with WDT model files.

Additionally, the WebLogic Remote Console assumes WDT model files are in YAML format. If you upload a file with no file extension, the WebLogic Remote Console will convert it to YAML format after you save your changes.
{{% /notice %}}

## Create a new WDT model file

1. Expand the Kiosk and beside the project name, click &#x022EE;. Select **Create Provider for New WDT Model File**.
1. Enter a name for the WDT model file provider. This is the name that will appear in the Project list of providers so you can identify which provider you're working on.
1. Enter a name for the WDT model file in the **WDT Model Filename** field. Include .yaml or .json at the end of the file name.
1. Click ![Upload file](/weblogic-remote-console/images/icons/choose-directory-icon-blk_24x24.png) and browse to the directory where you want to save the new WDT model file.
1. **Optional**: Enable **Use Sparse Template** to create a WDT model file which does not contain any references to an Administration Server.
1. **Optional**: Choose a property list provider from the **WDT Variables** dropdown list. If you add WDT variables to your WDT model file, you can update the variables in your WDT model file from a single location - the property list provider. If you don't have a property list provider yet, you can edit the WDT model file settings later to add or change the associated WDT variables. See [WDT Model Tokens](#model_tokens) for more information.
1. Click **OK** to create the file.

## Upload an existing WDT model file
If you've already created a WDT model file, you can upload it to WebLogic Remote Console where you can continue to edit it.

1. Expand the Kiosk and beside the project name, click &#x022EE;. Select **Add WDT Model File Provider**.
1. Enter a name for the model in the **Model Name** field. This is the name that will appear in the Project list of providers so you can identify which provider you’re working on.
1. Click ![Upload file](/weblogic-remote-console/images/icons/choose-file-icon-blk_24x24.png) and browse to the WDT model file (a YAML or JSON file).
1. **Optional**: Choose a property list provider from the **WDT Variables** dropdown list. If you add WDT variables to your WDT model file, you can update the variables in your WDT model file from a single location - the property list provider. If you don't have a property list provider yet, you can edit the WDT model file settings later to add or change the associated WDT variables. See [WDT Model Tokens](#model_tokens) for more information.
1. Click **OK** to upload the file.

## Edit a WDT model file {id="changes_wdt"}

1. Expand the Kiosk and select the WDT model file you want to edit.
1. Click **WDT Model Tree** and make your changes to the domain configuration. Make sure to click ![WDT Model Edit](/weblogic-remote-console/images/icons/wdt-options-icon-blk_24x24.png) if you want to enter a [model token](#model_tokens).
|Option | Description |
|---|---|
| Default (unset) | Restore field to its default value. |
| Select Value | Select a reference to a component that exists in the current WDT model file. |
| Enter Value | Enter a fixed value.|
| Enter Model Token | Enter a [WDT model token](#model_tokens). |
| Enter Unresolved Reference | Enter a reference to a component that does not exist in the current WDT model file but will exist at a later point. |
| Select Model Token Variable | Select a [model token variable](#wdt_variables) from the list of available options. The WDT model file must be connected with a property list to see this option. |
| Create Model Token Variable | Enter a Variable Name and Variable Value to create a new [model token variable](#wdt_variables). New model token variables are added to the connected property list. The WDT model file must be connected with a property list to see this option. |

    The WebLogic Remote Console auto-saves any changes you make to the WDT model file. You don't need to commit changes to WDT model files.
1. After you finish making changes, you can click **Save Now** (in the desktop application) or **Download File** (in the browser) to ensure all changes are saved and downloaded to your computer.

{{% notice info %}}
The browser application behaves differently than the desktop application. While changes to the WDT model file are still saved automatically as you move around the console, they are *not* saved to your computer. This means that once you're satisfied with your changes, you *must* click **Download File** to download the updated WDT model file to your computer.

Do not refresh the browser page or you will lose all your changes.
{{% /notice %}}

{{% notice tip %}}
If you want to restore fields to their default value, right-click on a field and click **Restore to default**.
{{% /notice %}}

### WDT model tokens {id="model_tokens"}
WDT model tokens are variables that you can use to replace fixed values in WDT model files. With WDT model tokens, WDT model files become more versatile - you can create a single WDT model file with model tokens and when you build a domain from it, you only need to update the model token values, rather than create multiple, static WDT model files.

There are several types of model tokens including variable tokens, file tokens, and so on. Model tokens follow this format: `@@TYPE:KEY@@`, where `TYPE` is the model token type and `KEY` is the variable value. For example, you can declare a variable token by entering `@@PROP:ABCDE@@` into a field.

See [WDT Model Tokens](https://oracle.github.io/weblogic-deploy-tooling/concepts/model/#model-tokens) in the WebLogic Deploy Tooling documentation for more information.

#### WDT variables {id="wdt_variables"}

WDT variables make it even easier to manage WDT model tokens in the WebLogic Remote Console. When you add WDT variables to your WDT model file, you create a link between the WDT model file and a [property list]({{< relref "userguide/providers/property-list" >}}). You can then pull in properties from the property list and use them as WDT model tokens. Then, when you want to update a property value, just open the associated property list and make your changes there.

You can use both standalone WDT model tokens and WDT variables in a WDT model file, but only one property list provider per WDT model file. Multiple WDT model files can use the same property list.

## Delete a WDT model file
This will only remove the WDT model file from the WebLogic Remote Console. It will remain in the location designated on your computer. However, if you are using the browser application (and want to keep this WDT model file), make sure to download the file before deleting it in WebLogic Remote Console.

This will not delete any associated property list providers.

1. Expand the Kiosk and beside the WDT model file, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png) icon.

## Build a WebLogic Server domain

When you're satisfied with the properties of your WDT model file, you can transform it into a live WebLogic Server domain with [WebLogic Deploy Tooling (WDT)](https://github.com/oracle/weblogic-deploy-tooling).

1. Save the WDT model file in WebLogic Remote Console. Make a note of the location of the YAML or JSON file on your computer.
1. If you haven't already, download WDT from its [GitHub repository](https://github.com/oracle/weblogic-deploy-tooling/releases).
1. Follow the instructions in the [WDT Documentation](https://oracle.github.io/weblogic-deploy-tooling/) for building a domain from a model.

{{% notice note %}}
If WDT reports an error when opening the WDT model file from WebLogic Remote Console, upgrade your WDT to the latest available version and try again.
{{% /notice %}}
