---
weight: 155
title: Monitoring Domains
---



Use WebLogic Remote Console to monitor WebLogic Server and its related resources and services.

For general information on monitoring, diagnostic, and tuning tools in WebLogic Server, see [Monitoring, Diagnosing, and Troubleshooting](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=INTRO-GUID-F6276D78-0B63-4520-8CF8-E57AB49196E4) in **Understanding Oracle WebLogic Server**.

## Monitor Servers {#GUID-883264DD-C3C8-48B6-81A4-F26ABA0EFEAA}

Review the servers in your domain to ensure they are functioning as expected.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**.

    Use the **Servers** table to monitor and compare properties across the different server instances in your domain.

    Use the **Customize Table** feature to rearrange the table columns to suit your needs.

2.  To see more information about a server, click on its row in the table.

    Each server has its own child node under the **Servers** node. A top-level *myServer* node provides general runtime information regarding the selected server. Expand the *myServer* node to see more specific information for other areas such as scheduling or deployments.


### View Node Manager Status and Logs {#GUID-FCF0B63C-18B9-415D-A86B-390C8CB4B2A5}

You can check the current status of Node Manager and use Node Manager logs to help troubleshoot problems in starting or stopping individual Managed Servers.

For more information, see [Log Files](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=NODEM-GUID-A3AACA8B-4AFC-4082-9855-118A6DDDC67F) in **Administering Node Manager for Oracle WebLogic Server**.

{{< alert title="Note" color="primary" >}}

 Node Manager must be running to view its logs.

{{< /alert >}}


1.  In the **Monitoring Tree**, go to **Environment**, then **Node Manager Logs**.

2.  Click the name of the machine whose Node Manager logs you want to view.

3.  Click **Download**.


When using Hosted WebLogic Remote Console, your browser controls the location where the log files are downloaded. If you want to change the default download location, update your browser settings accordingly.

### Configure Health Monitoring {#GUID-7ECFBDD7-C3A3-44CF-B3D6-D9FC396E2ECB}

A server can monitor key aspects of its subsystems and report when a subsystem is not functioning properly.

If the server is running under a Node Manager, the Node Manager can automatically restart a server with an unhealthy subsystem. Node Manager can only perform automatic monitoring and shutdown for servers that it starts.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  On the **Health** tab, modify the options as necessary.

3.  Click **Save**.


## Dashboards {#GUID-1C12C76D-2820-4AD8-9556-46AC52C617AD}

Use dashboards to quickly assess and filter data about your domain. You can specify criteria for WebLogic Remote Console to match against MBeans in your domain and then review the results.

Dashboards are highly customizable. Start from any node in the **Monitoring** perspective and you can use its properties to develop precise criteria that go far beyond simple true/false statements. Dashboards let you find obscure, cross-functional data that might otherwise require comparison across multiple nodes.

Dashboards are only available on the **Monitoring Tree** perspective.

{{< alert title="Note" color="primary" >}}



You can expand the **Dashboards** node at the bottom of the Navigation tree to see any saved or built-in dashboards.

{{< /alert >}}


### Dashboard Filters {#GUID-2E5979B0-99ED-400B-A626-A525AA0FC3D8}

In dashboards, filters are the criteria that you use to curate your results. Generally, filters are based on the properties of a node.

WebLogic Remote Console restricts which filters are available based on your current node so you can focus on the criteria that is relevant to your goals. As such, the filters that are available on the Environments: Servers node are different than those available under Deployments: Application Runtime Data.

Each filter consists of a **name** (or **property**) from the domain, a **value**, and an **operator** that determines how the name and value interact with each other. A basic dashboard filter is simply <code>name=value</code>. The following example dashboard filter returns any servers that require a restart to apply configuration changes:

```
ServerRuntime.RestartRequired == true
```

Values come in three formats:

-   Text
-   Numeric
-   Boolean (expressed as option toggles). Set the option to <code>On</code> for True, <code>Off</code> for False.

Use operators to determine how a value should be assessed. Only the operators that are applicable to a name or property appear as options - you won't see <code>greater than</code> for text values. By default, all filters are set to <code>Any</code> to provide the broadest possible search parameters.

