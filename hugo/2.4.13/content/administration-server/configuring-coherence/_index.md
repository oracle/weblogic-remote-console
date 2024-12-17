---
author: Oracle Corporation
publisherinformation: December 2024
weight: 209
title: Configuring Coherence
---



Oracle Coherence enables organizations to predictably scale mission-critical applications by providing fast and reliable access to frequently used data. By automatically and dynamically partitioning data in memory across multiple servers, Coherence enables continuous data availability and transactional integrity, even in the event of a server failure.

WebLogic Server domains include a Coherence container that simplifies the management and deployment of Coherence clusters and Coherence-based applications.

{{< notice note >}}



Coherence can also be installed in a standalone mode that does not rely on WebLogic Server. WebLogic Remote Console cannot administer standalone Coherence installations, therefore this documentation focuses solely on using Coherence with WebLogic Server.

To learn more about standalone Coherence, see [Introducing the Oracle Coherence Standard Installation Topologies](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=COHIN-GUID-440D6D47-086F-4A0A-A71A-ABD691DA83BD) in **Installing Oracle Coherence**.

{{< /notice >}}


## Coherence Clusters and Managed Coherence Servers {}

Coherence is integrated within WebLogic Server as a container subsystem, known as a Coherence cluster. The use of a container aligns the lifecycle of a Coherence member with the lifecycle of a Managed Server: starting or stopping a server JVM starts and stops a Coherence cluster member.

A WebLogic Server domain can contain a single Coherence cluster that can be associated with multiple WebLogic Server clusters. Within a Coherence cluster are Coherence cluster members.

Managed Coherence servers are Managed Servers that are configured to be Coherence cluster members. Managed Coherence servers provide in-memory distributed caching for applications to increase application scalability, availability, and performance.

Managed servers can be explicitly associated with a Coherence cluster or they can be associated with a WebLogic Server cluster that is associated with a Coherence cluster.

Managed Coherence servers that are part of a WebLogic Server cluster inherit their Coherence settings from the WebLogic Server cluster. WebLogic Server clusters are typically used to set up Coherence deployment tiers that organize managed Coherence servers based on their role in the Coherence cluster.

{{< notice note >}}



Similar to WebLogic Server clusters, Coherence clusters consist of multiple managed Coherence server instances. However, Coherence clusters use different clustering protocols and are configured separately from WebLogic Server clusters.

With Coherence clusters, a client interacts with the data in a local cache, and the distribution and backup of the data is automatically performed across cluster members.

{{< /notice >}}


For more information, see [Configuring and Managing Coherence Clusters](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-C4577955-59DB-4333-A817-7C26641C4EDC) in **Administering Clusters for Oracle WebLogic Server**.

{{< notice note >}}



In previous releases, Coherence cluster members were organized into Coherence servers (also known as Coherence data nodes). This feature is deprecated and not supported by WebLogic Remote Console. Coherence tiers should be configured to use Managed Coherence servers instead.

{{< /notice >}}


## Configure Coherence: Main Steps {#GUID-B7D3071F-A32F-4AE9-9A36-FF28E3B674C8}

For optimal performance or scalability, Coherence is typically set up using WebLogic Server clusters to represent deployment tiers.

