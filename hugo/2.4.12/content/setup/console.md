---
title: Explore the WebLogic Remote Console
description: An overview of the WebLogic Remote Console and its differences with the Oracle WebLogic Administration Console.
weight: 1
---

The WebLogic Remote Console offers an alternative option for administering WebLogic Server domains. It not only allows you to edit Administration Servers, but also build WebLogic Deploy Tooling (WDT) model files and property lists.

While the WebLogic Remote Console shares many features with the Administration Console, its functionality is slightly different. See [ Differences with the Administration Console ]({{< relref "setup/admin-console-diff" >}}) for more information.


## Basic layout

<!-- ![WebLogic Remote Console](/weblogic-remote-console/images/wrc-console.png) -->

The WebLogic Remote Console presents a simple user interface that varies slightly across different providers. Broadly, it's arranged into the following areas:

* **Providers drawer** - manages the details of your current [project]({{< relref "userguide/projects" >}}), its [providers]({{< relref "userguide/providers" >}}) and their connection details. You can also import and export project files here. 

* **NavStrip** - toggles the visibility of the navigation tree (![Navpane icon](/weblogic-remote-console/images/icons/navigation-icon-toggle-off-blk_24x24.png)) and, in an Administration Server provider, permits movement between perspectives. 

* **Navigation Tree** - traverses the domain structure. Expand each top-level node to see more information. The Navigation Tree varies depending on your currently active provider.

* **Content Pane** - explore and edit the properties of the active provider.

The WebLogic Remote Console automatically detects and matches the language of your operating system.

## Navigate the domain {id="nav_dom"}

In the WebLogic Remote Console, you can travel through the structure of a WebLogic domain in multiple ways:

* **Navigation Tree** - expand the nodes and drill down until you reach the information you're interested in.

* **Breadcrumbs** - review the hierarchical path of your current page and jump back or across to a related page in a different perspective. For example, from Domain/Servers in the Edit Tree, you can jump to Environment/Servers in the Monitoring Tree from the breadcrumb trail.

* **Search** - enter a search term in the bar and see all the beans that match your search term. You can find previous searches in the Recent Searches node at the bottom of the Navigation Tree. Searches and search history are only performed within a perspective and provider.

## Modify console preferences

You can change the behavior of the WebLogic Remote Console to suit your needs.

1. In the WebLogic Remote Console, go to **File** > **Preferences**. (**WebLogic Remote Console** > **Application Preferences** on macOS).
1. Choose a section tab and make your changes as needed.
1. Close the **Preferences** dialog box to apply your changes.

## Tool bar icons {id="toolbar_icons"}

These icons appear along the top of the content pane:

* ![Home icon](/weblogic-remote-console/images/icons/home-icon-blk_24x24.png) : Home - returns you to the provider home page with its list of perspectives

* ![Landing page icon](/weblogic-remote-console/images/icons/landing-page-icon-blk_24x24.png) : Landing page - returns you to the landing page of the current perspective

* ![history icon](/weblogic-remote-console/images/icons/beanpath-history-icon-blk_24x24.png) : Navigation History - displays a menu with a list of clickable links to the pages you have visited. This history is perspective-scoped.

* ![Help icon](/weblogic-remote-console/images/icons/help-icon-blk_24x24.png) : Help - shows reference information about the attributes displayed on the page.

* ![Reload icon](/weblogic-remote-console/images/icons/sync-off-icon-blk_24x24.png) : Reload - reloads the form or table once if no auto reload interval is set. This icon changes to active (![Sync interval icon](/weblogic-remote-console/images/icons/sync-on-icon-blk_24x24.png)) when the reload interval is set. Click the icon to toggle the auto reload on and off.

* ![Sync interval icon](/weblogic-remote-console/images/icons/sync-interval-icon-blk_24x24.png) Auto Reload Interval - sets or clears a specified time interval, in seconds, for automatic reload of the form or table. If you select a different tab, or move to another page, automatic page reload stops.

* ![Shopping cart empty icon](/weblogic-remote-console/images/icons/shopping-cart-empty-tabstrip_24x24.png) / ![Shopping cart full icon](/weblogic-remote-console/images/icons/shopping-cart-non-empty-tabstrip_24x24.png) : Shopping Cart - indicates the status of changes to an Administration Server. A full shopping cart icon (![Shopping cart full icon](/weblogic-remote-console/images/icons/shopping-cart-non-empty-tabstrip_24x24.png)) indicates pending changes to the domain. Click to view, discard, or commit the changes.

