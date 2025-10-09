---
weight: 192
title: Configuring Services
---



Use WebLogic Remote Console to manage services in a WebLogic Server domain.

## Data Sources {#GUID-D92E5FE4-548C-49E1-9A77-A61A59039D21}

You can connect WebLogic Server to databases by adding JDBC data sources to your domain. A data source is a Jakarta EE standard method of configuring connectivity to a database.

Each WebLogic data source contains a pool of database connections. Applications look up the data source on the JNDI tree or in the local application context and then use a database connection from the pool of connections. Data sources and their connection pools provide connection management processes that help keep your system running efficiently.

You can manage the following JDBC data source types from WebLogic Remote Console:

-   JDBC Generic Data Sources

-   JDBC Multi Data Sources

-   Active GridLink Multi Data Sources

-   Universal Connection Pool \(UCP\) Data Sources


For more information on using data sources with WebLogic Server, see [Understanding JDBC Data Sources](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=INTRO-GUID-B4D35DB2-DCD1-4E79-9109-49999B0A7D46) in **Understanding Oracle WebLogic Server** and [Configure Database Connectivity](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-23E710AA-35CA-48DC-9A6D-D2221B6C582A)in **Administering JDBC Data Sources for Oracle WebLogic Server**.

### JDBC Drivers {}

Data sources require the use of JDBC drivers to gain access to various databases. WebLogic Server comes with a default set of JDBC drivers but you can also install third-party JDBC drivers.

For the types of JDBC drivers supported in WebLogic Server, see [Types of JDBC Driver](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-BC450A35-AF2E-4A7C-A355-E90AA78DF181) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

For a list of the JDBC drivers installed in WebLogic Server, see [JDBC Drivers Installed with WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-DCF67151-5FFD-444A-B51A-1E9A4798E88C) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

For instructions on how to install third-party JDBC drivers, see [Adding Third-Party JDBC Drivers Not Installed with WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-AC76754A-BFC3-40BE-98D2-03E1B4C950FC) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

### Create a Generic Data Source {#GUID-2089B850-BA49-4677-B5E4-F225B563698A}

A generic data source provides database access and database connection management. Generic data sources and their connection pools provide connection management processes that help keep your system running efficiently.

For more information on generic data sources, see [Using JDBC Generic Data Sources](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-5F9CCFFC-6279-4D0B-8247-18BED441E3BD) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

{{< alert title="Note" color="primary" >}}



Generic is the term used to distinguish a simple data source from a Multi Data Source or Active GridLink data source.

{{< /alert >}}


If you need a JDBC driver that is not installed with WebLogic Server, you must install it before you can set up a data source. See [Adding Third-Party JDBC Drivers Not Installed with WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-AC76754A-BFC3-40BE-98D2-03E1B4C950FC) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Services**, then **Data Sources**.

2.  Click **New**.

3.  Enter a name for the new data source.

    The name cannot contain the following characters: <code>@ # $</code>.

4.  In the **JNDI Names** field, enter the JNDI path to the location where this JDBC data source will be bound. Applications look up the data source on the JNDI tree by this name when reserving a connection.

5.  Choose the server instances or clusters where you want to deploy the data source.

6.  Select **Generic Data Source** from the **Data Source Type** drop-down list.

7.  From the **Database Type** drop-down list, select the database management system \(DBMS\) of the database that you want to connect to. If your DBMS is not listed, select **Other**.

8.  From the **Database Driver** drop-down list, select a JDBC driver.

9.  Enter the connection details for the database that you want to connect to:

    -   **Database Name**: Enter the name of the database you want to connect to. Exact database name requirements vary by JDBC driver and by DBMS.
    -   **Host Name**: Enter the DNS name or IP address of the server that hosts the database. If you are creating an Oracle GridLink service-instance connection, this must be the same for each data source in a given multi data source.
    -   **Port**: Enter the port on which the database server listens for connections requests.
    -   **Database User Name**: Enter the database user account name that you want to use for connections in the data source.
    -   **Password**: Enter the password for the database user account.
10. Click **Create**.


### Create a Multi Data Source {#GUID-33543D1B-BB22-4DBC-9011-A2D3E3553858}

A multi data source is an abstraction around a group of generic data sources. It provides failover and load balancing for connection requests between two or more data sources.

For more information on multi data sources, see [Using JDBC Multi Data Sources](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-CF34E3FE-C329-4006-9506-34544B8447CD) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

