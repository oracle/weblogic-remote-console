---
weight: 1
title: Introducing WebLogic Remote Console 3.x!
---

{{% alert color="secondary" %}}

**WebLogic Remote Console 3.0.3**, the general availability (GA) release of WebLogic Remote Console 3.x, is now available!

Refer to the [current documentation](../latest/_index.md) for the latest information. 

WebLogic Remote Console 3.0.0, 3.0.1, and 3.0.2 releases were made available as **technical previews** for testing purposes only. You should now use release 3.0.3 or later.

{{% /alert %}}

WebLogic Remote Console 3.x is a substantial design update that delivers significant usability improvements to WebLogic Remote Console.

We've also made considerable cosmetic updates in 3.x. MBeans and their configurations remain in the same places, they just look a little different. You can continue to refer to the [documentation for the latest GA release of WebLogic Remote Console](../latest/_index.md) for guidance on how to administer your domains.

To help you understand what *has* changed, we've outlined some of the major functional differences below.

## Key Differences Between 2.x and 3.x

* **Enhanced Project management**: Project management has been moved out of the File menu into its own dedicated page where you can add, edit, and delete projects and their constituent providers.
* **Improved Provider management**: The Providers drawer has been re-imagined as a dedicated page where you can see all of the providers (and their details) in a project at a glance. You can add, edit, delete, and sort providers from this page.
* **Changes to Change Management**:
  * **Improved Shopping Cart**: Pending changes are now visible in a dialog box where you can see where the change was made and the old and new values.
  * **Change indicators**: Configurations with non-default values are now marked by a green bar to the left of the field. Previously, changes were indicated by a black outline.
  * **Unsaved changes**: WebLogic Remote Console no longer warns you when you try to leave a page that has unsaved changes. Previously, WebLogic Remote Console would ask you to confirm whether to save or discard your changes before letting you navigate away.
