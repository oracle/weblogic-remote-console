---
title: Get started
date: 2021-09-01
draft: false
description: Installing and basic configuration for the WebLogic Remote Console
weight: 1
---

You can install and run the WebLogic Remote Console as either a desktop application or a browser application. Both options are valid choices but they function slightly differently.

{{% notice note %}}
We recommend that you use the desktop application over the browser application whenever possible. Certain features, such as editing WDT model files, work more effectively in the desktop application.
{{% /notice %}}

## Review system requirements {id="sys_reqs"}

The WebLogic Remote Console supports the following platforms:

* Linux (64 bit only)
    * Ubuntu 14.04 and later
    * Fedora 24 and later
        * Oracle Linux 8 and later
    * Debian 8 and later
* macOS
    * macOS 10.11 (El Capitan) or later (64-bit Intel)
* Windows (64 bit only)
    * Windows 7 and later

Additionally, the WebLogic Remote Console *browser application* requires the use of a modern internet browser:

* Apple Safari
* Google Chrome
* Microsoft Edge
* Mozilla Firefox

The WebLogic Remote Console *desktop application* is based on the [Electron](https://www.electronjs.org/) framework.

## Install the WebLogic Remote Console

### Desktop application {id="install_desktop"}

1. Uninstall any previous versions of the WebLogic Remote Console from your computer.
1. Download the WebLogic Remote Console. Go to [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and download the installer applicable for your operating system.
1. Run the installer.
1. **Optional**: Install the WebLogic Remote Console extension in the WebLogic Server domain. The WebLogic Remote Console extension adds additional functionality when using the WebLogic Remote Console.
    1. Create a `management-services-ext` directory under the domain home.
    1. Download the `console-rest-ext-1.0.war` from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and save it inside the `management-services-ext` directory you created in the previous step.
    1. Reboot the Administration Server if it is already running.
1. Launch the WebLogic Remote Console application.

### Browser application {id="install_browser"}
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
The WebLogic Remote Console supports providers that connect to WebLogic Server Administration Servers and providers that edit WebLogic Deploy Tooling (WDT) model files and property lists.

1. Open the WebLogic Remote Console in the desktop application or the browser.
1. Add a provider from the Startup Tasks dialog box. Or, if it doesn't appear, expand the Kiosk and click &#x022EE;. The following providers are available:
    * Add Admin Server Connection Provider (the Administration Server must be running)
    * Add WDT Model File Provider
    * Add WDT Composite Model File Provider
    * Add Property List Provider
    * Create Provider for New WDT Model File
    * Create Provider for New Property List

    See [Provider types]({{< relref "userguide/providers" >}}) for more information.

    In the desktop application, you can organize providers into Projects that persist when you close and reopen the application. See [Projects]({{< relref "projects" >}}) for more information.
1. Add more providers to the project. Click &#x022EE; beside the project name and select a provider type.
1. Select a provider from the Kiosk.
1. Start reviewing or editing the domain configuration.

## Next steps {id="next_steps"}

* [Familiarize yourself with the WebLogic Remote Console.]({{< relref "console" >}})
* [Edit your providers.]({{< relref "userguide/providers" >}})
* [Customize your connection settings.]({{< relref "advanced-settings" >}})