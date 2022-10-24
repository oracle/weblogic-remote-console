---
title: Projects
date: 2021-09-01
draft: false
description: How to connect to a WebLogic domain or deploy tooling model.
weight: 1
---

A project is a group of providers connections to WebLogic Administration Servers, WebLogic Deploy Tooling (WDT) models, WDT composite models, or property lists.

## Create a project {id="create"}

1. Open **File** > **New Project**.
1. Enter a name for the project and click **OK**. The new project will appear in the Kiosk.
Next, you'll add a provider to the project.
1. Expand the Kiosk and beside the project name, click &#x022EE;. Select one of the following options to add provider:
    * Add Admin Server Connection Provider
    * Add WDT Model File Provider
    * Add WDT Composite Model File Provider
    * Add Property List Provider
    * Create Provider for New WDT Model File
    * Create Provider for New Property List

    Visit [Provider types]({{< relref "userguide/providers" >}}) for more information on each of the providers.
1. Fill in the required details.
1. Click **OK** to save add the provider to your project.
1. Add more providers to your project.

You can add as many providers to a project as you want. You can also create multiple projects to intelligently organize providers as needed. Furthermore, you can add the same providers into different projects if you need to.

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