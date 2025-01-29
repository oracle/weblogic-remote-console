---
author: Oracle Corporation
publisherinformation: December 2024
weight: 140
title: Deploying Applications
---



You can use WebLogic Remote Console to manage the deployment process of applications to WebLogic Server.

For general information on the application deployment process, see [Understanding WebLogic Server Deployment](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEPGD-GUID-F6E8BF0B-FBCF-44D2-A33F-13C4EF2E0031) in **Deploying Applications to Oracle WebLogic Server**.

## Supported Deployment Units {#SECTION_JCN_YYR_FCC}

A deployment unit refers to a Java EE application (an enterprise application or Web application) or a standalone Java EE module (such as an EJB or resource adapter) that has been organized according to the Java EE specification and can be deployed to WebLogic Server.

The following deployment units are supported:

-   Enterprise Application

-   Web Application

-   Enterprise JavaBean

-   Web Service

-   Java EE Library

-   Optional Package

-   JDBC, JMS, and WLDF Modules

-   Client Application Archive


For more information on each deployment unit, see [Supported Deployment Units](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEPGD-GUID-DC6C0B59-7560-4A6F-964B-201480072A3D) in **Deploying Applications to Oracle WebLogic Server**

## Install an Application {#GUID-C9A911B0-1942-4383-BD91-49BC745F21DA}

An application can be installed as an archived EAR file or as an exploded directory. Installing an application makes its physical file or directory known to WebLogic Server.

