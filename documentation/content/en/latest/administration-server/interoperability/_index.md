---
weight: 250
title: Interoperating with Oracle Tuxedo
---



WebLogic Server supports interoperability between WebLogic Server applications and Tuxedo services.

Use WebLogic Remote Console to manage the connections between the two services using one of the following options:

-   Use the **WebLogic Tuxedo Connector \(WTC\)** to develop and support applications interoperating between WebLogic Server and Tuxedo by using a Java Application-to-Transaction Monitor Interface \(JATMI\) \(similar to Tuxedo ATMI\) or by using RMI over IIOP applications and Tuxedo CORBA remote objects. See [Create a WTC Server](#GUID-A86E2972-434C-490E-A4C2-3405E7318FFC).

-   Use **Jolt Connection Pools** to enable Tuxedo ATMI services for the Web, using WebLogic Server as the front-end HTTP and application server. See [Create a Jolt Connection Pool](#GUID-28B08CE4-75F5-4F72-B091-77C52B55957D).


For a comparison of these options, see [How WebLogic Tuxedo Connector Differs from Jolt](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WTCCF-GUID-BC1EFA1A-3FA6-4027-8226-C8ADCD6EF092) in **Administering WebLogic Tuxedo Connector for Oracle WebLogic Server**.

## Create a WTC Server {#GUID-A86E2972-434C-490E-A4C2-3405E7318FFC}

The WebLogic Tuxedo Connector \(WTC\) provides interoperability between WebLogic Server applications and Tuxedo services. It allows WTC clients to invoke Tuxedo services and Tuxedo clients to invoke WebLogic Server applications, such as EJBs and servlets.

To configure the WTC, you must create a WTC server, which organizes the various attributes necessary to establish a session connection between WebLogic Server and Tuxedo.

1.  In the **Edit Tree**, go to **Interoperability**, then **WTC Servers**.

2.  Click **New**.

3.  Enter a name for the WTC Server.

4.  Click **Create**.

5.  On the **Targets** tab, select the servers or clusters where you want to deploy this WTC server.


Next, you must create at least one local Tuxedo access point. See [Create a Local Access Point](#GUID-61659C15-4333-4557-BE92-8EA33856C8D9).

### Configure WTC Servers {#GUID-DB9133EB-73F7-480C-B4A9-6A1AB3AA8C35}

After you create an WTC server, you can configure how it to determine how WebLogic Server should interact with the Tuxedo environment.

1.  In the **Edit Tree**, go to **Interoperability**, then **WTC Servers**, then *myWTCServer*, and select the configuration parameter you want to edit.

See [Configuring WebLogic Tuxedo Connector for Your Applications](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WTCCF-GUID-65A4FE3C-A3B4-405A-A92D-AC749604257B) in **Administering WebLogic Tuxedo Connector for Oracle WebLogic Server**.

<table id="TABLE_QXD_DJG_N2C"><thead><tr><th>

Option

</th><th>

Description

</th></tr></thead><tbody><tr><td>

Local Access Point

</td><td>

Local Tuxedo access points provide configuration information to connect available remote Tuxedo domains to a WTC server.

</td></tr><tr><td>

Remote Acess Point

</td><td>

Remote Tuxedo access points provide configuration information to connect a WTC server to available remote Tuxedo domains.

</td></tr><tr><td>

Exported Services

</td><td>

Exported services provide information about how to provide Java application services to remote Tuxedo application environments.

</td></tr><tr><td>

Imported Services

</td><td>

Imported services provide information on how to access services that are available on remote Tuxedo domains.

</td></tr><tr><td>

Passwords

</td><td>

Password configurations provide passwords for inter-domain authentication through access points.

</td></tr><tr><td>

Resources

</td><td>

Resources specify field table classes, reference view buffer structures, and provide application passwords for domains.

</td></tr><tr><td>

Queuing Bridge

</td><td>

A Tuxedo queuing bridge provides a bidirectional JMS interface that allows WTC applications to communicate with Tuxedo application environments.

</td></tr><tr><td>

Redirections

</td><td>

Redirections are used to configure a one-to-one connection between the JMS interface and Tuxedo application environment.

</td></tr></tbody>
</table>

Table 1. Tuxedo Interactions. Various ways to coordinate between WebLogic Server and Tuxedo

### Create a Local Access Point {#GUID-61659C15-4333-4557-BE92-8EA33856C8D9}

Local Tuxedo access points provide configuration information to connect available remote Tuxedo domains to a WTC server.

You must have at least one local Tuxedo access point configured to create a valid WTC server.

1.  In the **Edit Tree**, go to **Interoperability**, then **WTC Servers**, then *myWTCServer*, then **Local APs**.

2.  Click **New**.

3.  Enter a name for the local Tuxedo access point.

4.  Click **Create**.

5.  Update the other local access point attributes as necessary.

6.  Click **Save**.

7.  If you want to define the connection configurations of a local Tuxedo access point that will be used with this WTC server, then, on the **Connections** tab, update the appropriate attributes.

8.  If you want to define the security configurations of a local Tuxedo access point that will be used with this WTC server, then, on the **Security** tab, update the appropriate attributes.

9.  Click **Save**.


### Create a Remote Access Point {#GUID-4906AD52-8DE8-4FC1-828D-BC0719FD0E12}

Remote Tuxedo access points provide configuration information to connect a WTC server to available remote Tuxedo domains.

1.  In the **Edit Tree**, go to **Interoperability**, then **WTC Servers**, then *myWTCServer*, then **Remote APs**.

2.  Click **New**.

3.  Enter a name for the remote access point.

4.  Click **Create**.

5.  Update the other remote access point attributes as necessary.

6.  Click **Save**.

7.  If you want to define the connection configurations of a remote Tuxedo access point that will be used with this WTC server, then, on the **Connections** tab, update the appropriate attributes.

8.  If you want to define the security configurations of a remote Tuxedo access point that will be used with this WTC server, then, on the **Security** tab, update the appropriate attributes.

9.  Click **Save**.


## Create a Jolt Connection Pool {#GUID-28B08CE4-75F5-4F72-B091-77C52B55957D}

Jolt is a Java-based client API that manages requests from servlets and applications on WebLogic Server to Oracle Tuxedo services.

It is recommended that you create one Jolt connection pool for each application running on WebLogic Server.

1.  Make sure that you have properly configured Oracle Tuxedo to use Jolt. See [Configuring the Oracle Jolt System](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=OTXJO-GUID-D9DC5679-1452-49CB-B7E9-D8A2B28B9267) in **Using Oracle Jolt**.

2.  On each WebLogic Server instance that hosts a Jolt connection pool, you must configure Jolt classes to run as server startup up and shutdown classes. These classes establish and terminate the connection between Tuxedo and WebLogic Server.

    1.  Configure the Jolt startup classes, as described in [Configure Startup Classes](../domain-configuration#GUID-6DE805E3-C3B3-4373-8016-AAD4A1498E25).

        -   In the **Class Name** field, enter <code>bea.jolt.pool.servlet.weblogic.PoolManagerStartUp</code>.
        -   Enable **Failure is Fatal**.
        -   Target the startup class to the server or clusters that will host the Jolt connection pools.
    2.  Configure the Jolt shutdown classes, as described in [Configure Shutdown Classes](../domain-configuration#GUID-9B52831B-B82A-4348-BEA5-3492E8AEFF29).

        -   In the **Class Name** field, enter <code>bea.jolt.pool.servlet.weblogic.PoolManagerShutDown</code>.
        -   Target the shutdown class to the server or clusters that will host the Jolt connection pools.
    3.  Make sure you add the Jolt startup and shutdown classes to the classpath.

    4.  Restart each server where you deployed the classes.

3.  In the **Edit Tree**, go to **Interoperability**, then **Jolt Connection Pools**.

4.  Click **New**.

5.  Enter a name for the Jolt connection pool.

6.  Click **Create**.

7.  Update the other attributes for the Jolt connection pool as necessary.

8.  Click **Save**.


