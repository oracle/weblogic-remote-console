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



Hosted WebLogic Remote Console is only supported on Administration Servers running WebLogic Server 14.1.2.0.0 or later, and is subject to the same system requirements as its associated WebLogic Server release. To see the applicable certification matrix for your release of WebLogic Server, refer to [Oracle Fusion Middleware Supported System Configurations](unilink:fmwcert).

{{< /alert >}}


Desktop WebLogic Remote Console is supported on the following platforms.



<table id="GUID-FFC1F9AC-7CE7-4BC1-9D3D-BD59CC228C6B__TABLE_B5D_JSX_HZB">
                        <caption>
                           <span>
                              <span>Table 1. </span>Requirements. </span>
                           <span>For the best experience, make sure your environment meets the following requirements.</span>
                        </caption>
                        <thead>
                           <tr>
                              <th id="d32620e134">Platform</th>
                              <th id="d32620e136">Minimum Requirement</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td>Linux</td>
                              <td>
                                 <p>64 bit only.</p>
                                 <ul id="GUID-FFC1F9AC-7CE7-4BC1-9D3D-BD59CC228C6B__UL_QFM_4SX_HZB">
                                    <li>Debian 11 and later</li>
                                    <li>Fedora 40 and later<ul id="GUID-FFC1F9AC-7CE7-4BC1-9D3D-BD59CC228C6B__UL_GM1_VSX_HZB">
                                          <li>Oracle Linux 7 and later</li>
                                       </ul>
                                    </li>
                                    <li>Ubuntu 16.04 and later</li>
                                 </ul>
                              </td>
                           </tr>
                           <tr>
                              <td>macOS</td>
                              <td>
                                 <p>13 (Ventura) or later</p>
                                 <p>
                                    <strong>Note</strong>: Intel machines must be 64 bit.</p>
                              </td>
                           </tr>
                           <tr>
                              <td>Windows</td>
                              <td>
                                 <p>64 bit only.</p>
                                 <p>Windows 10 and later.</p>
                              </td>
                           </tr>
                        </tbody>
                     </table>




We recommend setting the viewport of WebLogic Remote Console to 1300 px or wider. On narrower viewports, UI elements may overlap or disappear.

## Install Desktop WebLogic Remote Console {#GUID-F178ACDD-4929-4918-8126-274997E5312E}

Desktop WebLogic Remote Console is a version of WebLogic Remote Console that is based on the Electron framework and installed as a desktop application.