* **Clearer and sharper icons**: Icons throughout WebLogic Remote Console have been updated to more clearly convey their functions. See [Page Icons](#page-icons) and [Field Icons](#field-icons).
  * **Rearranged tool bar icons**: Tool bar icons have been shifted around to better group functionality and workflow.
* **New-ish Field Settings button**: <i class="fa-solid fa-bullseye"></i> This button allows for more granular editing of field values. It opens a separate dialog box where you can edit values, review lengthy field values, or revert existing values to their default values (that is, "unset" them). The Field Settings button will be familiar to users who managed WDT model files in WebLogic Remote Console. 
* **Consolidated Navigation Tree**: The NavStrip and Navigation Tree have been combined into a single panel, allowing you to switch between perspectives more intuitively.
* **More sophisticated Breadcrumb navigation**: Move up, down, and across nodes of WebLogic Remote Console. Use the breadcrumb trail to not only help you understand your position within the domain, but to move through it. 

    Each breadcrumb in the trail is clickable so you can move up levels in the hierarchy, or you can click the dropdown menu beside the final breadcrumb (aka the current page) to jump to its child nodes or to its related pages in different perspectives.
* **Dark Mode!**: <i class="fa-regular fa-sun"></i> / <i class="fa-regular fa-moon"></i>

{{% alert color="success" %}}

In order to release the best possible product for general availability, we're asking you to try out WebLogic Remote Console 3.x and tell us what you think.

If you want to give feedback, you can do so by:

* Leaving a comment in the [#remote-console Slack channel](https://join.slack.com/t/oracle-weblogic/shared_invite/zt-1ni1gtjv6-PGC6CQ4uIte3KBdm_67~aQ).

* Opening an issue in the [WebLogic Remote Console GitHub repository](https://github.com/oracle/weblogic-remote-console) that describes your issue. Make sure to include your environment details (OS, JDK, WebLogic Server) and any relevant logs. 

{{% /alert %}}

## Connecting to a Provider

1. Open WebLogic Remote Console.
1. Click **Create** and choose a Provider type. See [Provider Types](../latest/set-console/#GUID-82C1C605-D42E-45EA-AC16-5BA3D5853C96).
1. Fill in the necessary connection information. For more detailed steps:
    * For an Admin Server Connection Provider, see [Connect to an Administration Server](../latest/administration-server/domain-configuration/#GUID-37C3DE03-B1A7-42AA-B596-83D7A9520D33).
    * For a WDT Model File Provider, see [Create a WDT Model File](../latest/weblogic-deploy-tooling/wdt-model-files/#GUID-1ECF1B50-BE85-413F-8417-34A8E0CC8FB0) or [Upload a WDT Model File](../latest/weblogic-deploy-tooling/wdt-model-files/#GUID-EC821453-1C8A-49DD-A2AB-B5BF58B0B00E).
    * For a WDT Composite Model Provider, see [Create a WDT Composite Model](../latest/weblogic-deploy-tooling/wdt-composites/#GUID-099438C8-E18F-49E5-8963-DD229B77910A).
    * For a Property List Provider, see [Create a Property List](../latest/weblogic-deploy-tooling/property-lists/#GUID-8A4D1F37-7E9A-47B7-BD7D-4EC0B69426FA).
1. Click **Done** to save the provider.
1. Click **Connect/Activate**.

[![Administration Server in the Edit Tree perspective](/weblogic-remote-console/images/screenshots/admin-server-300.png)](/weblogic-remote-console/images/screenshots/admin-server-300.png)

* If you want to *see* the current provider's details, click the **Kebab** menu <i class="fa-solid fa-ellipsis-vertical"></i> beside the breadcrumb navigation and then click **Provider Information**. A dialog box with the provider's details will open.

* If you want to *edit* a provider's details, click the **Kebab** menu <i class="fa-solid fa-ellipsis-vertical"></i> beside the breadcrumb navigation and then click **Go to Project/Provider Table**. Select the provider you want to edit. After making your changes, click **Save**.


### Page Icons

|Icon|Usage|
|---|---|
|<i class="fa-brands fa-github"></i>| GitHub - Opens the WebLogic Remote Console GitHub repository in your browser.|
|<i class="fa-solid fa-lightbulb"></i>| User Tips - Provides tips on WebLogic Remote Console functionality. |
|<i class="fa-regular fa-sun"></i> / <i class="fa-regular fa-moon"></i>| Dark/Light mode - Switches between Light and Dark modes.|
|<i class="fa-regular fa-circle-question"></i>| User Help - Opens the WebLogic Remote Console user documentation in your browser.|
|<i class="fa-regular fa-star"></i>| Add Bookmark - Saves the current page as bookmark so you can quickly refer to it later.|
|<i class="fa-regular fa-bookmark"></i>| Page Bookmarks - Opens a dialog box that lists all of your saved pages.|
|<i class="fa-solid fa-cart-shopping"></i>| Shopping Cart - Lists any pending changes in the active Administration Server provider. You can choose whether to commit or discard them.|
|<i class="fa-solid fa-clock-rotate-left"></i>| Show Pages History - Opens the Pages History dialog box, which lists the pages that you have previously visited in WebLogic Remote Console.|
|<i class="fa-solid fa-arrow-left"></i> / <i class="fa-solid fa-arrow-right"></i>| Back/Forward - Browses backward or forward through your previously visited pages in WebLogic Remote Console. |
|<i class="fa-solid fa-circle-question"></i>| Inline Field Help - Shows reference information about the attributes present on the current page. Click again to return to the editable fields.|
|<i class="fa-solid fa-rotate-right"></i>| Reload - Refreshes any forms or tables on the current page with the latest available data. When Auto Reload Interval is enabled, this icon will bounce continuously.|
|<i class="fa-solid fa-rotate-right fa-rotate-270"></i>| Auto-Reload Interval - Sets a time interval (in seconds) for how often WebLogic Remote Console should reload a page to refresh its information. If you select another tab or move to another page, automatic reload stops.To stop auto reload, click the bouncing Reload icon or click Auto Reload Interval and set the interval to 0.|

### Field Icons

|Icon|Usage|
|---|---|
|<i class="fa-solid fa-bullseye"></i>| Field Settings - Opens a dialog box where you edit values, review lengthy field values, or revert existing values to their default values (that is, “unset” them).|
|**\|**| Change Indicator -  Indicates that the current value of the marked field differs from the default value.|

## Managing Projects

You can use projects to organize your providers in a way that makes sense for your workflow.

1. While in a provider, click the **Kebab** menu <i class="fa-solid fa-ellipsis-vertical"></i> beside the breadcrumb navigation and then click **Go to Project/Provider Table**.

    The **Project/Provider** table lists all provider connections in a project and is your central place for managing providers in the project. For the current project you can also add more providers, edit existing providers, connect to a different provider, re-order providers, and delete providers.

    [![Projects/Provider table](/weblogic-remote-console/images/screenshots/providers-300.png)](/weblogic-remote-console/images/screenshots/providers-300.png)

    **Tip**: Use the **Customize Table** menu to control which columns are visible in the **Provider Details** table.
1. In the breadcrumbs trail, click **Projects**. 
    
    [![Projects](/weblogic-remote-console/images/screenshots/projects-300.png)](/weblogic-remote-console/images/screenshots/projects-300.png)
1. Click **Create** to create a new project.
  
    You can also import or export a project (and its provider connection details) from the **Projects** page.
1. Select the new project and then click **Create** to add a provider to the project. 

To switch between projects, return to the **Projects** page by clicking **Projects** in the breadcrumb trail and then selecting a different project.

To get back to the active *provider* (or switch to another provider in the project), select the project that contains the active provider, then, in the **Project/Provider** table, select the active provider. Click **Connect/Activate**.
