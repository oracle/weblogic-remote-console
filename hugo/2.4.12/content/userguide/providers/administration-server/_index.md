---
title: Administration Servers
description: How to configure WebLogic Administration Servers in the WebLogic Remote Console
weight: 1
---

The WebLogic Remote Console can connect directly to a WebLogic Administration Server to view and edit its domain, much like the WebLogic Server Administration Console, though there are [some differences]({{< relref "setup/admin-console-diff" >}}).

You can save the connection details for multiple WebLogic Administration Servers, making it easy to switch between domains with a click.
<!-- You can even choose to add the same Administration Server multiple times, as long as it's either in a different project or has a different user account associated. -->

## Connect to a WebLogic Administration Server

1. Start the WebLogic Administration Server.
1. Open the Providers drawer and beside the project name, click &#x022EE;. Select **Add Admin Server Connection Provider**.
1. Enter a name for the Administration Server connection. This is the name that will appear in the Project list of providers so you can identify which provider you’re working on.
1. Enter a username and password for a user account with editing privileges in the selected Administration Server.
As with the Administration Console, your management capabilities will be limited depending on the level of access granted to your user account. See [Understand access discrepancies]({{< relref "userguide/role-access" >}}) for more information. You can choose to have multiple connections to the same Administration Server with different users.
1. Enter the URL for the Administration Server.
    
    **Note**: Make sure that the `management/*` endpoint of your Administration Server is accessible by the WebLogic Remote Console. If your administration server's endpoints are behind a load balancer, firewall, or otherwise externally unavailable, you will need to expose that endpoint manually.
1. **Optional**:
    * If you want to force WebLogic Remote Console to connect to an Administration Server regardless of warnings about expired, untrusted, or missing certificates, enable the **Insecure Connection** checkbox. We *strongly* recommend that you only enable this setting for development or demonstration environments.
    * If you want to facilitate communication between a WebLogic Server domain that resides in a different network and the WebLogic Remote Console, enter a proxy server address in the **Proxy Override** field. You can also [set a proxy address globally]({{< relref "userguide/advanced-settings#proxy" >}}) that applies to all administration server connections.

1. Click **OK** to connect the WebLogic Remote Console to the WebLogic Administration Server.

The WebLogic Remote Console is now connected to a WebLogic Administration Server. You can make changes to the domain as desired.

