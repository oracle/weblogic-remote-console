---
weight: 290
title: Troubleshoot Issues with WebLogic Remote Console
---



Learn how to identify and recover from issues in WebLogic Server or WebLogic Remote Console.

Perform these preliminary troubleshooting steps to get started:

1.  Record the error, affected provider, time of occurrence, WebLogic Remote Console version, and WebLogic Server version.
2.  Check the console and Administration Server log files for errors.

    See [Review Log Files](#GUID-0492B07F-0F69-4944-9B8B-C1EAD42DF655).

3.  Confirm that the Administration Server can reach your Managed Servers and clusters. See [Investigate Server Connection Issues](#GUID-6C3E82A1-BEC6-4CEF-A964-4C795C5436F7).
4.  Review [Known Issues](#GUID-A2824DAE-C040-43E0-A645-041FDFB8936F) and check the installed console and extension versions against the applicable release notes.

    See [Upgrade Desktop WebLogic Remote Console](../set-console#GUID-281298E0-AEE6-4DEC-ADF1-949780E75D76).

5.  Restart an affected console component or WebLogic Server when the identified issue or a configuration change requires it.

## Investigate Server Connection Issues {#GUID-6C3E82A1-BEC6-4CEF-A964-4C795C5436F7}

If the Administration Server cannot reach a Managed Server or cluster, you may be able to determine the cause using WebLogic Remote Console.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**. Use the **State** column to determine the current life cycle state of a server instance or cluster.

    If the Administration Server cannot reach the server to determine its state, the server will be marked as <code>Unreachable</code>.

2.  Click on a server or cluster whose state is <code>Unreachable</code>.

3.  Click the **Troubleshoot** tab. WebLogic Remote Console will automatically attempt to send test administration traffic to the server or cluster.

    Depending on the result of the test, WebLogic Remote Console provides different information:

    -   If the Administration Server cannot find the HTTP/S address for sending administration traffic to the server \(typically because the server is not running\), then the **Server URL** field will return <code>unknown</code>.
    -   If the Administration Server receives a response from the server, then WebLogic Remote Console will populate the **Status**, **Response Headers**, and **Response Body** fields.
    -   If the Administration Server receives a Java exception, then WebLogic Remote Console will populate the **Exception** and **Stack Trace** fields.

Use the information gathered from this troubleshooting test to help determine the cause of the connection issues between the Administration Server and server instances or clusters.

## Review Log Files {#GUID-0492B07F-0F69-4944-9B8B-C1EAD42DF655}

If you experience any issues with WebLogic Remote Console, then you can check its log files to determine the cause of the issues.

1.  Open **Help**, then **Toggle Developer Tools** and select the **Console** tab.

2.  Read the log messages to see if they provide enough information to determine the cause of your issue.

3.  WebLogic Remote Console also generates a log file, <code>out.log</code>, for each session. Open the log file and review its contents.

    The location of <code>out.log</code> varies depending on your platform:

    -   Linux: <code>*$HOME*/.config/weblogic-remote-console/out.log</code>
    -   macOS: <code>/Users/*user*/Library/Application Support/weblogic-remote-console/out.log</code>
    -   Windows: <code>C:\Users\*user*\AppData\Roaming\weblogic-remote-console\out.log</code>
    Log file entries from previous sessions are saved to a new file in the same directory, marked by date: <code>out-yyyy-mm-dd.log</code>.


{{< alert title="Note" color="primary" >}}



If you want to generate log files for WebLogic Server, see [Log Messages](../administration-server/monitoring-domains#GUID-280EB231-F28A-4FF2-A8B2-08DEBDD9CD4B) instead.

{{< /alert >}}


## Known Issues {#GUID-A2824DAE-C040-43E0-A645-041FDFB8936F}

This section describes the known issues associated with WebLogic Remote Console.

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

**Solution**: Try logging into Hosted WebLogic Remote Console again. In the browser's address bar, enter <code>http://*hostname*:*port*/rconsole/signin</code> \(or <code>https://*hostname*:*port*/rconsole/signin</code>\) and re-enter your credentials.

### Deleted Items Do Not Re-Appear When Change is Reverted {}

If you delete an item but then discard the change instead of committing it, WebLogic Remote Console will not show the restored item immediately.

**Workaround**: Navigate away and then back to the affected page and the previously deleted item will become visible. If the deletion affected the navigation tree, such as deleting a node, you can collapse and then re-expand the navigation tree and the node will re-appear.

### Using the Hosted WebLogic Remote Console Across Multiple Browser Tabs May Cause Strange Behavior {}

If you open Hosted WebLogic Remote Console in multiple browser tabs and edit the domain, the different instances will interfere with each other and may result in configuration errors.

**Solution**: Only use Hosted WebLogic Remote Console in one browser tab at a time.

### The WebLogic Remote Console Log File Looks Corrupted {#section_f5d_yk4_nfc}

If the WebLogic Remote Console log file has unprintable characters and appears corrupted, it may be because your JVM's file encodings are not compatible with the UTF-8 file encoding used by Desktop WebLogic Remote Console.

**Workaround**: Set the JDK JVM encodings for Desktop WebLogic Remote Console to use UTF-8.

### Children of Newly Created Nodes do not Appear Automatically {#section_f42_zh3_zfc}

Occasionally, when you create an item, its top-level node appears in the Navigation Tree but its child nodes do not appear.

**Workaround**: Reload the page by navigating to another perspective tree and then back to the original perspective. The child nodes should now be visible.

### A 'Failed to start an edit session' Error is Appearing {#section_wqg_sqt_pgc}

If you try to make a configuration change to the domain and receive an <code>Failed to start an edit session</code> error, it might be because another user currently has the configuration lock which blocks other users from overwriting their changes.

If you are an administrator, you can take the configuration lock \(and their pending changes\) from the other user. See [Grab the Edit Lock](../administration-server/domain-configuration#GUID-376C1ED1-E4AF-48B8-9BEC-B57D5BDEB9B5).

### How do I do *x* in WebLogic Remote Console 3.x? {#section_vq1_ly2_y3c}

Significant changes to WebLogic Remote Console were implemented in 3.x. For a brief overview of the major changes compared to WebLogic Remote Console 2.4.19, refer to [Introducing WebLogic Remote Console 3.x](https://oracle.github.io/weblogic-remote-console/preview/).

While we have done our best to ensure feature parity from WebLogic Remote Console 2.4,19, you may encounter some unexpected behavior, particularly in the area of WDT model file management. As with any issues you encounter, consider raising a bug in the [WebLogic Remote Console GitHub Repository](https://github.com/oracle/weblogic-remote-console) so we can track the issue. See [Contribute to WebLogic Remote Console](../set-console/contribute-wrc-repository#GUID-0BCE90EE-6760-4A0E-968E-C0EB8C49D66E).

## Cannot Connect to the Administration Server {#GUID-B3D14A11-0144-4B31-BFE3-E6AC59AEFCBE}

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

        **Note**: The <code>-k</code> option is equivalent to <code>--insecure</code>. It skips server certificate verification, allowing you to test connectivity without certificate trust validation preventing the connection. To also test certificate verification, repeat the HTTPS command without <code>-k</code>.

        If the HTTPS command succeeds with <code>-k</code> but fails without it with a certificate verification error, investigate the server certificate, hostname, and curl’s trust configuration.

        Compare these results with the error reported by WebLogic Remote Console to help distinguish connectivity problems from certificate trust problems. Curl and WebLogic Remote Console may use different trust configurations, so a successful curl connection does not by itself establish whether the console trusts the Administration Server’s certificate. See [Connect using SSL/TLS](../administration-server/domain-configuration#GUID-660C99D2-4F3F-4276-B3E2-E725A27D1C82) for configuring certificate trust in WebLogic Remote Console.

-   Make sure your Administration Server's management endpoint, <code>management/*</code>, is accessible to clients. It may be blocked if your domain is behind a load balancer or firewall, or is in a Docker container. You will need to expose the endpoint manually.

    You should also make sure that the value of the Remote Console Helper Context Path attribute \(<code>RemoteConsoleHelperMBean.ContextPath</code>\) has not been changed. The default value is <code>console</code>, which WebLogic Remote Console appends to the domain URL. If you modify the context path, it may prevent WebLogic Remote Console from successfully connecting to the Administration Server. Do not change it unless you understand the possible impacts to Desktop WebLogic Remote Console. See [Configure Web Authentication](../administration-server/domain-configuration#GUID-A6191FE0-2A4C-45B6-A138-7FD9B157D28F).

-   Confirm that RESTful Management Services \(<code>RestfulManagementServicesMBean</code>\) are enabled. In some releases of WebLogic Server, they are disabled by default.

-   If the Administration Server resides in a different network than WebLogic Remote Console, then make sure the proxy settings of WebLogic Remote Console are properly configured to allow communication between the two. See [Connect using a Proxy Server](../administration-server/domain-configuration#GUID-D7AD7F50-88F8-4FC9-A28B-CBF98B5FD479).

    If an HTTP server, reverse proxy, ingress, or load balancer fronts the Administration Server, check its routing configuration to ensure that requests for <code>management/*</code> are forwarded to the Administration Server. Refer to that component’s documentation for the appropriate configuration file and routing or location directives.


## Features are Missing from WebLogic Remote Console {#GUID-954E44B6-5421-40C4-B9A7-77B5C24EF8D2}

Certain features or screens in WebLogic Remote Console are hidden if your current user is not assigned the appropriate permissions.

For security purposes, WebLogic Remote Console restricts what a user can see or do depending on their role. Only administrators have access to the full functionality of WebLogic Remote Console.

Try logging in as a user with more elevated permissions.

For more information, see [Access Limitations](../administration-server/domain-configuration#GUID-BA0BFEB9-FA9D-4063-90E0-1D44551FB2E2).

{{< alert title="Note" color="primary" >}}



If you believe a feature is missing and it is not a case of inadequate permissions, you can open an enhancement request in the [WebLogic Remote Console GitHub repository](https://github.com/oracle/weblogic-remote-console).

{{< /alert >}}


## REST Communication Issues {#GUID-2EF5267E-FE34-4D74-BF2F-3F318E47062A}

WebLogic Remote Console reports that it is experiencing REST communication issues between servers.

When REST communication is blocked, it may prevent further configuration of the domain or cause the Monitoring Tree perspective to report inaccurate statuses for Managed Servers.

You can test the REST connection using <code>curl</code>.

-   To get the Administration Server’s runtime statistics *directly*:

    -   For HTTP, run:

        ```
        curl -v --user *username*:*password* http://*adminServerHost*:*adminServerPort*/management/weblogic/latest/serverRuntime
        ```

    -   For HTTPS, run:

        ```
        curl -v -k --user *username*:*password* https://*adminServerHost*:*adminServerPort*/management/weblogic/latest/serverRuntime
        ```

    If the direct request fails, see [Cannot Connect to the Administration Server](#GUID-B3D14A11-0144-4B31-BFE3-E6AC59AEFCBE).

-   To get the Administration Server’s runtime statistics *indirectly*:

    -   For HTTP, run:

        ```
        curl -v --user *username*:*password* http://*adminServerHost*:*adminServerPort*/management/weblogic/latest/domainRuntime/serverRuntimes/*adminServerName*
        ```

    -   For HTTPS, run:

        ```
        curl -v -k --user *username*:*password* https://*adminServerHost*:*adminServerPort*/management/weblogic/latest/domainRuntime/serverRuntimes/*adminServerName*
        ```


{{< alert title="Note" color="primary" >}}



The HTTPS examples use <code>-k</code>, equivalent to <code>--insecure</code>, to test connectivity without verifying the Administration Server’s certificate. Repeat the commands without <code>-k</code> to also test certificate verification using curl’s trust configuration.

{{< /alert >}}


If the direct request succeeds but the indirect request fails, investigate the REST communication path and the Administration Server logs. The <code>-k</code> option affects curl’s verification of the Administration Server’s certificate; it does not change certificate verification between WebLogic servers.

### Potential Causes {}

If the direct connection to the Administration Server succeeded but the indirect connection failed, this may indicate an SSL/TLS handshake error or some other SSL/TLS issue. Enable JDK SSL/TLS debugging on the Administration Server and then re-run the indirect curl command to help you identify the SSL/TLS connection issue.

If you receive a <code>SocketException: Permission denied</code> error, then check if your VPN is interfering with communication to the Administration Server. Disconnect from the VPN and try to connect again. If the connection is successful, you may be able to work around the issue by setting the listen address of the Administration Server to <code>localhost</code>, <code>127.0.0.1</code>, or another NIC specific address and re-enabling the VPN.

Certain configuration changes can block REST communication between servers, including, but not limited to the following examples:

-   Disabling the default Identity Asserter provider.
-   Disabling the default Credential Mapping provider.
-   Removing <code>weblogic-jwt-token</code> from the default Identity Asserter provider’s Active Types.
-   Applying incompatible REST invocation policies to the WebLogic Server REST API. For example, using Oracle Web Services Manager \(OWSM\) to protect the domain may inadvertently restrict access to the REST API.
-   Changing the listen port \(including enabling the Administration port\) without immediately restarting the servers.

You must update your configuration changes so they no longer block REST communication.

## Invalid WebLogic Server Configurations {#GUID-BC6A74B7-C370-4370-9ED1-18C3FEB4EC39}

WebLogic Remote Console reports an invalid configuration in your domain.

To make sure that changes to your domain are valid, WebLogic Remote Console performs validation checks whenever you save or try to commit a change. If WebLogic Remote Console reports an invalid configuration error, then you must identify and correct the change before you can commit your changes.

-   Review any recent changes for issues. You can check the Shopping Cart to see your pending changes if you have the WebLogic Remote Console extension installed.
-   Check the log output from WebLogic Remote Console and the Administration Server.

If you still cannot determine the cause of the error, then you may need to discard all of your changes and then reapply them one at a time to isolate the change responsible for the error.

{{< alert title="Note" color="primary" >}}



WebLogic Remote Console *does not* validate WDT model files. It will accept changes or values that are invalid and which may prevent the WDT model file from building or updating a domain. For example, if you add integer values that are invalid or out of range for a specific setting, or remove a server or target but do not update the deployments to select a different server or target, WebLogic Remote Console will not flag these errors.

For information on acceptable values, refer to the [WDT Documentation](https://oracle.github.io/weblogic-deploy-tooling/).

{{< /alert >}}


## Problem reading auto-prefs.json {#GUID-D5574A23-8B13-4210-A2A7-916411FB08C3}

WebLogic Remote Console shuts down unexpectedly with a <code>Failure reading auto prefs</code> error.

The <code>auto-prefs.json</code> file saves state information about WebLogic Remote Console including details on projects and providers. Users should not touch this file unless it becomes corrupted.

If <code>auto-prefs.json</code> does become corrupted, you can reset it, but all of your data regarding your projects will be lost. The data for your domain will be unaffected.

1.  Close WebLogic Remote Console.
2.  Delete <code>auto-prefs.json</code>. The location of <code>auto-prefs.json</code> varies depending on your platform:
    -   Linux: <code>*$HOME*/.config/weblogic-remote-console/auto-prefs.json</code>
    -   macOS: <code>/Users/*user*/Library/Application Support/weblogic-remote-console/auto-prefs.json</code>
    -   Windows: <code>C:\Users\*user*\AppData\Roaming\weblogic-remote-console\auto-prefs.json</code>
3.  Restart WebLogic Remote Console.

