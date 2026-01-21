---
weight: 18
title: Get to Know the Console
---



WebLogic Remote Console is your portal to managing WebLogic Server domains from a unified interface, whether they are running domains or model templates.

When you launch WebLogic Remote Console for the first time, it opens a **Startup Tasks** dialog box with options to connect to a new provider, such as an Administration Server or WDT model file. WebLogic Remote Console remembers your connection details so on subsequent visits, it will open on your last project, letting you continue where you left off.

The structure of WebLogic Remote Console remains similar across provider types, with variances as appropriate for the provider type.

## Key Elements of the Interface {}

Open the ![Providers drawer](/weblogic-remote-console/images/ui-icons/project-management-blk-24x24.png) **Providers** drawer to see and manage your saved provider connections.

Browse the **Navigation Tree** to see the structure of the provider as a node tree. In providers based on domains, such as Administration Servers or WDT model files, the node tree builds upon the MBean structure that defines a WebLogic Server domain. Beside the Navigation Tree is the **NavStrip**. On providers with multiple perspectives, you can also use the icons in the NavStrip to move between perspectives.

Click ![Toggle Navigation Tree visibility](/weblogic-remote-console/images/ui-icons/navigation-icon-toggle-blk-24x24.png) above the NavStrip to hide the Navigation Tree when you want a bigger editing area. Click it again to bring the Navigation Tree back.

The **Content Pane** is the main editing area for managing your domains or property lists. As you move through the nodes of the Navigation Tree, the Content Pane updates to match your new position.

## Tools {}

Tools are a set of quick actions that you can use to navigate or manipulate the interface. Icons for these actions are scattered across the top of WebLogic Remote Console.

Tool icons only appear on pages where they are applicable. For example, the Shopping Cart, used to indicate pending changes to an active domain, only appears in Administration Server providers.

<table id="TABLE_GQ3_FQF_NZB"><thead><tr><th>

Tool Icon

</th><th>

Description

</th></tr></thead><tbody><tr><td>

![Home](/weblogic-remote-console/images/ui-icons/home-icon-blk-24x24.png) Home

</td><td>

Sends you to the Home Page of the provider.

</td></tr><tr><td>

![Empty shopping cart](/weblogic-remote-console/images/ui-icons/shopping-cart-icon-24x24.png) Shopping Cart

</td><td>

Indicates if there are pending changes ready to be committed to a WebLogic Server domain.When the **Shopping Cart** is full, you can click it to see the pending changes and then commit or discard them.

</td></tr><tr><td>

![Visibility of history](/weblogic-remote-console/images/ui-icons/beanpath-history-icon-blk-24x24.png) Visibility of History

</td><td>

Triggers a record of the pages you visit. When active, a drop-down list appears where you can see, and return to, your previous pages. History is limited to the current perspective. Click **More ︙**, then **Clear History Entries** to delete your navigation history.

</td></tr><tr><td>

![Providers drawer](/weblogic-remote-console/images/ui-icons/project-management-blk-24x24.png) Providers

</td><td>

Opens the **Providers** drawer where you can manage your provider connections.

</td></tr><tr><td>

![Back](../../pages-history-back-blk-24x24.png)/![Next](/weblogic-remote-console/images/ui-icons/pages-history-next-blk-24x24.png) Browse Back and Forward

</td><td>

Browses backward or forward through your previously visited pages in WebLogic Remote Console.

</td></tr><tr><td>

![Pages history](/weblogic-remote-console/images/ui-icons/pages-history-icon-blk-24x24.png) Pages History

</td><td>

Opens the **Pages History** dialog box, which lists the pages that you have previously visited in WebLogic Remote Console.

</td></tr><tr><td>

![Landing page](/weblogic-remote-console/images/ui-icons/landing-page-icon-blk-24x24.png) Landing Page

</td><td>

Sends you to the Landing Page of the current perspective.

</td></tr><tr><td>

