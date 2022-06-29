---
title: Explore the WebLogic Remote Console
date: 2021-09-01
draft: false
description: An overview of the WebLogic Remote Console and its differences with the Oracle WebLogic Administration Console.
weight: 1
---

The WebLogic Remote Console provides a redesigned interface for WebLogic Server domain configuration. The new user interface applies the standards of the Oracle Redwood design system included with Oracle JET.

The WebLogic Remote Console user interface consists of the following sections:

* [Kiosk](#kiosk)
* [NavStrip](#navstrip)
* [Navigation Tree](#navtree)
* [Content Pane](#content-pane)

<!--TODO image-->
## Kiosk {id="kiosk"}

The Kiosk (located in the bottom right corner of the WebLogic Remote Console) is where you perform the administrative aspects of the WebLogic Remote Console such as managing providers and projects.

When you expand the Kiosk, you can see and edit the details of your current project, its providers, their connection details and so on. You can also import and export project files here.

You can see the connection status of the current provider in the upper right corner of the console.

* Administration Server connections are either **Green** (connected) or **Red** (not connected).
* WDT model files, WDT composite models, and property lists are always **Yellow** (offline).

{{% notice note %}}
For Administration Server providers only, the Kiosk also provides a secondary function - the Shopping Cart. In the **Shopping Cart** tab, you can see the Change Manager, as well as any changes you've made to the domain configuration. You can commit (or discard) changes directly from the Shopping Cart.

The Shopping Cart is only visible in the Kiosk if you **a.** have the console extension, `console-rest-ext-1.0.war`, installed and **b.** there are pending changes.
{{% /notice %}}

## NavStrip {id="navstrip"}

The NavStrip is a small, vertical strip along the left edge of the WebLogic Remote Console window that contains icons for toggling the visibility of the navigation tree ![Navpane icon](/weblogic-remote-console/images/icons/navigation-icon-toggle-off-blk_24x24.png), and for choosing a perspective to work within. Clicking a NavStrip icon for a perspective is equivalent to clicking a card on the Home Page.

## Navigation tree {id="navtree"}

The Domain Structure panel in the WebLogic Server Administration Console is represented in the WebLogic Remote Console as a dynamic navigation tree pane. Different navigation trees are loaded based on the perspective that you are using. For example, if you are using the Configuration perspective, the navigation tree lists the root-level nodes in the domain structure.

An ellipse (...) in the Navigation Tree in a list indicates that there are more than 10 entities of a particular type defined in the domain. When you click the ellipse, the table view for the first 10 entities displays in the main content area. You can then access all the entities in the table view using the arrows at the bottom of the table. For example, if you have 20 server instances defined in a domain, only the first 10 are listed in the navigation tree. Clicking the ellipse displays the Server table in the main content area, where you can view the first 10 servers and navigate to the remaining servers.

## Content pane {id="content-pane"}

The main section of the WebLogic Remote Console window is the Content Pane, the central location where domain configuration changes are made. Each time you open a provider, you'll be shown a home page with different perspectives you can peruse to explore the properties of the provider.

As you move through the NavStrip and Navigation Tree, the contents in the Content Pane will update to reflect your location. Your location in the Navigation Tree indicates what you see in the content pane.

Different provider types have different perspectives.

**Administration Server**

An Administration Server provider has three perspectives:
* Edit Tree: an editable representation of the WebLogic Server domain. Enter this perspective when you want to make and commit changes to the domain.

* Configuration Tree: a read-only representation of the WebLogic Server domain. Enter this perspective if you want to see the current settings of the domain, without making any changes.
{{% notice note %}}
If you make changes in the Edit Tree perspective, those changes won't appear in the Configuration Tree perspective until you commit them, or for non-dynamic changes, until you restart the server.
{{% /notice %}}
* Monitoring Tree: an overview of the runtime statistics for the running domain. You can view statistics by server or aggregated across servers. For example, applications running on Server1  vs. applications running on one or more servers. The Monitoring Tree also provides some control operations such as starting or stopping servers or applications.

**Property list**

A property list provider has one perspective:

* Property List Editor: an editable list of properties.


**WDT model file**

A WDT model file provider has one perspective:

* WDT Model Tree: an editable representation of a WDT model for a WebLogic Server domain.


**WDT composite model**

A WDT composite model file provider has one perspective:

* WDT Composite Model Tree: a read-only representation of multiple, merged WDT model files for a WebLogic Server domain.

#### Breadcrumb trail

As you traverse the different nodes of the domain, the breadcrumbs along the top of the content pane will update to show your hierarchical location within the domain structure. You can move between related pages under different perspectives by clicking the dropdown button beside the rightmost entry of the breadcrumb trail.

For example, if you're on Domain/Servers in the Edit Tree, you can jump to Environment/Servers (Monitoring Tree) from the breadcrumb trail.

#### Tool bar icons in the content pane {id="toolbar_icons"}

These icons appear along the top of the content pane:

* ![Home icon](/weblogic-remote-console/images/icons/home-icon-blk_24x24.png) : Home - returns you to the provider home page with its list of perspectives

* ![Landing page icon](/weblogic-remote-console/images/icons/landing-page-icon-blk_24x24.png) : Landing page - returns you to the top-level landing page of the current navigation node

* ![history icon](/weblogic-remote-console/images/icons/beanpath-history-icon-blk_24x24.png) : Navigation History - displays a menu with a list of clickable links to the pages you have visited. This history is perspective-scoped.

* ![Help icon](/weblogic-remote-console/images/icons/help-icon-blk_24x24.png) : Help - shows reference information about the attributes displayed on the page.

* ![Reload icon](/weblogic-remote-console/images/icons/sync-off-icon-blk_24x24.png) : Reload - reloads the form or table once if no auto reload interval is set. This icon changes to active (![Sync interval icon](/weblogic-remote-console/images/icons/sync-on-icon-blk_24x24.png)) when the reload interval is set. Click the icon to toggle the auto reload on and off.

* ![Sync interval icon](/weblogic-remote-console/images/icons/sync-interval-icon-blk_24x24.png) Auto Reload Interval - sets or clears a specified time interval, in seconds, for automatic reload of the form or table. If you select a different tab, or move to another page, automatic page reload stops.

* ![Shopping cart empty icon](/weblogic-remote-console/images/icons/shopping-cart-empty-tabstrip_24x24.png) / ![Shopping cart full icon](/weblogic-remote-console/images/icons/shopping-cart-non-empty-tabstrip_24x24.png) : Shopping Cart - indicates the status of changes to an Administration Server. A full shopping cart icon (![Shopping cart full icon](/weblogic-remote-console/images/icons/shopping-cart-non-empty-tabstrip_24x24.png)) indicates pending changes to the domain. Click to view, discard, or commit the changes.

## Use the WebLogic Remote Console help {id="help"}

The WebLogic Remote Console provides several types of online help on each page.
* Use the ? icon to the left of each field to access summary and detailed help for the field. If you hover over the ?, a summary help description displays. Click the ? icon to display a more detailed help description, if available.
* Click the ? icon in the top right of the content pane to toggle the view of the reference information for all of the fields displayed on the page.