## Customizable tables {id="cust_table"}

You can choose which columns to show or hide in tables so you can focus on the important details and ignore the irrelevant ones.

Click the **Customize Table** option that appears above all tables in the WebLogic Remote Console to view a list of all the possible columns you can add to the table and see information for. Move the columns back and forth between **Available Columns** and **Selected Columns** until you've assembled a set of columns that works for your needs and then, click **Apply**. 

To return the table to its default set of columns, click **Reset**.

The list of options under Available Columns changes depending on the table; not all columns are applicable to all tables. Additionally, any changes to table columns will apply to that specific table across all applicable providers - if you change the table columns for Server Templates in `wdt-model_1`, those changes will also affect the Server Templates table in `wdt-model_2` and `admin-server_1` (Configuration Tree). Changes will also persist after you stop and start the WebLogic Remote Console.

{{% notice tip %}}
You can easily copy text from the various tables throughout the WebLogic Remote Console. Right-click on a table cell and select either **Copy Column Cell to Clipboard** or **Copy Row Data to Clipboard** and the data from that table cell or its row is automatically saved to your computer's clipboard.
{{% /notice %}}

## Find help {id="help"}

The WebLogic Remote Console provides several types of online help on each page.
* Use the ? icon to the left of each field to access summary and detailed help for the field. If you hover over the ?, a summary help description displays. Click the ? icon to display a more detailed help description, if available.
* Click the ? icon in the top right of the content pane to toggle the view of the reference information for all of the fields displayed on the page.

## WebLogic Remote Console extension {id="ext"}

The WebLogic Remote Console extension is a complementary component that you can add to your WebLogic domain to enhance the functionality of the WebLogic Remote Console when managing domains. 

After you install the extension, you'll be able to:

* View pending changes in the Shopping Cart
* Manage security data stored in the embedded LDAP server (users, groups, roles, policies, credential mappings)
* Inspect the JNDI table
* Manage JMS messages and JTA transactions

To install the extension:

1. Create a `management-services-ext` directory under the domain home.
1. Download the latest WebLogic Remote Console extension, `{{<console_rest_ext>}}`, from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and save it inside the `management-services-ext` directory you created in the previous step.
    
    **Note**: Do not try to deploy `{{<console_rest_ext>}}` as an application in your domain.
1. Restart the Administration Server if it is already running.
1. In the WebLogic Remote Console, disconnect, then re-connect to the Administration Server.

## Supplemental customization {id="files"}

While you should perform all configuration of the WebLogic Remote Console from within its graphical user interface, occasionally there are circumstances where that's not possible. In those cases, you can view some of the data files upon which the WebLogic Remote Console builds its customizations. 

These files are located in the following directories:
* Linux: `$HOME/.config/weblogic-remote-console/`
* macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/`
* Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\`


| File name | Purpose |
|---|---|
|`auto-prefs.json`| Describes the user interface of the WebLogic Remote Console. |
|`config.json`| Describes settings for the WebLogic Remote Console. We do not recommend modifying this file; use the Settings dialog box to edit settings instead. See [Customize settings]({{< relref "userguide/advanced-settings" >}}) for more information. |
|`dashboards.json`| Records the details of existing dashboards. See [Generate dashboards]({{< relref "userguide/dashboards" >}}) for more information. |
|`out.log`| Collects log entries for the current session of the WebLogic Remote Console. At the start of each session, log entries from the previous session are moved to a new file marked by date: `out-yyyy-mm-dd`. See [Check log files]({{< relref "userguide/logging" >}}) for more information. |
|`recent-searches.json`| Lists the search terms for any searches that you've executed. See [Search]({{< relref "setup/console#nav_dom" >}}) for more information. |
|`table-customizations.json`| Describes any table customizations you've saved. See [Customizable tables]({{< relref "setup/console#cust_table" >}}) for more information. |

{{% notice note %}}
If you introduce an error into one of these files, it may affect the behavior of the WebLogic Remote Console and you may need to wipe or delete the file to recover. The WebLogic Remote Console will lose all saved data for that file, resetting it to its defaults. For example, if you have to erase `dashboards.json`, all your dashboards will be deleted.
{{% /notice %}}

## Multi-window support

You can open multiple instances of the WebLogic Remote Console to increase your productivity. Whether you want multiple windows to compare different views of the same provider or to work with distinct projects simultaneously, you can open a set of console windows that caters to your needs. Select **New Window** from the File menu to open a new WebLogic Remote Console window.