![Help](/weblogic-remote-console/images/ui-icons/toggle-help-icon-blk-16x16.png) Help

</td><td>

Shows reference information about the attributes present on the current page.

</td></tr><tr><td>

![Reload](/weblogic-remote-console/images/ui-icons/sync-icon-blk-24x24.png) Reload

</td><td>

Refreshes any forms or tables on the current page with the latest available data.When **Auto Reload Interval** is enabled, this icon will bounce continuously.

</td></tr><tr><td>

![Auto-reload interval](/weblogic-remote-console/images/ui-icons/sync-interval-icon-blk-24x24.png) Auto Reload Interval

</td><td>

Sets a time interval \(in seconds\) for how often WebLogic Remote Console should reload a page to refresh its information. If you select another tab or move to another page, automatic reload stops.To stop auto reload, click the bouncing **Reload** icon or click **Auto Reload Interval** and set the interval to <code>0</code>.

</td></tr><tr><td>

![Refresh page values](/weblogic-remote-console/images/ui-icons/action-reset-icon-blk-24x24.png) Refresh Page Values

</td><td>

Updates the Content Pane with the latest values.

</td></tr><tr><td>

**☆** Page Bookmarks

</td><td>

Saves the current page as a bookmark. You can also view existing bookmarks.

</td></tr></tbody>
</table>

Table 1. Tools. Tool icons that may appear along the top of the Content Pane.

## Explore your Domain {}

WebLogic Server domains can be complex structures, so WebLogic Remote Console provides multiple methods to locate your objective.

**Navigation Tree**: Expand the nodes of the Navigation Tree to browse its children and gain a high level understanding of the hierarchical relationship of a WebLogic Server domain.

**Breadcrumbs**: The Content Pane provides a breadcrumb menu to orient you as you descend further into a node branch. You can also click on a node's page title in the Breadcrumb menu to find links to related nodes that take you directly to the related content.

**Search**: Use the search bar to find any MBeans in the domain that match your query. Searches are restricted to within the current provider and perspective. Previous search queries can be found as the last node in the Navigation Tree, nested under the **Recent Searches** node.

