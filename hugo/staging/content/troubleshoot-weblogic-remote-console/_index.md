---
author: Oracle Corporation
publisherinformation: January 2025
weight: 250
title: Troubleshoot Issues with WebLogic Remote Console
---



Learn how to identify and recover from issues in WebLogic Server or WebLogic Remote Console.

Perform these preliminary troubleshooting steps to get started:

-   Restart all servers in the domain.
-   Confirm that the Administration Server can reach your Managed Servers and clusters. See [Investigate Server Connection Issues](#GUID-6C3E82A1-BEC6-4CEF-A964-4C795C5436F7).
-   Check the log files for any errors. See [Review Log Files](#GUID-0492B07F-0F69-4944-9B8B-C1EAD42DF655).
-   Review any known issues. See [Known Issues](#GUID-A2824DAE-C040-43E0-A645-041FDFB8936F).
-   Update to the latest versions of Desktop WebLogic Remote Console and the WebLogic Remote Console extension. See [Upgrade Desktop WebLogic Remote Console](../set-console#GUID-281298E0-AEE6-4DEC-ADF1-949780E75D76).

## Investigate Server Connection Issues {#GUID-6C3E82A1-BEC6-4CEF-A964-4C795C5436F7}

If the Administration Server cannot reach a Managed Server or cluster, you may be able to determine the cause using WebLogic Remote Console.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**. Use the **State** column to determine the current life cycle state of a server instance or cluster.

    If the Administration Server cannot reach the server to determine its state, the server will be marked as <code>Unreachable</code>.

2.  Click on a server or cluster whose state is <code>Unreachable</code>.

3.  Click the **Troubleshoot** tab. WebLogic Remote Console will automatically attempt to send test administration traffic to the server or cluster.

    Depending on the result of the test, WebLogic Remote Console provides different information:

    -   If the Administration Server cannot find the HTTP/S address for sending administration traffic to the server (typically because the server is not running), then the **Server URL** field will return <code>unknown</code>.
    -   If the Administration Server receives a response from the server, then WebLogic Remote Console will populate the **Status**, **Response Headers**, and **Response Body** fields.
    -   If the Administration Server receives a Java exception, then WebLogic Remote Console will populate the **Exception** and **Stack Trace** fields.

Use the information gathered from this troubleshooting test to help determine the cause of the connection issues between the Administration Server and server instances or clusters.

## Review Log Files {#GUID-0492B07F-0F69-4944-9B8B-C1EAD42DF655}

If you experience any issues with WebLogic Remote Console, then you can check its log files to determine the cause of the issues.

1.  Open **Help**, then **Toggle Developer Tools** and select the **Console** tab.

2.  Read the log messages to see they provide enough information to determine the cause of your issue.

3.  WebLogic Remote Console also generates a log file, <code>out.log</code>, for each session. Open the log file and review its contents.

    The location of <code>out.log</code> varies depending on your platform:

    -   Linux: <code>$HOME/.config/weblogic-remote-console/out.log</code>
    -   macOS: <code>/Users/<user>/Library/Application Support/weblogic-remote-console/out.log</code>
    -   Windows: <code>C:\Users\\*user*\AppData\Roaming\weblogic-remote-console\out.log</code>
    Log file entries from previous sessions are saved to a new file in the same directory, marked by date: <code>out-yyyy-mm-dd.log</code>.


{{< notice note >}}



If you want to generate log files for WebLogic Server, see [Log Messages](../administration-server/monitoring-domains#GUID-280EB231-F28A-4FF2-A8B2-08DEBDD9CD4B) instead.

{{< /notice >}}


## Known Issues {#GUID-A2824DAE-C040-43E0-A645-041FDFB8936F}

This page describes the known issues associated with WebLogic Remote Console.

### Limitations {}

You cannot:

-   Record WLST scripts while you configure WebLogic Server using WebLogic Remote Console.
-   Reorder security providers in WDT model file providers. However, you can download the WDT model file and edit the YAML file manually to rearrange the order of the security providers.

### Limited MBean Property Support {}

WebLogic Remote Console includes most of the MBean properties that the WebLogic Server Administration Console supported. However, due to limitations in the WebLogic REST API, some MBeans are omitted, including some that are deprecated. If you require an MBean property that is not currently available in WebLogic Remote Console, then file an enhancement request in the [WebLogic Remote Console GitHub repository](https://github.com/oracle/weblogic-remote-console).

### My Credentials Don't Work {}

If you are sure your login credentials are correct but you're receiving an Unexpected Error Response error, it might be because your credentials contain unsupported characters.

By default, WebLogic Remote Console uses HTTP Basic Authentication which supports a limited character set. Characters outside that set, for example, Japanese characters, cannot be used in either usernames or passwords.

**Workaround**: If you wish to continue using credentials with these characters, then when you connect to an Administration Server from WebLogic Remote Console, you must enable **Use Web Authentication** in the provider connection dialog box. The WebLogic Remote Console will send you to the external authentication portal. See [Configure Web Authentication](../administration-server/domain-configuration#GUID-A6191FE0-2A4C-45B6-A138-7FD9B157D28F).

### Hosted WebLogic Remote Console is "unable to connect to the WebLogic domain's administration server" {}

In Hosted WebLogic Remote Console, an orange banner appears along the top of the console that indicates it cannot reach the Administration Server.

**Solution**: Try logging into Hosted WebLogic Remote Console again. In the browser's address bar, enter <code>http://*hostname*:*port*/rconsole/signin</code> (or <code>https://*hostname*:*port*/rconsole/signin</code>) and re-enter your credentials.

### Deleted Items Do Not Re-Appear When Change is Reverted {}

If you delete an item but then discard the change instead of committing it, WebLogic Remote Console will not show the restored item immediately.

**Workaround**: Navigate away and then back to the affected page and the previously deleted item will become visible. If the deletion affected the navigation tree, such as deleting a node, you can collapse and then re-expand the navigation tree and the node will re-appear.

### Using the Hosted WebLogic Remote Console Across Multiple Browser Tabs May Cause Strange Behavior {}

If you open Hosted WebLogic Remote Console in multiple browser tabs and edit the domain, the different instances will interfere with each other and may result in configuration errors.

**Solution**: Only use Hosted WebLogic Remote Console in one browser tab at a time.

### Web authentication does not support path based routing {}

If you use an HTTP proxy server (such as Oracle HTTP Server or Apache HTTP Server) and use path based routing to manage access to your WebLogic Server instances, then, when using web authentication, WebLogic Remote Console cannot properly resolve the paths to direct users to the appropriate URLs.

## Cannot connect to the Administration Server {#GUID-B3D14A11-0144-4B31-BFE3-E6AC59AEFCBE}

WebLogic Remote Console cannot connect to a WebLogic Server Administration Server.

If you experience issues connecting to an Administration Server when using WebLogic Remote Console, then you may need to update the connection settings between the application and the domain. Use the following methods to identify which setting may be causing the issue.

-   Test access to the Administration Server using <code>curl</code>. Make sure to use a WebLogic user that is assigned one of the following roles: Admin, Deployer, Operator or Monitor.

    -   For HTTP connections, run:

        ```
        curl -v --user *username*:*password* http://*adminServerHost*:*adminServerPort*/management/weblogic/latest/domainConfig
        ```

    -   For HTTPS connections, run:

        ```
        curl -v -k --user *username*:*password* https://*adminServerHost*:*adminServerPort*/management/weblogic/latest/domainConfig
        ```

    If you can connect successfully over HTTPS, then the problem is likely that WebLogic Remote Console does not trust the SSL certificate of the Administration Server. You can either import the Administration Server’s certificate into your client’s keystore, or, if you’re using demo certificates, enable the **Make Insecure Connection** option when you connect to the Administration Server.

-   Make sure your Administration Server's management endpoint, <code>management/*</code>, is accessible to clients. It may be blocked if your domain is behind a load-balancer or firewall, or is in a Docker container. You will need to expose the endpoint manually.

    You should also make sure that the value of the Remote Console Helper Context Path attribute (<code>RemoteConsoleHelperMBean.ContextPath</code>) has not been changed. The default value is <code>console</code>, which WebLogic Remote Console appends to the domain URL. If you modify the context path, it may prevent WebLogic Remote Console from successfully connecting to the Administration Server. Do not change it unless you understand the possible impacts to Desktop WebLogic Remote Console. See [Configure Web Authentication](../administration-server/domain-configuration#GUID-A6191FE0-2A4C-45B6-A138-7FD9B157D28F).

-   If the Administration Server resides in a different network than WebLogic Remote Console, then make sure the proxy settings of WebLogic Remote Console are properly configured to allow communication between the two. See [Connect using a Proxy Server](../administration-server/domain-configuration#GUID-D7AD7F50-88F8-4FC9-A28B-CBF98B5FD479).

    You may need to add a location match stanza for the <code>management/*</code> endpoint to the domain configuration file, <code>config.xml</code>.


## Features are Missing from WebLogic Remote Console {#GUID-954E44B6-5421-40C4-B9A7-77B5C24EF8D2}

Certain features or screens in WebLogic Remote Console are hidden if your current user is not assigned the appropriate permissions.

For security purposes, WebLogic Remote Console restricts what a user can see or do depending on their role. Only administrators have access to the full functionality of WebLogic Remote Console.

Try logging in as a user with more elevated permissions.

For more information, see [Access Limitations](../administration-server/domain-configuration#GUID-BA0BFEB9-FA9D-4063-90E0-1D44551FB2E2).

{{< notice note >}}



If you believe a feature is missing and it is not a case of inadequate permissions, you can open an enhancement request in the [WebLogic Remote Console GitHub repository](https://github.com/oracle/weblogic-remote-console).

{{< /notice >}}


## REST Communication Issues {#GUID-2EF5267E-FE34-4D74-BF2F-3F318E47062A}

WebLogic Remote Console reports that it is experiencing REST communication issues between servers.

When REST communication is blocked, it may prevent further configuration to the domain or cause the Monitoring Tree perspective to report inaccurate statuses for Managed Servers.

Certain configuration changes can block REST communication between servers, including, but not limited to the following examples:

-   Disabling the default Identity Asserter provider.
-   Disabling the default Credential Mapping provider.
-   Removing <code>weblogic-jwt-token</code> from the default Identity Asserter provider’s Active Types.
-   Applying incompatible REST invocation policies to the WebLogic Server REST API. For example, using Oracle Web Services Manager (OWSM) to protect the domain may inadvertently restrict access to the REST API.
-   Changing the listen port (including enabling the Administration port) without immediately restarting the servers.

You must update your configuration changes so they no longer block REST communication.

## Invalid WebLogic Server Configurations {#GUID-BC6A74B7-C370-4370-9ED1-18C3FEB4EC39}

WebLogic Remote Console reports an invalid configuration in your domain.

To make sure that changes to your domain are valid, WebLogic Remote Console performs validation checks whenever you save or try to commit a change. If WebLogic Remote Console reports an invalid configuration error, then you must identify and correct the change before you can commit your changes.

-   Review any recent changes for issues. You can check the Shopping Cart to see your pending changes if you have the WebLogic Remote Console extension installed.
-   Check the log output from WebLogic Remote Console and the Administration Server.

If you still cannot determine the cause of the error, then you may need to discard all of your changes and then reapply them one at a time to isolate the change responsible for the error.

{{< notice note >}}



WebLogic Remote Console *does not* validate WDT model files. It will accept changes or values that are invalid and which may prevent the WDT model file from building or updating a domain. For example, if you add integer values that are invalid or out of range for a specific setting, or remove a server or target but do not update the deployments to select a different server or target, WebLogic Remote Console will not flag these errors.

For information on acceptable values, refer to the [WDT Documentation]( https://oracle.github.io/weblogic-deploy-tooling/).

{{< /notice >}}


## Problem reading auto-prefs.json {#GUID-D5574A23-8B13-4210-A2A7-916411FB08C3}

WebLogic Remote Console shuts down unexpectedly with a <code>Failure reading auto prefs</code> error.

The <code>auto-prefs.json</code> file saves state information about WebLogic Remote Console including details on projects and providers. Users should not touch this file unless it becomes corrupted.

If <code>auto-prefs.json</code> does become corrupted, you can reset it, but all of your data regarding your projects will be lost. The data for your domain will be unaffected.

1.  Close WebLogic Remote Console.
2.  Delete <code>auto-prefs.json</code>. The location of <code>auto-prefs.json</code> varies depending on your platform:
    -   Linux: <code>*$HOME*/.config/weblogic-remote-console/auto-prefs.json</code>
    -   macOS: <code>/Users/*user*/Library/Application Support/weblogic-remote-console/auto-prefs.json</code>
    -   Windows: <code>C:\Users\\*user*\AppData\Roaming\weblogic-remote-console\auto-prefs.json</code>
3.  Restart WebLogic Remote Console.

