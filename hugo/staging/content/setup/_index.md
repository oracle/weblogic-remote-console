---
title: Get started
date: 2021-09-01
draft: false
description: Installing and basic configuration for the WebLogic Remote Console
weight: 1
---

## Review system requirements {id="sys_reqs"}

The WebLogic Remote Console supports the following platforms:

* Linux (64 bit only)
    * Ubuntu 14.04 and later
    * Fedora 24 and later
        * Oracle Linux 7 and later
    * Debian 8 and later
* macOS
    * macOS 10.11 (El Capitan) or later (64-bit Intel)
* Windows (64 bit only)
    * Windows 7 and later

The WebLogic Remote Console desktop application is based on the [Electron](https://www.electronjs.org/) framework.

## Install the WebLogic Remote Console {id="install"}

1. Uninstall any previous versions of the WebLogic Remote Console from your computer.
1. Download the WebLogic Remote Console. Go to [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and download the installer for your operating system.
1. Run the installer.
1. **Optional**: Install the WebLogic Remote Console extension in the WebLogic Server domain. The WebLogic Remote Console extension provides [additional functionality]({{< relref "setup/console#ext" >}}) when using the WebLogic Remote Console to manage WebLogic domains.
    1. Create a `management-services-ext` directory under the domain home.
    1. Download the latest WebLogic Remote Console extension, `{{<console_rest_ext>}}`, from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and save it inside the `management-services-ext` directory you created in the previous step. If you have an earlier version of the extension already downloaded, delete it and replace it with the latest version.
    1. Reboot the Administration Server if it is already running.
1. Launch the WebLogic Remote Console application.

The WebLogic Remote Console is also available as a browser application. However, the browser application has significant limitations compared to the desktop version and should be used only when it's not possible to install the desktop application. Expand **Using the WebLogic Remote Console browser application** for further details.

{{%expand "Using the WebLogic Remote Console browser application"%}}

### Limitations

Changes made in the browser application do not persist after you close the browser tab. If you accidentally close or refresh the browser tab, you can lose all of your changes. If you make changes to an Admin Server provider, they will remain in a pending state. However, changes to WDT model files, WDT Composite files, and property lists are lost if you do not click **Download File** at the end of your session.

You cannot save provider connection details - you must load them every time you launch the browser application.

[Projects]({{< relref "projects" >}}), used to remember and organize providers, become ineffective as you can only "use" one project at a time and it's forgotten when the browser tab is closed.

Additionally, do not attempt to use the browser based application as a server; it must be run locally.

### Install the WebLogic Remote Console browser application

**Prerequisites**: To use the WebLogic Remote Console browser application, your system requires:

* [Java SE 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or later. To check your Java version, enter `java -version` at the command line.
* A modern internet browser:
    * Apple Safari
    * Google Chrome
    * Microsoft Edge
    * Mozilla Firefox

1. Download the WebLogic Remote Console. Go to [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and download `console.zip`.
1. Extract the ZIP archive to a directory of your choice. Once its contents are extracted, it creates a `console` directory that includes:
    * The console executable file `console.jar`
    * The libraries required to use the console in the `libs` subdirectory
    * The console extension, `{{<console_rest_ext>}}`, that you install in the WebLogic Server domain
1. **Optional**: Install the WebLogic Remote Console extension in the WebLogic Server domain. The WebLogic Remote Console extension provides [additional functionality]({{< relref "setup/console#ext" >}}) when using the WebLogic Remote Console to manage WebLogic domains.
    1. Create a `management-services-ext` directory under the domain home.
    1. Download the WebLogic Remote Console extension, `{{<console_rest_ext>}}`, from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and save it in the `management-services-ext` directory you created in the previous step. If you have an earlier version of the extension already downloaded, delete it and replace it with the latest version.
    1. Reboot the Administration Server if it is already running.
1. Open a command window and on the command line, enter `java -jar <console_home>/console.jar` where `<console_home>` is the directory where you unzipped the installer.
1. Open a browser window and enter `http://localhost:8012` in the address bar.
{{% /expand%}}

## Connect to a provider {id="connect"}
The WebLogic Remote Console supports providers that connect to WebLogic Server Administration Servers and providers that edit WebLogic Deploy Tooling (WDT) model files and property lists.

1. Open the WebLogic Remote Console.
1. Add a provider from the Startup Tasks dialog box. Or, if it doesn't appear, expand the Kiosk and click &#x022EE;. The following providers are available:
    * Add Admin Server Connection Provider (the Administration Server must be running)
    * Add WDT Model File Provider
    * Add WDT Composite Model File Provider
    * Add Property List Provider
    * Create Provider for New WDT Model File
    * Create Provider for New Property List

    See [Provider types]({{< relref "userguide/providers" >}}) for more information.

    You can organize providers into Projects that persist when you close and reopen the application. See [Projects]({{< relref "projects" >}}) for more information.
1. Add more providers to the project. Click &#x022EE; beside the project name and select a provider type.
1. Select a provider from the Kiosk.
1. Start reviewing or editing the domain configuration.

## Next steps {id="next_steps"}

* [Familiarize yourself with the WebLogic Remote Console.]({{< relref "console" >}})
* [Edit your providers.]({{< relref "userguide/providers" >}})
* [Customize your connection settings.]({{< relref "advanced-settings" >}})