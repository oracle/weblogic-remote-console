---
weight: 8
title: Get Started
---



WebLogic Remote Console is easy to install and you can quickly start managing your domains.

WebLogic Remote Console is available in two formats:

-   **Desktop WebLogic Remote Console**, a desktop application installed on your computer.
-   **Hosted WebLogic Remote Console**, a web application deployed to an Administration Server and accessed through a browser.

Generally, the two formats have similar functionality, though the desktop application offers certain conveniences that are not possible when using a browser.

If your environment has restrictions on installing applications, consider enabling Hosted WebLogic Remote Console. See [Deploy Hosted WebLogic Remote Console](#GUID-9974090F-7983-4641-9121-36A29B6F6735).

## System Requirements {#GUID-FFC1F9AC-7CE7-4BC1-9D3D-BD59CC228C6B}

Review the system requirements needed to run WebLogic Remote Console.

WebLogic Remote Console is compatible with WebLogic Server 12.2.1.4.0 and later.

{{< alert title="Note" color="primary" >}}



Hosted WebLogic Remote Console is only supported on Administration Servers running WebLogic Server 14.1.2.0.0 or later, and is subject to the same system requirements as its associated WebLogic Server release. To see the applicable certification matrix for your release of WebLogic Server, refer to [Oracle Fusion Middleware Supported System Configurations](https://www.oracle.com/middleware/technologies/fusion-certification.html).

{{< /alert >}}


Desktop WebLogic Remote Console is supported on the following platforms.

<table id="TABLE_B5D_JSX_HZB"><thead><tr><th>

Platform

</th><th>

Minimum Requirement

</th></tr></thead><tbody><tr><td>

Linux

</td><td>

64 bit only.

-   Debian 11 and later
-   Fedora 41 and later
    -   Oracle Linux 8 and later
-   Ubuntu 22.04 and later

</td></tr><tr><td>

macOS

</td><td>

13 \(Ventura\) and later

**Note**: Intel machines must be 64 bit. [^1]

</td></tr><tr><td>

Windows

</td><td>

64 bit only.

Windows 11 and later.

</td></tr></tbody>
</table>

Table 1. Requirements. For the best experience, make sure your environment meets the following requirements.

We recommend setting the viewport of WebLogic Remote Console to 1300 px or wider. On narrower viewports, UI elements may overlap or disappear.

## Install Desktop WebLogic Remote Console {#GUID-F178ACDD-4929-4918-8126-274997E5312E}

Desktop WebLogic Remote Console is a version of WebLogic Remote Console that is based on the Electron framework and installed as a desktop application.

1.  Download the latest version of WebLogic Remote Console from the [WebLogic Remote Console GitHub Repository](https://github.com/oracle/weblogic-remote-console/releases) releases page. Choose the appropriate installer for your operating system.

2.  Follow the typical process for installing applications on your operating system.

3.  Launch WebLogic Remote Console.


If you are using WebLogic Server 14.1.1.0 or earlier, you can enhance the functionality for managing Administration Servers by installing the WebLogic Remote Console extension. See [Install the WebLogic Remote Console Extension](#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591). The extension comes pre-installed in WebLogic Server 14.1.2.0 and later.

## Deploy Hosted WebLogic Remote Console {#GUID-9974090F-7983-4641-9121-36A29B6F6735}

Hosted WebLogic Remote Console is a version of WebLogic Remote Console that is hosted on the Administration Server of the domain and accessed through a browser.

Hosted WebLogic Remote Console is useful for situations where it is not feasible to install external applications in your environment.{{< alert title="Note" color="primary" >}}

 Deploying Hosted WebLogic Remote Console is only supported on Administration Servers running WebLogic Server 14.1.2.0.0 or later.

{{< /alert >}}


1.  Start the Administration Server.

2.  Deploy the Hosted WebLogic Remote Console application using the WebLogic Scripting Tool \(WLST\).

    1.  Open a command line terminal and go to <code>*ORACLE\_HOME*/oracle_common/common/bin</code>.

    2.  Invoke WLST with the following options:

        For Unix operating systems, enter:

        ```
        wlst.sh *WL\_HOME*/server/bin/remote_console_deployment.py t3://*hostname*:*port* *username* < *password.txt*
        ```

        For Windows operating systems, enter:

        ```
        wlst.cmd *WL\_HOME*\server\bin\remote_console_deployment.py t3://*hostname*:*port* *username* < *password.txt*
        ```

        Where:

        -   <code>*WL\_HOME*</code> is the top-level installation directory for WebLogic Server.
        -   <code>*hostname*</code> is the host name of the Administration Server.
        -   <code>*port*</code> is the port number of the Administration Server.
        -   <code>*username*</code> is a user account capable of deploying applications.
        -   <code>*password.txt*</code> is the path to a file containing the password for the specified user account.
        Examples:

        On Unix operating systems:

        ```
        wlst.sh /Users/smithdoe/Oracle/Middleware/Oracle_Home/wlserver/server/bin/remote_console_deployment.py t3://localhost:7001 admin < /Users/smithdoe/password.txt
        ```

        On Windows operating systems:

        ```
        wlst.cmd C:\Oracle\Middleware\Oracle_Home\wlserver\server\bin\remote_console_deployment.py t3://localhost:7001 admin < C:\Users\smithdoe\password.txt
        ```


Hosted WebLogic Remote Console is now deployed and will remain active as long as the <code>weblogic-remote-console-app</code> application is deployed and the Administration Server is running.

Do not stop or delete the Hosted WebLogic Remote Console application, <code>weblogic-remote-console-app</code>, if you want to continue to use Hosted WebLogic Remote Console.

To use Hosted WebLogic Remote Console to manage the running Administration Server, see [Start Hosted WebLogic Remote Console](#GUID-3F16AD12-C29D-49F1-8FA3-DAECD71D516D).

## Start Hosted WebLogic Remote Console {#GUID-3F16AD12-C29D-49F1-8FA3-DAECD71D516D}

Hosted WebLogic Remote Console is a version of WebLogic Remote Console that is accessible using a browser.

Before you can start Hosted WebLogic Remote Console, you must have deployed it. See [Deploy Hosted WebLogic Remote Console](#GUID-9974090F-7983-4641-9121-36A29B6F6735).

1.  Start the Administration Server.

2.  Open a browser and enter <code>http://*hostname*:*port*/rconsole</code> \(or for HTTPS, <code>https://*hostname*:*port*/rconsole</code>\).

    Where <code>*hostname*</code> and <code>*port*</code> match the values you set when you deployed Hosted WebLogic Remote Console.

    {{< alert title="Note" color="primary" >}}

    

    If your Administration Server is behind a firewall or load balancer, or otherwise externally unavailable, you must manually expose the <code>rconsole/*</code> endpoint to make it accessible, similar to exposing <code>console/*</code> for the WebLogic Server Administration Console.

    This is in addition to exposing the <code>management/*</code> endpoint which is required for general domain configuration.

    {{< /alert >}}


3.  Log in to Hosted WebLogic Remote Console.

4.  In the **Providers** drawer, select **This Server**.


Hosted WebLogic Remote Console is active as long as the <code>weblogic-remote-console-app</code> application is deployed and the Administration Server is running.

{{< alert title="Note" color="primary" >}}



You can use Hosted WebLogic Remote Console to connect to and manage other providers beyond the Administration Server it is hosted on. See [Connect to a Provider](#GUID-98F273C5-CC1E-4272-B560-604CA23A739A).

{{< /alert >}}


## Install the WebLogic Remote Console Extension {#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591}

The WebLogic Remote Console extension enhances the management capabilities of WebLogic Remote Console for Administration Server connections.

For an overview of the functionality provided by the WebLogic Remote Console extension, see [Features of the WebLogic Remote Console Extension](#GUID-6357222A-F7D4-46FC-BC87-22D6D1A6568A).

{{< alert title="Note" color="primary" >}}

 This procedure is only necessary if you are running WebLogic Server 14.1.1.0.0 or earlier. As of WebLogic Server 14.1.2.0.0, the WebLogic Remote Console extension is automatically included with a WebLogic Server installation and updated with each Patch Set Update \(PSU\).

{{< /alert >}}


1.  Shut down the Administration Server.

2.  Under <code>*DOMAIN\_HOME*/</code>, create a folder and name it <code>management-services-ext</code>.

3.  Download the latest WebLogic Remote Console extension, <code>console-rest-ext-2.4.19.war</code>, from the [WebLogic Remote Console GitHub Repository](https://github.com/oracle/weblogic-remote-console/releases) releases page.

    {{< alert title="Note" color="primary" >}}

    

    <code>console-rest-ext-jakarta-2.4.19.war</code> is intended for domains running WebLogic Server 15.1.1.0.0 or later; you should not need to install it manually.

    {{< /alert >}}


4.  Save the extension under <code>management-services-ext/</code>.

    You do not need to deploy the WebLogic Remote Console extension as an application in your domain.

5.  Restart the Administration Server.

6.  In WebLogic Remote Console, disconnect and then reconnect to the Administration Server.


New versions of the WebLogic Remote Console extension and WebLogic Remote Console are generally released simultaneously. Whenever you update WebLogic Remote Console, make sure you also update the extension to match.

If you need to update the WebLogic Remote Console extension separately from the console, follow the instructions outlined in step [2](#STEP_H13_HCK_DCC) of [Upgrade Desktop WebLogic Remote Console](#GUID-281298E0-AEE6-4DEC-ADF1-949780E75D76). Note that if you manually install the WebLogic Remote Console extension in <code>*DOMAIN\_HOME*/</code> on domains running WebLogic Server 14.1.2.0.0 or later, then it will take precedence over the version of the extension that is automatically included with WebLogic Server installations and updates.

### Features of the WebLogic Remote Console Extension {#GUID-6357222A-F7D4-46FC-BC87-22D6D1A6568A}

The WebLogic Remote Console extension adds many features to WebLogic Remote Console that are useful for the administration of WebLogic Server domains.

When the WebLogic Remote Console extension is installed, it grants the following capabilities to WebLogic Remote Console:

-   **View pending changes** - Identify any changes that are saved to the domain but not yet committed. Pending changes are listed in the Shopping Cart.

-   **Access the Security Data Tree perspective** - Edit security data that is stored in the embedded LDAP server, including, but not limited to, managing:

    -   Users and Groups

    -   Roles and Policies

    -   Credential Mappings

    You can also view \(but not edit\) the users and groups for any authentication provider that supports it.

-   **Create and edit application deployment plans** - Use deployment plans to extend or override an application's deployment descriptors.

-   **Manage JMS messages** - Import, export, or delete messages.

-   **Manage JTA transactions** - Import, export, or delete transactions.

-   **Test data source connections** - Verify that the domain can successfully connect to the configured database.

-   **View objects in JNDI structure** - Examine objects such as Jakarta EE services and components such as RMI, JMS, EJBs, and JDBC data sources.

-   **Upload applications or database client data for redeployment** - Update and redeploy applications or database client data with new versions that were not already deployed to the Administration Server.

    The redeployment of applications or database client data that are already on the server is supported without the extension.

-   **Analyze server connection issues** - Test connections between the Administration Server and Managed Servers or clusters.


For installation instructions, see [Install the WebLogic Remote Console Extension](#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591).

## Provider Types {#GUID-82C1C605-D42E-45EA-AC16-5BA3D5853C96}

Use WebLogic Remote Console to connect to the following provider types, each of which offers a different approach for managing your WebLogic Server domains.

|Provider|Description|
|--------|-----------|
|[Administration Server](../administration-server#GUID-BC6883D0-1917-4130-B79B-02727F1242D6)|Connect to a running WebLogic Server domain through its Administration Server.|
|[WDT Model Files](../weblogic-deploy-tooling/wdt-model-files#GUID-2AEF7470-25FA-4A9D-85FB-16F8F5415C35)|Edit WebLogic Deploy Tooling \(WDT\) metadata models of WebLogic Server domains.|
|[WDT Composite Models](../weblogic-deploy-tooling/wdt-composites#GUID-904FB61C-F32C-4D33-8698-59346E279140)|Combine and compare settings across multiple WDT model files.|
|[Property Lists](../weblogic-deploy-tooling/property-lists#GUID-62721515-29E5-4DC4-BBD8-E2D1C8A7529D)|Edit the key-value pairs that enable the use of variables in WDT model files.|

## Connect to a Provider {#GUID-98F273C5-CC1E-4272-B560-604CA23A739A}

You can connect WebLogic Remote Console to a WebLogic Administration Server, WDT model file, or another provider.

1.  Open the **Providers** drawer and click **More ︙**.

2.  Choose a provider type from the list:

    -   Add Admin Server Connection Provider
    -   Add WDT Model File Provider
    -   Add WDT Composite Model File Provider
    -   Add Property List Provider
    -   Create Provider for new WDT Model File
    -   Create Provider for New Property List
    For information on the different providers, see [Provider Types](#GUID-82C1C605-D42E-45EA-AC16-5BA3D5853C96).

3.  Fill in any required connection details for the selected provider.

4.  Click **OK** to establish the connection.

    The Administration Server must be running for the connection to succeed.


## Upgrade Desktop WebLogic Remote Console {#GUID-281298E0-AEE6-4DEC-ADF1-949780E75D76}

Install the latest version of Desktop WebLogic Remote Console and take advantage of the latest features in both the console and WebLogic Server.

When a newer version of Desktop WebLogic Remote Console is available, an alert will appear in the menu bar.

1.  In Desktop WebLogic Remote Console, open **Updates Available**, then **Download and install**.

    Desktop WebLogic Remote Console update runs in the background so you can continue working in WebLogic Remote Console with no interruptions. The next time the console is launched, the updates will apply.

    You can also download the update from the [WebLogic Remote Console GitHub Repository](https://github.com/oracle/weblogic-remote-console/releases) releases page and apply the update manually.

2.  <a id="STEP_H13_HCK_DCC"></a>Update the WebLogic Remote Console *extension*.

    {{< alert title="Note" color="primary" >}}

    

    -   For domains running WebLogic Server *14.1.1.0.0 and earlier*: You must manually update the extension. Perform the following steps.

    -   For domains running WebLogic Server *14.1.2.0.0 and later*: You do not need to manually update the extension because it is updated by WebLogic Server Patch Set Updates \(PSUs\).

        If you choose to manually update the extension anyways, it will take precedence over the version of the extension included with WebLogic Server.

    {{< /alert >}}


    For the best experience, you should keep the versions of WebLogic Remote Console and its extension in sync with each other. That is, when you are running WebLogic Remote Console 2.4.19, you should have <code>console-rest-ext-2.4.19.war</code> installed.

    1.  While connected to the domain, open the **Providers** drawer and beside the provider connection, click the **Get Info** icon to see the **Console Extension Version**. If it matches WebLogic Remote Console version, skip the rest of these steps. Otherwise, continue.

    2.  Shut down the Administration Server.

    3.  Go to the <code>*DOMAIN\_HOME*/management-services-ext/</code> folder and delete the existing WebLogic Remote Console extension. If the <code>*DOMAIN\_HOME*/management-services-ext/</code> folder doesn't exist, create it.

    4.  Download the WebLogic Remote Console extension that matches your WebLogic Remote Console from the [WebLogic Remote Console GitHub Repository](https://github.com/oracle/weblogic-remote-console/releases). It will be within the matching WebLogic Remote Console release section.

        -   For domains running WebLogic Server 14.1.2.0.0 or earlier, download <code>console-rest-ext-2.4.19.war</code>

        -   For domains running WebLogic Server 15.1.1.0.0 or later, download <code>console-rest-ext-jakarta-2.4.19.war</code>.

    5.  Save the extension under <code>*DOMAIN\_HOME*/management-services-ext/</code>.

    6.  Restart the Administration Server.

    {{< alert title="Note" color="primary" >}}

    

    *On domains running 14.1.2.0.0 or later:* If you want to revert to using the WebLogic Remote Console extension that's included with WebLogic Server and updated with PSUs, delete the extension under <code>*DOMAIN\_HOME*/management-services-ext/</code>.

    {{< /alert >}}



[^1]: Support for Mac computers with an Intel processor is deprecated in WebLogic Remote Console 2.4.18 and may be removed in a future release.