Before you create a multi data source, you should create the generic data sources that the multi data source will manage, and ensure they are deployed to same targets as where you plan to deploy the multi data source. See [Create a Generic Data Source](#GUID-2089B850-BA49-4677-B5E4-F225B563698A).

1.  In the **Edit Tree**, go to **Services**, then **Data Sources**.

2.  Click **New**.

3.  Enter a name for the new data source.

    The name cannot contain the following characters: <code>@ # $</code>.

4.  In the **JNDI Names** field, enter the JNDI path to the location where this JDBC data source will be bound. Applications look up the data source on the JNDI tree by this name when reserving a connection.

5.  Choose the server instances or clusters where you want to deploy the data source.

    {{< alert title="Note" color="primary" >}}

     You must deploy the multi data source and the generic data sources to the same targets.

    {{< /alert >}}


6.  Select **Multi Data Source** from the **Data Source Type** drop-down list.

7.  From the **Algorithm Type** drop-down list, choose an algorithm type to determine the connection request processing for the multi data source.

    -   **Failover**: The multi data source routes connection requests to the first data source in the list; if the request fails, the request is sent to the next data source in the list, and so forth.
    -   **Load-Balancing**: The multi data source distributes connection requests evenly to its member data sources.
8.  Specify whether this is an XA or non-XA JDBC multi data source.

    -   When the **XA Driver** option is *enabled*, the multi data source will only use data sources that use an XA JDBC driver to create database connections.
    -   When the **XA Driver** option is *disabled*, the multi data source will only use data sources that use a non-XA JDBC driver to create database connections
    The option you select limits the data sources that you can select as part of the multi data source in a later step. Limiting data sources by JDBC driver type enables the WebLogic Server transaction manager to properly complete or recover global transactions that use a database connection from a multi data source.

9.  Choose the data sources that you want the multi data source to use to satisfy connection requests.

10. Click **Create**.


#### Add or Remove Data Sources in a Multi Data Source {#GUID-BCEE5277-8A52-4337-9B62-CFA9471C0671}

You can add or remove data sources to a multi data source while the data source is deployed \(referred to as dynamically changing the data source list in the multi data source\).

The data sources that you add to a multi data source must be deployed on the same targets on which you intend to deploy the multi data source. You cannot include data sources in a multi data source that are deployed on different servers or clusters. See [Target Data Sources](#GUID-D4E085B2-DD26-431B-B602-94F29C52BAE1).

1.  In the **Edit Tree**, go to **Services**, then **Data Sources**.

2.  Select the multi data source whose components you want to edit.

3.  On the **Data Sources** tab, use the **Data Source List** field to modify which data sources are covered by this multi data source.

    -   To add a new data source, enter the exact name of the data source, separating each data source with a comma.
    -   To remove an existing data source, delete the name of the data source.
    {{< alert title="Note" color="primary" >}}

    

    The order of data sources in the list determines the order that the multi data source uses to route connection requests. For multi data sources that use the Failover algorithm, the first data source in the list is considered the primary data source. Others are considered secondary, tertiary, and so forth.

    {{< /alert >}}


4.  Click **Save**.


### Create an Active GridLink Data Source {#GUID-921FF7EC-EAEA-459B-9EA0-8357355C8BE5}

An Active GridLink data source provides connectivity between WebLogic Server and an Oracle database.

For more information on GridLink data sources, see [Using Active GridLink Data Sources](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-82D615E4-857E-4DC1-89D2-34270809690A) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

If you need a JDBC driver that is not installed with WebLogic Server, you must install it before you can set up a data source. See [Adding Third-Party JDBC Drivers Not Installed with WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-AC76754A-BFC3-40BE-98D2-03E1B4C950FC) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Services**, then **Data Sources**.

2.  Click **New**.

3.  Enter a name for the new data source.

    The name cannot contain the following characters: <code>@ # $</code>.

4.  In the **JNDI Names** field, enter the JNDI path to the location where this JDBC data source will be bound. Applications look up the data source on the JNDI tree by this name when reserving a connection.

5.  Choose the server instances or clusters where you want to deploy the data source.

6.  Select **GridLink Data Source** from the **Data Source Type** drop-down list.

7.  From the **Database Driver** drop-down list, select JDBC drivers.

    1.  **Optional**: If you selected a non-XA driver, then select a **Global Transactions Protocol**.

        See [JDBC Data Source Transaction Options](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-4C929E67-5FD7-477B-A749-1EA0F4FD25D4) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

8.  Enter the connection details for the database that you want to connect to:

    -   **Listeners**: Enter the DNS name or IP address and port number \(separated by a colon\) of the server that hosts the database. Enter each listener on a new line.
    -   **Service Name**: Specify the service name of the database to which you want to connect.
    -   **Database User Name**: Enter the database user account name that you want to use for each connection in the data source.
    -   **Password**: Enter the password for the database user account.
    -   **Protocol**: If required, change the value from **TCP** to **SDP**. To use Socket Direct Protocol \(SDP\), your database network must be configured to use Infiniband.
9.  Configure any additional connection details that are applicable to your environment.

10. Click **Create**.


### Create a UCP Data Source {#GUID-813FCED9-0BF5-4E2A-9924-9D12957BC10B}

A Universal Connection Pool \(UCP\) data source provides an option for users who want to use Oracle Universal Connection Pooling to connect to Oracle databases. UCP provides an alternative connection pooling technology to Oracle WebLogic Server connection pooling.

For more information on UCP data sources, see [Using Universal Connection Pool Data Sources](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-91994E4A-5B7B-42A1-9584-9E1AB579FD40) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

If you need a JDBC driver that is not installed with WebLogic Server, you must install it before you can set up a data source. See [Adding Third-Party JDBC Drivers Not Installed with WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-AC76754A-BFC3-40BE-98D2-03E1B4C950FC) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Services**, then **Data Sources**.

2.  Click **New**.

3.  Enter a name for the new data source.

    The name cannot contain the following characters: <code>@ # $</code>.

4.  In the **JNDI Names** field, enter the JNDI path to the location where this JDBC data source will be bound. Applications look up the data source on the JNDI tree by this name when reserving a connection.

5.  Choose the server instances or clusters where you want to deploy the data source.

6.  Select **UCP Data Source** from the **Data Source Type** drop-down list.

7.  From the **Database Driver** drop-down list, select JDBC drivers.

8.  Enter the connection details for the database that you want to connect to:

    -   **URL**: Enter the URL for the database.
    -   **Database User Name**: Enter the database user account name that you want to use for each connection in the data source.
    -   **Password**: Enter the password for the database user account.
9.  Configure any additional connection details that are applicable to your environment.

10. Click **Create**.


### Control JDBC Data Sources {#GUID-C61D7557-E83E-477D-A1E9-BF7281CF12D9}

After you create a JDBC data source, you can perform administrative tasks on instances of the data source in WebLogic Remote Console.

1.  In the **Monitoring Tree**, go to **Services**, then **Data Sources**, then **JDBC Data Source Runtime MBeans**.
2.  Select the data source that you want to manage and then choose the control operation that you want to perform on the data source.

[Table 1](#TABLE_YT5_TQW_CBC) describes the control operations that you can perform on a JDBC data source.

<table id="TABLE_YT5_TQW_CBC"><thead><tr><th>

Operation

</th><th>

Description

</th></tr></thead><tbody><tr><td>

Start

</td><td>

Use **Start** to start an individual instance of a data source.

For more information, see [Starting a Data Source](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-6A301B9B-A0DD-4290-B02D-F2F57899A1B1) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

</td></tr><tr><td>

Resume

</td><td>

Use **Resume** to resume individual data sources that are in a <code>Suspended</code> state.

For more information, see [Resuming a Connection Pool](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-80AB2650-2AFB-4D67-B650-DCEA15E2260A) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

</td></tr><tr><td>

Suspend

</td><td>

Use **Suspend** to pause individual instances of a data source. When you suspend a data source, applications can no longer get a database connection from the data source. You can choose how to handle active connections:

-   Choose **Gracefully** to mark the data source as disabled and block any new connection requests. If there are any reserved connections, the operation will wait for the period as specified by <code>InactiveTimeout</code>, otherwise the operation waits 60 seconds before suspending all connections. If successful, the health state is set to <code>Suspended</code>. All connections are preserved exactly as they were before the data source was suspended. When you resume the data source, clients that had reserved a connection before the data source was suspended can continue exactly where they left off.
-   Choose **Force Suspend** to mark the data source as disabled. Any transaction on any currently reserved connection is rolled back, and all reserved connections are destroyed. Any subsequent attempts by applications to use their reserved connections will fail. If successful, the health state is set to <code>Suspended</code>. At this time, the data source attempts to replenish the connection pool by creating as many new connections as had been destroyed. When you **Resume**, clients must reserve new connections to proceed.

For more information, see [Suspending a Connection Pool](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-0EDEBF44-FCE6-4725-B319-6210D436D6C8) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

</td></tr><tr><td>

Shutdown

</td><td>

Use **Shutdown** to shut down individual instances of a data source. You can choose how to handle active connections:

-   Choose **Gracefully** to shut down a data source if there are no active connections. If any connections from the data source are currently in use, the **Shutdown** operation will fail and the health state remains <code>Running</code>.
-   Choose **Force Shutdown** to shut down a data source and force the disconnection of all current connection users.

For more information, see [Shutting Down a Data Source](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-1CD1421C-44D4-4C23-B67A-0C019F0C2194) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

</td></tr><tr><td>

Shrink

</td><td>

Use **Shrink** to shrink the pool of database connections in individual instances of a data source to the minimum capacity or the current number of connections in use, whichever is greater.

For more information, see [Shrinking a Connection Pool](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-DE62B858-BE5A-4E22-BCCD-0605C437686E) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

</td></tr><tr><td>

Reset

</td><td>

Use **Reset** to reset the database connections in a JDBC data source by closing and then recreating all available database connections in the pool of connections in the data source.

For more information, see [Resetting a Connection Pool](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-B13E71AD-D6E1-44F4-ADC1-4156ACAC4756) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

</td></tr><tr><td>

Clear cache

</td><td>

Use **Clear cache** to clear the statement cache for all connections in the instance of the data source. Statement caching must be enabled for the data source for WebLogic Server to cache prepared and callable statements that are used in each connection in the data source. Each connection has its own cache, but the caches for each connection are configured and managed as a group.

For more information, see [Managing the Statement Cache for a Data Source](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-41996544-B805-4226-B0A0-29E8FCF93952) and [Increasing Performance with the Statement Cache](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-AFDCC45F-7AD7-4C81-8FA9-1C7ECA05F08C) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

</td></tr></tbody>
</table>

Table 1. Control Operations for JDBC Data Sources. Describes the control operations that you can perform on a JDBC data source.

### Monitor Statistics for JDBC Data Sources {#GUID-D6ACE2D7-51AB-4332-B634-9DD00E964F62}

You can monitor a variety of statistics for each data source instance in your domain, such as the current number of database connections in the connection pool, current number of connections in use, and the longest wait time for a database connection.

1.  In the **Monitoring Tree**, go to **Services**, then **Data Sources**, then **JDBC Data Source Runtime MBeans**.

    {{< alert title="Note" color="primary" >}}

     For multi data sources, you can also go to **Services**, then **Data Sources**, then **JDBC Multi Data Source Runtime MBeans** to review a multi data source and its associated sub data sources.

    {{< /alert >}}


2.  Select the data source for which you want to see statistics.


By default, this data source page will display all of the statistics that are available for the selected data source. To refine the information, customize the table to show only relevant statistics. See [Customize a Table](../../set-console/get-know-console#GUID-FF37D291-F8C5-4EFB-8A18-DADF035348C9).

### Target Data Sources {#GUID-D4E085B2-DD26-431B-B602-94F29C52BAE1}

When you target a JDBC data source, a new instance of the data source is created on the target. When you select a *server* as a target, an instance of the data source is created on the server. When you select a *cluster* as a target, an instance of the data source is created on *all* servers in the cluster.

Make sure that the JDBC drivers that you want to use to create database connections are installed on all servers on which you want to deploy the data source. See [Using JDBC Drivers with WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-2BAFE654-B10B-4A72-9D1C-A10FCCFBA458) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Services**, then **Data Sources**.

2.  Select the data source whose targets you want to edit.

3.  On the **Targets** tab, select each server or cluster where you want to deploy the data source and move them under **Chosen**. Move unwanted servers or clusters under **Available**.

4.  Click **Save**.


### Test JDBC Data Sources {#GUID-7E1C132C-FCD0-4A1F-9D0E-AFE849829C59}

You can manually test individual instances of a data source. When you test a data source, WebLogic Server reserves a connection from the data source, tests it using the standard testing query or the query specified in Test Table Name, and then returns the database connection to the pool of connections.

It is important to regularly check that the database connections in a data source remain healthy, which helps keep your applications running properly. See [Testing Data Sources and Database Connections](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-3E801058-5862-411B-BE83-319E101EE775) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

1.  **Optional**: Configure testing options for the JDBC data source.

    You may want to modify the default database connection testing options to better match the needs of your environment.

    1.  In the **Edit Tree**, go to **Services**, then **Data Sources**.

    2.  Select the data source whose connection testing options you want to edit.

    3.  Select the **Connection Pool** tab, then the **Advanced** subtab.

    4.  Modify the following options as necessary for your environment.

    5.  In the **Test Table Name** field, enter the name of a small table to use in a query to test database connections. The standard query is <code>select 1 from table_name</code>. If you prefer to use a different query as a connection test, enter <code>SQL</code> followed by a space and the SQL code you want to use to test database connections.

    6.  Enable the **Test Connections on Reserve** option to test the database connection before giving it to your application when your application requests a connection form the data source.

        The test adds a small delay in serving the client's request for a connection from the pool, but ensures that the client receives a viable connection.

    7.  In the **Test Frequency** field, specify how frequently \(in seconds\) WebLogic Server should perform background connection tests.

    8.  In the **Seconds to Trust an Idle Pool Connection** field, enter the interval \(in seconds\) during which, if the database connection has been used or tested, WebLogic Server will skip the connection test. This option can help reduce the overhead of connection testing and improve application performance.

    9.  Click **Save** and commit your changes.

2.  In the **Monitoring Tree**, go to **Environment**, then **Servers**, then choose the server where the data source you want to test is deployed.

3.  Go to **Services**, then **Data Sources**, then **JDBC Data Source Runtime MBeans**.

4.  Select the data source that you want to test.

5.  Click the **Test** tab.


The test will occur immediately. Test results are shown on the **Test** tab page.

### Specify RMI JDBC Security {#GUID-4349E9ED-33AE-43F3-A7FC-47017F5EC9BA}

You can secure RMI JDBC communication with a data source using a check for administrator authentication.

For more information about using JDBC over RMI, see [Using the WebLogic RMI Driver \(Deprecated\)](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDCBP-GUID-54294308-E996-46C4-82D2-0F1CE122956F) in **Developing JDBC Applications for Oracle WebLogic Server**.

1.  **Optional**: If you plan to choose the <code>Secure</code> option, you must first configure an SSL/TLS listen port channel. See [Specify Listen Ports](../domain-configuration#GUID-9084C04C-06CC-4E14-85B6-CFC755E7A428).

2.  In the **Edit Tree**, go to **Environment**, then **Servers**. Click **Show Advanced Fields**.

3.  Select an option from the **RMI JDBC Security** drop-down list:

    -   <code>Secure</code>: Rejects all incoming application JDBC calls over RMI by remote clients and servers. Internal interserver JDBC calls over RMI operations are allowed for the Logging Last Resource, Emulate Two-Phase Commit and One-Phase Commit Global Transactions Protocol options. The <code>Secure</code> option requires that all the servers are configured with an SSL listen port. If not, all operations fail with an exception.
    -   <code>Compatibility</code>: Allows uncontrolled access to DataSource objects for all incoming JDBC application calls over RMI. This setting should only be used when strong network security is in place.
    -   <code>Disabled</code>: Disables all JDBC calls over RMI, including the internal RMI operations for Logging Last Resource, Emulate Two-PhaseCommit and One-Phase Commit Global Transactions Protocol options.
    For more information, see [Security Considerations for WebLogic RMI Drivers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCP-GUID-F382C8BC-60E8-4E54-9662-3AC4D9DAAD6F) in **Developing JDBC Applications for Oracle WebLogic Server**.

    As of WebLogic Server 14.1.2.0.0, the default value for **RMI JDBC Security** is <code>Secure</code>.

4.  Click **Save**.


### Configure Global Transaction Options for a JDBC Data Source {#GUID-794B20F3-E748-4289-9918-BD362A42A69C}

The transaction protocol for a JDBC data source determines how connections from the data source are handled during transaction processing.

1.  In the **Edit Tree**, go to **Services**, then **Data Sources**.

2.  Select the data source whose targets you want to edit.

3.  On the **Transactions** tab, select an option for transaction processing from the **Global Transactions Protocol** drop-down list.

    To understand how transaction options differ, see [JDBC Data Source Transaction Options](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JDBCA-GUID-4C929E67-5FD7-477B-A749-1EA0F4FD25D4) in **Administering JDBC Data Sources for Oracle WebLogic Server**.

    {{< alert title="Note" color="primary" >}}

    

    If the data source uses an XA JDBC driver to create database connections, connections from the data source will support the two-phase commit transaction protocol only.

    {{< /alert >}}


4.  Click **Save**.


## Messaging {#GUID-C6298217-B758-4694-B409-BC29CD0D6CDB}

WebLogic Server provides an enterprise-class messaging system that fully supports the Java Messaging Service \(JMS\) specification and which also provides numerous extensions that go beyond the standard JMS APIs.

It is tightly integrated into the WebLogic Server platform, allowing you to build highly secure Jakarta EE applications that can be easily monitored and administered through WebLogic Remote Console. In addition to fully supporting XA transactions, WebLogic Server messaging also features high availability through its clustering and service migration features while also providing seamless interoperability with other versions of WebLogic Server and third-party messaging vendors.

WebLogic Server messaging is comprised of these areas:

-   **JMS Servers**: act as management containers for JMS queue and topic destinations in a JMS module that are targeted to them. A JMS server's primary responsibility for its destinations is to maintain information on which persistent store is used for any persistent messages that arrive on the destinations, and to maintain the states of durable subscribers created on the destinations.
-   **Store-and-Forward Agents**: provide a mechanism for reliably delivering messages between applications that are distributed across WebLogic Server subsystems, in particular the WebLogic JMS and Web Services subsystems. Using the highly available SAF service, an application can send messages to a remote endpoint that is not available at the moment when the messages are sent, either because of network problems or system failures.
-   **JMS System Modules**: contain global configuration JMS resources, such as queues, topics, templates, connections factories, and JMS store-and-forward \(SAF\) destinations, and are defined by XML documents that conform to the <code>weblogic-jmsmd.xsd</code> schema. JMS system modules are stored in <code>*DOMAIN\_HOME*/config/jms</code> and a reference to the module is added in the domain's configuration file as a <code>JMSSystemResource</code> element. System modules are globally available for targeting to servers and clusters configured in the domain, and therefore are available to all applications deployed on the same targets and to client applications.
-   **Messaging Bridges**: provide a forwarding mechanism between any two messaging products that support the JMS API. Use a messaging bridge to provide interoperability between separate implementations of WebLogic JMS, or between WebLogic JMS and another messaging product.

### Related Content {}

For more information, see:

-   [Understanding JMS Resource Configuration](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-AF9A1640-97EC-4498-8FEF-18E807192516) in **Administering JMS Resources for Oracle WebLogic Server**
-   [Understanding the Store-and-Forward Service](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SAFMG-GUID-9B338A45-8D69-42C0-B295-49C669E7C31C) in **Administering the Store-and-Forward Service for Oracle WebLogic Server**
-   [Understanding the Messaging Bridge](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=BRDGE-GUID-9A0D179A-65D6-4DC9-B187-20126B231835) in **Administering the WebLogic Messaging Bridge for Oracle WebLogic Server**
-   [The WebLogic Persistent Store](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=STORE-GUID-8A3CCC2F-B156-452D-A7AF-888F38676F35) in **Administering the WebLogic Persistent Store**

### Create a JMS Server {#GUID-683F7936-2E0B-410E-A54F-DC912E3FDF9A}

JMS servers are environment-related configuration entities that act as management containers for the queues and topics in JMS modules that are targeted to them.

The primary responsibility of a JMS server for its destinations is to maintain information on which persistent store is used for any persistent messages that arrive on the destinations, and to maintain the states of durable subscribers created on the destinations.

JMS servers also manage message paging on destinations, and optionally, can manage message and byte thresholds, as well as server-level quota for its targeted destinations. As a container for targeted destinations, any configuration or run-time changes to a JMS server can affect all the destinations that it hosts.

For more information, see [Overview of JMS Servers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-C6C50FD9-A67B-4B71-83EE-6BB012BFFFFF) and [Configure JMS Servers and Persistent Stores](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-67EA1C4F-D865-45EC-8581-AA145EAFB91D) in **Administering JMS Resources for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Services**, then **JMS Servers**.

2.  Click **New**.

3.  Enter a name for the new JMS Server and click **Create**.

4.  From the **Persistent Store** drop-down list, choose the store where this JMS server should store its persistent messages.

    If you want to use the default persistent store provided by WebLogic Server, leave **Persistent Store** set to None.

    If you don't have a custom persistent store configured yet, click the **More ︙** button beside **Persistent Store** and then select either **New File Store** or **New JDBC Stores**. Then, follow the instructions at [Create a File Store](#GUID-83543D4D-C767-4258-A236-0E79A1997DBF) or [Create a JDBC Store](#GUID-68E358EF-6C72-4992-98E6-D95BC6429991). Select the newly created store from the **Persistent Store** drop-down list.

    {{< alert title="Note" color="primary" >}}

    

    When a JMS server is targeted to a:

    -   Migratable target, it cannot use the default store. A custom store must be configured and targeted to the same migratable target.

    -   Dynamic cluster, it requires a custom persistent store that must target the same dynamic cluster or use the default store available on each dynamic cluster member.

        Use a custom store with **Distribution Policy** set to <code>Singleton</code> to host stand-alone \(non-distributed\) destinations.

        Use a custom store with **Distribution Policy** set to <code>Distributed</code> to host distributed destinations.

    {{< /alert >}}


5.  Configure any additional JMS server attributes. Remember to click **Show Advanced Fields** to see all of the options.

6.  Click **Save**.

7.  On the **Target** tab, from the **Target** drop-down list, select the server instance, cluster, or migratable target where you want to deploy the JMS server.

    You can target a JMS server to a standalone WebLogic Server instance, a cluster, or a migratable target server. Migratable targets define a set of WebLogic Server instances in a cluster that can potentially host a pinned service, such as a JMS server.

    If you are using a JMS server in a clustered server environment, review the guidance provided at [Configure JMS Servers and Persistent Stores](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-67EA1C4F-D865-45EC-8581-AA145EAFB91D) in **Administering JMS Resources for Oracle WebLogic Server**.

8.  Click **Save**.


#### Monitor a JMS Server {#GUID-C80FAB30-FC4A-4D6A-971C-66AAD13DC387}

You can monitor runtime statistics for an active JMS server. You can also access runtime information for a JMS server's destinations, transactions, connections, and server session pools.

For more information, see [Monitoring JMS Statistics and Managing Messages](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-9EDF1C1F-7E22-463D-8B51-F05551E61876) in **Administering JMS Resources for Oracle WebLogic Server**.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers** and choose the server where the JMS server is deployed. Then proceed to **Services**, then **Messaging**, then **JMS Runtime**, then **JMS Servers**.

    If you want to compare all of the JMS servers in the domain, instead go to **Services**, then **Messaging**, then **JMS Runtime**, then **JMS Servers**.

2.  Select the JMS server whose runtime information you want to view.


### Create a JMS System Module {#GUID-ABB99866-324C-4179-A91C-A97B6D63EC6E}

JMS resources are configured and stored as modules similar to standard Jakarta EE modules. Such resources include queues, topics, connection factories, templates, destination keys, quota, distributed queues, distributed topics, foreign servers, and JMS store-and-forward \(SAF\) parameters.

System modules are globally available for targeting to servers and clusters configured in the domain, and therefore are available to all applications deployed on the same targets and to client applications.

JMS configuration resources can also be managed as deployable application modules, either with a Jakarta EE application as a packaged module, which is available only to the enclosing application, or as a stand-alone module that provides global access to the resources defined in that module.

For more information, see [Overview of JMS Modules](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-47659F77-3B92-44E1-9A2E-EABD2F6FFB8F) in **Administering JMS Resources for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Services**, then **JMS Modules**.

2.  Click **New**.

3.  Enter a name for the new JMS system module and click **Create**.

4.  On the **Target** tab, from the **Target** drop-down list, select a server instance or cluster on which to deploy the JMS system module.

5.  Click **Save**.

    A new node will appear under **JMS Modules** in the Navigation Tree for your JMS system module.

6.  Expand the new node for your JMS system module to see its children which are the JMS system resources that you can configure. See [Configure Resources for JMS System Modules](#GUID-723C3B6E-6C57-48E7-B265-C4FF90D270A6).


#### Configure Resources for JMS System Modules {#GUID-723C3B6E-6C57-48E7-B265-C4FF90D270A6}

After creating a JMS system module, you can configure resources for the module, including stand-alone queues and topics, distributed queues and topics, connection factories, JMS templates, destination sort keys, destination quota, foreign servers, and JMS SAF \(store-and-forward\) parameters.

For more information, see [Configurable JMS Resources in Modules](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-CE1554CE-A641-445F-8214-7327F472268D) in **Administering JMS Resources for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Services**, then **JMS Modules**.

2.  Select the JMS system module that you want to configure resources for.

3.  In the Navigation Tree, as child nodes of JMS system module that you selected, click the resource that you want to configure.

    The following JMS system resources are available:

    -   **Quota** - controls the allotment of system resources available to destinations.
    -   **Template** - provides an efficient means of defining multiple queues and topics with similar configuration settings.
    -   **Destination Key** - defines a sort order for the messages as they arrive on destinations.
    -   **Topic** - defines a publish/subscribe \(pub/sub\) destination, which enables an application to send a message to multiple applications.
    -   **Queue** - defines a point-to-point \(PTP\) destination, which enables one application to send a message to another.
    -   **Connection Factory** - defines a set of connection configuration parameters that enable JMS clients to create JMS connections.
    -   **Distributed Topic** - a single unit of JMS topics that are accessible as a single, logical topic to a client. The members of the distributed topic are usually distributed across multiple servers within a cluster, with each topic member belonging to a separate JMS server.
    -   **Distributed Queue** - a single unit of JMS queues that are accessible as a single, logical topic to a client. The members of the distributed queue are usually distributed across multiple servers within a cluster, with each topic member belonging to a separate JMS server.
    -   **Foreign Server** - represents a third-party JMS provider that is outside WebLogic Server. It contains information that allows a local server instance to reach a remote JNDI provider, thereby allowing for a number of foreign connection factory and destination objects to be defined on one JNDI directory.
    -   **SAF Imported Destination** - defines a collection of imported SAF \(store-and-forward\) queues or topics that represent JMS destinations in a remote server instance or cluster.
    -   **Remote SAF Context** - specifies SAF login context that a SAF imported queue or topic uses to connect to a remote destination.
    -   **SAF Error Handling** - specifies the action to be taken when the SAF service fails to forward messages to a remote destination.
    For guidance on how to configure JMS modules, see [Configuring Basic JMS System Resources](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-BD6C5EE3-3796-49F7-BE43-838BC00C3710) in **Administering JMS Resources for Oracle WebLogic Server**.

4.  Enter any required information for the selected resource.

    Certain resources may encourage you to configure an appropriate subdeployment. A subdeployment is the mechanism by which targetable JMS module resources \(such as queues, topics, and connection factories\) are grouped and targeted to a server resource \(such as JMS servers, server instances, or cluster\).

    Most JMS resources have additional parameters that can be modified after they are created. For example, you can modify the default message threshold values or enable message logging for queues, topics, and templates.

5.  Click **Create**.


### Create a Store-and-Forward Agent {#GUID-B23D418A-C1D8-4AE3-BB35-8186409E4515}

The Store-and-Forward \(SAF\) service enables WebLogic Server to deliver messages reliably between applications that are distributed across WebLogic Server instances.

If the destination is not available at the moment the messages are sent, either because of network problems or system failures, then the messages are saved on a local server instance, and are forwarded to the remote destination once it becomes available.

SAF agents are responsible for store-and-forwarding messages between local sending and remote receiving endpoints. A SAF agent can be configured to have only sending capabilities, receiving capabilities, or both. JMS SAF only requires a sending agent on the sending side for JMS messages. Web Services Reliable Messaging \(WSRM\) SAF requires both a sending agent and a receiving agent.

For more information, see [SAF Service Agents](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SAFMG-GUID-CD387C08-E7F6-4657-A50E-81BFCD73121B) in **Administering the Store-and-Forward Service for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Services**, then **SAF Agents**.

2.  Click **New**.

3.  Enter a name for the new SAF agent and click **Create**.

4.  From the **Persistent Store** drop-down list, choose the store where this SAF agent will store its persistent messages.

    If you want to use the default persistent store provided by WebLogic Server, leave **Persistent Store** set to <code>None</code>.

    If you don't have a custom persistent store configured yet, click the **More ︙** button beside **Persistent Store** and then either **New File Store** or **New JDBC Stores**. Then, follow the instructions at [Create a File Store](#GUID-83543D4D-C767-4258-A236-0E79A1997DBF) or [Create a JDBC Store](#GUID-68E358EF-6C72-4992-98E6-D95BC6429991).

    -   When a SAF agent is targeted to a cluster, a SAF Agent must use a custom store with **Distribution Policy** set to <code>Distributed</code> and is targeted to the same cluster.

    -   A SAF Agent can use a default store only when targeting a configured \(non-dynamic\) cluster.

    -   When a SAF agent is targeted to a migratable target, a custom store must be configured and targeted to the same migratable target.

5.  From the **Agent Type** drop-down list, choose one of the following options:

    -   **Both**: Configures an agent that has sending and receiving agent functionality.
    -   **Sending-only**: Configures an agent that stores messages in persistent storage, forwards messages to the receiving side, and re-transmits messages when acknowledgments do not come back in time.
    -   **Receiving-only**: Configures an agent that detects and eliminates duplicate messages sent by a receiving agent, and delivers messages to the final destination.
    JMS SAF users should select **Sending-only** as JMS SAF doesn't require a configured receiving agent.

6.  Configure any additional SAF agent attributes. Remember to click **Show Advanced Fields** to see all of the options.

7.  Click **Save**.

8.  On the **Target** tab, from the **Target** drop-down list, select the server instance, cluster, or migratable target where you want to deploy the SAF agent.

    When targeting a cluster, a SAF Agent must use a custom store with **Distribution Policy** set to <code>Distributed</code> and is targeted to the same cluster.

    If a SAF agent is targeted to a migratable target, it cannot be targeted to any other server targets, including an entire cluster.

9.  Click **Save**.


#### Monitor an SAF Agent {#GUID-764DFBA8-84C8-4525-BB64-1442867DC305}

You can view runtime information for an active SAF agent .

For more information, see [Monitoring SAF Agents](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SAFMG-GUID-784A6221-F49E-4568-9235-74057CC28EF7) in **Administering the Store-and-Forward Service for Oracle WebLogic Server**.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers** and choose the server where the SAF agent is deployed. Then proceed to **Services**, then **Messaging**, then **SAF Runtime**, then **Agents**.

    If you want to see all of the SAF agents in the domain, instead go to **Services**, then **Messaging**, then **SAF Runtime**, then **Agents**.

2.  Select the SAF agent whose runtime information you want to view.


### Create a JMS Bridge Destination {#GUID-59A12FFE-D6D3-450E-BD53-765042E075CE}

A JMS bridge destination instance defines the actual source and target JMS bridge destinations for a bridge instance.

You need to configure a JMS bridge destination instance for each source *and* each target destination to be mapped to a messaging bridge instance. Therefore, when you finish defining attributes for a source JMS bridge destination, repeat these steps to configure a target JMS bridge destination.

1.  In the **Edit Tree**, go to **Services**, then **JMS Bridge Destinations**.

2.  Click **New**.

3.  Enter a name for the new JMS bridge destination and click **Create**.

4.  In the **Adapter JNDI Name** field, specify the JNDI name of the adapter used to communicate with the bridge destinations.

    For more information on which adapter name to enter, see [Resource Adapters](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=BRDGE-GUID-7FEDDF6F-A118-4413-B728-8BCF01E8D788) in **Administering the WebLogic Messaging Bridge for Oracle WebLogic Server**.

5.  In the **Connection URL** field, specify the connection URL for this JMS bridge destination.

6.  In the **Connection Factory JNDI Name** field, specify the connection factory's JNDI name for this JMS bridge destination.

7.  In the **Destination JNDI Name** field, specify the destination JNDI name for this JMS bridge destination.

8.  Configure any additional attributes that are applicable to your environment.

9.  Click **Save**.

10. Repeat these steps to create a matching JMS bridge destination.

    If you first created a *source* JMS bridge destination, then now you should create a *target* destination.

    If you first created a *target* JMS bridge destination, then now you should create a *source* destination.


### Create a Messaging Bridge Instance {#GUID-B94D0913-AB5D-48A4-80D1-89A30CADE00D}

The WebLogic messaging bridge allows you to configure a forwarding mechanism between any two messaging products. You can use the messaging bridge to integrate your messaging applications. A messaging bridge instance communicates with the configured source and target bridge destinations.

For each mapping of a source destination to a target destination, whether it is another WebLogic JMS implementation, or a third-party JMS provider, you must configure a messaging bridge instance.

Each instance defines the source and target destination for the mapping, a message filtering selector, a quality of service \(QOS\), transaction semantics, and reconnection parameters.

For more information, see [Understanding the Messaging Bridge](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=BRDGE-GUID-9A0D179A-65D6-4DC9-B187-20126B231835) in **Administering the WebLogic Messaging Bridge for Oracle WebLogic Server**.

1.  If you haven't already, create and configure source and target JMS bridge destinations as described in [Create a JMS Bridge Destination](#GUID-59A12FFE-D6D3-450E-BD53-765042E075CE).

2.  In the **Edit Tree**, go to **Services**, then **Messaging Bridge**.

3.  Click **New**.

4.  Enter a name for the new messaging bridge instance and click **Create**.

5.  From the **Source Bridge Destination** drop-down list, select a source destination.

6.  From the **Target Bridge Destination** drop-down list, select a target destination.

7.  Configure any additional attributes that are applicable to your environment.

8.  Click **Save**.


If you plan to use the messaging bridge to access destinations on different releases of WebLogic Server, or in remote WebLogic domains, then you may need to manually implement some of the interoperability guidelines described at [Interoperating with Different WebLogic Server Releases or Foreign Providers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=BRDGE-GUID-C8BD733C-1607-487B-94D7-3735FC67FF0F) in **Administering the WebLogic Messaging Bridge for Oracle WebLogic Server**.

### Create a File Store {#GUID-83543D4D-C767-4258-A236-0E79A1997DBF}

A file store is a file-based repository for storing subsystem data, such as persistent JMS messages or durable subscriber information.

A persistent store provides a built-in, high-performance storage solution for WebLogic Server subsystems and services that require persistence. For example, it can store persistent JMS messages or durable subscriber information, as well as temporarily store messages sent to an unavailable destination using the store-and-forward feature.

The persistent store also supports persistence to a JDBC-enabled database \(JDBC store\). See [Create a JDBC Store](#GUID-68E358EF-6C72-4992-98E6-D95BC6429991) instead.

1.  Create a directory on your file system for the file store.

    The directory must be accessible from all candidate server members. For highest reliability, use a shared storage solution that is itself highly available. For example, a storage area network \(SAN\) or a dual-ported SCSI disk.

2.  In the **Edit Tree**, go to **Services**, then **File Stores**.

3.  Click **New**.

4.  Enter a name for the new File Store and click **Create**.

5.  In the **Directory** field, enter the path to the directory on the file system where the file store is kept.

6.  Modify any additional settings that are applicable to your environment.

7.  Click **Save**.

8.  On the **Target** tab, from the **Target** drop-down list, select a server instance, dynamic cluster, or migratable target on which to deploy the file store.

    When selecting a dynamic cluster, the store must be targeted to the same dynamic cluster as the JMS server.

    When selecting a migratable target, the store must share the same migratable target as the migratable JMS server or SAF agent.

9.  Click **Save**.


### Create a JDBC Store {#GUID-68E358EF-6C72-4992-98E6-D95BC6429991}

A JDBC store is a JDBC-accessible database for storing subsystem data, such as persistent JMS messages and durable subscriber information.

A persistent store provides a built-in, high-performance storage solution for WebLogic Server subsystems and services that require persistence. For example, it can store persistent JMS messages or durable subscriber information, as well as temporarily store messages sent to an unavailable destination using the store-and-forward feature.

The persistent store also supports persistence to a file-based store \(file store\). See [Create a File Store](#GUID-83543D4D-C767-4258-A236-0E79A1997DBF) instead.

1.  If you haven't already, create a JDBC data source. See [Data Sources](#GUID-D92E5FE4-548C-49E1-9A77-A61A59039D21).

    A JDBC store must use a JDBC data source that uses a non-XA JDBC driver and has **Supports Global Transactions** disabled. This limitation does not remove the XA capabilities of layered subsystems that use JDBC stores. For example, WebLogic JMS is fully XA-capable regardless of whether it uses a file store or any JDBC store.

    Make sure the data source is accessible to all candidate servers.

2.  In the **Edit Tree**, go to **Services**, then **JDBC Stores**.

3.  Click **New**.

4.  Enter a name for the new JDBC store.

5.  In the **Prefix Name** field, specify a prefix name to add to the start of the table name in this JDBC store for use with multiple instances.

6.  From the **Data Source** drop-down list, select a data source.

7.  From the **Target** drop-down list, select a server instance, dynamic cluster, or migratable target on which to deploy the file store.

    When selecting a dynamic cluster, the store must be targeted to the same dynamic cluster as the JMS server. When selecting a migratable target, the store must share the same migratable target as the migratable JMS server or SAF agent.

8.  Modify the rest of the settings as needed.

9.  Click **Save**.


### Create a Path Service {#GUID-0ED6000C-D3C2-49C7-AAE8-F6D4F69A5E5A}

A path service is persistent map that can be used to store the mapping of a group of messages to a messaging resource, such as a member of a distributed destination or a store-and-forward agent.

Path services provide a way to enforce message ordering by pinning messages to a member of a cluster hosting servlets, distributed queue members, or store-and-forward agents.

For more information, see [Using the WebLogic Path Service](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-AEA435AE-A60F-4E0A-9494-F13215280AFB) in **Administering JMS Resources for Oracle WebLogic Server**.

1.  If you haven't already, create and configure at least one for each of the following: a cluster, a custom persistent store, and a store-and-forward \(SAF\) agent. You may also want to configure JMS system modules.

    See:

    -   [Configure Clusters](../domain-configuration#GUID-A7753EF9-756C-4F2D-9E70-495979B7EEE3)

    -   [Create a File Store](#GUID-83543D4D-C767-4258-A236-0E79A1997DBF) or [Create a JDBC Store](#GUID-68E358EF-6C72-4992-98E6-D95BC6429991)

    -   [Create a Store-and-Forward Agent](#GUID-B23D418A-C1D8-4AE3-BB35-8186409E4515)

    -   [Create a JMS System Module](#GUID-ABB99866-324C-4179-A91C-A97B6D63EC6E)

2.  In the **Edit Tree**, go to **Services**, then **Path Services**.

3.  Click **New**.

4.  Enter a name for the new Path Service and click **Create**.

5.  From the **Persistent Store** drop-down list, choose the store where this path service will store its persistent messages.

    {{< alert title="Note" color="primary" >}}

    

    If you plan to target the path service to a migratable target, then it must use a custom store. If you plan to target the path service to a cluster, then you must specify a custom store with the same target, a **Migration Policy** set to <code>Always</code>, and a **Distribution Policy** set to <code>Singleton</code>.

    {{< /alert >}}


    If you want to use the default persistent store provided by WebLogic Server, leave **Persistent Store** set to <code>None</code>. However, it is recommended that you use a custom store instead of the default store.

6.  Click **Save**.

7.  On the **Target** tab, from the **Target** drop-down list, select the cluster, cluster member or migratable target where you want to deploy the path service.

8.  Click **Save**.


### Manage JMS Messages {#GUID-880A8C55-1B01-4407-8611-05158114E557}

You can manage JMS messages that are available on the standalone queue, distributed queue, or durable topic subscriber that you are monitoring.

{{< alert title="Note" color="primary" >}}



This functionality is only available on domains running WebLogic Server 14.1.2.0.0 or later. If you want to manage JMS messages for an older release, you must use an alternative administration tool.

{{< /alert >}}


1.  In the **Monitoring Tree**, go to **Environment**, then **Servers** and select the server hosting the messages that you want to move.
2.  Under the selected server, go to **Services**, then **Messaging**, then **JMS Runtime**, then **JMS Servers**, then *myJMSServer*, then **Destinations** and select the JMS destination that currently hosts the messages that you want to move.
3.  On the **Messages** tab, select all of the messages on which you want to perform the action and then click the action's button. See [Table 2](#TABLE_ZTB_MFF_N2C).

<table id="TABLE_ZTB_MFF_N2C"><thead><tr><th>

Action

</th><th>

Description

</th></tr></thead><tbody><tr><td>

**Delete**

</td><td>

Deletes the selected JMS messages from the current queue.

See [Deleting Messages](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-A33AE053-4EC2-43F2-82C3-808E68A50400) in **Administering JMS Resources for Oracle WebLogic Server**.

</td></tr><tr><td>

**Export**

</td><td>

Exports the selected messages from the current queue, which results in a JMS message that is converted to either XML or serialized format.

See [Exporting Messages](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-E7BB7D5E-933F-474D-94EC-CC50777B0BB3) in **Administering JMS Resources for Oracle WebLogic Server**.

</td></tr><tr><td>

**Import**

</td><td>

Imports the selected messages in XML format, which results in the creation or replacement of a message on the current queue.

See [Importing Messages](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-D55047DD-0C4F-426D-ABDD-BD4C6C61A242) in **Administering JMS Resources for Oracle WebLogic Server**.

</td></tr><tr><td>

**Move**

</td><td>

Transfers selected JMS messages from the current queue to another destination, including a destination on a different JMS server.

The message identifier does not change when you move a message. If the message being moved already exists on the target destination, a duplicate message with the same identifier is added to the destination.

See [Moving Messages](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JMSAD-GUID-929C8361-21D1-40C8-B4F1-400616DCCF24) in **Administering JMS Resources for Oracle WebLogic Server**.

</td></tr><tr><td>

**View**

</td><td>

Displays the contents of a JMS message.

**Note**: For larger messages, you will need to export the message to a file to view its full contents. WebLogic Remote Console will indicate when a message has been truncated.

-   If a message is less than 10,000 characters, WebLogic Remote Console will show the entire message body.

-   If a message is between 10,000 - 200,000 characters, WebLogic Remote Console will show the first 10,000 characters of the message.

-   If a message is more than 200,000 characters, WebLogic Remote Console will not show *any* of the message body.


</td></tr></tbody>
</table>

Table 2. JMS Message Actions. Actions that you can perform on JMS messages.

## View Objects in the JNDI Table {#GUID-780192AC-812D-48E6-ABC7-162C5A39D227}

You can use WebLogic Remote Console to view objects in the Java Naming and Directory Interface \(JNDI\) table.

WebLogic Server implements the JNDI of the Jakarta EE platform as a means to provide a standard, unified interface to multiple naming and directory services in an enterprise. See [Understanding WebLogic JNDI](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WJNDI-GUID-DED922F8-6F8F-41C3-96DF-3D64B01250CC) in **Developing JNDI Applications for Oracle WebLogic Server**.

You can load WebLogic Server Jakarta EE services and components, such as RMI, JMS, EJBs, and JDBC Data Sources, in the JNDI table. Typically, these objects are bound in the JNDI table when you configure their **JNDI Name** attribute and deploy them to the server.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  Click the **JNDI** tab to see the JNDI objects.

    {{< alert title="Note" color="primary" >}}

     The JNDI tab is only visible on servers that are running and reachable by the Administration Server.

    {{< /alert >}}



## Create a Foreign JNDI Provider {#GUID-2D09676D-DF7B-4239-B08C-C31E4477B3CB}

A foreign JNDI provider represents a JNDI tree that resides outside of a WebLogic Server environment. This could be a JNDI tree in a different server environment or within an external Java program.

By setting up a foreign JNDI provider, you can look up and use a remote object with the same ease as using an object bound in your WebLogic Server instance. In other words, you can access local and remote objects using a single WebLogic Server connection.

1.  In the **Edit Tree**, go to **Services**, then **Foreign JNDI Providers**.

2.  Click **New**.

3.  Enter a name for the new Foreign JNDI provider and click **Create**.

4.  In the **Initial Context Factory** field, enter the name of the class that must be instantiated to access the JNDI provider. This class name depends on the JNDI provider and the vendor that are being used. The value corresponds to the standard JNDI property, <code>java.naming.factory.initial</code>.

5.  In the **Provider URL** field, enter the URL that WebLogic Server will use to contact the JNDI provider. This value corresponds to the standard JNDI property, <code>java.naming.provider.url</code>.

6.  In the **User** field, enter the name of a user authorized to access the foreign JNDI, then in **Password**, enter the user account's password.

7.  Click the **Targets** tab and select the servers or clusters where you want to deploy this foreign JNDI provider.

8.  **Optional**: If you want to specify additional properties for the JNDI provider, click the **Properties** tab.

    These properties will be passed directly to the constructor for the JNDI provider's <code>InitialContext</code> class.

    1.  In the **Properties** table, click **+** to add a new row.

    2.  Double-click the cell under **Properties Name** and enter a name for the property.

    3.  Double-click the cell under **Properties Value** and enter a value for the property.

    4.  Click **Save**.

9.  Next, you should create foreign JNDI object links which set up a relationship between a name in your local JNDI table and the object in the foreign \(remote\) table.
10. Expand the node in the Navigation Tree for the Foreign JNDI Provider you created and open the **Foreign JNDI Links** child node.

11. Click **New**.

12. Enter a name for the foreign JNDI link.

13. In the **Local JNDI Name** field, specify the name that the remote JNDI object will be bound to in the local server's JNDI tree and used to look up the object on the local server.

14. In the **Remote JNDI Name** field, specify the name of the remote object that will be looked up in the foreign JNDI directory.

15. Click **Create**.


## XML Resources {#GUID-F516A8C2-629B-4660-B597-310A4F194C34}

You can configure two different types of XML resources for WebLogic Server.

-   XML registries, which you can use to specify alternative server-wide XML parsers and transformers for WebLogic Server to use when it parses and transforms XML documents. You can also use the XML registry to specify local copies of external entities and caching instructions for these entities. See [Create an XML registry](#GUID-1C568EDE-9E40-4D32-B677-109974FE574F).
-   XML entity caches, which you can use to configure the cache that WebLogic Server uses to cache external entities. See [Create an XML Entity Cache](#GUID-E1012B5E-38F5-498D-86F7-309D4904B602).

You can create as many XML registries and entity caches as you like. However, you can only associate one of each type with a particular server instance of WebLogic Server.

For more information on how XML resources are used in WebLogic Server, see [**Developing XML Applications for Oracle WebLogic Server**](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=XMLPG-GUID-27BB3783-6FBB-4DA5-8F5C-1F8902ABB74F).

### Create an XML registry {#GUID-1C568EDE-9E40-4D32-B677-109974FE574F}

An XML Registry is a facility for configuring and administering the XML resources of WebLogic Server. XML resources include the default parser, transformer factories, and external entity resolution.

In particular, use an XML registry to specify:

-   An alternative, server-wide XML parser, used by default when parsing XML documents, instead of the parser that is installed by default. You do this by specifying the names of the classes that implement the <code>javax.xml.parsers.DocumentBuilderFactory</code> and <code>javax.xml.parsers.SaxParserFactory</code> interfaces; these implementing classes are used to parse XML in DOM and SAX mode, respectively.
-   A specific XML parser that should be used to parse a particular document type.
-   An alternative server-wide transformer instead of the default transformer. You do this by specifying the name of the class that implements the <code>javax.xml.transform.TransformerFactory</code> interface, used to transform XML documents.
-   External entities that are to be resolved by using local copies of the entities. After you specify these entities, the Administration Server stores local copies of them in the file system and automatically distributes them to the server’s parser at parse time. This feature eliminates the need to construct and set SAX EntityResolvers.
-   External entities to be cached by WebLogic Server after retrieval from the Web. Specify how long these external entities should be cached before WebLogic Server re-retrieves them and when WebLogic should first retrieve the entities, either at application run time or when WebLogic Server starts.

You can create as many XML Registries as you like; however, you can associate only *one* XML registry with a particular instance of WebLogic Server.

If an instance of WebLogic Server does not have an XML registry associated with it, then the default parser and transformer are used when parsing or transforming documents. The default parser and transformer are those included in the JDK.

Once you associate an XML registry with an instance of WebLogic Server, all its configuration options are available for XML applications that use that server.

1.  In the **Edit Tree**, go to **Services**, then **XML Registries**.

2.  Click **New**.

3.  Enter a name for the XML registry and click **Create**.

4.  **Optional**: If you don't plan to use the default parser and transformer, you must specify your alternative settings.

    1.  In the **Document Builder Factory** field, enter the fully qualified name of the class that implements the <code>javax.xml.parsers.DocumentBuilderFactory</code> interface.

    2.  In the **SAX Parser Factory** field, enter the fully qualified name of the class that implements the <code>javax.xml.parsers.SaxParserFactory</code> interface.

    3.  In the **Transformer Factory** field, enter the fully qualified name of the class that implements the <code>javax.xml.transform.TransformerFactory</code> interface.

    4.  Click **Save**.


Next, you must associate the XML registry with a WebLogic Server instance. See [Target an XML Registry to a Server](#GUID-A9DF992A-74D4-4746-BDE9-79ACCCF7D2B9).

### Target an XML Registry to a Server {#GUID-A9DF992A-74D4-4746-BDE9-79ACCCF7D2B9}

A WebLogic Server can only have one XML registry associated with it. However, you can target the same XML registry to multiple WebLogic Server instances.

1.  If you haven't done so already, create an XML registry. See [Create an XML registry](#GUID-1C568EDE-9E40-4D32-B677-109974FE574F).

2.  In the **Edit Tree**, go to **Environment**, then **Servers**.

3.  Choose the server to which you want the XML registry.

4.  Enable **Show Advanced Fields** and then from the **XML Registry** drop-down list, select the XML registry that you want to target to this server.

5.  Click **Save**.


### Create an XML Entity Cache {#GUID-E1012B5E-38F5-498D-86F7-309D4904B602}

You can specify that WebLogic Server should cache external entities that are referenced with a URL or a pathname relative to the main directory of the EAR archive, either at server startup or when the entity is first referenced. You specify this by first creating an XML entity cache and then specifying when it should be cached for the particular entity.

Caching the external entity saves the remote access time and provides a local backup in the event that the Administration Server cannot be accessed while an XML document is being parsed, due to the network or the Administration Server being down.

1.  In the **Edit Tree**, go to **Services**, then **XML Entity Caches**.

2.  Click **New**.

3.  Enter a name for the XML entity cache and click **Create**.

4.  Update the configuration options for the new XML entity cache as needed.

5.  Click **Save**.


Next, you must associate the XML entity cache with a WebLogic Server instance. See [Target an XML Entity Cache to a Server](#GUID-0A422838-CDA6-4845-BA69-FED12DB72E6E).

### Target an XML Entity Cache to a Server {#GUID-0A422838-CDA6-4845-BA69-FED12DB72E6E}

A WebLogic Server instance can only have one XML entity cache associated with it.

1.  If you haven't already done so, create an XML entity cache. See [Create an XML Entity Cache](#GUID-E1012B5E-38F5-498D-86F7-309D4904B602).

2.  In the **Edit Tree**, go to **Environment**, then **Servers**.

3.  Choose the server to which you want the XML entity cache.

4.  Enable **Show Advanced Fields** and then from the **XML Entity Cache** drop-down list, select the XML entity cache that you want to target to this server.

5.  Click **Save**.


## Configure Access to Jakarta Mail {#GUID-FACD70A2-6CEF-40A0-9A71-DBC51EF8A869}

You can configure a mail server or establish user credentials for an existing mail server. Mail sessions and the Jakarta Mail API do not provide mail server functions. They merely enable applications to send and receive data from an existing mail server.

Jakarta Mail APIs provide applications and other Jakarta EE modules with access to Internet Message Access Protocol \(IMAP\) and Simple Mail Transfer Protocol \(SMTP\) capable mail servers on your network or the internet.

In the reference implementation of Jakarta Mail, applications must instantiate <code>jakarta.mail.Session</code> objects, which designate mail hosts, transport and store protocols, and a default mail user for connecting to a mail server. You can use WebLogic Remote Console to create a mail session, which configures a <code>jakarta.mail.Session</code> object and registers it in the WebLogic Server JNDI table. Applications access the mail session through JNDI instead of instantiating their own <code>jakarta.mail.Session</code> object.

1.  In the **Edit Tree**, go to **Services**, then **Mail Sessions**.

2.  Click **New**.

3.  Enter a **Name** and a **JNDI Name** for the mail session.

    Applications use the JNDI Name to look up the mail session. For example, if you enter <code>myMailSession</code> as the JNDI name, applications perform the following look up:

    ```
    InitialContext ic = new InitialContext();
    Session session = (Session) ic.lookup("myMailSession");
    ```

4.  Click **Create**.

5.  In the **Session Username** field, specify the user account to use to create an authenticated Jakarta Mail session. Then, in the **Session Password** field, enter the password for the user account.

    If you do not specify a user account, it is assumed the session is not to be authenticated.

6.  On the **Targets** tab, move the servers or clusters that you want this mail session to target over to **Chosen**.

    The mail session is only registered in the JNDI table for the targeted WebLogic Server instances.

    When you target all or part of a cluster, WebLogic Remote Console initiates a two-phase deployment. In general, such a deployment ensures that if the deployment fails for one active server, it fails for all active servers.

7.  Click **Save**.

8.  **Optional**: You can specify additional properties for connecting to an existing mail server.

    {{< alert title="Note" color="primary" >}}

    

    Only specify a property if you want to override the default value. If you do not specify any properties, the mail session will use the Jakarta Mail default property values.

    {{< /alert >}}


    1.  On the **Java Mail Properties** tab, in the **Java Mail Properties** table, click **+** to add a new row.

    2.  Double-click the cell under **Properties Name** and enter a name for the property.

    3.  Double-click the cell under **Properties Value** and enter a value for the property.

    4.  Click **Save**.

    [Table 3](#TABLE_H4B_RWG_QBC) describes the valid properties and default values, derived from the Jakarta Mail API Design Specification.

<table id="TABLE_H4B_RWG_QBC"><thead><tr><th>

Property

</th><th>

Description

</th><th>

Default

</th></tr></thead><tbody><tr><td>

<code>mail.store.protocol</code>

</td><td>

Protocol for retrieving email. For example, <code>mail.store.protocol=imap</code>.

</td><td>

<code>imap</code>

</td></tr><tr><td>

<code>mail.transport.protocol</code>

</td><td>

Protocol for sending email. For example, <code>mail.transport.protocol=smtp</code>

</td><td>

<code>smtp</code>

</td></tr><tr><td>

<code>mail.host</code>

</td><td>

The name of the mail host machine. For example, <code>mail.host=mailserver</code>.

</td><td>

Local machine

</td></tr><tr><td>

<code>mail.user</code>

</td><td>

Name of the default user for retrieving email. For example, <code>mail.user=postmaster</code>.

</td><td>

Value of the <code>user.name</code> Java system property.

</td></tr><tr><td>

<code>mail.protocol.host</code>

</td><td>

The mail host for a specific protocol. You can set <code>mail.SMTP.host</code> and <code>mail.IMAP.host</code> to different machine names. For example, <code>mail.smtp.host=mail.mydom.com mail.imap.host=localhost</code>

</td><td>

Value of the <code>mail.host</code> property.

</td></tr><tr><td>

<code>mail.protocol.user</code>

</td><td>

Protocol-specific default user name for logging into a mailer server. For example, <code>mail.smtp.user=weblogic mail.imap.user=appuser</code>.

</td><td>

Value of the <code>mail.user</code> property.

</td></tr><tr><td>

<code>mail.protocol.user</code>

</td><td>

The default return address. For example, <code>mail.from=master@mydom.com</code>

</td><td>

<code>username@host</code>

</td></tr><tr><td>

<code>mail.debug</code>

</td><td>

Set to <code>True</code> to enable Jakarta Mail debug output.

</td><td>

<code>False</code>

</td></tr></tbody>
</table>

Table 3. Java Mail Properties. The valid properties and default values, derived from the Jakarta Mail API Design Specification.{{< alert title="Note" color="primary" >}}

    

    Applications can override any properties set in the mail session by creating a <code>Properties</code> object containing the properties you want to override. See [Programming JavaMail with WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLPRG-GUID-A4FEDEB5-D57D-4BC5-95F6-C78C754AC07E) in **Developing Applications for Oracle WebLogic Server**.

    {{< /alert >}}



## Configure Domain JTA Options {#GUID-AB51E3F2-F216-40B3-A5C9-F76A11428CA5}

In WebLogic Server, you can set many options that affect transaction processing at the domain level so that they apply to all servers in the domain.

1.  In the **Edit Tree**, go to **Services**, then **JTA**.

2.  Specify new values for any or all of the available options. Click **Show Advanced Fields** to show all of the options.

3.  Click **Save**.


### View Transaction Statistics {#GUID-B08A882B-F309-4E98-824D-E900606B0C0F}

You can monitor transactions and transaction statistics.

For more information, see [Monitoring Transactions](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLJTA-GUID-E658251F-59E6-4537-9879-5BB4FEBF913A) in **Developing JTA Applications for Oracle WebLogic Server**.

1.  In the **Monitoring Tree**, go to **Services**, then **Transactions**, then **JTA Runtime** to see statistics for all transactions coordinated by server.

2.  **Optional**: If you want to see the transaction statistics for only one server, click the server row in the table.

3.  You can also expand the child nodes under **JTA Runtime** to view transaction details by transaction name or by resource, details about current transactions, or details about transaction recovery performed by the server.


### View Current Transactions {#GUID-8F422CD7-1013-41E9-9908-D3FC8C105E97}

You can view in-progress transactions coordinated by the selected server.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**, then choose the server whose transactions you want to view.

2.  Under the server node, go to **Services**, then **Transactions**, then **JTA Runtime**.

3.  Click the **Transactions** tab to see current transactions for the selected server.


### Enable Local Domain Security for JTA Communication {#GUID-BE784D71-17F7-4883-B558-4FA4EC3CFBAC}

Local domain security for JTA establishes trust between servers within a domain so that global transactions may occur across secure communication channels.

{{< alert title="Note" color="primary" >}}



Local domain security extends the cross-domain protocol and its terminology and configuration reflect that origin. Nevertheless, local domain security is only applicable to local \(intra-\) domain communication.

If you need to secure JTA communication across separate domains, you should configure cross-domain security or the security interoperability mode. See [How to Determine the Communication to Use for Inter-Domain Transactions](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLJTA-GUID-A5C879B3-8FDB-41C2-9A82-D1E853876414) in **Developing JTA Applications for Oracle WebLogic Server**.

{{< /alert >}}


1.  In the **Edit Tree**, go to **Services**, then **JTA**.

2.  Click **Show Advanced Controls**.

3.  Turn on the **Local Domain Security Enabled** option.

    To reduce the impact on performance, WebLogic Server caches the authenticated subject. If you want to modify the cache settings for your environment, change the following settings:

    -   To disable the cache, turn off **Local Domain Security Cache Enabled**.
    -   To change how often the cache is cleared, update the **Local Domain Security Cache TTL** value \(in seconds\).
4.  Click **Save** and then commit your changes.

5.  <a id="STEP_BN1_MJV_2DC"></a>Create a user for local domain security and assign it to the <code>CrossDomainConnectors</code> group. See [Create a User](../securing-domains#GUID-7A265AF1-F634-45EE-B685-C969A95DC476).

    This user will be authorized to perform all JTA communication between servers in the domain.

6.  Configure a local domain security credential mapping for the local domain security user. Use the default credential mapping provider or, if you want to configure your own credential mapping provider, see [Configure a Credential Mapping Provider](../securing-domains#GUID-49DE7039-810D-433A-A5EB-6A4E1FEB885C).

    1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Credential Mappers**, then **Remote Resources**.

    2.  Click **New**.

    3.  Turn on the **Use cross-domain protocol** option.

    4.  In the **Remote Domain** field, enter the name of the *local* domain.

    5.  In the **Remote User** field, enter the username of the user you configured in step [5](#STEP_BN1_MJV_2DC). Then, in the **Remote Password** field, enter their password.

    6.  Click **Create**.


Local domain security is now enabled for JTA communication.

### Specify the JTA Security Interoperability Mode {#GUID-5A5742F5-BCA8-4687-9F09-A670BD5C171B}

The security interoperability \(interop\) mode determines the security subject for JTA communication between servers.

{{< alert title="Note" color="primary" >}}



If local- or cross-domain security are enabled, they supersede the security interop mode.

{{< /alert >}}


1.  In the **Edit Tree**, go to **Services**, then **JTA**.

2.  Click **Show Advanced Controls**.

3.  From the **Security Interoperability Mode** drop-down list, select a mode:

    -   **Default**: Messages are forwarded using kernel identity *if* the **Admin** channel is also configured. Otherwise, it behaves like <code>performance</code> mode. See [Configure the Domain-Wide Administration Port](../domain-configuration#GUID-BC689DFE-0598-46B4-8E30-82B87D9CB354).
    -   **Performance**: Messages are forwarded using an anonymous user.
4.  Click **Save**.


