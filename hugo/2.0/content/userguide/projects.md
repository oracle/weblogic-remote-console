---
title: Projects
date: 2021-09-01
draft: false
description: How to connect to a WebLogic Server domain or deploy tooling model.
weight: 1
---

A project is a group of connections to either WebLogic Administration Servers or WebLogic Deploy Tooling (WDT) models or both.

## Create a project {id="create"}

1. Open **File** > **New Project**.
1. Enter a name for the project and click **OK**. The new project will appear in the Kiosk.
1. Expand the Kiosk and beside the project name, click &#x022EE;. Select either **Add Admin Server Connection Provider** or **Add WDT Model File Provider**. You can add multiple of either to the project and it doesn't matter which order you add them in. You can also create a WDT model file with minimal configuration by selecting **Create Provider for New WDT Model File**.
1. To add an Admin Server connection:
    1. Select **Add Admin Server Connection Provider**.
    1. Enter a name for the the connection in the **Connection Name** field. This is merely a reference name and does not need to match the name of the Administration Server.
    1. Enter the username and password credentials for a user account for that domain.
    1. If necessary, update the URL to match the actual location of the Administration Server.
    1. Click **OK** to connect the WebLogic Remote Console to the Administration Server.
1. To add a WDT model file:
    1. Select **Add WDT Model File Provider**.
    1. Enter a name for the model in the **Model Name** field. This is merely a reference name and does not need to match the name of the WDT model.
    1. Click ![Upload file](/weblogic-remote-console/images/icons/choose-file-icon-blk_24x24.png) and browse to the WDT model file (a YAML or JSON file).
    1. Click **OK** to upload the file.
1. To create a WDT model file with minimal configurations:
    1. Select **Create Provider for New WDT Model File**.
    1. Enter a name for the model in the **WDT Model Provider Name** field. This is merely a reference name and does not need to match the name of the WDT model.
    1. Enter a name for the WDT model file in the **WDT Model Filename** field. Include .yaml or .json at the end of the file name.
    1. Click ![Upload file](/weblogic-remote-console/images/icons/choose-directory-icon-blk_24x24.png) and browse to the directory where you want to save the new WDT model file.
    1. **Optional**: Enable **Use Sparse Template** to create a WDT model file which does not contain any references to an Administration Server.
    1. Click **OK** to create the file.

The Administration Server connection or WDT model will appear in the Kiosk. Select a connection to make it active in the content pane and you can begin editing it. See [Edit Domain Configurations]({{< relref "edit-domain-config" >}}) for tips on how making changes in the WebLogic Remote Console differs from the Administration Console.

{{% notice note %}}
If you plan to edit WDT model files, it's recommended that you use the desktop application over the browser.
{{% /notice %}}

## Switch between projects {id="switch"}

You can create multiple projects in the WebLogic Remote Console, each with different domain connections or WDT model files, or both.

To switch to another project, open the **File** menu and select **Switch to project**. Choose the project you want to switch to.

## Edit a project {id="edit"}
You can edit a project and its connections at any time.

To add connections to a project, expand the Kiosk and click &#x022EE;.

To rename a project, open the **File** menu and select **Rename *current-project***.

To edit the details of a connection, expand the Kiosk and select the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-manage-icon-brn_24x24.png) icon beside the connection you want to edit.


## Export a project {id="export"}

If you're using the WebLogic Remote Console across several computers, exporting a project is a convenient way to share a project across multiple computers.

{{% notice note %}}
If your project contains a WDT model file, make sure the location of the WDT model file is accessible to all the computers where this project will be imported to.
{{% /notice %}}

1. Create a project with all the desired connections.
1. In the Kiosk, click &#x022EE; and select **Export Providers as Project**.
1. Enter a name for the exported project. This is the name that will be used when it is imported into another WebLogic Remote Console instance.
1. Enter a name for the file of the exported project.
1. Click **OK** and choose a file location to save the exported project file.

WebLogic Remote Console creates a JSON file with the project details that you can import into other instances of WebLogic Remote Console

## Import a project {id="import"}

You can import the project details of a previously created project to rapidly ramp up productivity in a new installation of WebLogic Remote Console.

1. [Export a project](#export) and save the file to the computer where you want to import it.
1. On the computer where you want to import the file, start WebLogic Remote Console.
1. Open the Kiosk menu and click &#x022EE;.
1. Select **Import Project**.
1. Click ![Upload file](/weblogic-remote-console/images/icons/choose-file-icon-blk_24x24.png) and browse to the exported project file.
1. Click **Import**.

The imported project will automatically become the current project loaded in the WebLogic Remote Console.


## Delete a project {id="delete"}

To delete a project, open the **File** menu and select **Delete Project**. Choose the project you want to delete.