Dashboards consist of one or more filters and filters are *cumulative* - beans must match ALL of the defined filters to be returned as a result. Therefore, when you build a dashboard, only edit the filters that are relevant to your query and leave the rest of the filters unchanged.

### Built-In Dashboards {#GUID-8B5A1529-2C09-40D7-B11D-D1B2C9E9248A}

WebLogic Remote Console provides a set of pre-defined dashboards to monitor common domain statistics.

On the **Monitoring Tree**, expand the **Dashboards** node to see both custom and built-in dashboards.

You cannot edit or delete built-in dashboards. However, you can use a built-in dashboards as a starting point for another dashboard. Select a built-in dashboard and click **Copy**, then enter a new name for your custom dashboard. Edit it as you would a custom dashboard.

### Create a Dashboard {#GUID-2248703B-6D0E-4376-ACAC-4613230C6CCD}

You can create your own custom dashboards to monitor the state of your domain.

1.  In the **Monitoring Tree**, go to the node in the Navigation Tree that most closely matches the type of content that you want to track. For example, if you want to learn about servers, open the **Environment: Servers** node.

2.  Click **New Dashboard**.

3.  Enter a name for your new dashboard and then begin configuring the filters that will determine the results of the dashboard. For guidance on how to build filters, see [Dashboard Filters](#GUID-2E5979B0-99ED-400B-A626-A525AA0FC3D8).

4.  Click **Create** to generate the dashboard.

5.  Click **Customize Table** to control which columns appear in the dashboard.


All of your dashboards are available in the **Dashboards** node of the Monitoring Tree.

Dashboards are not automatically refreshed with new data. You must refresh or rerun the dashboard page to see any changes to MBeans. Click **Reload** to update the results. You can also click **Auto Reload Interval** to set the dashboard to regularly reload and update the results.

## Log Messages {#GUID-280EB231-F28A-4FF2-A8B2-08DEBDD9CD4B}

WebLogic Server logging services provide facilities for writing, viewing, filtering, and listening for log messages. These log messages are generated by WebLogic Server instances, subsystems, and Java EE applications that run on Oracle WebLogic Server or in client JVMs.

Use WebLogic Remote Console to configure WebLogic Server Logging services. For general information on WebLogic Server logging services, see [Understanding WebLogic Logging Services](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLLOG-GUID-7E52F7E6-55A1-4E0D-A3F6-CBC110ABD975) in **Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server**.

### View Logs {#GUID-7DE040D7-9BF2-420A-9810-F1CA993A32CA}

Each subsystem within WebLogic Server generates log messages to communicate its status. To keep a record of the messages that its subsystems generate, WebLogic Server writes the messages to log files.

The contents of log files are generated according to the logging settings that are currently defined for a server. To manage what information is sent to a log file, see [Configure Logs](#GUID-B5244A71-B792-42E1-ACFF-B0DDC9A53E67).

For more information on WebLogic logging services, see [Understanding WebLogic Logging Services](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLLOG-GUID-7E52F7E6-55A1-4E0D-A3F6-CBC110ABD975) in **Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server**.

1.  In the **Monitoring Tree**, go to **Diagnostics**, then **Logs and Archives**.

2.  Each row is a type of diagnostic data. Click on the row that you're interested in to view its logs.

3.  Select a log file and then click **Download Logs**.

    Logs are segregated by server instance.


### Configure Logs {#GUID-B5244A71-B792-42E1-ACFF-B0DDC9A53E67}

WebLogic Server generates log files to track and communicate the status of its various subsystems. To ensure these log files remain valuable and usable, you can configure their settings.

Each WebLogic Server instance writes all messages from its subsystems and applications to a server log file that is located on the local host computer. In addition to writing messages to the server log file, each server instance forwards a subset of its messages to a domain-wide log file. By default, servers forward only messages of severity level <code>Notice</code> or higher. See [Server Log Files and Domain Log Files](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLLOG-GUID-FB3DEC02-7238-48AF-8DEE-2363BB241DCC) in **Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server**.

The server log records information about events such as the startup and shutdown of servers, the deployment of new applications, or the failure of one or more subsystems. The messages include information about the time and date of the event as well as the ID of the user who initiated the event. You can view and sort these server log messages to detect problems, track down the source of a fault, and track system performance.

You can also create client applications that listen for these messages and respond automatically. For example, you can create an application that listens for messages indicating a failed subsystem and sends email to a system administrator.

For more information on WebLogic logging services, see [Understanding WebLogic Logging Services](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLLOG-GUID-7E52F7E6-55A1-4E0D-A3F6-CBC110ABD975) in **Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  Click the **Logging** tab.

3.  Modify the logging settings to suit your needs.

4.  Click **Save**.

5.  Repeat on the rest of the servers.

6.  Go to **Environment**, then **Domain**.

7.  Click the **Logging** tab.

8.  Modify the settings for the domain-level log to suit your needs.

9.  Click **Save**.


### Define Debug Settings {#GUID-E271C76A-441E-4A5D-8795-1CB2F944B861}

Specify debugging settings for WebLogic Server.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  Click the **Debug** tab.

    The Debug tab is split into several subtabs that group related debug flags together. Use the **All** tab to see all available debug flags.

3.  Enable the debug flags that you want to generate logging messages.

4.  Click **Save**.


If you haven't already, you should configure general logging settings for this server. See [Configure Logs](#GUID-B5244A71-B792-42E1-ACFF-B0DDC9A53E67).

If you create applications to run on WebLogic Server, you can configure your applications to generate messages of severity <code>DEBUG</code>. These messages are never forwarded to the domain log and are intended to contain detailed information about the operation of an application or the server.

### Filter Log Messages {#GUID-EB50E0B0-91AB-416A-A61F-79D414282DEE}

WebLogic Server can generate a significant amount of data in its log messages. You can filter log messages so only certain messages are published.

For example, you can filter out messages of a certain severity level, or from a particular subsystem, or according to some other specified criteria. Only the log messages that satisfy the filter criteria get published. You can also create separate filters for the messages that each server instance writes to its server log file, standard out, memory buffer, or broadcasts to the domain-wide message log.

WebLogic Server offers multiple methods for filtering log messages and you can use these methods simultaneously. Choose the methods that work for your environment. For more information, see [Filtering WebLogic Server Log Messages](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLLOG-GUID-601DAF57-58CC-4E13-B509-129884A8E6C3) in **Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Environment**, then *myServer*.

2.  Click on the **Logging** tab.

3.  Click **Show Advanced Fields**.

4.  If you want to change the default severity level for all loggers or packages in the logger tree, then choose a new level from the **Minimum severity to log** drop-down list.

    The default level is <code>Info</code>. For information on message severity, see [Message Severity](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLLOG-GUID-A7D779DC-43FE-40D1-ABBF-4D781FC72381) in **Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server**.

5.  If you want to redirect the standard out of the JVM in which the WebLogic Server instance runs to the four log message destinations (log file, standard out, domain log, and message buffer), then turn on **Redirect stdout logging enabled**. For more information, see [Redirecting JVM Output](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLLOG-GUID-E11405DE-BAED-456F-9D5E-E155B2D24BA3) in **Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server**.

6.  If you want to override the setting for the root Logger (as specified by the **Minimum severity to log list** option) or its closest parent node in the logger tree, then do as follows:

    1.  Click the **Severity Properties** tab.

    2.  In the **Logger Severity Properties** table, click **+** to add a new key-value row, then double-click the row cells to update the key and value.

    You can also use Logger severity properties to specify severity levels for packages (if using the Commons Logging API) or for individual WebLogic Server subsystem Loggers (if using the Message Catalog Logger).

    All loggers inherit the severity level of their nearest parent node in the logger hierarchy. You can specify a severity level for a given logger that is different than its nearest parent node using key-value pairs, where the key is the logger name and the value is the severity level (Info, Critical, Warning, and so on).

    See [Specifying Severity Level for Loggers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLLOG-GUID-4D87246E-F63B-4AA0-B471-E5326673C841) in **Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server**.

7.  If you want to control which log messages are published, you can create log filters which use custom logic to evaluate log message content and then accept or reject it for publication based on its criteria. You can apply log filters to these log message destinations: log file, standard out, and domain log broadcaster.

    1.  [Create a Log Filter](#GUID-0D37D991-A698-4D2C-8163-DC3B1A0BBC65).

    2.  To apply a log filter to the log file message destination, choose your preferred severity level from the **Log File Severity Level** drop-down list, then choose a log filter from the **Log File Filter** drop-down list.

    3.  To apply a log filter to the standard out message destination, choose your preferred severity level from the **Stdout Severity Level** drop-down list, then choose a log filter from the **Stdout Filter** drop-down list.

    4.  To apply a log filter to the domain log broadcaster message destination, choose your preferred severity level from the **Domain Log Broadcast Severity Level** drop-down list, then choose a log filter from the **Domain Log Broadcast Filter** drop-down list.

        You can specify the size of the message buffer which stores messages that will be forwarded to the domain log. A higher value causes more messages to be stored in the buffer before the contents are forwarded to the domain log. For performance reasons, it is recommended that this value be set to 10 or higher in production mode.

    You cannot forward <code>DEBUG</code> messages to the domain log.

8.  Click **Save**.


### Create a Log Filter {#GUID-0D37D991-A698-4D2C-8163-DC3B1A0BBC65}

Log filters provide control over the log messages that get published. A filter uses custom logic to evaluate the log message content, which you use to accept or reject a log message

For example, to filter out messages of a certain severity level, from a particular subsystem, or according to specified criteria. Only the log messages that satisfy the filter criteria get published. You can create separate filters for the messages that each server instance writes to its server log file, standard out, memory buffer, or broadcasts to the domain-wide message log.

1.  In the **Edit Tree**, go to **Environment**, then **Log Filters**.

2.  Click **New**.

3.  Enter a name for the log filter and click **Create**.

4.  Enter an expression in the **Filter Expression** field.

    A filter expression defines simple filtering rules to limit the volume of log messages written to a particular log destination. For information on building filter expressions, see [WLDF Query Language](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLDFC-GUID-594EA6D9-EB3A-4C51-BF09-F5A8F483D1A0) in **Configuring and Using the Diagnostics Framework for Oracle WebLogic Server**.

5.  Click **Save**.


Update your logging settings to apply this log filter. See [Filter Log Messages](#GUID-EB50E0B0-91AB-416A-A61F-79D414282DEE).

### Rotate Log Files {#GUID-212C2424-746F-4150-8664-F6F9A0B0A4EF}

Set a rotation schedule for the log files generated by WebLogic Server.

For more information, see [Rotating Log Files](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLLOG-GUID-FCA331B8-F60C-4E52-A91B-FABACCC9EFBE) in **Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server**.

{{< alert title="Note" color="primary" >}}



WebLogic Server sets a threshold size limit of 2,097,152 kilobytes before it forces a hard rotation to prevent excessive log file growth.

{{< /alert >}}


1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  On the **Logging** tab, from the **Rotation Type** drop-down list, select the criteria that triggers the server to move log messages to a separate file. Depending on your choice, configure the appropriate settings.

    -   **By Size** - rotates log messages when log file size reaches the specified size.
    -   **By Time** - rotates log messages after a specified time interval passes.
    -   **By Size or Time** - rotates log messages if the file size reaches the specified size or if the specified time interval passes, whichever occurs first.
    -   **None** - log messages are not automatically rotated. You must manually erase the contents of the file when the size becomes too large.
3.  If you chose **By Size** as the Rotation Type.

    1.  In the **Rotation file size** field, enter the file size that triggers the server to move log messages to a separate file. After the log file reaches the specified size, the next time the server checks the file size it renames the current log file by appending a 5-digit integer; for example, <code>SERVER_NAME.log00007</code>. After the server renames the file, subsequent messages accumulate in a new file named <code>SERVER_NAME.log</code>.

4.  If you chose **By Time** as the Rotation Type.

    1.  In the **Begin rotation time** field, enter the start time

        Use the following format: <code>hh:mm</code>, where <code>hh</code> is the hour in a 24-hour format and <code>mm</code> is the minute. At the time that you specify, the server rotates the current log file. If the time that you specify is already past, the server rotates the log file at the next scheduled interval, as specified in **Rotation Interval**.

    2.  In the **Rotation Interval** field, enter the interval, in hours, at which the server saves old messages to another file.

5.  If you chose **By Size or Time** as the Rotation Type, then configure the **By Size** and **By Time** options as described in steps [3](#STEP_Z2F_JLF_B2C) and [4](#STEP_TQJ_JLF_B2C).

6.  If you want to limit the number of log files that the server creates to store old log messages, enable the **Limit Number of Retained Log Files** option. Then, in the **Files to Retain** field, enter the maximum number of files. If the server receives additional log messages after reaching the capacity of the last log file, it overwrites the oldest log file.

7.  In the **Log file rotation directory** field, enter the directory location where the rotated log files will be stored.

    Enter an absolute pathname or a pathname that is relative to the server's root directory. By default, the rotated files are stored in the same directory where the log file is stored.

8.  If you want to add a time or date stamp to the file name when the log file is rotated, then in the **Log file name** field, add <code>java.text.SimpleDateFormat</code> variables to the file name and surround each variable with percentage (%) characters.

    For example, if you enter the following value in the Log file name field: <code>myserver_%yyyy%_%MM%_%dd%_%hh%_%mm%.log</code>, the server's log file will be named <code>myserver_*yyyy_MM_dd_hh_mm*.log</code>.

    When the server instance rotates the log file, the rotated file name contains the date stamp. For example, if the server instance rotates its local log file on 4 March 2020 at 10:15 AM, the log file that contains the old log messages will be named <code>myserver_2020_03_04_10_15.log*nnnnn*</code>. (The current, in-use server log file retains the name <code>myserver_*yyyy_MM_dd_hh_mm*.log</code>.)

    If you do not include a time and date stamp, the rotated log files are numbered in order of creation <code>*SERVER_NAME*.log*nnnnn*</code>, where <code>*SERVER_NAME*</code> is the name configured for the log file. For example: <code>myserver.log00007</code>.

9.  Click **Save**.


## Enable Configuration Auditing {#GUID-BB85D9BB-5E36-4067-AA9F-E01EBFF027CD}

You can configure the Administration Server to emit audit messages that enable auditing of configuration changes in a domain.

This provides a record of changes to the configuration of any resource within a domain or invokes management operations on any resource within a domain. Configuration audit records can be saved to a log file, sent to an Auditing provider in the security realm, or both.

If you plan to audit configuration changes, then you must configure the WebLogic Auditing Provider first. See [Configure an Auditing Provider](../securing-domains#GUID-553E0BEB-BD7E-44EF-AD4D-782F1A01C3B8).

1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

2.  Click **Show Advanced Fields**.

3.  From the **Configuration Audit Type** drop-down list, select the method to use for auditing configuration change events.

    -   **None**: No audit configuration change events are written.
    -   **Log**:Configuration events will be written to the server log.
    -   **Audit**: Configuration events will be directed to the Security Framework and handled by the Auditing provider.
    -   **LogAudit**: Configuration events will written to the server log as well as directed to the Security Framework and handled by the Auditing provider.
4.  Click **Save**.


## Display Thread Stacks {#GUID-E83F152C-96B8-46CD-9A14-818C468BAF7D}

You can display the current stack for an active thread.

1.  In the **Monitoring Tree**, go to **Environment**, then **JVM Runtime**.

2.  Click the **Thread Stack Dump** tab to see an overview of the thread stack dumps for each server in the domain.

3.  To see the thread stack dump for a single server, click the server instance in the table. This sends you to the **JVM Runtime** node for the selected server. Click the **Thread Stack Dump** tab.


## Tuning Performance {#GUID-F414237C-43D2-43CF-8A72-B999D19A1D2E}

To ensure that your WebLogic Server environment is performing optimally, you should regularly monitor its behavior and then adjust its settings accordingly.

For guidance on the performance tuning options that are available in WebLogic Server, see [**Tuning Performance of Oracle WebLogic Server**](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=PERFM-GUID-56A43014-010F-4BA5-9A77-AB188E208BB7).

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  On the **Advanced** tab, select the **Tuning** subtab.

3.  Modify the available options as recommended based on the needs of your environment.

4.  Click **Save**.

5.  Repeat as needed for the rest of the servers in your domain.