{{% notice tip %}}
You can use the WebLogic Remote Console to manage a WebLogic Server domain running on Kubernetes. For details about how to set up access to WebLogic Server domains running on Kubernetes, see [Use the Remote Console](https://oracle.github.io/weblogic-kubernetes-operator/managing-domains/accessing-the-domain/remote-admin-console/) in the *WebLogic Kubernetes Operator User Guide*.
{{% /notice %}}

The Administration Server provider is split into multiple perspectives, each of which focuses on a different management area for a WebLogic domain:

* **Edit Tree**: an editable view of the WebLogic Server domain. Enter this perspective when you want to make and commit changes to the domain.
* **Configuration Tree**: a read-only view of the WebLogic Server domain. Enter this perspective if you want to see the current settings of the domain, without making any changes.    
* **Monitoring Tree**: an overview of the runtime statistics for the running domain. You can view statistics by server or aggregated across servers. For example, applications running on Server1  vs. applications running on one or more servers. The Monitoring Tree also provides some control operations such as starting or stopping servers or applications.
* **Security Data Tree**: an editable view of the security providers' data in the security realm. This includes users, groups, policies, and so on.

{{% notice note %}}
While the Edit Tree and the Configuration Tree perspectives look similar, they are generated from two separate collections of configuration MBeans, which results in important and distinct nuances between the two perspectives:

1. Changes made in the Edit Tree perspective do not appear in the Configuration Tree perspective until you commit them, or for non-dynamic changes, until you restart the server.

1. Certain dynamically computed domain contents do not appear in the Edit Tree. For example,
    * Dynamic clusters (and their servers)
    * Situational configurations 
    * Changes made from the command line using system properties
    * Changes to some production mode-related settings

For more information on the differences between editable Configuration MBeans and read-only Configuration MBeans, see [Managing Configuration Changes](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/domcf/changes.html#GUID-223E202F-DA06-45C3-B297-E66655F4E9AB) in Understanding Domain Configuration for Oracle WebLogic Server.
{{% /notice %}}


## Edit a WebLogic Administration Server {id="changes_adminserver"}

Editing a domain in the WebLogic Remote Console is similar in process to the Administration Console. When you start editing a domain, a configuration lock is created that blocks other users from making simultaneous changes. Once you're satisfied with your changes, you can activate these changes and perpetuate them to the Administration and Management Servers.

{{% notice note%}}
Certain areas and actions in the WebLogic Remote Console are hidden from non-administrators. For example, users with the Operator role cannot see the Edit Tree at all. For more information on what each user role can (or cannot) access, see [Understand Access Discrepancies]({{< relref "userguide/role-access" >}}).
{{% /notice%}}

1. Open the Providers drawer and select the Administration Server you want to edit.
1. Click the **Edit Tree** perspective and make your changes to the domain configuration. Fields marked with ![Server restart icon](/weblogic-remote-console/images/icons/restart-required-blk_24x24.png) require a server restart.
1. Click **Save** on every page after making your changes.
1. If you have the extension installed, open the Providers drawer and select **Shopping Cart** to view your changes.
1. Commit your changes. In the upper right corner of the content pane, click ![Server restart icon](/weblogic-remote-console/images/icons/shopping-cart-non-empty-tabstrip_24x24.png) and then **Commit Changes**.
1. Restart your server if necessary.
    1. Check if any servers require a restart on the **Monitoring Tree** perspective > **Environment** > **Servers** page.

{{% notice tip %}}
You can restore fields to their default value. Right-click on a field and click **Restore to default**.
{{% /notice %}}

### Shopping cart {id="shopping_cart"}

The Shopping Cart (equivalent to the Change List in the WebLogic Server Administration Console) holds all the pending changes for the current session in the WebLogic Remote Console. In the shopping cart, you can see if any changes are pending, commit those changes or discard them entirely.

If you installed the console extension, `{{<console_rest_ext>}}`, then you can also see the specific changes you've made and the status of the lock in the Change Manager. 

Open the Shopping Cart menu and click **View Changes** to see your pending changes.

Some changes can be activated immediately (dynamic) while other changes require a server restart to activate (non-dynamic). When you need to activate non-dynamic changes, navigate to the **Environment** > **Servers** node in the Monitoring perspective to see which servers need a restart.

If you need to undo a change, you must discard all Shopping Cart contents or manually revert the change in the Edit Tree perspective.

{{% notice note %}}
The configuration change lock does not prevent you from making conflicting configuration edits using the same administrator user account. For example, if you obtain a configuration change lock in the WebLogic Remote Console, and then use the Administration Console or WebLogic Scripting Tool (WLST) with the same user account, you will access the same edit session that you opened in the WebLogic Remote Console and you will not be blocked from making changes with the other tools.

We recommend against making changes using multiple tools because when one of the sessions activates their changes, it releases the lock and the other session will not be able to save or activate their changes.
{{% /notice %}}


## Edit the connection details of a WebLogic Administration Server

1. Open the Providers drawer and beside the WebLogic Administration Server connection that you want to edit, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-manage-icon-brn_24x24.png) icon.
1. Edit the details of the WebLogic Administration Server. You can change its name in WebLogic Remote Console, switch user accounts or update the URL.
1. Click **OK** to save your changes.

## View the connection details of a WebLogic Administration Server

It's easy to view the details of a WebLogic Server Connection.

1. Open the Providers drawer and beside the WebLogic Administration Server, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-info-icon-brn_24x24.png) icon.

A list of connection details will appear, including:

* Provider ID
* Domain Name
* Domain URL
* Domain Version
* Username
* Role

## Delete a connection to a WebLogic Administration Server
This will only delete the WebLogic Remote Console access to the WebLogic Administration Server. The domain itself will be unaffected.

1. Open the Providers drawer and beside the WebLogic Administration Server, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png) icon.

## Create a managed server

1. In the Edit Tree perspective, expand the **Environment** > **Servers** node.
1. Click **New**.
1. Enter a name for the new server.
1. **Optional**: If you want to copy the settings from an existing server onto your new server, select a server from the **Copy settings from another server** dropdown. Only the server's settings will be copied; children, such as channels, are not copied. Any settings that are not supported by the WebLogic Server REST API are also not copied. 
1. Click **Create**.

## Control Operations {id="controls"}
The WebLogic Remote Console provides control operations for the Administration Server in the Monitoring perspective.

### Change server state
Server state indicates the specific condition of a server in the life cycle management.

1. Open the Providers drawer and select a WebLogic Administration Server connection.
1. Choose the **Monitoring** perspective from the home page.
1. Go to **Environment** > **Servers**
1. Choose the action for the server(s):
    * Start
    * Resume
    * Suspend
    * Shutdown
    * Restart SSL
1. Choose when to initiate the action:
    * When work completes
    * Force shutdown now
1. In the dialog box, move the servers whose state you want to change from **Available** to **Chosen**.
1. Initiate the action.

