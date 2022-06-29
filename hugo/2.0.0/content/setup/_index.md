---
title: Get started
date: 2021-09-01
draft: false
description: Installing and basic configuration for the WebLogic Remote Console
weight: 1
---

## Install the WebLogic Remote Console

You can install and run the WebLogic Remote Console through a desktop application or from within your internet browser.

{{% notice note %}}
We recommend using the desktop application over the browser application whenever possible. Certain features, such as editing WDT model files, work more effectively in the desktop application.
{{% /notice %}}

### Desktop application {id="install_desktop"}

1. Uninstall any previous versions of the WebLogic Remote Console from your computer.
1. Download the WebLogic Remote Console. Go to [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and download the installer applicable for your operating system.
1. Run the installer.
1. **Optional**: Install the WebLogic Remote Console extension in the WebLogic Server domain. The WebLogic Remote Console extension adds additional functionality when using the WebLogic Remote Console.
    1. Create a `management-services-ext` directory under the domain home.
    1. Download the `console-rest-ext-1.0.war` from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and save it inside the `management-services-ext` directory you created in the previous step.
    1. Reboot the Administration Server if it is already running.
1. Launch the WebLogic Remote Console application.

### Browser-based {id="install_browser"}
Your computer must have [Java SE 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or later installed. To check your Java version, enter `java -version` at the command line.

1. Download the WebLogic Remote Console. Go to [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and download `console.zip`.
1. Extract the ZIP archive to a directory of your choice. Once its contents are extracted, it creates a `console` directory that includes:
    * The console executable file `console.jar`
    * The libraries required to use the console in the `libs` subdirectory
    * The console extension, `console-rest-ext-1.0.war`, that you install in the WebLogic Server domain
1. **Optional**: Install the WebLogic Remote Console extension in the WebLogic Server domain. The WebLogic Remote Console extension adds additional functionality when using the WebLogic Remote Console.
    1. Create a `management-services-ext` directory under the domain home.
    1. Download the `console-rest-ext-1.0.war` from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and save it in the `management-services-ext` directory you created in the previous step.
    1. Reboot the Administration Server if it is already running.
1. Open a command window and on the command line, enter `java -jar <console_home>/console.jar` where `<console_home>` is the directory where you unzipped the installer.
1. Open a browser window and enter `http://localhost:8012` in the address bar.

## Connect to a provider {id="connect"}
The WebLogic Remote Console supports provider connections to WebLogic Server Administration Servers and WebLogic Deploy Tooling (WDT) model files.

1. *If connecting to a WebLogic Server Administration Server,* start the WebLogic Administration Server.
1. Launch the WebLogic Remote Console in the desktop application or the browser.
1. Choose a startup task to build your first project. Projects are groups of connections to WebLogic Administration Servers, WebLogic Deploy Tooling (WDT) models or both. See [Projects]({{< relref "projects" >}}) for more information.
    * **Add Admin Server Connection Provider**: Connect to the Administration Server of a WebLogic Server domain.
    * **Add WDT Model File Provider**: Import an existing WDT Model file.
    * **Create Provider for New WDT Model File**: Create a new WDT model file with only the essential configurations for a fresh start.
    * **Import Project**: Import project settings from another WebLogic Remote Console instance.

    On subsequent launches, the desktop application will open your last active project.

    If you want to create a new project, select **File > New Project**.
1. Add additional providers to the project. Click &#x022EE; beside the project name and select a provider type.
1. Select an Administration Server or WDT model file from the Kiosk.
1. Start reviewing or editing the domain configuration.

## Next steps {id="next_steps"}

* [Familiarize yourself with the WebLogic Remote Console.]({{< relref "console" >}})
* [Edit your Administration Servers or WDT model files.]({{< relref "edit-domain-config" >}})
* [Customize your connection settings.]({{< relref "advanced-settings" >}})