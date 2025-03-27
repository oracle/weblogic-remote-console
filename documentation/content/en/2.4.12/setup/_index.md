---
title: Get started
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
1. **Optional**: Install the WebLogic Remote Console extension in the WebLogic Server domain. The WebLogic Remote Console extension provides [additional functionality](console#ext) when using the WebLogic Remote Console to manage WebLogic domains.
    1. Create a `management-services-ext` directory under the domain home.
    1. Download the WebLogic Remote Console extension, `console-rest-ext-2.4.12.war`, from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and save it inside the `management-services-ext` directory you created in the previous step. If you have an earlier version of the extension already downloaded, delete it and replace it with the latest version.
    
        **Note**: Do not try to deploy the console extension as an application in your domain.
    1. Restart the Administration Server if it is already running.
1. Launch the WebLogic Remote Console application.

## Connect to a provider {id="connect"}
The WebLogic Remote Console supports providers that connect to WebLogic Server Administration Servers and providers that edit WebLogic Deploy Tooling (WDT) model files and property lists.

1. Open the WebLogic Remote Console.
1. Add a provider from the Startup Tasks dialog box. Or, if it doesn't appear, open the **Providers** drawer and click &#x022EE;. The following providers are available:
    * Add Admin Server Connection Provider (the Administration Server must be running)
    * Add WDT Model File Provider
    * Add WDT Composite Model File Provider
    * Add Property List Provider
    * Create Provider for New WDT Model File
    * Create Provider for New Property List

    See [Provider types](../userguide/providers) for more information.

    You can organize providers into Projects that persist when you close and reopen the application. See [Projects](../userguide/projects) for more information.
1. Fill in the necessary connection details for the provider.
1. Select a provider to start reviewing or editing the domain configuration.

You can add as many providers to a project as needed. 

## Next steps {id="next_steps"}

* [Familiarize yourself with the WebLogic Remote Console.](console)
* [Edit your providers.](../userguide/providers)
* [Customize your settings.](../userguide/advanced-settings)