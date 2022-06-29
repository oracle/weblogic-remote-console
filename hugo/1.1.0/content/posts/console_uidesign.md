---
title: Console Design and Usage Notes
date: 2021-04-27
draft: false
description: Overview of the console's user interface and behavior
weight: 2
---

#
- [Separation of Configuration and Runtime Data](#separation)
- [User Interface Description ](#new_ui)
- [Usage Notes](#usage)

## Separation of Configuration and Runtime Data {id="separation"}
Unlike the WebLogic Server Administration Console, which has pages that combine the configuration and runtime data, the Remote Console has separate pages for each. For example, in the Remote Console:
  * The Servers table under Environment in the Configuration perspective shows all the configured servers (in the 'edit' tree), but does not show whether each server is running.
  * The Server States table in the Monitoring perspective lists all the servers, both configured and dynamic, (in the Administration Server's 'server config' tree) and the status of each server. This page also provides control operations to change the state of the servers.
  * The Running Servers table in the Monitoring perspective lists the servers (in the Administration Server's 'server config' tree) that are currently running.

You can navigate easily between the two perspectives using the drop-down list in the breadcrumbs and the icons in the NavStrip on the left.

{{% notice note %}}
Because the Configuration perspective shows the 'edit' tree (that is, the changes you're currently making and haven't activated yet), and the Monitoring perspective shows the Administration Server's 'server config' tree (that is, the configuration from the last time the Administration Server was booted plus any activated dynamic changes), unactivated changes that you made in the Configuration perspective won't show up in the Monitoring perspective.  For example, if you add a server and have not activated the change yet, it does not show up in the Monitoring 'Running Servers' and 'Server States' tables.  Also, if you make any nondynamic changes, and activate them, they won't show up in the Monitoring pages until you reboot the appropriate servers.
{{% /notice %}}

## User Interface Description {id="new_ui"}
The primary areas and design features of the  WebLogic Remote Console user interface are as follows:

* **Branding Area**   The Branding area is the fixed area at the very top of the page. The application name is located on the left; the connected user and connect/disconnect icon are on the right. In addition to the connect/disconnect icon, you can click the application name to re-establish a domain connection.

  You can click on the domain name in the branding area to see the URL for the domain that you are connected to and the version of the WebLogic Server domain.

* **Home Page** The Home page uses a card-based design to represent functional areas such as Configuration and Monitoring. When you select a card on the Home page, a perspective for the functional area displays. Perspectives separate administration tasks and behaviors.

* **Landing Page** Like the Home page, the landing pages have been reworked to use cards, in addition to clickable links. There are currently two landing pages:
  * Configuration - For creating, modifying and removing data associated with configuration MBeans in a WebLogic domain. Note that WebLogic has three different versions of the configuration per-domain:
    - The 'edit' tree -  the pending configuration that hasn't been activated yet.
    - The 'domain config' tree - the most recently activated configuration (that is, the domain's 'config' directory).
    - The 'server config' tree - the configuration that a server is currently using that may need to be rebooted to catch up to the domain config tree.

    Currently, the Remote Console only displays the 'edit' tree.
  * Monitoring - For viewing runtime MBeans in a WebLogic domain.

  Clicking a card on a landing page displays (or hides) a list of clickable categories for the associated root level node, and a descriptive paragraph for each. On the Configuration landing page, for example, the cards represent the root level nodes in the domain structure (such as Environment, Scheduling, Services, and so on).

  You can return to a landing page by clicking ![Home icon](/weblogic-remote-console/images/icons/home-icon-blk_24x24.png) on the right side of the content pane.

* **Navigation Tree** The Domain Structure panel in the WebLogic Server Administration Console is represented in the WebLogic Remote Console as a dynamic navigation tree pane. Different navigation trees are loaded based on the perspective that you are using. For example, if you are using the Configuration perspective, the navigation tree lists the root-level nodes in the domain structure.

    An ellipse (...) in the Navigation Tree in a list indicates that there are more than ten entities of a particular type defined in the domain. When you click the ellipse, the table view for the first ten entities displays in the main content area. You can then access all the entities in the table view using the arrows at the bottom of the table. For example, if you have 20 server instances defined in a domain, only the first ten are listed in the navigation tree. Clicking the ellipse displays the Server table in the main content area, where you can view the first ten servers and navigate to the remaining servers.

* **NavStrip** A small strip on the left edge of the page that contains icons for toggling the visibility of the navigation tree ![Navpane icon](/weblogic-remote-console/images/icons/navigation-icon-toggle-off-blk_24x24.png), and for choosing the perspective to work with, such as Configuration and Monitoring. Clicking a NavStrip icon for a perspective is equivalent to clicking a card on the Home Page. The difference is that the NavStrip is always visible, while the Home page cards are not.

* **Navigation Tree/Content Pane Divider**  When the navigation tree is open, you can use this divider to simultaneously adjust the width of the navigation tree and content pane.

* **Content Pane** The content pane is the main pane to the right of the navigation tree that consists of:
    * Header - Topmost section of the content pane that contains the name of the active perspective.
      * Click ![Home icon](/weblogic-remote-console/images/icons/home-icon-blk_24x24.png) in the Header area to return to the Remote Console Home page.
      * Click ![Read/Write icon](/weblogic-remote-console/images/icons/console-mode-readwrite_24x24.png) to change the console into read-only mode or ![Read-only icon](/weblogic-remote-console/images/icons/console-mode-readonly_24x24.png) to change the console into read/write mode.
    * Breadcrumbs - Represent the path to the current MBean, with clickable links to the parent pages. Use the drop-down list, if available, to navigate to related pages, runtime data or configuration data.
    * Main content area - Contains the tables and forms data. The topmost section is a fixed header that contains page descriptions and instructions, tabs (if applicable), perspective-scoped navigation history, toolbar buttons such as **Save** on the left, toolbar icons (on the right) and the **Show advanced fields** check box. The content area beneath the fixed header contains the tables, forms, and help fields. Horizontal and vertical scrollbars appear for tables, forms and help when the page is not large enough to display its entire contents.

## Usage Notes {id="usage"}
Consider the following usage notes when using the WebLogic Remote Console:
- [Create MBeans](#create)
- [Use the Tool Bar Icons in the Content Pane](#tool_bar)
- [Use the Shopping Cart](#cart)
- [Use the Remote Console Help](#help)
- [Use the Remote Console Control Operations](#controls)

### Create MBeans {id="create"}
The Remote Console includes simplified wizards for deploying applications and creating JDBC system resources.

In most other cases, when you create a new MBean on a page, you are prompted to fill in a few key properties, such as Name, then click **Create**. Unlike the WebLogic Server Administration Console, the Remote Console does not guide you through configuring other properties that you typically need to complete the configuration. Instead, it displays the new bean's pages where you can click through the tabs to finish configuring the bean.

{{% notice note %}}
When you configure a bean property that references another bean, you must first create the other bean. For example, if you want to assign Server1 to Cluster1, you need to create Cluster1 first, unlike in the WebLogic Server Administration Console where you can choose to create Cluster1 during server creation.
{{% /notice %}}

### Use the Tool Bar Icons in the Content Pane {id="tool_bar"}
Use the icons on the tool bar as follows:
* Home - Click ![Home icon](/weblogic-remote-console/images/icons/home-icon-blk_24x24.png) in the content pane to return to the landing page for the functional area, such as Configuration or Monitoring. Click ![Home icon](/weblogic-remote-console/images/icons/home-icon-blk_24x24.png) in the left side of the header area to return to the console home page.
* Navigation History - Click ![history icon](/weblogic-remote-console/images/icons/beanpath-history-icon-blk_24x24.png) to view a menu with a list of clickable links to the pages you have visited. This history is perspective-scoped.
* Help - Click ![Help icon](/weblogic-remote-console/images/icons/help-icon-blk_24x24.png) to view reference information about the attributes displayed on the page.
* Reload - Click ![Reload icon](/weblogic-remote-console/images/icons/sync-off-icon-blk_24x24.png) to reload the form/table once when no auto reload interval is set. This icon changes to active (![Sync interval icon](/weblogic-remote-console/images/icons/sync-on-icon-blk_24x24.png)) when the reload interval is set. Click the icon to toggle the auto reload on and off.
* Auto Reload Interval - Click ![Sync interval icon](/weblogic-remote-console/images/icons/sync-interval-icon-blk_24x24.png) to set or clear a specified time interval, in seconds, for automatic reload of the form/table. If you select a different tab, or move to another page, automatic page reload stops.

* Shopping Cart - When changes are pending, click ![Shopping cart full icon](/weblogic-remote-console/images/icons/shopping-cart-non-empty-tabstrip_24x24.png) to view, discard, or commit the changes. The ![Shopping cart empty icon](/weblogic-remote-console/images/icons/shopping-cart-empty-tabstrip_24x24.png) indicates there are no pending changes to the configuration.

### Use the Shopping Cart {id="cart"}

You can use the shopping cart to:
* Commit all the changes currently in the shopping cart. This equates to clicking the "Activate Changes" button in the WebLogic Server Administration Console.
* Discard all the changes currently in the shopping cart. There is currently no support for removing an individual shopping cart item.

If you installed the [Remote Console extension]({{< relref "install_config#extension" >}}) in your domain, you can:
* View the status of the lock in the Change Manager.
* View additions and deletions of configuration objects.
* View the before and after values of fields modified through forms.
* Navigate to the form associated with the addition or change.

These pending changes and lock status are visible in a Kiosk window, accessible by clicking View Changes from the Shopping Cart menu, or by clicking the Kiosk tab on the bottom right side of the page.

**Difference Between the Change Center and Change Manager**
In the WebLogic Server Administration Console, the Change Center provides a way to lock a domain configuration so you can make changes to the configuration while preventing other accounts from making changes during your edit session. It can be enabled or disabled in a development domain, and is enabled by default in a production domain. When locking is enabled, you start the edit process by obtaining a lock. When you finish making changes, you save the changes. The changes do not take effect, however, until you activate them, distributing them to all server instances in the domain.

The WebLogic Remote Console provides similar locking functionality in the shopping cart. In the Remote Console, in both development and production domains, the pages are always read/writeable. When you create an MBean or save a change to page, the Remote Console automatically grabs the lock. To view details about the lock, expand the Change Manager in the Kiosk. The changes are not activated until you click Commit Changes.

When you activate nondynamic changes, you need to navigate to the 'Running Servers' table in the Monitoring perspective to see which servers need to be rebooted so that they can start using the new configuration.

In both consoles, the configuration change lock does not prevent you from making conflicting configuration edits using the same administrator user account. For example, if you obtain a configuration change lock using the WebLogic Remote Console, and then use the Administration Console or WebLogic Scripting Tool (WLST) with the same user account, you will access the same edit session that you opened in the Remote Console and you will not be locked out of making changes with the other tools.

{{% notice note %}}
We recommend against making changes using multiple tools because when one of the sessions activates their changes, it releases the lock and the other session will not be able to save or activate their changes.
{{% /notice %}}

### Use the Remote Console Help {id="help"}

The Remote Console provides several types of online help on each page.
* Use the ? icon to the left of each field to access summary and detailed help for the field. If you hover over the ?, a summary help description displays. Click the ? icon to display a more detailed help description, if available.
* Click the ? icon in the top right of the content pane to toggle the view of the reference information for all of the fields displayed on the page.

### Use the Remote Console Control Operations {id="controls"}
The Remote Console provides control operations in the Monitoring perspective.
* The Server States page contains the control operations to change the state of a server. Server state signifies the specific condition of a server in the life cycle management. To change the server state, click the desired control at the top of the table. Then, in the next window, select the servers on which you want to perform the control operation. Consistent with the WebLogic Server Administration Console, the Remote Console includes support for graceful shutdowns.
* The App Deployments Runtimes page, under Domain Information in the Navigation tree, provides controls to start and stop applications. To start or stop an application, select the control, then in the next window, select the applications on which you want to perform the operation.
