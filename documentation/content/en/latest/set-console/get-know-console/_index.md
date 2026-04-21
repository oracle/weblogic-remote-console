---
weight: 18
title: Get to Know the Console
---



WebLogic Remote Console is a graphical user interface that enables you to administer **Providers** such as WebLogic Server domains, WDT model files \(and their composites\), and property lists.

For more information, see [Provider Types](..#GUID-82C1C605-D42E-45EA-AC16-5BA3D5853C96).

You can save the connection details for multiple providers in WebLogic Remote Console, making it easy to switch between domains and workflows, streamlining domain management.

As you add more provider connections, you may want to group them into **Projects**. Projects allow you to organize provider connections according to any categorization scheme that works for you. You can even save the same provider connection in multiple projects; you are saving the connection details so it doesn't matter from which project you access a provider.

For more information, see [Projects](#GUID-A6323CCF-02F4-4E77-BDF2-A2DB1623A598).

## Key Elements of the Interface {}

Most provider types have a **Navigation Tree** that presents the structure of a WebLogic Server domain as a node tree. Expand each top-level node \(such as **Environment** or **Security**\) to delve into the domain's structure. As you move through the Navigation Tree, the central pane of WebLogic Remote Console will update to display the applicable MBeans attributes and configurations for the currently selected node.

{{< alert title="Note" color="primary" >}}



A Property List provider does not have a Navigation Tree; its interface consists of a single page where you enter name-value pairs. In contrast, Administration Server providers have four distinct Navigation Trees, one for each perspective. See [Perspectives in the Administration Server Provider](../../administration-server/domain-configuration#GUID-E1D3A576-47A8-4291-9F56-617B1039168F).

{{< /alert >}}


You can also move through the domain structure using the Search field or the Breadcrumbs trail.

The **Search** field \(located in the header banner\) finds any MBeans in the domain that match your query. Search results are limited to the current provider and perspective. Previous search queries can be found \(and rerun\) under the **Recent Searches** node, the last node in the Navigation Tree.

The **Breadcrumb** trail \(located underneath the header bar\) indicates the full direct ancestry of your current page. You can use the breadcrumbs in the trail to jump to higher levels in the Navigation Tree. The final breadcrumb in the trail \(that is, the current page\) enables you to jump to related pages outside of the current page's hierarchy. Select the final breadcrumb to choose from a list of related pages.

{{< alert title="Note" color="primary" >}}



If you find yourself regularly reviewing specific data within your domain, consider building a **Dashboard**, which lets you curate complex search filters and compare disparate information about your domain. For more information, see [Dashboards](../../administration-server/monitoring-domains#GUID-1C12C76D-2820-4AD8-9556-46AC52C617AD).

{{< /alert >}}


[Table 1](#TABLE_GQ3_FQF_NZB) describes common icons for the various actions available throughout WebLogic Remote Console.

<table id="TABLE_GQ3_FQF_NZB"><thead><tr><th>

Icon

</th><th>

Description

</th></tr></thead><tbody><tr><td>

![Icon of GitHub logo](/weblogic-remote-console/images/ui-icons/ico-git-hub.png) GitHub

</td><td>

Opens the WebLogic Remote Console GitHub repository in your browser.

</td></tr><tr><td>

![Icon of a lightbulb](/weblogic-remote-console/images/ui-icons/ico-lightbulb.png)Console Tips

</td><td>

Provides tips on WebLogic Remote Console functionality.

</td></tr><tr><td>

![Icon of the sun](/weblogic-remote-console/images/ui-icons/ico-weather-sun.png)/![Icon of a crescent moon](/weblogic-remote-console/images/ui-icons/ico-weather-moon.png)Dark/Light mode

</td><td>

Switches the user interface between Light and Dark modes.

</td></tr><tr><td>

![Icon of question mark inside a circle](/weblogic-remote-console/images/ui-icons/ico-help-circle-s.png) User Documentation

</td><td>

Opens the WebLogic Remote Console user documentation in your browser.

</td></tr><tr><td>

![Icon of a star](/weblogic-remote-console/images/ui-icons/ico-star.png) Add Bookmark

</td><td>

Saves the current page as bookmark so you can quickly refer to it later.

</td></tr><tr><td>

![Icon of banner with a star](/weblogic-remote-console/images/ui-icons/ico-bookmark-favorite.png)Page Bookmarks

</td><td>

Opens a dialog box that lists all of your saved pages.

</td></tr><tr><td>

![Icon of an empty shopping cart](/weblogic-remote-console/images/ui-icons/ico-cart-alt.png) Shopping Cart

</td><td>

Lists any pending changes in the active Administration Server provider. You can choose whether to commit or discard them.When the **Shopping Cart** is full, you can click it to see the pending changes and then commit or discard them.

</td></tr><tr><td>

![Icon of a clock whose border is a circular arrow](/weblogic-remote-console/images/ui-icons/ico-clock-history.png) Show Pages History

</td><td>

Opens the **Pages History** dialog box, which lists the pages that you have previously visited in WebLogic Remote Console.

</td></tr><tr><td>

![Icon of leftward facing arrow inside a circle](/weblogic-remote-console/images/ui-icons/ico-arrow-left.png)/![Icon of right-facing arrow inside a circle](/weblogic-remote-console/images/ui-icons/ico-arrow-right.png)Back/Forward

</td><td>

Browses backward or forward through your previously visited pages in WebLogic Remote Console.

</td></tr><tr><td>

![Icon of question mark](/weblogic-remote-console/images/ui-icons/ico-help.png) Inline Field Help

</td><td>

Shows reference information about the attributes present on the current page. Click again to return to the editable fields.

</td></tr><tr><td>

![Icon of an arrow in a circle](/weblogic-remote-console/images/ui-icons/ico-refresh.png)Reload

</td><td>

Refreshes any forms or tables on the current page with the latest available data. When **Auto Reload Interval** is enabled, this icon will bounce continuously.

</td></tr><tr><td>

![Icon of an arrow in a circle with a line cutting through the circle](/weblogic-remote-console/images/ui-icons/ico-reset.png) Auto Reload Interval

</td><td>

Sets a time interval \(in seconds\) for how often WebLogic Remote Console should reload a page to refresh its information. If you select another tab or move to another page, automatic reload stops.To stop auto reload, click the bouncing **Reload** icon or click **Auto Reload Interval** and set the interval to <code>0</code>.

</td></tr><tr><td colspan="2">

**The following icons appear directly beside fields in WebLogic Remote Console.**

</td></tr><tr><td>

![Icon of a bullseye](/weblogic-remote-console/images/ui-icons/ico-target.png) Field Settings

</td><td>

Opens a dialog box where you edit values, review lengthy field values, or revert existing values to their default values \(that is, “unset” them\).In WDT model file and WDT Composite model providers, it also provides support for inserting variable values. See [WDT Model Tokens](../../weblogic-deploy-tooling/wdt-model-files#GUID-0C7510AB-67B2-4EF5-8DAB-5A09DC2BD2E8).

</td></tr><tr><td>

**\|** Change Indicator

</td><td>

Indicates that the current value of the marked field is set to a value other than the default value. See [Change Indicators](#section_mcl_y1g_y3c).

</td></tr></tbody>
</table>

Table 1. Page and Field Icons. Icons that may appear throughout WebLogic Remote Console.

## Change Indicators {#section_mcl_y1g_y3c}

When you modify an MBean attribute, WebLogic Remote Console adds a green bar to the left of the attribute's field to indicate that it is no longer set to the default value.

To return an MBean attribute to its default setting, select the **Field Settings** ![Icon of a bullseye](/weblogic-remote-console/images/ui-icons/ico-target.png) button beside the attribute field, then select **Unset value** and click **OK**. Make sure to save \(and commit\) the change.

{{< alert title="Note" color="primary" >}}



The domain configuration file, <code>config.xml</code>, only describes MBean attributes if they are set to non-default values. After you use restore a value to its default, the \(now unnecessary\) attribute will be removed from the file.

{{< /alert >}}


## Change Console Preferences {#GUID-709F9244-296B-443C-827F-AC8B26513FAC}

You can adjust the preferences of Desktop WebLogic Remote Console including changes to credential management, the interface's language, or auto-update behavior.

1.  Go to **File**, then **Preferences**. \(On macOS, go to **WebLogic Remote Console**, then **Application Preferences** \).

2.  Choose a section tab and make your changes as needed.

3.  Close the **Preferences** dialog box to apply your changes.


## Bookmark Pages {#GUID-BB23744E-D6F9-4D35-8CEB-01EBCF03636F}

You can save WebLogic Remote Console pages that you visit frequently.

Bookmarks are shared between providers of the same type. For example, if you save a page in an Administration Server provider, that page will be bookmarked in every Administration Server provider, but it won't be available in a WDT Model provider.

-   To save a page in WebLogic Remote Console as a bookmark:
    -   On the page that you want to save, click **Page Bookmark** ![Icon of a star](/weblogic-remote-console/images/ui-icons/ico-star.png) in the tool bar.

        On pages that are already bookmarked, the star will be filled in.

-   To go to a bookmarked page:
    -   In the upper right corner, click **Page Bookmarks** ![Icon of banner with a star](/weblogic-remote-console/images/ui-icons/ico-bookmark-favorite.png), then select the page that you want to visit.

-   To delete a bookmark:
    -   In the upper right corner, click **Page Bookmarks** ![Icon of banner with a star](/weblogic-remote-console/images/ui-icons/ico-bookmark-favorite.png), then click the page you want to delete.  WebLogic Remote Console will load that page where you can click the (filled in) **Page Bookmark** ![Icon of a star](/weblogic-remote-console/images/ui-icons/ico-star.png) icon to un-bookmark the page.

## Customize a Table {#GUID-FF37D291-F8C5-4EFB-8A18-DADF035348C9}

You can choose which columns are visible in a table, hiding irrelevant data so you can focus on the important details.

1.  Find a table that you want to customize. For example, in the **Edit Tree**, go to **Environment**, then **Servers**.

2.  Click **Customize Table** to display the list of Available Columns.

    The available column options differ by table as not all columns \(that is, properties\) are applicable to all tables.

3.  Use the arrows to move your wanted columns from **Available Columns** to **Selected Columns**. Move any unwanted columns back to **Available Columns**. Move the columns to **Selected Columns** in the order that you want them to appear in the table. There must be at least one column under **Selected Columns**.

4.  Click **Apply** to save your changes.


Changes to table columns will persist indefinitely and apply to that specific table across all applicable providers. If you change the table columns for Server Templates in wdt-model\_1, then those changes will also affect the Server Templates table in wdt-model\_2 and admin-server\_1 \(Edit Tree\).

To return a table to its default set of columns, open **Customize Table** and click **Reset**.

## Projects {#GUID-A6323CCF-02F4-4E77-BDF2-A2DB1623A598}

Use projects to organize providers in a way that makes sense for your workflow.

You can add as many providers to a project as you want. You can even add the same provider to multiple projects.

For simplicity, we recommend that if you use property lists with your WDT model files, then you should keep the property list provider in the same project as the WDT model file.

### Create a Project {#GUID-744E69CA-2A29-42E4-BD29-9F43516DF1F9}

To arrange providers into a collection:

1.  Open the **Projects/Providers** page.

2.  In the breadcrumbs trail, select **Projects**.

3.  Select **Create**.

4.  Enter a name for the new project and select **Done**. WebLogic Remote Console will automatically load the Project page for your new project.

5.  Select **Create** to add a provider to the new project. Select one of the following options to add a provider:

    -   Admin Server Connection Provider
    -   Existing WDT Model File Provider
    -   WDT Composite Model File Provider
    -   Existing Property List Provider
    -   New WDT Model File Provider
    -   New Property List Provider
    For more information on the different provider types, see [Provider Types](..#GUID-82C1C605-D42E-45EA-AC16-5BA3D5853C96)

6.  Fill in any required information.

7.  Click **Done** to add the provider to the project.

8.  **Optional**: Add more providers to the project.


You can add or remove providers from the project at any point. To switch to another project, return to the **Projects/Providers** page and select another project from the left pane navigation tree.

Deleting a project will not affect the providers within the project.

### Export a Project {#GUID-AD97818F-0740-4E24-8673-9FFF4E32596E}

If you use WebLogic Remote Console on multiple computers, exporting a project is a convenient way to share a project across multiple computers.

{{< alert title="Note" color="primary" >}}

 If the project contains a WDT model file, make sure the location of the WDT model file is accessible to all the computers where this project will be imported to.

{{< /alert >}}


1.  Open the **Projects/Providers** page.

2.  In the breadcrumbs trail, select **Projects**.

3.  In the Projects table, select the project that you want to export.

4.  Select **Export** and save the <code>projects.json</code> file to your computer. You can change the file name as desired.


You can import the <code>projects.json</code> file into other instances of WebLogic Remote Console.

### Import a Project {#GUID-F0A7A1C6-87F1-458B-9D31-5FF65E20023D}

You can import the project details of an existing project to rapidly ramp up productivity in a new installation of WebLogic Remote Console.

1.  Export a project and save the file to the computer where you want to import it. See [Export a Project](#GUID-AD97818F-0740-4E24-8673-9FFF4E32596E).

2.  On the computer where you want to import the file, start WebLogic Remote Console.

3.  On the **Projects** page, select **Import**.

4.  Select **Upload File** and browse to the file location of the exported project file.

5.  Click **Done**.


{{< alert title="Note" color="primary" >}}



The behavior of imported projects differs between Desktop WebLogic Remote Console and Hosted WebLogic Remote Console.

-   In Desktop WebLogic Remote Console, the console loads the imported project automatically but you can switch back to any of your previously existing projects.

-   In Hosted WebLogic Remote Console, the console *adds* the providers from the imported project to the current project.


{{< /alert >}}


## Enable Keyboard Navigation on macOS {#GUID-5C611ED8-29EF-4B21-B181-557C7D192C96}

On devices running macOS, you must specifically enable keyboard navigation before you can use the Tab key \(or Shift + Tab keys\) to navigate between the controls in WebLogic Remote Console.

1.  On your device running macOS, open the Apple main menu and select **System Settings**.

2.  Click the **Keyboard** item in the sidebar.

3.  Turn on the **Keyboard Navigation** option.

4.  **Optional**: If you plan to use the Safari browser with Hosted WebLogic Remote Console, then do the following:

    1.  Open the Safari browser and open its main menu.

    2.  Select **Settings**.

    3.  On the **Advanced** tab, turn on the **Press Tab to highlight each item on a webpage** option.


