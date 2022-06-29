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
1. Click **OK** to create the file.

## Upload an existing WDT model file
If you've already created a WDT model file, you can upload it to WebLogic Remote Console where you can continue to edit it.

1. Expand the Kiosk and beside the project name, click &#x022EE;. Select **Add WDT Model File Provider**.
1. Enter a name for the model in the **Model Name** field. This is the name that will appear in the Project list of providers so you can identify which provider you’re working on.
1. Click ![Upload file](/weblogic-remote-console/images/icons/choose-file-icon-blk_24x24.png) and browse to the WDT model file (a YAML or JSON file).
1. Click **OK** to upload the file.

## Edit a WDT model file {id="changes_wdt"}

1. Expand the Kiosk and select the WDT model file you want to edit.
1. Click **WDT Model Tree** and make your changes to the domain configuration. Make sure to click ![WDT Model Edit](/weblogic-remote-console/images/icons/wdt-options-icon-blk_24x24.png) if you want to enter a [model token](#model_tokens).

    The WebLogic Remote Console auto-saves any changes you make to the WDT model file. You don't need to commit changes to WDT model files.
1. After you finish making changes, you can click **Save Now** (in the desktop application) or **Download File** (in the browser) to ensure all changes are saved and downloaded to your computer.

{{% notice info %}}
The browser application behaves differently than the desktop application. While changes to the WDT model file are still saved automatically as you move around the console, they are *not* saved to your computer. This means that once you're satisfied with your changes, you *must* click **Download File** to download the updated WDT model file to your computer.

Do not refresh the browser page or you will lose all your changes.
{{% /notice %}}

#### WDT model tokens {id="model_tokens"}
Model tokens increase the flexibility of domain configuration in WDT model files. Model tokens are variables that can replace 'real' field values. Rather than restricting a property to a single value, the value will update according the variable. In this way, a WDT model file can be a versatile template that builds similar but distinct domains.

There are several types of model tokens including variable tokens, file tokens, and so on. Model tokens follow this format: `@@TYPE:KEY@@`, where `TYPE` is the model token type and `KEY` is the variable value. For example, you could declare variable token by entering `@@PROP:ABCDE@@` into a field.

See [WDT Model Tokens](https://oracle.github.io/weblogic-deploy-tooling/concepts/model/#model-tokens) in the WebLogic Deploy Tooling documentation for more information.

{{% notice tip %}}
You can restore fields to their default value. Right-click on a field and click **Restore to default**.
{{% /notice %}}

## Delete a WDT model file
This will only remove the WDT model file from the WebLogic Remote Console. It will remain in the location designated on your computer. However, if you are using the browser application (and want to keep this WDT model file), make sure to download the file before deleting it in WebLogic Remote Console.

1. Expand the Kiosk and beside the WDT model file, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png) icon.