1.  Download the latest version of WebLogic Remote Console from the [WebLogic Remote Console GitHub Repository](https://github.com/oracle/weblogic-remote-console). Choose the appropriate installer for your operating system.

2.  Follow the typical process for installing applications on your operating system.

3.  Launch WebLogic Remote Console.


If you are using WebLogic Server 14.1.1.0 or earlier, you can enhance the functionality for managing Administration Servers by installing the WebLogic Remote Console extension. See [Install the WebLogic Remote Console Extension](#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591). The extension comes pre-installed in WebLogic Server 14.1.2.0 and later.

## Deploy Hosted WebLogic Remote Console {#GUID-9974090F-7983-4641-9121-36A29B6F6735}

Hosted WebLogic Remote Console is a version of WebLogic Remote Console that is hosted on the Administration Server of the domain and accessed through a browser.

Hosted WebLogic Remote Console is useful for situations where it is not feasible to install external applications in your environment.{{< alert title="Note" color="primary" >}}

 Deploying Hosted WebLogic Remote Console is only supported on Administration Servers running WebLogic Server 14.1.2.0.0 or later.

{{< /alert >}}


1.  Start the Administration Server.

2.  Deploy the Hosted WebLogic Remote Console application using the WebLogic Scripting Tool (WLST).

    1.  Open a command line terminal and go to <code>*ORACLE_HOME*/oracle_common/common/bin</code>.

    2.  Invoke WLST with the following options:

        ```
        wlst.sh *WL_HOME*/server/bin/remote_console_deployment.py t3://*hostname*:*port* *username* < *password.txt*
        ```

        Where:

        -   <code>*WL_HOME*</code> is the top-level installation directory for WebLogic Server.
        -   <code>*hostname*</code> is the host name of the Administration Server.
        -   <code>*port*</code> is the port number of the Administration Server.
        -   <code>*username*</code> is a user account capable of deploying applications.
        -   <code>*password.txt*</code> is the path to a file containing the password for the specified user account.
        For example:

        ```
        wlst.sh /Users/smithdoe/Oracle/Middleware/Oracle_Home/wlserver/server/bin/remote_console_deployment.py t3://localhost:7001 admin < /Users/smithdoe/password.txt
        ```


Hosted WebLogic Remote Console is now deployed and will remain active as long as the <code>weblogic-remote-console-app</code> application is deployed and the Administration Server is running.

Do not stop or delete the Hosted WebLogic Remote Console application, <code>weblogic-remote-console-app</code>, if you want to continue to use Hosted WebLogic Remote Console.

To use Hosted WebLogic Remote Console to manage the running Administration Server, see [Start Hosted WebLogic Remote Console](#GUID-3F16AD12-C29D-49F1-8FA3-DAECD71D516D).

## Start Hosted WebLogic Remote Console {#GUID-3F16AD12-C29D-49F1-8FA3-DAECD71D516D}

Hosted WebLogic Remote Console is a version of WebLogic Remote Console that is accessible using a browser.

Before you can start Hosted WebLogic Remote Console, you must have deployed it. See [Deploy Hosted WebLogic Remote Console](#GUID-9974090F-7983-4641-9121-36A29B6F6735).

1.  Start the Administration Server.

2.  Open a browser and enter <code>http://*hostname*:*port*/rconsole</code> (or for HTTPS, <code>https://*hostname*:*port*/rconsole</code>).

    Where <code>*hostname*</code> and <code>*port*</code> match the values you set when you deployed Hosted WebLogic Remote Console.

    {{< alert title="Note" color="primary" >}}

    

    If your Administration Server is behind a firewall or load balancer, or otherwise externally unavailable, you must manually expose the <code>rconsole/\*</code> endpoint to make it accessible, similar to exposing <code>console/\*</code> for the WebLogic Server Administration Console.

    This is in addition to exposing the <code>management/\*</code> endpoint which is required for general domain configuration.

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

 You only need to perform this procedure if you are running WebLogic Server 14.1.1.0.0 or earlier. As of WebLogic Server 14.1.2.0.0, the WebLogic Remote Console extension is automatically installed in your domain.

{{< /alert >}}


1.  Under <code>*DOMAIN_HOME*</code>, create a folder and name it <code>management-services-ext</code>.

2.  Download the latest WebLogic Remote Console extension, <code>console-rest-ext-2.4.13.war</code>, from the [WebLogic Remote Console GitHub Repository](https://github.com/oracle/weblogic-remote-console).

3.  Save the extension under <code>management-services-ext</code>.

    You do not need to deploy <code>console-rest-ext-2.4.13.war</code> as an application in your domain.

4.  Restart the Administration Server.

5.  In WebLogic Remote Console, disconnect and then reconnect to the Administration Server.


The WebLogic Remote Console extension is updated with WebLogic Remote Console. Whenever you update WebLogic Remote Console, make sure you also update the extension to match.

If you need to update the WebLogic Remote Console extension separately from the console, follow the instructions outlined in step [2](#STEP_H13_HCK_DCC) of [Upgrade Desktop WebLogic Remote Console](#GUID-281298E0-AEE6-4DEC-ADF1-949780E75D76).

{{< alert title="Note" color="primary" >}}



With the release of WebLogic Remote Console 2.4.11, the versioning scheme of the WebLogic Remote Console *extension* was updated to match that of WebLogic Remote Console. There are no versions between <code>console-rest-ext-9.0.war</code> (released with WebLogic Remote Console 2.4.10) and <code>console-rest-ext-2.4.11.war</code> (released with WebLogic Remote Console 2.4.11).

{{< /alert >}}


### Features of the WebLogic Remote Console Extension {#GUID-6357222A-F7D4-46FC-BC87-22D6D1A6568A}

The WebLogic Remote Console extension adds many features to WebLogic Remote Console that are useful for the administration of WebLogic Server domains.

When the WebLogic Remote Console extension is installed, it grants the following capabilities to WebLogic Remote Console:

-   **View pending changes** - Identify any changes that are saved to the domain but not yet committed. Pending changes are listed in the Shopping Cart.

-   **Access the Security Data Tree perspective** - Edit security data that is stored in the embedded LDAP server, including, but not limited to, managing:

    -   Users and Groups

    -   Roles and Policies

    -   Credential Mappings

    You can also view (but not edit) the users and groups for any authentication provider that supports it.

-   **Create and edit application deployment plans** - Use deployment plans to extend or override an application's deployment descriptors.

-   **Manage JMS messages** - Import, export, or delete messages.

-   **Manage JTA transactions** - Import, export, or delete transactions.

-   **Test data source connections** - Verify that the domain can successfully connect to the configured database.

-   **View objects in JNDI structure** - Examine objects such as Java EE services and components such as RMI, JMS, EJBs, and JDBC data sources.

-   **Upload applications or database client data for redeployment** - Update and redeploy applications or database client data with new versions that were not already deployed to the Administration Server.

    The redeployment of applications or database client data that are already on the server is supported without the extension.

-   **Analyze server connection issues** - Test connections between the Administration Server and Managed Servers or clusters.


For installation instructions, see [Install the WebLogic Remote Console Extension](#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591).

## Provider Types {#GUID-82C1C605-D42E-45EA-AC16-5BA3D5853C96}

Use WebLogic Remote Console to connect to the following provider types, each of which offers a different approach for managing your WebLogic Server domains.



<table id="GUID-82C1C605-D42E-45EA-AC16-5BA3D5853C96__TABLE_I4W_4ZY_RZB">
                     <span>The provider types available in <span id="GUID-82C1C605-D42E-45EA-AC16-5BA3D5853C96__WRC">WebLogic Remote Console</span>
                     </span>
                     <thead>
                        <tr>
                           <th id="d32620e897">Provider</th>
                           <th id="d32620e899">Description</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>
                              <a href="../administration-server#GUID-BC6883D0-1917-4130-B79B-02727F1242D6">Administration Server</a>
                           </td>
                           <td>Connect to a running WebLogic Server domain through its Administration Server.</td>
                        </tr>
                        <tr>
                           <td>
                              <a href="../weblogic-deploy-tooling/wdt-model-files#GUID-2AEF7470-25FA-4A9D-85FB-16F8F5415C35">WDT Model Files</a>
                           </td>
                           <td>Edit WebLogic Deploy Tooling (WDT) metadata models of WebLogic Server domains.</td>
                        </tr>
                        <tr>
                           <td>
                              <a href="../weblogic-deploy-tooling/wdt-composites#GUID-904FB61C-F32C-4D33-8698-59346E279140">WDT Composite Models</a>
                           </td>
                           <td>Combine and compare settings across multiple WDT model files.   </td>
                        </tr>
                        <tr>
                           <td>
                              <a href="../weblogic-deploy-tooling/property-lists#GUID-62721515-29E5-4DC4-BBD8-E2D1C8A7529D">Property Lists</a>
                           </td>
                           <td>Edit the key-value pairs that enable the use of variables in WDT model files.</td>
                        </tr>
                     </tbody>
                  </table>




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

Upgrade to the latest version of Desktop WebLogic Remote Console and take advantage of the latest features in both the console and WebLogic Server.

If a newer version of Desktop WebLogic Remote Console is available, an alert will appear in the menu bar.

1.  In Desktop WebLogic Remote Console, open **Updates Available**, then **Download and install**.

    Desktop WebLogic Remote Console update runs in the background so you can continue working in WebLogic Remote Console with no interruptions. The next time the console is launched, the updates will apply.

    You can also go directly to the [WebLogic Remote Console GitHub Repository](https://github.com/oracle/weblogic-remote-console) to download and apply the update manually.

2.  Update the WebLogic Remote Console *extension*.

    For the best experience, you should keep the versions of WebLogic Remote Console and its extension in sync with each other. That is, when you are running WebLogic Remote Console 2.4.13, you should have <code>console-rest-ext-2.4.13.war</code> installed.

    {{< alert title="Note" color="primary" >}}

    

    With the release of WebLogic Remote Console 2.4.11, the versioning scheme of the extension was updated to match WebLogic Remote Console. Due to this change, the extension version jumps from <code>console-rest-ext-9.0.war</code> to <code>console-rest-ext-2.4.11.war</code>.

    {{< /alert >}}


    1.  While connected to the domain, open the **Providers** drawer and beside the provider connection, click the **Get Info** icon to see the **Console Extension Version**. If it matches WebLogic Remote Console version, you can skip the rest of the steps. Otherwise, continue.

    2.  Go to <code>*DOMAIN_HOME*/management-services-ext</code> and delete the existing WebLogic Remote Console extension.

    3.  Download the WebLogic Remote Console extension that matches your WebLogic Remote Console from the [WebLogic Remote Console GitHub Repository](https://github.com/oracle/weblogic-remote-console). It will be within the matching WebLogic Remote Console release section.

    4.  Save the extension to <code>*DOMAIN_HOME*/management-services-ext</code>.

    5.  Restart the Administration Server.