1.  Verify whether your domain's topology can support separate WebLogic Server clusters to represent Coherence deployment tiers. For guidance, see [Cluster Architectures](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-7B99ADBA-F318-42A5-AC72-063DD8EBEFA3) in **Administering Clusters for Oracle WebLogic Server**.

    {{< notice note >}}

    

    Alternatively, for development purposes, you can set up a single standalone Managed Server instance to act as both a cache server and a cache client. See [Configure and Deploy Coherence on a Single-Server Cluster](#GUID-DB577D5C-A80B-48DB-A940-C95D764532C5).

    Single-server topologies are not recommended for production use.

    {{< /notice >}}


2.  Configure a Coherence cluster as described in [Create a Coherence Cluster](#GUID-D042E373-ED9F-4EC1-B0F4-89DFD803DF0C).

3.  Configure a data tier as described in [Create a Coherence Data Tier](#GUID-F9B1FB82-B316-4CD1-824F-03A0984EE59A).

    A Coherence data tier is a WebLogic Server cluster that is associated with a Coherence cluster and hosts any number of storage-enabled managed Coherence servers. For more information, see [Configuring and Managing a Coherence Data Tier](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-0B8C8447-3007-4E0D-9CA8-9B676E9D7A5E) in **Administering Clusters for Oracle WebLogic Server**.

4.  Configure an application tier as described in [Create a Coherence Application Tier](#GUID-8A5079EB-A4AD-4C47-B6F3-576C6A4EE515).

    A Coherence application tier is a WebLogic Server cluster that is associated with a Coherence cluster and hosts any number of storage-disabled managed Coherence servers. For more information, see [Configuring and Managing a Coherence Application Tier](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-AF4B64A6-598A-4DFB-978B-D7C3B92F42E4) in **Administering Clusters for Oracle WebLogic Server**.

5.  Configure a proxy tier as described in [Create a Coherence Proxy Tier](#GUID-042599BA-C133-43E0-8572-30B84149BB4F).

    A Coherence proxy tier is a WebLogic Server cluster that is associated with a Coherence cluster and hosts any number of managed Coherence proxy servers. Managed Coherence proxy servers allow Coherence*Extend clients to use Coherence caches without being cluster members. For more information, see [Configuring and Managing a Coherence Proxy Tier](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-FC671FC0-0A23-4FA0-BBAD-0A3A72DFF261) in **Administering Clusters for Oracle WebLogic Server**.

6.  Create and package a Coherence Grid Archive (GAR) module for any application modules (Web application, EJB, and so on) that use Coherence. For more information, see [Creating Coherence Applications for WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLCOH-GUID-C34A3F98-55D5-4D5A-8BCC-E3EBC718B57D) in **Developing Oracle Coherence Applications for Oracle WebLogic Server**.

7.  Deploy your Coherence GAR module to your WebLogic Server domain as described in [Install an Application](../deploying-applications#GUID-C9A911B0-1942-4383-BD91-49BC745F21DA).

    Standalone GARs are deployed in the same way as other Java EE modules. For more information, see [Deploying Coherence Applications in WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLCOH-GUID-9284398A-509D-4BC0-9007-502CCCA4D758) in **Developing Oracle Coherence Applications for Oracle WebLogic Server**.


## Create a Coherence Cluster {#GUID-D042E373-ED9F-4EC1-B0F4-89DFD803DF0C}

Coherence clusters enable applications to share data management and caching services among server instances and clusters hosting the applications that need access to them.

Configure cluster properties and then target Coherence clusters to WebLogic Server instances or clusters in the domain.

1.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**.

2.  Click **New**.

3.  Enter a name for the Coherence cluster and click **Create**.

4.  Select a **Clustering Mode** and then adjust the Coherence general properties according to the clustering mode you selected.

5.  If you want to specify operational settings that are not available through the provided MBeans, you can upload a cluster configuration file with your supplemental settings. Click **Import Configuration**, then, in the **Custom Cluster Configuration File Name** dialog box, enter the location of the cluster configuration file, relative to the domain configuration directory.

    {{< notice note >}}

    

    Avoid configuring the same operational settings in both an external cluster configuration file and through the MBeans.

    {{< /notice >}}


6.  Click **Save**.


Next, you should consider updating the following configuration options:

-   [Target Coherence Clusters](#GUID-EA8324AB-56FA-48C1-8218-3E399409F390)

-   [Configure Coherence Federation](#GUID-587E8B6E-E352-4169-AE37-779D4C114278)

-   [Configure Coherence Persistence](#GUID-D586A7ED-2690-420C-BE6A-6BA32D989DF7)

-   [Set Up the Coherence Security Framework](#GUID-03F09E60-A5B5-4FE0-AE6F-25430D63C602)


## Configure Coherence Clusters {#GUID-C27281D9-1D27-48BB-B1D2-DEBCB7935466}

A Coherence cluster provides several cluster settings that can be configured for a specific domain.

You should update the default values of the Coherence cluster as needed for your environment.

### Configure Coherence Federation {#GUID-587E8B6E-E352-4169-AE37-779D4C114278}

Use Coherence federation to federate cache data asynchronously across multiple geographically dispersed clusters. Federating cached data across clusters provides redundancy, off-site backup, and multiple points of access for application users in different geographical locations.

For more information, see [Federating Caches Across Clusters](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=COHAG-GUID-B88851EC-BE98-40D5-B026-E29B66DFE384) in **Administering Oracle Coherence**.

1.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**.

2.  Click the Coherence cluster that you want to edit, then select the **Coherence Federation** tab.

3.  Select a **Federation Topology** from the drop-down list.

    When a topology is selected, a topology configuration is automatically created and named <code>Default-Topology</code>. The Default-Topology topology configuration is created and used if no other federation topology is specified in the cache configuration file.

    When using federation, complementary topologies must be configured on both the local and remote clusters. For example, if a local cluster is set to use <code>active-passive</code>, then the remote cluster must be set to use <code>passive-active</code>.

4.  In the **Remote Coherence Cluster Name** field, enter the name of the remote cluster to which this cluster is being federated.

5.  In the **Remote Participant Hosts** field, enter one or more hosts (separated by commas) that are running managed Coherence servers on the remote cluster.

6.  If required, change the cluster port of the remote cluster in the **Remote Coherence Cluster Listen Port**. The default cluster port is typically not changed.

7.  Click **Save**.


### Configure Coherence Persistence {#GUID-D586A7ED-2690-420C-BE6A-6BA32D989DF7}

Use Coherence persistence to save and recover Coherence distributed caches. Cached data is persisted so that it can be quickly recovered after a catastrophic failure or after a cluster restart due to planned maintenance.

For more information on configuring persistence in Coherence, see [Persisting Caches](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=COHAG-GUID-3DC46E44-21E4-4DC4-9D12-231DE57FE7A1) in **Administering Oracle Coherence**.

1.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**.

2.  Click the Coherence cluster that you want to edit, then select the **Coherence Persistence** tab.

3.  Choose a **Persistence Mode** from the drop-down list.

    -   **On-Demand**: In this mode, a cache service is manually persisted and recovered upon request using the persistence coordinator. The persistence coordinator is exposed as an MBean interface that provides operations for creating, archiving, and recovering snapshots of a cache service.
    -   **Active**: In this mode, cache contents are automatically persisted on all mutations and are automatically recovered on cluster/service startup. The persistence coordinator can still be used in active persistence mode to perform on-demand snapshots.
    -   **Active-Async**: In this mode, the storage servers can persist data asynchronously. Thus, a mutating request is successful after the primary stores the data and (if there is a synchronous backup) after the backup receives the update.
    -   **Active Backup**: In this mode, persistence behaves similarly to the active persistence mode but it also stores backup partitions asynchronously on a disk.
4.  You can override the default locations where various persistence files are stored. Enter new file locations in the appropriate fields:

    -   **Active Directory**
    -   **Snapshot Directory**
    -   **Trash Directory**
    -   **Backup Directory**
    -   **Events Directory**
5.  Click **Save**.


### Configure Coherence Logging {#GUID-B31786DE-73A9-4ECB-B9A6-EDF549BF61CF}

You can configure logging properties for a Coherence cluster.

1.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**.

2.  Click the Coherence cluster that you want to edit, then select the **Logging** tab.

3.  Make sure the **Enabled** option is turned on.

4.  In the **Logger Name** field, enter the logger name for the Coherence logs.

5.  In the **Message Format** field, enter the Coherence logs message format.

6.  In the **Severity Level** field, enter the logging severity level for Coherence logs. The maximum level you can set is <code>9</code>.

7.  In the **Character Limit** field, enter the character limit for Coherence logs.

8.  Click **Save**.


### Set Up the Coherence Security Framework {#GUID-03F09E60-A5B5-4FE0-AE6F-25430D63C602}

You can enable and configure the Coherence security framework. If you do not enable security, then any non-WebLogic Server JVM can access the Coherence cluster without going through WebLogic Server authorization.

For more information, see [Securing Oracle Coherence in Oracle WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=COHSG-GUID-D80F3D67-668C-4C91-B340-0A96B26B05D8) in **Securing Oracle Coherence**.

1.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**.

2.  Click the Coherence cluster that you want to edit, then select the **Security** tab.

3.  Turn on the **Security Framework Enabled** option and then configure the security parameters to meet the requirements of your environment.

    {{< notice note >}}

    

    If the **Secured Production** option is not set, Coherence will inherit its domain mode from WebLogic Server.

    {{< /notice >}}


4.  Click **Save**.

5.  Enable an Identity Asserter for a Coherence cluster to assert a client's identity token. For local extend clients, an identity asserter is already enabled for asserting a token of type <code>weblogic.security.acl.internal.AuthenticatedSubject</code>. For remote (outside of WebLogic Server) extend clients, a custom identity asserter implementation class must be packaged in a GAR. However, an identity asserter is not required if the remote extend client passes <code>null</code> as the token. If the proxy service receives a non-null token and there is no identity asserter implementation class configured, a <code>SecurityException</code> is thrown and the connection attempt is rejected.

    1.  Under the current Coherence cluster node in the navigation tree, select **Coherence Identity Asserter**.

    2.  In the **Class Name** field, enter the fully qualified name of the asserter class. For example, to use the default identity asserter, enter <code>com.tangosol.net.security.DefaultIdentityAsserter</code>.

    3.  Click **Save**.

    4.  If there are any arguments, open the **Identity Asserter Constructor Arguments** node and click **New** to add class constructor arguments.

    5.  Click **Save**.


If you want to define WebLogic Server roles and policies for authorizing access to Coherence services and caches, see [Secure a Coherence Service Configuration](#GUID-FB54E265-1370-4543-9FE4-A65AE0EDED58) or [Secure Coherence Caches](#GUID-4C734AB5-62A9-4DBF-8FCC-9CAF4DC842CB), respectively.

### Target Coherence Clusters {#GUID-EA8324AB-56FA-48C1-8218-3E399409F390}

Target Coherence clusters to WebLogic Server instances or clusters that host applications that need access to Coherence data caches and services.

1.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**.

2.  Click the Coherence cluster that you want to edit, then select the **Members** tab.

3.  Select the servers or clusters where you want to deploy the Coherence cluster configuration and move them under **Chosen**. Move any unwanted servers or clusters under **Available**.

4.  Click **Save**.


### Create a Cluster Cache Configuration {#GUID-5122006C-7CEE-4B96-BB24-01758E0AFEAE}

A Coherence cache configuration file defines the caches and services that are used by an application. Typically, a cache configuration file is included in a GAR module.

A GAR is deployed to all managed Coherence servers in the data tier and can also be deployed as part of an EAR to the application tier. The GAR ensures that the cache configuration is available on every Coherence cluster member.

However, there are cases that require a different cache configuration file to be used on specific managed Coherence servers. For example, a proxy tier requires access to all artifacts in the GAR but needs a different cache configuration file that defines the proxy services to start.

You can use WebLogic Remote Console to define a cluster cache configuration. A cache configuration file can be associated with WebLogic clusters or Managed Coherence Servers at runtime. In this case, the cache configuration overrides the cache configuration file that is included in a GAR. You can also omit the cache configuration file from a GAR file and assign it at runtime.

To override a cache configuration file at runtime, the cache configuration file must be bound to a JNDI name. The JNDI name is defined using the <code>override-property</code> attribute of the <code><cache-configuration-ref></code> element. The element is located in the <code>coherence-application.xml</code> file that is packaged in a GAR file. For more information on the <code>coherence-application.xml</code> file, see [coherence-application.xml Deployment Descriptor Elements](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLCOH-GUID-124B798C-C9E4-40B7-85A2-4F901F3A4455) in **Developing Oracle Coherence Applications for Oracle WebLogic Server**. For more information on importing a cache configuration file, see [Overriding a Cache Configuration File](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-08312E14-C94D-40E3-A09F-5667ECE22171) in **Administering Clusters for Oracle WebLogic Server**.

1.  If you haven't already done so, create a Coherence cluster. See [Create a Coherence Cluster](#GUID-D042E373-ED9F-4EC1-B0F4-89DFD803DF0C).

2.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**, then *myCoherenceCluster*, then **Coherence Cache Configs**.

3.  Click **New**.

4.  In the **Name** field, enter a name for the Coherence cache configuration.

5.  In the **JNDI Name** field, enter the JNDI name to which the cache configuration file is bound.

    This JNDI name is prefixed with <code>cache-config/</code> and must match the value in the <code>override-property</code> of your <code>cache-configuration-ref</code> entry in <code>coherence-application.xml</code>.

    For example, JNDI name of <code>ExamplesGAR</code> must match the <code>override-property</code> of <code>cache-config/ExamplesGAR</code>.

6.  In the **Cache Configuration File** field, enter the full path to the cache configuration file. Alternatively, you may specify a URL.

7.  Click **Create**.

8.  On the **Targets** tab, select the servers or clusters where you want to target the cluster cache configuration and move them under **Chosen**. Move unwanted servers or clusters under **Available**.

9.  Click **Save**.


### Secure Coherence Caches {#GUID-4C734AB5-62A9-4DBF-8FCC-9CAF4DC842CB}

Use WebLogic Server authorization to restrict access to specific Coherence caches.

1.  If you haven't already done so, create a Coherence cluster. See [Create a Coherence Cluster](#GUID-D042E373-ED9F-4EC1-B0F4-89DFD803DF0C).

2.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**, then *myCoherenceCluster*, then **Coherence Caches**.

3.  Click **New**.

4.  In the **Name** field, enter a name for the Coherence cache. The name of the cache must match *exactly* the name of the cache used in an application.

5.  Click **Create** and commit your changes.

6.  Apply a security role that is scoped to the Coherence cache. See [Create a Scoped Role](../securing-domains#GUID-CB641FD2-694F-452C-AC47-8E126374EF8D).


### Secure a Coherence Service Configuration {#GUID-FB54E265-1370-4543-9FE4-A65AE0EDED58}

You can use WebLogic Server authorization to restrict access to Coherence services. Specifying authorization on a cache service affects access to all the caches that are created by that service.

1.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**, then *myCoherenceCluster*, then **Coherence Services**.

2.  Click **New**.

3.  In the **Name** field, enter a name for the Coherence service. The name of the service must match *exactly* the name of the service used in an application.

    {{< notice note >}}

    

    The exact name must include the scope name as a prefix to the service name. The scope name can be explicitly defined in the cache configuration file or, more commonly, taken from the deployment module name. For example, if you deploy a GAR named <code>contacts.gar</code> that defines a service named <code>ContactsService</code>, then the exact service name is <code>contacts:ContactsService</code>.

    {{< /notice >}}


4.  Click **Create** and commit your changes.

5.  Apply a security role that is scoped to the Coherence service. See [Create a Scoped Role](../securing-domains#GUID-CB641FD2-694F-452C-AC47-8E126374EF8D).


### Specify a Coherence Well Known Address {#GUID-E028304F-5CF5-4FD8-82A7-B74338196538}

Configure a well known address for a Coherence cluster. Other members can use this address to enroll in the cluster.

1.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**, then *myCoherenceCluster*, then **Coherence Cluster Well Known Addresses**.

2.  Click **New**.

3.  In the **Name** field, enter a name for the Coherence well known address.

4.  In the **Listen Address** field, enter the IP address of the Coherence cluster member.

5.  Click **Create**.


### Configure a Coherence Address Provider {#GUID-8CBEB83E-5388-4E93-9BC0-93D6D11AA06F}

An address provider specifies the TCP listener address (IP or DNS name, and port) for a proxy service.

1.  In the **Edit Tree**, go to **Environment**, then **Coherence Clusters**, then *myCoherenceCluster*, then **Coherence Address Providers**.

2.  Click **New**.

3.  In the **Name** field, enter a name for the Coherence address provider.

4.  Click **Create**.

    A node for the new address provider will appear under the **Coherence Address Providers**.

5.  Expand the new node and go to **Coherence Socket Addresses**.

6.  Click **New**.

7.  Enter a name for the socket address.

8.  In the **Address** field, specify the listen address for your socket address.

9.  In the **Port** field, specify the listen port for your socket address.

10. Click **Create**.


## Coherence Deployment Tiers {#GUID-26E0D6DA-EB7D-4BCA-8707-49C3162A5CF1}

In production environments, Coherence is typically set up using WebLogic Server clusters to represent deployment tiers.

There are three types of Coherence deployment tiers:

-   **Data Tier** which hosts one or more cache servers
-   **Application Tier** which hosts one or more cache clients
-   **Proxy Tier** which hosts one or more managed Coherence proxy servers and the Coherence extend client tier that hosts extend clients

The tiered topology approach provides optimal scalability and performance.

For more information on Coherence deployment tiers, see [Creating Coherence Deployment Tiers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-133FFEBE-568D-4E5A-8C14-85388F4FB054) in **Administering Clusters for Oracle WebLogic Server**.

### Create a Coherence Data Tier {#GUID-F9B1FB82-B316-4CD1-824F-03A0984EE59A}

A Coherence data tier is a WebLogic Server cluster that is associated with a Coherence cluster and hosts any number of storage-enabled managed Coherence servers.

For more information on Coherence data tiers, see [Configuring and Managing a Coherence Data Tier](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-0B8C8447-3007-4E0D-9CA8-9B676E9D7A5E) in **Administering Clusters for Oracle WebLogic Server**.

1.  If you haven't already done so, create a Coherence cluster as described in [Create a Coherence Cluster](#GUID-D042E373-ED9F-4EC1-B0F4-89DFD803DF0C).

2.  Create a WebLogic Server cluster as described in [Create a Cluster](../domain-configuration#GUID-EEE59519-29C3-4003-828A-9A3DC25059DA).

3.  On the WebLogic Server cluster that you just created, go to the **Advanced** tab, then the **Coherence** subtab.

4.  From the **Coherence Cluster System Resource** drop-down list, select the Coherence cluster.

5.  Turn on the **Local Storage Enabled** option.

6.  Click **Save**.

7.  Create one or more managed Coherence servers as described in [Create a Managed Coherence Server](#GUID-48BEE50E-2995-4C42-96EF-2F28416512FC) and assign them to this data tier.


You should also create a Coherence application tier and, optionally, a Coherence proxy tier. See [Create a Coherence Application Tier](#GUID-8A5079EB-A4AD-4C47-B6F3-576C6A4EE515) or [Create a Coherence Proxy Tier](#GUID-042599BA-C133-43E0-8572-30B84149BB4F).

### Create a Coherence Application Tier {#GUID-8A5079EB-A4AD-4C47-B6F3-576C6A4EE515}

A Coherence application tier is a WebLogic Server cluster that is associated with a Coherence cluster and hosts any number of storage-disabled managed Coherence servers.

For more information on Coherence application tiers, see [Configuring and Managing a Coherence Application Tier](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-AF4B64A6-598A-4DFB-978B-D7C3B92F42E4) in **Administering Clusters for Oracle WebLogic Server**.

1.  If you haven't already done so, create a Coherence cluster as described in [Create a Coherence Cluster](#GUID-D042E373-ED9F-4EC1-B0F4-89DFD803DF0C).

2.  Create a WebLogic Server cluster as described in [Create a Cluster](../domain-configuration#GUID-EEE59519-29C3-4003-828A-9A3DC25059DA).

3.  On the WebLogic Server cluster that you just created, go to the **Advanced** tab, then the **Coherence** subtab.

4.  From the **Coherence Cluster System Resource** drop-down list, select the Coherence cluster.

5.  Turn off the **Local Storage Enabled** option. Servers in the application tier should never be used to store cache data.

6.  Click **Save**.

7.  Create one or more managed Coherence servers as described in [Create a Managed Coherence Server](#GUID-48BEE50E-2995-4C42-96EF-2F28416512FC) and assign them to this application tier.


You should also create a Coherence data tier and, optionally, a Coherence proxy tier. See [Create a Coherence Data Tier](#GUID-F9B1FB82-B316-4CD1-824F-03A0984EE59A) or [Create a Coherence Proxy Tier](#GUID-042599BA-C133-43E0-8572-30B84149BB4F).

### Create a Coherence Proxy Tier {#GUID-042599BA-C133-43E0-8572-30B84149BB4F}

A Coherence proxy tier is a WebLogic Server cluster that is associated with a Coherence cluster and hosts any number of managed Coherence proxy servers. Managed Coherence proxy servers allow Coherence*Extend clients to use Coherence caches without being cluster members.

The number of managed Coherence proxy servers that are required in a proxy tier depends on the number of expected clients. At least two proxy servers must be created to allow for load balancing. However, additional servers may be required when supporting a large number of client connections and requests.

For details on Coherence*Extend and creating extend clients, see [Introduction to Coherence*Extend](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=COHCG-GUID-E935592F-DCA2-44BD-96D5-E276DFA3D3F9) in **Developing Remote Clients for Oracle Coherence**.

1.  If you haven't already done so, create a Coherence cluster as described in [Create a Coherence Cluster](#GUID-D042E373-ED9F-4EC1-B0F4-89DFD803DF0C).

2.  Create a WebLogic Server cluster as described in [Create a Cluster](../domain-configuration#GUID-EEE59519-29C3-4003-828A-9A3DC25059DA).

3.  On the WebLogic Server cluster that you just created, go to the **Advanced** tab, then the **Coherence** subtab.

4.  From the **Coherence Cluster System Resource** drop-down list, select the Coherence cluster.

5.  Turn off the **Local Storage Enabled** option. Servers in the proxy tier should never be used to store cache data.

6.  Click **Save**.

7.  Create one or more managed Coherence servers as described in [Create a Managed Coherence Server](#GUID-48BEE50E-2995-4C42-96EF-2F28416512FC) and assign them to this proxy tier.


You should also create a Coherence data tier and a Coherence application tier. See [Create a Coherence Data Tier](#GUID-F9B1FB82-B316-4CD1-824F-03A0984EE59A) and [Create a Coherence Application Tier](#GUID-8A5079EB-A4AD-4C47-B6F3-576C6A4EE515).

## Create a Managed Coherence Server {#GUID-48BEE50E-2995-4C42-96EF-2F28416512FC}

A Managed Coherence server is a Managed Server that is configured to be Coherence cluster member and provide in-memory distributed caching for applications.

1.  Create a WebLogic Server Managed Server, as described in [Create a Managed Server](../domain-configuration#GUID-50C0A18E-83F6-4865-ABF7-6127D0D0F49D).

2.  On the Managed Server that you just created, from the **Cluster** drop-down list, select a cluster that is acting as a Coherence deployment tier.

    For information on Coherence deployment tiers, see [Coherence Deployment Tiers](#GUID-26E0D6DA-EB7D-4BCA-8707-49C3162A5CF1).

3.  Click **Save**.


## Configure and Deploy Coherence on a Single-Server Cluster {#GUID-DB577D5C-A80B-48DB-A940-C95D764532C5}

During development, a single-server cluster offers a quick way to start and stop a cluster. A single-server cluster is a cluster that is constrained to run on a single managed server instance and does not access the network. The server instance acts as a storage-enabled cluster member, a client, and (optionally) a proxy.

For more information on using a single-server Coherence cluster, see [Using a Single-Server Cluster](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-8B3138E3-53B0-4263-A24B-C3F681A61D9B) in **Administering Clusters for Oracle WebLogic Server**.

{{< notice note >}}



To set up Coherence for production use, follow the steps outlined in [Configure Coherence: Main Steps](#GUID-B7D3071F-A32F-4AE9-9A36-FF28E3B674C8) instead.

{{< /notice >}}


1.  If you haven't already done so, create a Coherence cluster as described in [Create a Coherence Cluster](#GUID-D042E373-ED9F-4EC1-B0F4-89DFD803DF0C).

    If you are using multicast communication, set **Time To Live** to <code>0</code>. For more information about communication for Coherence clusters, see [Configure Cluster Communication](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-6EA50819-A366-46DE-9DE5-95F274569934) in **Administering Clusters for Oracle WebLogic Server**.

2.  Create a WebLogic Server Managed Server, as described in [Create a Managed Server](../domain-configuration#GUID-50C0A18E-83F6-4865-ABF7-6127D0D0F49D).

    Do not create a managed *Coherence* server.

3.  On the Managed Server that you just created, go to the **Advanced** tab and then its **Coherence** subtab.

4.  From the **Coherence Cluster System Resource** drop-down list, select the Coherence cluster.

    This standalone Managed Server will now inherit settings directly from the Coherence cluster.

5.  Turn on the **Local Storage Enabled** option to ensure the Managed Server will be a storage-enabled Coherence member (cache server).

6.  Set the **Unicast Listen Address** to an address that is routed to loop back. On most computers, setting the address to <code>127.0.0.1</code> works.

    For more information about unicast settings for Coherence cluster members, see [Configure Coherence Cluster Member Unicast Settings](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-5F143155-0B1D-4EFE-8BAC-DE51F9D8F8D6) in **Administering Clusters for Oracle WebLogic Server**.

7.  Click **Save**.

8.  Create and package a Coherence Grid Archive (GAR) module for any application modules (Web application, EJB, etc.) that use Coherence. See [Creating Coherence Applications for WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLCOH-GUID-C34A3F98-55D5-4D5A-8BCC-E3EBC718B57D) in **Developing Oracle Coherence Applications for Oracle WebLogic Server**.

9.  Deploy your Coherence GAR module to your WebLogic Server domain. Standalone GARs are deployed in the same way as other Jakarta EE modules. See [Deploying Coherence Applications in WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLCOH-GUID-9284398A-509D-4BC0-9007-502CCCA4D758) in **Developing Oracle Coherence Applications for Oracle WebLogic Server**.


