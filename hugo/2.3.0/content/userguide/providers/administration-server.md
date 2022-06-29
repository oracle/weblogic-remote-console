---
title: Administration Servers
date: 2021-09-01
draft: false
description: How to configure WebLogic Administration Servers in the WebLogic Remote Console
weight: 2
---

The WebLogic Remote Console can connect directly to a WebLogic Administration Server to view and edit its domain, much like the WebLogic Server Administration Console, though there are [some differences]({{< relref "setup/admin-console-diff" >}}).

You can save the connection details for multiple WebLogic Administration Servers, making it easy to switch between domains with a click.
<!-- You can even choose to add the same Administration Server multiple times, as long as it's either in a different project or has a different user account associated. -->

## Connect to a WebLogic Administration Server

1. Start the WebLogic Administration Server.
1. Expand the Kiosk and beside the project name, click &#x022EE;. Select **Add Admin Server Connection Provider**.
1. Enter a name for the Administration Server connection. This is the name that will appear in the Project list of providers so you can identify which provider you’re working on.
1. Enter a username and password for a user account with editing privileges in the selected Administration Server.
As with the Administration Console, your management capabilities will be limited depending on the level of access granted to your user account. See [Understand access discrepancies]({{< relref "userguide/role-access" >}}) for more information. You can choose to have multiple connections to the same Administration Server with different users.
1. Enter the URL for the Administration Server.
1. Click **OK** to connect the WebLogic Remote Console to the WebLogic Administration Server.

The WebLogic Remote Console is now connected to a WebLogic Administration Server. You can make changes to the domain as desired.

## Edit a WebLogic Administration Server {id="changes_adminserver"}

Editing a domain in the WebLogic Remote Console is similar in process to the Administration Console. When you start editing a domain, a configuration lock is created that blocks other users from making simultaneous changes. Once you're satisfied with your changes, you can activate these changes and perpetuate them to the Administration and Management Servers.

{{% notice note%}}
Certain areas and actions in the WebLogic Remote Console are hidden from non-administrations. For example, users with the Operator role cannot see the Edit Tree at all. For more information on what each user role can (or cannot) access, see [Understand Access Discrepancies]({{< relref "userguide/role-access" >}}).
{{% /notice%}}

1. Expand the Kiosk and select the Administration Server you want to edit.
1. Click the **Edit Tree** perspective and make your changes to the domain configuration. Fields marked with ![Server restart icon](/weblogic-remote-console/images/icons/restart-required-blk_24x24.png) require a server restart.
1. Click **Save** on every page after making your changes.
1. If you have the extension installed, expand the Kiosk and select **Shopping Cart** to view your changes.
1. Commit your changes. In the upper right corner of the content pane, click ![Server restart icon](/weblogic-remote-console/images/icons/shopping-cart-non-empty-tabstrip_24x24.png) and then **Commit Changes**.
1. Restart your server if necessary.
    1. Check if any servers require a restart on the **Monitoring Tree** perspective > **Environment** > **Servers** page.

{{% notice tip %}}
You can restore fields to their default value. Right-click on a field and click **Restore to default**.
{{% /notice %}}

### Shopping cart {id="shopping_cart"}

The Shopping Cart (equivalent to the Change List in the WebLogic Server Administration Console) holds all the pending changes for the current session in the WebLogic Remote Console. In the shopping cart, you can see if any changes are pending, commit those changes or discard them entirely.

If you installed the console extension, `console-rest-ext-1.0.war`, you can also see the specific changes you've made and the status of the lock in the Change Manager. If you need to undo a change, you must discard all shopping cart contents or manually revert the change in the Edit Tree perspective.

The configuration change lock does not prevent you from making conflicting configuration edits using the same administrator user account. For example, if you obtain a configuration change lock in the WebLogic Remote Console, and then use the Administration Console or WebLogic Scripting Tool (WLST) with the same user account, you will access the same edit session that you opened in the WebLogic Remote Console and you will not be blocked from making changes with the other tools.

{{% notice note %}}
We recommend against making changes using multiple tools because when one of the sessions activates their changes, it releases the lock and the other session will not be able to save or activate their changes.
{{% /notice %}}

Some changes can be activated immediately (dynamic) while other changes require a server start to activate (non-dynamic). When you need to activate non-dynamic changes, navigate to the **Environment** > **Servers** node in the Monitoring perspective to see which servers need a restart.



## Edit the connection details of a WebLogic Administration Server

1. Expand the Kiosk and beside the WebLogic Administration Server connection that you want to edit, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-manage-icon-brn_24x24.png) icon.
1. Edit the details of the WebLogic Administration Server. You can change its name in WebLogic Remote Console, switch user accounts or update the URL.
1. Click **OK** to save your changes.

## View the connection details of a WebLogic Administration Server

It's easy to view the details of a WebLogic Server Connection.

1. Expand the Kiosk and beside the WebLogic Administration Server, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-info-icon-brn_24x24.png) icon.

A list of connection details will appear, including:

* Provider ID
* Domain Name
* Domain URL
* Domain Version
* Username
* Role

## Delete a connection to a WebLogic Administration Server
This will only delete the WebLogic Remote Console access to the WebLogic Administration Server. The domain itself will be unaffected.

1. Expand the Kiosk and beside the WebLogic Administration Server, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png) icon.

## Control Operations {id="controls"}
The WebLogic Remote Console provides control operations for the Administration Server in the Monitoring perspective.

### Change server state
Server state indicates the specific condition of a server in the life cycle management.

1. Expand the Kiosk and select a WebLogic Administration Server connection.
1. Choose the **Monitoring** perspective from the home page.
1. Go to **Environment** > **Servers**
1. Choose the action for the server(s):
    * Start
    * Resume
    * Suspend
    * Shutdown
    * Restart SSL
1. Choose when to initiate the action:
    * When work completes
    * Force shutdown now
1. In the dialog box, move the servers whose state you want to change from **Available** to **Chosen**.
1. Initiate the action.

### Start or stop an application

1. Expand the Kiosk and select a WebLogic Administration Server connection.
1. Choose the **Monitoring** perspective from the home page.
1. Go to **Deployments** > **App Deployment Runtimes**.
1. Choose the action for the application:
    * Start
    * Stop
1. In the dialog box, move the applications whose state you want to change from **Available** to **Chosen**.
1. Initiate the change.

## Create MBeans {id="create"}
The WebLogic Remote Console includes simplified wizards for deploying applications and creating JDBC system resources.

In most other cases, when you create a new MBean on a page, you are prompted to fill in a few key properties, such as Name, then click **Create**. Unlike the WebLogic Server Administration Console, the WebLogic Remote Console does not guide you through configuring other properties that you typically need to complete the configuration. Instead, it displays the new bean's pages where you can click through the tabs to finish configuring the bean.

{{% notice note %}}
When you configure a bean property that references another bean, you must first create the other bean. For example, if you want to assign Server1 to Cluster1, you need to create Cluster1 first, unlike in the WebLogic Server Administration Console where you can choose to create Cluster1 during server creation.
{{% /notice %}}