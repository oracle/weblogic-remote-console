---
title: Edit domain configurations
date: 2021-09-01
draft: true
description: How to commit changes for your WebLogic Server domain from the WebLogic Remote Console
weight: 2
---

The domain configuration process in the WebLogic Remote Console is similar to the Administration Console. When you start editing the domain, a configuration lock is placed on the domain that blocks other users from making simultaneous changes. Once you're satisfied with your changes, you can 'activate' these changes and perpetuate them to the administration and management servers.

Configuration locks do not apply to WDT model files. As WDT model files are not connected to live domains, they do not require any locks to prevent conflicting changes. Additionally, you do not have to save *and* commit changes; once you save your changes, they are saved to the WDT model file.

#### WDT model tokens {id="model_tokens"}
When editing the domain configuration for a WDT model File, you can substitute model tokens instead of real field values. Model tokens are variables that you can enter into domain configuration settings. Rather than restricting a setting to a single value, the value will update according the variable.

There are several types of model tokens including variable tokens, file tokens, and so on. Model tokens follow this format: `@@TYPE:KEY@@`, where `TYPE` is the model token type and `KEY` is the variable value. For example, you could declare variable token by entering `@@PROP:ABCDE@@` into a field.

See [WDT Model Tokens](https://oracle.github.io/weblogic-deploy-tooling/concepts/model/#model-tokens) for more information.

## Shopping cart {id="shopping_cart"}

The Shopping Cart (equivalent to the Change List in the WebLogic Server Administration Console) holds all the pending changes for the current session in the WebLogic Remote console. In the shopping cart, you can see if any changes are pending, commit those changes or discard them entirely. If you installed the console extension, `console-rest-ext-1.0.war`, you can also see the specific changes you've made and the status of the lock in the Change Manager. Unfortunately, there is currently no support for removing individual items from the shopping cart.

The configuration change lock does not prevent you from making conflicting configuration edits using the same administrator user account. For example, if you obtain a configuration change lock in the WebLogic Remote Console, and then use the Administration Console or WebLogic Scripting Tool (WLST) with the same user account, you will access the same edit session that you opened in the WebLogic Remote Console and you will not be locked out of making changes with the other tools.

{{% notice note %}}
We recommend against making changes using multiple tools because when one of the sessions activates their changes, it releases the lock and the other session will not be able to save or activate their changes.
{{% /notice %}}

Some changes can be activated immediately (dynamic) while other changes will only activate following a server restart (non-dynamic). When you need to activate nondynamic changes, navigate to the 'Servers' node in the Monitoring perspective to see which servers need to be restarted so that they can start using the new configuration.

{{% notice tip %}}
You can restore fields to their default value. Right-click on a field and click **Restore to default**.
{{% /notice %}}

## Edit Administration Servers {id="changes_adminserver"}

{{% notice note%}}
If you are not an WebLogic Server administrator, some areas and actions within the WebLogic Remote Console may not be visible. For example, users with the Operator role cannot see the Edit Tree at all. For more information on what users in each roles can (or cannot) access, see [Understand Access Discrepancies]({{< relref "userguide/role-access" >}}).
{{% /notice%}}

1. Open a project and select an Admin Server Connection Provider.
1. Click the **Edit Tree** perspective and make your changes to the domain configuration. Fields marked with ![Server restart icon](/weblogic-remote-console/images/icons/restart-required-blk_24x24.png) require a server restart.
1. If you have the extension installed, view your changes in the Kiosk.
1. Commit your changes.
1. Restart your server if necessary.
    1. Check if any servers require a restart on the **Monitoring Tree** perspective > **Running Servers** page.

## Edit a WDT model file {id="changes_wdt"}

Domain configuration changes in WDT model files offer more flexibility to take advantage of the benefits of a model file. You can enter specific values in fields or enter model tokens to create variable values that update as needed for their environment. WDT model tokens follow this format: `@@TYPE:KEY@@`.

It's recommended that you use the desktop application version of the WebLogic Remote Console if you plan to edit a WDT model file.

1. Open a project and select a WDT Model File Provider.
1. Click **WDT Model Tree** and make your changes to the domain configuration. Make sure to click ![WDT Model Edit](/weblogic-remote-console/images/icons/wdt-options-icon-blk_24x24.png) if you want to enter a model token. The WebLogic Remote Console auto-saves any changes you make to the WDT model file. You don't need to commit changes to WDT model files.
1. After you finish making changes, you can click **Save Now** (in the desktop application) or **Download File** (in the browser) to ensure all changes are saved and downloaded to your computer.
{{% notice info %}}
The browser application behaves slightly differently. While changes to the WDT model file are still saved automatically as you move around the console, they are *not* saved to your computer. This means that once you're satisfied with your changes, you *must* click **Download File** to download the updated model file to your computer.

Do not refresh the browser page or you will lose all your changes.
{{% /notice %}}

## Use the WebLogic Remote Console control operations {id="controls"}
The WebLogic Remote Console provides control operations in the Monitoring perspective.

The **Server States** page contains the control operations to change the state of a server. Server state signifies the specific condition of a server in the life cycle management.

To change the server state, click the desired control at the top of the table. Then, in the next window, select the servers on which you want to perform the control operation. Consistent with the WebLogic Server Administration Console, the WebLogic Remote Console includes support for graceful shutdowns.

The **App Deployments Runtimes** page, under Domain Information in the Navigation Tree, provides controls to start and stop applications. To start or stop an application, select the control, then in the next window, select the applications on which you want to perform the operation.

## Create MBeans {id="create"}
The WebLogic Remote Console includes simplified wizards for deploying applications and creating JDBC system resources.

In most other cases, when you create a new MBean on a page, you are prompted to fill in a few key properties, such as Name, then click **Create**. Unlike the WebLogic Server Administration Console, the Remote Console does not guide you through configuring other properties that you typically need to complete the configuration. Instead, it displays the new bean's pages where you can click through the tabs to finish configuring the bean.

{{% notice note %}}
When you configure a bean property that references another bean, you must first create the other bean. For example, if you want to assign Server1 to Cluster1, you need to create Cluster1 first, unlike in the WebLogic Server Administration Console where you can choose to create Cluster1 during server creation.
{{% /notice %}}