This procedure applies to all of the deployment units listed in [Supported Deployment Units](#SECTION_JCN_YYR_FCC), with the exception of Java EE libraries. For Java EE libraries, see [Install a Java EE Library](#GUID-BE65E318-925C-4CEC-9041-76A7214AFA6A) instead.

1.  In the **Edit Tree**, go to **Deployments**, then **App Deployments**.

2.  Select **New**.

3.  Enter a name for the application.

4.  Select the servers and clusters to which you want to deploy the application.

5.  Make the archive file or exploded directory known to the Administration Server.

    -   If the application is on your file system and you need to upload it to the Administration Server, enable the **Upload** option. Then, beside **Source**, click **Choose File** to browse to the application's location on your system.
    -   If the application is already in the file system of the Administration Server, disable the **Upload** option. Then, in the **Source Path** field, enter the file path to the application.
6.  Add a deployment plan, choose another staging mode, or set application behavior at deployment.

7.  Click **Create**.


You can view the status of running deployment tasks on the **Monitoring Tree**: **Deployments**: **Deployment Tasks** page.

Your new application appears under the App Deployment node. You can make additional changes to the application on this page.

You must start an application before it can process client requests.

## Start an Application {#GUID-B47FE514-044F-4E73-812A-CD6AD83EB895}

You must start an application to make it available to WebLogic Server clients.

When you start an application, you can make it immediately available to clients, or you can start it in Administration Mode first to ensure that it is working as expected. Starting in Administration Mode allows you to perform final sanity checking of the distributed application directly in the production environment without disrupting clients.

1.  In the **Monitoring Tree**, go to **Deployments**, then **Application Management**.

2.  Select the application that you want to start.

3.  Click **Start** and choose either:

    -   **Servicing all requests**: to make the application immediately available to all clients.
    -   **Servicing only administration request**: to make the application available in Administration Mode only.

## Stop an Application {#GUID-1E6C78A0-AFA0-44BE-BFC3-9CE77FB1E483}

When you stop an application, you prevent clients from accessing it. You can choose whether no clients can use it, or transition it to Administration Mode so that only administrative tasks can be performed.

Stopping an application does not remove its source files from the server; you can redeploy a stopped application to make it available to WebLogic Server clients again.

1.  In the **Monitoring Tree**, go to **Deployments**, then **Application Management**.

2.  Select the application that you want to stop.

3.  Click **Stop** and choose one of:

    -   **When work completes**: to allow the application to finish its work and for all currently connected users to disconnect.
    -   **Force stop now**: to stop the application immediately, regardless of the work that is being performed and the users that are connected.
    -   **Servicing non-administration requests**: to stop the application once all its work has finished, and then put the application in Administration Mode so it remains accessible for administrative purposes.

## Specify Deployment Properties {#GUID-0D2646E1-C9DB-4B65-A691-F835E0C0274A}

After you deploy an application, you can configure additional settings to meet the needs of your environment.

1.  If you haven't already, create a deployment plan for the application. You can view the default configuration settings without creating a plan but they are read-only until you create a deployment plan. For more information, see [Deployment Plans](#GUID-9FACBC3D-4F1D-4D68-82FB-68E65A992886).

    {{< notice note >}}

     You cannot create a deployment plan for applications that were auto-deployed.

    {{< /notice >}}


    1.  In the **Monitoring Tree**, go to **Deployments**, then **Application Management**, then *myApp*.

    2.  Click **Create Plan**.

    3.  In the **Plan Path** field, enter a file path for the new deployment plan. Deployment plans must be in XML format and should be called <code>plan.xml</code>.

        If possible, you should create the new deployment plan for a single application within a <code>plan/</code> subdirectory of the application's root directory.

    4.  Click **Done**. WebLogic Server will create a basic deployment plan.

        You can see the deployment plan for an application under **Deployments**: **Application Management**: *myApplication*: **Deployment Plan (Advanced)**.

2.  Go to **Deployments**, then **Application Management**, then *myApplication*, then **Configuration**. Explore the Configuration node and its children to see the available deployment configuration options.

    {{< notice note >}}

     The contents of the Configuration node and its children differ based on application type. For example, web applications include settings for container descriptors while resource adapters include settings for outbound connection pools.

    {{< /notice >}}


3.  Click **Save** as you make changes. Any changes that you make to the Configuration node and its children are automatically reflected in the deployment plan of the application.

4.  Update and possibly redeploy your application to apply your changes. See [Update or Redeploy an Application](#GUID-240675E5-E13F-4335-B0B1-E9684DAFB6A9) for instructions.


## Deployment Plans {#GUID-9FACBC3D-4F1D-4D68-82FB-68E65A992886}

Use a deployment plan to specify deployment property values for an application.

A deployment plan is an optional document that works with or overrides your application’s deployment descriptors to configure an application for deployment to a specific WebLogic Server environment. Deployment plans are written in XML.

See [Understanding WebLogic Server Deployment Plans](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEPGD-GUID-29545865-3AC0-4777-8243-A85CDB04F33C) in **Deploying Applications to Oracle WebLogic Server**.

{{< notice note >}}

 You cannot create a deployment plan for applications that were auto-deployed.

{{< /notice >}}


For deployment plan descriptions and examples, see [Understanding Deployment Plan Contents](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEPGD-GUID-003B951E-051B-4BFA-B8C5-E006C0A0FDE7) in **Deploying Applications to Oracle WebLogic Server**.

Generally, if you need to modify the deployment properties of an application, you should use the Configuration node (as described in [Specify Deployment Properties](#GUID-0D2646E1-C9DB-4B65-A691-F835E0C0274A)), instead of manually editing the deployment plan.

If your changes in the deployment plan include non-dynamic changes, you must redeploy the application to propagate the changes from the deployment plan to the application.

### Modify a Deployment Plan {#GUID-B68813D1-ADDB-44D1-BF2E-5779426A3826}

You can manually update a deployment plan with new deployment instructions for an application.

For more information, see [Manually Customizing the Deployment Plan](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEPGD-GUID-CE85B546-1757-4AE3-BC82-E2C8EC202D0C) in **Deploying Applications to Oracle WebLogic Server**.

1.  In the **Monitoring Tree**, go to **Deployments**, then **Application Management**, then *myApplication*, then **Deployment Plan (Advanced)**.

2.  You can edit the deployment plan as a whole or the individual variable assignments within a deployment plan:

    -   To edit a deployment plan document:
        1.  Select the **Deployment Plan** tab.
        2.  Edit the deployment plan directly within the text box field. You can also copy the plan contents into an external text editor, make your edits and then paste the changed data back into WebLogic Remote Console.
        3.  Click **Save**.
    -   To edit individual variable assignments:
        1.  Select the **Variable Assignments** tab.
        2.  Select the variable assignment module that you want to edit and click **Edit**.
        3.  Enter a value and, if updating an array, choose an operation.
        4.  Click **Done**.
3.  Update and possibly redeploy your application to apply your changes. See [Update or Redeploy an Application](#GUID-240675E5-E13F-4335-B0B1-E9684DAFB6A9) for instructions.


## Update or Redeploy an Application {#GUID-240675E5-E13F-4335-B0B1-E9684DAFB6A9}

After you make changes to a deployed application or its deployment plan, you need to update the application with the new instructions and possibly redeploy the application to make the changes available to WebLogic Server clients.

{{< notice note >}}



If your changes are dynamic, then you only need to update the deployment plan. However, if your changes include non-dynamic changes, you must redeploy the application to propagate the changes from the deployment plan to the application.

If you try to update a deployment plan but your changes require a redeployment, WebLogic Remote Console will prompt you to redeploy the application instead.

{{< /notice >}}


If the application is deployed in a production environment, review [Overview of Redeployment Strategies](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEPGD-GUID-69BCEEBE-D19A-4B55-B14D-DAA10A209C21) in **Deploying Applications to Oracle WebLogic Server** for guidance on limiting downtime for the application.

1.  In the **Monitoring Tree**, go to **Deployments**, then **Application Management** and select the application that you want to update.

2.  Click **Update/Reploy** and choose one of the options:

    -   **Update - Deployment Plan on Server**: Updates the application using a new deployment plan located on the server. Use this option if all of your changes are dynamic.
    -   **Update - Deployment Plan on Local Machine**: Updates the application using a new deployment plan located on the local machine and then uploads it to the Administration Server's upload directory. Use this option if all of your changes are dynamic.
    -   **Redeploy - Deployment Source and Plan on Server**: Updates a deployment plan located on the server and redeploys the application. Use this option if your changes include non-dynamic changes that require the application to restart.
    -   **Redeploy - Deployment Source and Plan on Local Machine**: Updates a deployment plan located on the local machine and redeploys the application. Use this option if your changes include non-dynamic changes that the application to restart.
3.  If necessary for your selection, enter the file path to the new deployment plan.

4.  Click **Done** to update or redeploy the application.


You can track the status of the application deployment. While still in the **Monitoring Tree**, go to **Deployments**, then **Deployment Tasks**.

## Test Application Deployment {#GUID-632CF2ED-7A6A-4AEB-B3D9-345FB5736153}

After you deploy an application, you may want to confirm that it was deployed successfully.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**, then *myServer*, then **Deployments**, then **Application Runtimes**, then *myApp*, then **Component Runtimes**, then *myServer/myApp*, then **Servlets**.

2.  Construct a URL using the target server address plus the <code>ContextPath</code> and <code>Name</code> values from the Servlets table. For example, for an application deployed on the Administration Server, a test URL might look like: <code>http://adminserver:7001/myapp/welcome</code>.

    {{< notice note >}}

     Remember to consider any changes you made to network channels that may affect the application deployment. For example, the application may be on a different port.

    {{< /notice >}}


3.  Enter the URL into your browser. If the page loads correctly, then your application was deployed successfully.


## Remove an Application from a Domain {#GUID-ECC35452-5C21-4714-B1AA-AAEC6B0BA786}

An installed application or module remains available in the domain to stop, restart, or update until you explicitly remove it. After you delete an application or module from a domain, you must redeploy it to make it available to a WebLogic Server client again.

To temporarily make a deployed application unavailable to WebLogic Server clients, consider stopping it instead of deleting it. See [Stop an Application](#GUID-1E6C78A0-AFA0-44BE-BFC3-9CE77FB1E483).

1.  In the **Edit Tree**, go to **Deployments**, then **App Deployments**.

2.  Select the application that you want to remove and click **Delete**.


## Install a Java EE Library {#GUID-BE65E318-925C-4CEC-9041-76A7214AFA6A}

A Java EE library can be a standalone EJB or Web application module, multiple EJB or Web application modules packaged in an enterprise application (EAR), or a single plain JAR file that is registered with the Java EE application container upon deployment. After the library has been installed and started, other deployed modules can reference the library.

Installing a Java EE library means making its physical file or directory known to WebLogic Server. A Java EE library can be installed as an archived EAR file or as an exploded directory. After you have installed the Java EE library, other deployed modules can start using it.

1.  In the **Edit Tree**, go to **Deployments**, then **Libraries**.

2.  Click **New**.

3.  Enter a name for the Java EE library.

4.  Select the servers and clusters to which you want to deploy the Java EE library. Make sure to target all of the servers and clusters to which modules or applications that will reference the Java EE library are deployed.

5.  Make the Java EE library (an archive file or exploded directory) that you want to install known to the Administration Server.

    -   Enable **Upload** if the Java EE library is on your file system and you need to upload it to the Administration Server. Then, click **Choose File** to browse to the library's location on your system.
    -   If the Java EE library is already in the file system of the Administration Server, then disable the **Upload** option and enter the file path to the Java EE library.
    If you specify an exploded directory, WebLogic Server installs all components it finds in and below the specified directory.

    {{< notice note >}}

    

    You can install only the following types of archive files (or their corresponding exploded directories) as Java EE libraries: EJB JARs, Web application WARs, EAR files that contain EJB JARs or WARs, or plain JAR files that contain compiled classes.

    {{< /notice >}}


6.  Select a different staging mode.

7.  Click **Create**.


Your new library appears under the Libraries node. You can make additional changes to the Java library on this page.

### Redeploy a Java EE Library {#GUID-04280303-0DAE-4C09-AFC4-957C1406C611}

When you update a Java EE library, WebLogic Server redeploys the archive file or exploded directory. Update a library if you have made changes to it and you want to make the changes available to the modules and applications deployed to WebLogic Server that are using the library.

1.  In the **Monitoring Tree**, go to **Deployments**, then **Library Management**.

2.  Select the Java EE library that you want to update.

3.  Decide how you want to update the library:

    -   Choose **Redeploy** if the changes to the library are already available on the Administration Server and you only want to make those changes available to the modules and applications that are using the library.
    -   Choose **Upload and Redeploy** if you want to upload a new archive file or exploded directory.

        In the **Source** field, enter the path to the new archive file or exploded directory. Make sure the library's latest archive is under the Administration Server's <code>upload</code> directory.

4.  Click **Done**.


## Configure JASPIC for a Web Application {#GUID-07822B40-E226-4044-8C07-4CDB6D5D007E}

If using JASPIC, you can specify which Authentication Configuration provider applies to a specific Web application.

The Java Authentication Service Provider Interface for Containers (JASPIC) specification defines a service provider interface (SPI). The JASPIC SPI is used by authentication providers that implement message authentication mechanisms that can be integrated in server Web application message processing.

You can review the JASPIC specification at **[JSR 196: Java Authentication Service Provider Interface for Containers](https://www.jcp.org/en/jsr/detail?id=196)**.

1.  If you haven't done so already, configure JASPIC in the domain.

    1.  Ensure JASPIC is enabled in the domain. In the **Edit Tree**, go to **Environment**, then **Domain**. On the **Security** tab, click **Show Advanced Fields** and confirm that **JASPIC Enabled** is turned on.

    2.  Configure an Authentication Configuration provider.

        -   To configure a WebLogic Server Authentication Configuration Provider, see [Creating a WLS Authentication Configuration Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-9B974B35-7185-4E0F-BAC3-BC066BDC1DC5) in **Administering Security for Oracle WebLogic Server**.
        -   To configure a Custom Authentication Configuration Provider, see [Creating a Custom Authentication Configuration Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-90BF8C50-7229-4F11-9738-C06EC73860F2) in **Administering Security for Oracle WebLogic Server**.
2.  In the **Monitoring Tree**, go to **Deployments**, then **Application Management**, then *myWebApp*.

3.  If the application does not have a deployment plan, click **Create Plan**.

    WebLogic Server will create a basic deployment plan for the application which you can edit using the newly created **Configuration** and **Deployment Plan (Advanced)** child nodes.

    Whenever possible, use the **Configuration** node to edit deployment properties rather than editing the deployment plan directly. See [Specify Deployment Properties](#GUID-0D2646E1-C9DB-4B65-A691-F835E0C0274A).

4.  Expand the **Configuration** node and go to the **JASPIC Container** node.

    The **JASPIC Container** node is only available for web applications.

5.  Enter the name of the Authentication Configuration provider that you configured and want to apply to this web application.

6.  Click **Save**.

7.  Redeploy the web application or restart the server.