**Dashboards**: If you find yourself regularly reviewing specific data within your domain, you may want to make use of Dashboards, which let you curate complex search filters and compare disparate information about your domain. For more information, see [Dashboards](../../administration-server/monitoring-domains#GUID-1C12C76D-2820-4AD8-9556-46AC52C617AD).

## Change Indicators {}

When you modify an MBean attribute, WebLogic Remote Console adds a black outline to the attribute's field to indicate that it is no longer set to the default value.

To return an MBean attribute to its default setting, right-click inside the attribute's field and click **Restore to default**. Save and commit the change.

{{< alert title="Note" color="primary" >}}



The domain configuration file, <code>config.xml</code>, only describes MBean attributes if they are set to non-default values. After you use Restore to default, the \(now unnecessary\) attribute will be removed from the file.

{{< /alert >}}


## Change Console Preferences {#GUID-709F9244-296B-443C-827F-AC8B26513FAC}

You can customize Desktop WebLogic Remote Console to suit your needs.

1.  Go to **File**, then **Preferences**. \(On macOS, go to **WebLogic Remote Console**, then **Application Preferences** \).

2.  Choose a section tab and make your changes as needed.

3.  Close the **Preferences** dialog box to apply your changes.


## Bookmark Pages {#GUID-BB23744E-D6F9-4D35-8CEB-01EBCF03636F}

You can save WebLogic Remote Console pages that you visit frequently.

Bookmarks are shared between providers of the same type. For example, if you save a page in an Administration Server provider, that page will be bookmarked in every Administration Server provider, but it won't be bookmarked in a WDT Model provider.

-   To save a page in WebLogic Remote Console as a bookmark:
-   On the page that you want to save, click **Page Bookmarks ☆** in the tool bar, then select **Add Bookmark for Current Page**.

    On pages that are already bookmarked, the star will be filled in.

-   To go to a bookmarked page:
-   In the upper top right corner \(beside Pages History ![Pages history](/weblogic-remote-console/images/ui-icons/pages-history-icon-blk-24x24.png)\), click **Page Bookmarks ☆**, then select the page you want to visit.

-   To delete a bookmark:
-   In the upper top right corner \(beside Pages History ![Pages history](/weblogic-remote-console/images/ui-icons/pages-history-icon-blk-24x24.png)\), click **Page Bookmarks ☆**, then, in the row for the the page that you want to delete, click **Delete**, then **Apply**.

    If you clicked **Delete** on the wrong bookmark, you can click **Reset** to undo the deletion, if you haven't clicked **Apply** yet.


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

1.  Open **File**, then **New Project**.

2.  Enter a name for the new project.

3.  Open the **Providers** drawer and beside the project's name, click **More ︙**. Select one of the following options to add a provider:

    -   Add Admin Server Connection Provider
    -   Add WDT Model File Provider
    -   Add WDT Composite Model File Provider
    -   Add Property List Provider
    -   Create Provider for New WDT Model File
    -   Create Provider for New Property List
    For more information on the different provider types, see [Provider Types](..#GUID-82C1C605-D42E-45EA-AC16-5BA3D5853C96)

4.  Fill in any required information.

5.  Click **OK** to add the provider to your project.

6.  **Optional**: Add more providers to the project.


You can add or remove providers from the project at any point. To switch to another project, open **File**, then **Switch to project** and choose the project that you want to switch to.

Deleting a project will not affect the providers within the project.

### Export a Project {#GUID-AD97818F-0740-4E24-8673-9FFF4E32596E}

If you use WebLogic Remote Console on multiple computers, exporting a project is a convenient way to share a project across multiple computers.

{{< alert title="Note" color="primary" >}}

 If the project contains a WDT model file, make sure the location of the WDT model file is accessible to all the computers where this project will be imported to.

{{< /alert >}}


1.  In the Providers drawer, click **More ︙** and select **Export Providers as Project**.

2.  Enter a name for the exported project. When imported into another WebLogic Remote Console, this will be the name of the project.

3.  Enter a name for the file of the exported project.

4.  Click **OK** and choose a file location to save the exported project file.


WebLogic Remote Console creates a JSON file with the project details that you can import into other instances of WebLogic Remote Console.

### Import a Project {#GUID-F0A7A1C6-87F1-458B-9D31-5FF65E20023D}

You can import the project details of an existing project to rapidly ramp up productivity in a new installation of WebLogic Remote Console.

1.  Export a project and save the file to the computer where you want to import it. See [Export a Project](#GUID-AD97818F-0740-4E24-8673-9FFF4E32596E).

2.  On the computer where you want to import the file, start WebLogic Remote Console.

3.  In the Providers drawer, click **More ︙** and select **Import Project**.

4.  Click **Upload File** and browse to the exported project file.

5.  Click **Import**.


-   In Desktop WebLogic Remote Console, the imported project replaces the current project. To return to the previous project, open **File**, then **Switch to project** and choose the previous project.

-   In Hosted WebLogic Remote Console, the providers of the imported project are added to the current project.


## Enable Keyboard Navigation on macOS {#GUID-5C611ED8-29EF-4B21-B181-557C7D192C96}

On devices running macOS, you must specifically enable keyboard navigation before you can use the Tab key \(or Shift + Tab keys\) to navigate between the controls in WebLogic Remote Console.

1.  On your device running macOS, open the Apple main menu and select **System Settings**.

2.  Click the **Keyboard** item in the sidebar.

3.  Turn on the **Keyboard Navigation** option.

4.  **Optional**: If you plan to use the Safari browser with Hosted WebLogic Remote Console, then do the following:

    1.  Open the Safari browser and open its main menu.

    2.  Select **Settings**.

    3.  On the **Advanced** tab, turn on the **Press Tab to highlight each item on a webpage** option.