## Create MBeans {id="create"}
The WebLogic Remote Console includes simplified wizards for deploying applications and creating JDBC system resources.

In most other cases, when you create a new MBean on a page, you are prompted to fill in a few key properties, such as Name, then click **Create**. Unlike the WebLogic Server Administration Console, the WebLogic Remote Console does not guide you through configuring other properties that you typically need to complete the configuration. Instead, it displays the new bean's pages where you can click through the tabs to finish configuring the bean.

{{% notice note %}}
When you configure a bean property that references another bean, you must first create the other bean. For example, if you want to assign Server1 to Cluster1, you need to create Cluster1 first, unlike in the WebLogic Server Administration Console where you can choose to create Cluster1 during server creation.
{{% /notice %}}

## Application Deployment

You can use the WebLogic Remote Console to manage the deployment process for applications to WebLogic Server. 

For more information on the general process for application deployment, see [Deploying Applications to Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/depgd/intro.html#GUID-DD8754D5-0E35-4FDC-97BD-D9CD9876CC9B).

### Install an application

When you install an application, you make its physical file or directory known to WebLogic Server. An application can be installed as an archived EAR file or as an exploded directory.

1. In the **Edit Tree**, navigate to **Deployments** > **App Deployments**.
1. Select **New**.
1. Fill in the required fields.
1. Click **Create**.
1. Commit your changes.

Your new application appears under the App Deployment node. You can make additional changes to the application on this page. 

You must start an application before it can process client requests.

### Start an application

You need to start an application to make it available to WebLogic Server clients. 

When you start an application, you can make it immediately available to clients, or you can start it in Administration Mode to first ensure that it is working as you expect. Starting in Administration Mode allows you to perform final ("sanity") checking of the distributed application directly in the production environment without disrupting clients.

1. In the Monitoring Tree, navigate to **Deployments** > **Application Management**. 
1. Select the application that you want to start.
1. Click **Start** and choose either:
    * **Servicing all requests**: to make the application immediately available to all clients.
    * **Servicing only administration request**: to make the application available in Administration Mode only.

### Stop an application

When you stop an application, you can choose whether no clients can use it, or stop it in Administration Mode so that only administrative tasks can be performed.

Stopping an application does not remove its source files from the server; you can later redeploy a stopped application to make it available to WebLogic Server clients again.

1. In the Monitoring Tree, navigate to Deployments > Application Management. 
1. Select the application that you want to stop.
1. Click **Stop** and choose either:
    * **When work completes**: to allow the application to finish its work and for all currently connected users to disconnect.
    * **Force stop now**: to stop the application immediately, regardless of the work that is being performed and the users that are connected.
    * **Servicing non-administration requests**: to stop the application once all its work has finished, but to then put the application in Administration Mode so it remains accessible for administrative purposes.

### Test application deployment {id="app-test"}

After you deploy an application, you may want to confirm that it was deployed successfully.

1. In the **Monitoring Tree**, navigate to **Environment** > **Servers** > *myServer* > **Deployments** > **Application Runtimes** > *myApp* > **Component Runtimes** > *myServer/myApp* > **Servlets**.
1. Construct a URL using the target server address plus the `ContextPath` and `Name` values from the Servlets table. For example, for an application deployed on the Administration Server, a test URL might look like `http://adminserver:7001/myapp/welcome`. 
    
    **Note**: Remember to consider any changes you made to network channels that may affect the application deployment. For example, the application may be on a different port.
1. Enter the URL into your browser. If the page loads correctly, then your application was deployed successfully.

### View an application's current state

1. In the **Monitoring Tree**, navigate to **Deployments** > **Application Management** and choose the application whose state you want to view.

### Review an application's runtime statistics

1. In the **Monitoring Tree**, navigate to **Deployments** > **Application Runtime Data** and choose the application for which you want to view runtime information.
1. Explore the child nodes of the selected application to see its various runtime data. 

### Configure Deployment {id="configure-deployment"}

After you deploy an application, you can configure additional settings to meet the needs of your environment.

1. If you haven't already, create a deployment plan for the application. You can view the default configuration settings but they are read-only until you create a deployment plan. For more information, see [Deployment Plans](#deployment-plan). 
    
    **Note**: You cannot create a deployment plan for applications that were auto-deployed.
    1. In the **Monitoring Tree**, navigate to **Deployments** > **Application Management** and select your application.
    1. Click **Create Plan**.
    1. In the **Plan Path** field, enter a file path for the new deployment plan. You should create the new deployment plan for a single application within a `plan/` subdirectory of the application's root directory. Deployment plans must be in XML format and should be called `plan.xml`.
    1. Click **Done**. WebLogic Server will create a basic deployment plan.
    
        **Note**: You can see the deployment plan for an application under **Deployments** > **Application Management** > *myApplication* > **Deployment Plan (Advanced)**.

1. Go to **Deployments** > **Application Management** > *myApplication* > **Configuration**. Explore the Configuration node and its children to see the available deployment configuration options.
    
    **Note**: The contents of the Configuration node and its children differ based on application type. For example, web applications include settings for container descriptors while resource adapters include settings for outbound connection pools.
1. Click **Save** as you make changes. Any changes that you make to the **Configuration** node and its children are automatically reflected in the deployment plan.
1. Update and possibly redeploy your application to apply your changes. See [Update or redeploy an application](#redeploy-app) for instructions.

#### Update or redeploy an application {id="redeploy-app"}

If your changes are dynamic, then you only need to update the deployment plan. However, if your changes include non-dynamic changes, you must redeploy the application to propagate the changes from the deployment plan to the application.

For more information, see [Overview of Redeployment Strategies](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/depgd/redeploy.html#GUID-69BCEEBE-D19A-4B55-B14D-DAA10A209C21) in *Deploying Applications to Oracle WebLogic Server*.

To update or redeploy an application with an updated deployment settings.

1. In the **Monitoring Tree**, navigate to **Deployments** > **Application Management** and select your application.
1. Click **Update/Redeploy**.
1. Choose one of the options:
    * Update with New Deployment Plan:
        * **Deployment Plan on Server**: Updates the application using a new deployment plan located on the server. This option only applies dynamic changes to the application.
        * **Deployment Plan on Local Machine**: Updates the application using a new deployment plan located on the local machine and then uploads it to the Administration Server's upload directory. This option only applies dynamic changes to the application.
    * **Update with Modified Existing Deployment Plan**: Updates the existing deployment plan. This option only applies dynamic changes to the application.
    * Redeploy:
        * **Deployment Plan and Source on Server**: Updates a deployment plan located on the server and redeploys the application. Use this option if your changes include non-dynamic changes that require the application to restart.
        * **Deployment Plan and Source on Local Machine**: Updates a deployment plan located on the local machine and redeploys the application. Use this option if your changes include non-dynamic changes that the application to restart.

#### Deployment Plans {id="deployment-plan"}

You can use a deployment plan to specify deployment property values for an application. A deployment plan is an optional document that works with or overrides your application's deployment descriptors to configure an application for deployment to a specific WebLogic Server environment. Deployment plans are written in XML. 

For more information, see [Understanding WebLogic Server Deployment Plans](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/depgd/config.html#GUID-29545865-3AC0-4777-8243-A85CDB04F33C) in Deploying Applications to Oracle WebLogic Server.

**Note**: You cannot create a deployment plan for applications that were auto-deployed.

Generally, if you need to modify the deployment settings of an application, you should use the Configuration node (as described in [Configure Deployment](#configure-deployment)), instead of manually editing the deployment plan.

##### Create a Deployment Plan

1. In the **Monitoring Tree**, navigate to **Deployments** > **Application Management** and select your application.
1. Click **Create Plan**.
1. In the **Plan Path** field, enter a file path for the new deployment plan. You should create the new deployment plan for a single application within a `plan/` subdirectory of the application's root directory. Deployment plans must be in XML format and should be called `plan.xml`.
1. Click **Done**.

##### Update a Deployment Plan {id="update-dep-plan"}

You can manually edit a deployment plan to update it with new deployment instructions for an application. 

For more information, see [Manually Customizing the Deployment Plan](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/depgd/export.html#GUID-CE85B546-1757-4AE3-BC82-E2C8EC202D0C) in Deploying Applications to Oracle WebLogic Server.

1. In the **Monitoring Tree**, navigate to **Deployments** > **Application Management** > *myApplication* > **Deployment Plan (Advanced)**.
1. You can edit the the deployment plan as a whole or the individual variable assignments within a deployment plan:
    * To edit a deployment plan document:
        1. Select the **Deployment Plan** tab.
        1. Edit the deployment plan directly within the text box field or copy and paste the plan into a text editor. Make your edits and then copy and paste it back into the WebLogic Remote Console.
        1. Click **Save**.
    * To edit individual variable assignments:
        1. Select the variable assignment module that you want to edit and click **Edit**.
        1. Enter a value and, if updating an array, choose an operation.
        1. Click **Done**.
1. You will need to update and possibly redeploy your application to apply your changes. See [Update or redeploy an application](#redeploy-app) for instructions.
