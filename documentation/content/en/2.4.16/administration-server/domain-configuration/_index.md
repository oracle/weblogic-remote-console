---
weight: 33
title: Domain Configuration
---



Use WebLogic Remote Console to make configuration changes to your WebLogic Server domain through its Administration Server.

## Connect to an Administration Server {#GUID-37C3DE03-B1A7-42AA-B596-83D7A9520D33}

You can connect to a running WebLogic Server domain through its Administration Server and then manage its configurations using WebLogic Remote Console.

1.  Start the Administration Server.

    See [Starting and Stopping Servers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=START-GUID-762370A1-00C4-4EBB-92FC-5E33B97B6716) in **Administering Server Startup and Shutdown for Oracle WebLogic Server** for instructions.

2.  Open the **Providers** drawer and click **More ︙**.

3.  From the list, select **Add Admin Server Connection Provider**.

4.  Enter a name for the Administration Server.

    This name appears in the Project list of providers so you can identify which domain you're connected to.

5.  **Optional**: *For domains running WebLogic Server 14.1.2.0.0 or later only:* If you have configured WebLogic Server to delegate authentication to an external service using a browser, enable the **Use Web Authentication** option. Otherwise, leave it unselected and enter credentials for a local user account as described in step [6](#STEP_YRV_XJM_BDC).

    For more information, see [Configure Web Authentication](#GUID-A6191FE0-2A4C-45B6-A138-7FD9B157D28F).

6.  <a id="STEP_YRV_XJM_BDC"></a>Enter a username and password for a user account in the domain.

    Log in with a user who has the necessary privileges for the tasks you plan to perform. To prevent unauthorized modifications, WebLogic Remote Console limits which tasks and screens are available to a user, based on their role.

7.  In the **URL** field, enter the URL for the Administration Server.

    For example:

    ```
    http://localhost:7001
    ```

    Make sure that the <code>management/\*</code> endpoint of your Administration Server is accessible by WebLogic Remote Console. If your Administration Server's endpoints are behind a firewall, load balancer, or otherwise externally unavailable, you will need to expose the endpoint manually.

    If you are using Hosted WebLogic Remote Console, you will also need to expose the <code>rconsole/\*</code> endpoint.

8.  **Optional**: If you want WebLogic Remote Console to ignore warnings about expired, untrusted, or missing certificates when connecting to an Administration Server, enable the **Make Insecure Connection** checkbox. We recommend that you only enable this setting for development or demonstration environments.

9.  **Optional**: If this WebLogic Server domain resides in a different network, you can still facilitate communication between it and WebLogic Remote Console. In the **Proxy Override** field, enter a proxy server address.

    You can also set a proxy address that applies to all Administration Server connections. See [Connect using a Proxy Server](#GUID-D7AD7F50-88F8-4FC9-A28B-CBF98B5FD479).

10. Click **OK**.


After you connect successfully, you can begin managing your WebLogic Server domain. To understand how WebLogic Remote Console presents a domain structure, see [Perspectives in the Administration Server Provider](#GUID-E1D3A576-47A8-4291-9F56-617B1039168F).

You can view and update the connection details for an Administration Server provider in the **Providers** drawer.

### Connect using SSL/TLS {#GUID-660C99D2-4F3F-4276-B3E2-E725A27D1C82}

If you want to connect to a WebLogic Server domain using SSL/TLS, you may need to perform some additional configuration steps in WebLogic Remote Console.

If you specified HTTPS for the domain URL when you connected to the Administration Server, then WebLogic Remote Console uses SSL/TLS to communicate with the domain.

The SSL/TLS connection requires trust in the WebLogic Server domain, where the trust configuration is handled by the underlying JDK JSSE support. By default, the JDK uses the <code>cacerts</code> truststore provided with the JDK. If the domain requires additional trust, separate trust, or is using the WebLogic Server demo trust, then you’ll need to configure SSL/TLS trust.

You can either use WebLogic Remote Console to specify the type and location of the trust store (as described below), or use the <code>keytool</code> utility to import the required trust certificates into the <code>cacerts</code> truststore supplied with the JDK. See [The keytool Command](https://docs.oracle.com/en/java/javase/17/docs/specs/man/keytool.html) in **Java Development Kit Version 17 Tool Specifications**.

1.  In WebLogic Remote Console, go to **File**, then **Settings**. (On macOS, go to **WebLogic Remote Console**, then **Settings**.)

2.  Under the **Networking** section, in the **Trust Store Type** field, enter the algorithm name for your trust store. Depending on the Trust Store Type that you provide, additional fields may appear.

    See [JDK Providers Documentation](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JSSEC-GUID-FE2D2E28-C991-4EF9-9DBE-2A4982726313) in **Java Security Developer's Guide** for specific algorithm names.

3.  Click **Choose a trust store file** to browse to the file location of your trust store.

4.  Beside the **Trust Store Password** field, click **Change**, then enter the secret for your trust store.

5.  Click **Save** to add the secret.

6.  **Optional**: If you want WebLogic Remote Console to support two-way SSL/TLS, perform the following steps:

    1.  In the **Identity Key Store Type** field, enter the algorithm name for your identity key store. Depending on the Identity Key Store Type that you provide, additional fields may appear.

    2.  Click **Choose an identity key store file** to browse to the file location of your identity key store.

    3.  Beside the **Identity Store Key Password** field, click **Change**, then enter the secret for your identity key store.

    4.  Click **Save** to add the secret.

7.  Click **Save** (for the **Settings** dialog box) to apply your changes.


### Configure Web Authentication {#GUID-A6191FE0-2A4C-45B6-A138-7FD9B157D28F}

You can delegate authentication of users from WebLogic Remote Console to an external authentication service.

By default, WebLogic Remote Console uses the Basic HTTP authentication scheme to authenticate users. If you want to replace Basic authentication with another authentication scheme, perhaps to support a single sign-on flow, you can enable the **Use Web Authentication** option to send users through an alternative login process, using the browser.

{{< alert title="Note" color="primary" >}}



This functionality is only available on domains running WebLogic Server 14.1.2.0.0 or later.

{{< /alert >}}


When web authentication is enabled, the default Basic authentication HTTP header is replaced by using a WebLogic Server token for REST communications. Users are sent to a login endpoint that is generated by taking the domain URL of the connected Administration Server and then adding the Remote Console Helper Context Path (the default is <code>console</code>), and then <code>login</code>. For example, the full URL might look like: <code>https://*administrationServer*:7002/console/login</code>.

In the URL, notice that the protocol is <code>https</code> and the port number is <code>7002</code> (the default port number for the SSL/TLS listen port). To use web authentication, you must configure SSL/TLS.

Web authentication in WebLogic Remote Console is facilitated by the WebLogic Remote Console Helper, an application included with WebLogic Server. If necessary, you can customize settings for this application to fit your web authentication process.

For user accounts that are authenticated through the embedded LDAP server (WebLogic Authentication provider) or another supported LDAP or RDBMS authentication provider, you do not need to perform any further configuration.

However, if you want to authenticate virtual users, you must make these users known to WebLogic Server by adding them to an LDAP or RDBMS authentication provider as the REST communication from WebLogic Remote Console does not directly support the use of virtual users.

The general process for setting up web authentication is as follows:

1.  Configure SSL/TLS for your domain. See [Set Up SSL/TLS](../securing-domains#GUID-E4A623A5-532D-443B-BA39-0E13B004EB94).

2.  Configure your authentication provider.

    In **Administering Security for Oracle WebLogic Server**, see:

    -   [About Configuring the Authentication Providers in WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-E56E30B4-5C18-4A21-A683-AC166792A9DE)
    -   [Configuring the WebLogic Authentication Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-F61EF14D-7461-4F29-80D9-A171DEE3E882)
    -   [Configuring LDAP Authentication Providers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-C1478BFB-A1FF-46F0-8931-627A00B7945A)
    -   [Configuring RDBMS Authentication Providers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-8E2F4AEB-A54E-48E9-BB6B-7B6AF7C4FDC5)
3.  Ensure that both the login and management endpoints (<code>console/\*</code> and <code>management/\*</code>, respectively) of your Administration Server are accessible by WebLogic Remote Console. If your Administration Server's endpoints are behind a firewall, load balancer, or otherwise externally unavailable, you will need to expose those endpoints manually.

    The <code>console/\*</code> endpoint handles requests to obtain the identity token so it should be protected by a policy defined by your identity and access management (IAM) solution, where these policies typically enable an SSO solution. The <code>management/\*</code> endpoint is the service endpoint that is protected by the token obtained after authentication with the <code>console/\*</code> endpoint completes successfully.

    {{< alert title="Note" color="primary" >}}



    If you want to customize the login endpoint, you can replace the <code>console</code> segment of the login endpoint. The <code>login</code> segment remains unchanged. However, if you modify the login endpoint, it can prevent WebLogic Remote Console from successfully connecting to *any* Administration Server. Do not change it unless you fully understand how changing the login endpoint will affect access to your environments. Consider configuring a proxy server to route requests to WebLogic Server instead.

    To customize the login endpoint, update the Remote Console Helper Context Path attribute (see step [4](#STEP_JMG_NLW_CDC)) with a new endpoint and restart WebLogic Server.

    Then, go to **File**, then **Settings**. (On macOS, go to **WebLogic Remote Console**, then **Settings**.) Under the **Other Java System Properties** section, click **+** to add a new row and enter <code>console.ssoDomainLoginUri=/*newEndpoint*/login</code>.

    {{< /alert >}}


4.  <a id="STEP_JMG_NLW_CDC"></a>**Optional**: Customize the Remote Console Helper.

    1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

    2.  Click **Show Advanced Fields**.

    3.  Edit the following Remote Console Helper attributes as needed:

        -   Remote Console Helper Enabled
        -   Remote Console Helper Context Path
        -   Remote Console Helper Cookie Name
        -   Remote Console Helper Session Timeout
        -   Remote Console Helper Protected Cookie Enabled
        -   Remote Console Helper Token Timeout
    4.  Click **Save**.

5.  **Optional**: If you want to support the authentication of virtual users, then you must add each virtual user to the default authentication provider (WebLogic Authentication provider) or another configured LDAP or RDBMS provider. The REST communication from WebLogic Remote Console does not directly support the use of virtual users.

    Make sure to add the users as members of a group with permissions to accomplish their responsibilities, such as Administrators, Operators, or so on.

    If you add the virtual user to the WebLogic Authentication provider, then you can use WebLogic Remote Console to create the user as described in [Create a User](../securing-domains#GUID-7A265AF1-F634-45EE-B685-C969A95DC476). Otherwise, to add a virtual user to the provider, you'll need to use an external tool specific to the provider.

6.  When connecting to the Administration Server using WebLogic Remote Console:

    1.  Enable the **Use Web Authentication** option.

    2.  Ensure the Administration Server **URL** is using <code>https</code> and the SSL/TLS listen port (default is 7002). If the administration port is enabled, the default port value is 9002 instead.

        For example:

        -   <code>https://*administrationServer*:7002</code>
        -   <code>https://*administrationServer*:9002</code>

#### Enable SAML 2.0 SSO for WebLogic Remote Console {#GUID-944447EB-4328-4F16-9BF5-75EBE646B3E1}

If you configure WebLogic Server as a SAML 2.0 Service Provider site, you can use it to implement single sign-on (SSO) functionality for WebLogic Remote Console.

For an overview of the steps required to set up web authentication in WebLogic Remote Console, see [Configure Web Authentication](#GUID-A6191FE0-2A4C-45B6-A138-7FD9B157D28F).

{{< alert title="Note" color="primary" >}}



As this functionality relies on web authentication, it is only supported on domains running WebLogic Server 14.1.2.0.0 or later.

{{< /alert >}}


1.  Configure WebLogic Server as a SAML 2.0 Service Provider site as described in [Configuring a Service Provider Site for SAML 2.0 Single Sign-On](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-FF3CADAD-B630-4CEC-AD95-DB05F00237A3) in **Administering Security for Oracle WebLogic Server**.

    Make sure to:

    -   Add <code>/console/login</code> to the list of Identity Provider partner redirect URIs. See [Configure Redirect URIs](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-C947F29B-872A-49CC-B946-5738AB93B7A9) in **Administering Security for Oracle WebLogic Server**.

    -   Secure the published site URL by using <code>https</code> and the SSL/TLS listen port. For example, <code>https://wls.example.com:7002/saml2</code>. See [About SAML 2.0 General Services](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-F11352EE-6FF1-4B96-83B4-FA375BF4D5E5) in **Administering Security for Oracle WebLogic Server**.

2.  **Optional**: If you want to support the authentication of virtual users, then you need to configure an LDAP or RDBMS authentication provider and add each virtual user to that provider. The REST communication from WebLogic Remote Console does not directly support the use of virtual users.

    If you add the virtual user to the WebLogic Authentication provider, then you can use WebLogic Remote Console to create the user as described in [Create a User](../securing-domains#GUID-7A265AF1-F634-45EE-B685-C969A95DC476). Otherwise, to add a virtual user to the provider, you'll need to use an external tool specific to the provider.

    Make sure to add the users as members of the Administrators group.

3.  Update the Remote Console Helper attributes to support SAML 2.0 SSO.

    1.  In WebLogic Remote Console, in the **Edit Tree**, go to **Environment**, then **Domain**.

    2.  Click **Show Advanced Fields**.

    3.  Update the values for the following Remote Console Helper attributes as specified:

        -   **Remote Console Helper Cookie Name**: <code>JSESSIONID</code>
        -   **Remote Console Helper Protected Cookie Enabled**: <code>false</code>
    4.  Click **Save**.


### Connect using a Proxy Server {#GUID-D7AD7F50-88F8-4FC9-A28B-CBF98B5FD479}

You may need to configure settings for a proxy server to facilitate communication between WebLogic Remote Console and a WebLogic Server domain that resides in a different network.

You can configure a global proxy server that applies to all Administration Server connections or you can assign proxy server settings individually to each Administration Server connection.

You can also configure a combination of global and individual settings; the individual proxy server settings will override the global proxy server settings.

-   To apply a global proxy server that affects all Administration Server connections:

    1.  Go to **File**, then **Settings**. (On macOS, go to **WebLogic Remote Console**, then **Settings**.)

    2.  Under the **Networking** section, in the **Proxy Address** field, enter the address of the proxy server, including both the host name and port number.

    3.  Click **Save** to apply your changes.

    Although it is possible to create multiple global proxy servers using Java system properties, we do not recommend it. Configuring multiple global proxy servers can lead to unexpected and unwanted behavior. This applies even if the proxy servers use different protocols: if you use Java system properties to add a proxy server that uses HTTPS and then another that uses SOCKS, WebLogic Remote Console will ignore the SOCKS proxy server.

    The proxy server value in the **Settings** dialog box takes precedence over global proxy server settings that were set using Java system properties.

-   To apply proxy server settings to a single Administration Server connection:

    1.  Open the **Providers** drawer.

    2.  Beside the Administration Server provider where you want to configure a proxy server, click **Settings**.

    3.  In the **Proxy Override** field, enter the address of the proxy server, including both the host name and port number.

        {{< alert title="Note" color="primary" >}}

         If you want to bypass a global proxy server and make a direct connection, enter <code>DIRECT</code>.

        {{< /alert >}}


    4.  Click **OK**.


### Change Network Timeout Settings {#GUID-DE8161AA-2664-4248-AB9E-2147BDB3A65F}

You can change the default settings for the connection and read timeout limits used with a WebLogic Server domain from WebLogic Remote Console.

1.  Go to **File**, then **Settings**. (On macOS, go to **WebLogic Remote Console**, then **Settings**.)

2.  Under the **Networking** section, in the **Administration Server Connection Timeout** field, specify an interval (in milliseconds) to determine how long the WebLogic Remote Console should wait for a successful connection to a domain. The default is 10 seconds (10 000 milliseconds).

3.  In the **Administration Server Read Timeout** field, specify an interval (in milliseconds) to determine how long the WebLogic Remote Console should wait for a response from the server. The default is 20 seconds (20 000 milliseconds).

4.  Click **Save** to apply your changes.


When changing network timeout settings, the primary impact will be to the response time for Console threads, while the application will show no data when a timeout occurs. Timeouts are more likely to occur during requests where WebLogic Server experiences longer initialization or execution times, such as during runtime monitoring actions of servers.

### Disable Host Name Verification in Connections to the Domain {#GUID-85D3E2FF-86EA-49E1-8BAE-5ECB1A9A9E1E}

When using WebLogic demo trust to connect to a domain, it may be necessary to disable host name verification.

When host name verification is disabled, WebLogic Remote Console does not verify that the host name in the URL to which a connection is made matches the host name in the digital certificate that the server sends back as part of the SSL connection.

1.  Go to **File**, then **Settings**. (On macOS, go to **WebLogic Remote Console**, then **Settings**.)

2.  Under the **Networking** section, under **Disable Host Name Verification**, select **Yes** to disable host name verification or **No** to enable host name verification.

3.  Click **Save** to apply your changes.


### Using Java System Properties {#GUID-352F58BB-AE18-4414-9A9A-64A96429DAF0}

WebLogic Remote Console supports the use of Java system properties to customize the console if a specific setting is not available.

{{< alert title="Note" color="primary" >}}

 If the equivalent setting already exists in the **Settings** dialog box, we recommend using that configuration option instead of a Java system property. For example, use the **Proxy Address** option under **Networking** rather than <code>https.proxyHost</code> and <code>https.proxyPort</code>.

{{< /alert >}}


To add a Java system property to WebLogic Remote Console:

1.  Go to **File**, then **Settings**. (On macOS, go to **WebLogic Remote Console**, then **Settings**.)
2.  Under the **Other Java System Properties** section, click **+** to add a new row and enter the Java system property as a name-value pair, separated by <code>=</code>. For example, <code>server.port=8092</code>.

To delete a property, select the row and click **-**.

#### Examples {}



<table id="GUID-352F58BB-AE18-4414-9A9A-64A96429DAF0__TABLE_KSZ_MGQ_CBC">
                           <span>Lists some examples of supported Java system properties</span>
                           <thead>
                              <tr>
                                 <th>Usage</th>
                                 <th>Syntax</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td>
                                    <p>To set the <code>SameSite</code> cookie attribute if required for web browser support.</p>
                                    <p>When WebLogic Remote Console establishes a connection with the WebLogic Server domain, a HTTP cookie is established with the Web Browser session.</p>
                                    <p>For security reasons, the <code>SameSite</code> attribute of the HTTP cookie may need to be set for the Web Browser to accept the HTTP session cookie.</p>
                                 </td>
                                 <td>
                                    <p>Set both properties:</p>
                                    <ul id="GUID-352F58BB-AE18-4414-9A9A-64A96429DAF0__UL_AJK_FHQ_CBC">
                                       <li>
                                          <p>
                                             <code>console.enableSameSiteCookieValue=true</code>
                                          </p>
                                       </li>
                                       <li>
                                          <p>
                                             <code>console.valueSameSiteCookie=Lax|Strict</code>
                                          </p>
                                          <p>The default is <code>Lax</code>.</p>
                                       </li>
                                    </ul>
                                 </td>
                              </tr>
                              <tr>
                                 <td>
                                    <p>To specify an alternative location for the JDK.</p>
                                 </td>
                                 <td>
                                    <code>javaPath=<em>pathToJDK</em>
                                    </code>
                                 </td>
                              </tr>
                              <tr>
                                 <td>
                                    <p>To specify a custom logging configuration file so you can control the logging information that WebLogic Remote Console collects.</p>
                                    <p>The custom logging configuration file must follow the Java format for configuration files. You can see an example of a Java logging configuration file at <code>$JAVA_HOME/conf/logging.properties</code>.</p>
                                    <p>If a problem occurs with your custom logging configuration file, WebLogic Remote Console will fallback to use its default logging configuration file. <code>STDOUT</code> includes a log message indicating which file was used.</p>
                                 </td>
                                 <td>
                                    <code>java.util.logging.config.file=&lt;path-to-logging.properties&gt;</code>
                                 </td>
                              </tr>
                           </tbody>
                        </table>




## Configuring a WebLogic Server Domain {#GUID-1CD33411-D8B9-4CAB-88FE-1D043B5FEEEE}

After you connect to an Administration Server with WebLogic Remote Console, you are ready to make configuration changes to your domain.

For a comprehensive explanation of domain configuration in WebLogic Server, see [Understanding Oracle WebLogic Server Domains](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DOMCF-GUID-64E1CAC9-78A5-491C-BE42-6CBB81AA774B) in **Understanding Domain Configuration for Oracle WebLogic Server**.

In WebLogic Remote Console, it is a generally two step process to apply configuration changes to your domain.

### Step One: Edit {}

When you make changes to your domain, they are saved in a Pending state. They are not active in the domain but you can make changes in other areas without losing them and even if you log out of WebLogic Remote Console, the domain will retain those changes.

You can see your pending changes in the Shopping Cart. In the Shopping Cart, click **View Changes**. If you cannot see specific changes in the Shopping Cart, [Install the WebLogic Remote Console Extension](../../set-console#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591).

WebLogic Remote Console protects your edits from being overwritten by other users by enforcing a configuration lock that prevents other users from making changes to the domain during your editing session. You will retain this lock until you commit (or discard) your changes.

{{< alert title="Note" color="primary" >}}



The configuration lock only prevents conflicts from *other* users. If you use the same user account to log in to another WebLogic Server system administration tool such as the WebLogic Scripting Tool (WLST), then WebLogic Server considers both sessions as the same edit session.

Avoid using making changes using multiple tools simultaneously. When one session commits its changes, it releases the configuration lock and discards changes from the other session.

{{< /alert >}}


### Step Two: Commit {}

When you are satisfied with your changes, you must commit them for the changes to apply to the domain. Open the Shopping Cart and then click **Commit Changes**.

Some configuration changes apply to the domain immediately - these are called dynamic changes. Other configuration changes require a server restart to take effect and are called non-dynamic changes. A server restart required icon ![Restart required](/weblogic-remote-console/images/ui-icons/restart-required-blk-24x24.png) appears beside any attribute that is non-dynamic.

{{< alert title="Note" color="primary" >}}

 If your set of changes contains both dynamic and non-dynamic changes, then none of the changes will take effect until after a server restart. This ensures that the configuration changes are not partially, and potentially imperfectly, implemented.

{{< /alert >}}


WebLogic Remote Console releases the configuration lock after your changes are committed.

You may not need to restart all servers to apply non-dynamic changes. In the **Monitoring Tree**, go to **Environment**, then **Servers** to see which servers require a restart.

{{< alert title="Note" color="primary" >}}

 Any actions are performed within the Monitoring Tree or Security Data tree perspectives do not require a commit step. They are active immediately after the changes are saved.

{{< /alert >}}


### Back Up Configuration Files {#GUID-6A1B7D7D-174F-417F-907D-900442FF0A87}

You can set WebLogic Server to save a domain's existing configuration state before pending changes are committed. If you ever need to reverse a change, then WebLogic Server has the previous set of configuration files (including the central configuration file, <code>config.xml</code>) available as a back up.

1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

2.  Click **Show Advanced Fields**.

3.  Turn on the **Configuration Archive Enabled** option.

4.  In the **Archive Configuration Count** field, enter the number of archive files to retain.

    When the maximum number of archive files is reached, older archive files will be discarded.

5.  Click **Save**.


Backups of the previous configuration files are saved in the <code>*DOMAIN_HOME*/configArchive</code> directory, in JAR files named <code>config-1.jar</code>, <code>config-2.jar</code>, and so on. The archived files are rotated so that the newest file has a suffix with the highest number. For more information, see [configArchive](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DOMCF-GUID-6910890D-D82B-4B2E-B5FD-AE51E01F4011) in **Understanding Domain Configuration for Oracle WebLogic Server**.

## Perspectives in the Administration Server Provider {#GUID-E1D3A576-47A8-4291-9F56-617B1039168F}

The Administration Server provider is split into multiple perspectives, each of which focuses on a different management area for a WebLogic Server domain.

-   **Edit Tree**: an editable view of the WebLogic Server domain. Use this perspective when you want to make changes and commit them to the domain.
-   **Configuration View Tree**: a read-only view of the WebLogic Server domain. Enter this perspective if you want to see the current settings of the domain, without making any changes.
-   **Monitoring Tree**: an overview of the runtime statistics for the running domain. You can view statistics per server or aggregated across all servers in the domain. For example, compare applications running on Server1 vs. applications running on one or more servers. The Monitoring Tree also provides some control operations such as starting and stopping servers or applications.
-   **Security Data Tree**: an editable view of the security providers' data in the security realm. This includes users, groups, policies, and so on.

{{< alert title="Note" color="primary" >}}

 Although the Edit Tree and the Configuration View Tree perspectives look similar, they are generated from two separate collections of configuration MBeans, which results in important and distinct nuances between the two perspectives:

1.  Changes made in the Edit Tree perspective do not appear in the Configuration View Tree perspective until you commit them, or, for non-dynamic changes, until you restart the server.
2.  Certain dynamically computed domain contents do not appear in the Edit Tree. For example,
    -   Dynamic clusters (and their servers)
    -   Situational configurations
    -   Changes made from the command line using system properties
    -   Changes to some production mode-related settings

For more information on the differences between editable Configuration MBeans and read-only Configuration MBeans, see [Managing Configuration Changes](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DOMCF-GUID-223E202F-DA06-45C3-B297-E66655F4E9AB) in **Understanding Domain Configuration for Oracle WebLogic Server**.

{{< /alert >}}


### Where do I? {}

The majority of domain configuration is performed within the **Edit Tree** perspective. However, there are some tasks that are performed in the Monitoring Tree or the Security Data Tree perspectives. These tasks do not require a commit step and become active immediately after your changes are saved.

{{< alert title="Note" color="primary" >}}

 The Configuration View Tree perspective is read-only and no management tasks are performed within it. Therefore, it's not included in this table.

{{< /alert >}}


<table id="GUID-E1D3A576-47A8-4291-9F56-617B1039168F__TABLE_XXF_KS2_GZB">
                        <caption>
                           <span>
                              <span>Table 1. </span>Tasks in Each
                    Perspective. </span>
                           <span>Identifies which perspective is responsible for different
                    management tasks.</span>
                        </caption>
                        <thead>
                           <tr>
                              <th>Task</th>
                              <th>Edit Tree</th>
                              <th>Monitoring Tree</th>
                              <th>Security Data Tree</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td>Start or stop a server</td>
                              <td> </td>
                              <td>✔</td>
                              <td> </td>
                           </tr>
                           <tr>
                              <td>Deploy an application</td>
                              <td>✔</td>
                              <td> </td>
                              <td> </td>
                           </tr>
                           <tr>
                              <td>Start or stop an application</td>
                              <td> </td>
                              <td>✔</td>
                              <td> </td>
                           </tr>
                           <tr>
                              <td>Configure servers, clusters, and machines</td>
                              <td>✔</td>
                              <td> </td>
                              <td> </td>
                           </tr>
                           <tr>
                              <td>Manage access control</td>
                              <td> </td>
                              <td> </td>
                              <td>✔</td>
                           </tr>
                           <tr>
                              <td>Manage users, groups, roles, policies</td>
                              <td> </td>
                              <td> </td>
                              <td>✔</td>
                           </tr>
                           <tr>
                              <td>Configure security providers</td>
                              <td>✔</td>
                              <td> </td>
                              <td> </td>
                           </tr>
                           <tr>
                              <td>Configure database connectivity</td>
                              <td>✔</td>
                              <td> </td>
                              <td> </td>
                           </tr>
                           <tr>
                              <td>Configure messaging</td>
                              <td>✔</td>
                              <td> </td>
                              <td> </td>
                           </tr>
                           <tr>
                              <td>Diagnose domain issues</td>
                              <td> </td>
                              <td>✔</td>
                              <td> </td>
                           </tr>
                           <tr>
                              <td>Configure SSL/TLS</td>
                              <td>✔</td>
                              <td> </td>
                              <td> </td>
                           </tr>
                           <tr>
                              <td>Create dashboards</td>
                              <td> </td>
                              <td>✔</td>
                              <td> </td>
                           </tr>
                        </tbody>
                     </table>




## Access Limitations {#GUID-BA0BFEB9-FA9D-4063-90E0-1D44551FB2E2}

To prevent unauthorized changes to your WebLogic Server domains, WebLogic Remote Console limits its functionality based on a user's role.

If you log in as a user whose role has limited permissions, WebLogic Remote Console automatically adjusts its user interface to conceal the areas to which you do not have access. Users with the administrator role have full access to WebLogic Remote Console.

If you want to see the full user interface of WebLogic Remote Console, regardless of your current role, then open **File** then **Settings**. (On macOS, go to WebLogic Remote Console, then **Settings**.) Under the **Role Checking** section, set **Restrict Content Based On Role** to **No** and click **Save**. A user with limited permissions can now *see* everything but they are still blocked from performing any actions beyond the scope of their role.

{{< alert title="Note" color="primary" >}}



These restrictions are based on the default security policies assigned to each role. If you customize the policies to add or remove access beyond the default policies, those changed permissions will not be reflected in WebLogic Remote Console. It will continue to hide or show functionality based on the default security policies.

For more information, see [Users, Groups, And Security Roles](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-A313D8DB-50DB-43EE-8BA1-EDECDC0DE2FE) in **Securing Resources Using Roles and Policies for Oracle WebLogic Server**.

{{< /alert >}}


[Table 2](#TABLE_T22_2WX_HZB) provides some examples of the limitations that users in non-Administrator roles might encounter.



<table id="GUID-BA0BFEB9-FA9D-4063-90E0-1D44551FB2E2__TABLE_T22_2WX_HZB">
                     <caption>
                        <span>
                           <span>Table 2. </span>Access Limitations based on Role. </span>
                        <span>Some examples of the limitations based on role.</span>
                     </caption>
                     <thead>
                        <tr>
                           <th>Role</th>
                           <th>Limitations</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>Deployer</td>
                           <td>User can view but not edit server or domain configurations. They can also modify areas related to application deployment including some JDBC and JMS resources.</td>
                        </tr>
                        <tr>
                           <td>Monitor</td>
                           <td>User access to WebLogic Remote Console is entirely read-only.</td>
                        </tr>
                        <tr>
                           <td>Operator</td>
                           <td>User can start and stop servers but cannot see the Edit Tree perspective.</td>
                        </tr>
                     </tbody>
                  </table>




## Configure Managed Servers {#GUID-6E2CC0CB-C93A-41A6-B4D0-F29114F9F756}

Managed Servers are subordinate servers that are managed indirectly through the domain's Administration Server.

In a typical production environment, you should create one or more Managed Servers in the domain to host business applications and only use the Administration Server to configure and monitor the Managed Servers.

You can configure Managed Servers as standalone instances or organize them into clusters. See [Managed Servers and Managed Server Clusters](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=INTRO-GUID-851570F6-57E5-4A15-9B8A-F2D36D9DAE22) in **Understanding Oracle WebLogic Server**.

### Create a Managed Server {#GUID-50C0A18E-83F6-4865-ABF7-6127D0D0F49D}

1.  In the **Edit Tree**, go to **Environment**, then **Servers**.

2.  Click **New**.

3.  Enter a name for the new server.

    See [Domain and Server Name Restrictions](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DOMCF-GUID-AB0C82F6-39F2-4CF7-9187-6685050ABDC3) in **Understanding Domain Configuration for Oracle WebLogic Server**.

4.  **Optional**: You can copy the settings from an existing server onto your new server. Select a server from the **Copy settings from another server** drop-down list.

    Only the server's settings will be copied. Children, such as channels, are not copied. Any settings that are not supported by the WebLogic Server REST API are also not copied.

5.  Click **Create**.


This process creates a standalone Managed Server. If you want to add the Managed Server to a cluster, follow the instructions in [Assign a Managed Server to a Cluster](#GUID-82FCF3FB-DEA8-4C95-989D-80C9768A6C0E).

### Start a Managed Server {#GUID-5068F3C9-B5A4-4CF3-84B0-B2449942AD40}

Start a Managed Server from WebLogic Remote Console.

1.  Configure Node Manager for use with Managed Servers.

    If you have already configured Node Manager, you can skip to the next step.

    1.  Choose a Node Manager implementation. See [Node Manager Implementations](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=NODEM-GUID-EA5A556B-EC4D-4FC6-B1E4-4C8F32DAF95C) in **Administering Node Manager for Oracle WebLogic Server**.

    2.  Configure your Node Manager implementation. See either [Configuring Java Node Manager](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=NODEM-GUID-C5ECF12B-64D4-4E0B-AF92-1627FD74510B) or [Configuring Script-Based Node Manager](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=NODEM-GUID-C5DE86A4-2C03-4C09-B30E-BDD28B314C2E) in **Administering Node Manager for Oracle WebLogic Server**.

    3.  Start Node Manager on the computer that you want to host the Managed Server.

2.  Configure the Managed Server to communicate with Node Manager.

    If you have already configured communication between your Managed Servers and the Node Manager, you can skip to the next step.

    1.  [Configure Machines](#GUID-2B9396AC-B40B-4AB2-B055-EA8FB52DED0B).

    2.  [Assign a Server Instance to a Machine](#GUID-47BC8E98-37A5-4F87-BB5A-F4DC4E40E5D5).

    3.  [Configure Startup Arguments for a Managed Server](#GUID-C1986FE5-E41C-41CC-880E-D6C78A691A7C).

3.  **Optional**: Change the startup mode for the Managed Server. The default is <code>RUNNING</code>. See [Specify a Startup Mode](#GUID-2802C481-742D-4EC6-8094-1734C19288C4).

4.  Start Node Manager on the computer that you want to host the Managed Server.

    The WebLogic Server custom installation process optionally installs and starts Node Manager as a Windows service on Windows systems. If it's not already running, you can start Node Manager manually at a command prompt or with a script. See [Starting and Stopping Node Manager](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=NODEM-GUID-53961E3A-D8E1-4556-B78A-9A56B676D57E) in **Administering Node Manager for Oracle WebLogic Server**.

5.  In the **Monitoring Tree**, go to **Environment**, then **Servers**.

6.  Select the server you want to start, then click **Start**.


Node Manager starts the server on the target machine. When the Node Manager finishes its start sequence, the server's state is indicated in the **State** column.

### Configure Startup Arguments for a Managed Server {#GUID-C1986FE5-E41C-41CC-880E-D6C78A691A7C}

In most environments, Node Manager can start a server without requiring you to specify startup options. However, if you have modified your environment, such as adding classes to the WebLogic Server class path, you must specify startup options before you can use WebLogic Remote Console to start a server.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**.

2.  Select the Managed Server that you want to configure startup arguments for.

3.  On the **Advanced** tab, select the **Node Manager** subtab.

4.  If you want the server instance to run under a different WebLogic Server user account, enter the username and password of an existing user in the **User Name** and **Password** fields. The user must have a role with permission to start servers.

    The existing username and password are the values that you supplied when you used WebLogic Remote Console or the Configuration Wizard to create the server.

5.  Update any other fields where you want to override the default values provided by the Node Manager.

    WebLogic Remote Console *replaces* the Node Manager default values, it does not append the new values to the default values. For more information, see [Reviewing nodemanager.properties](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=NODEM-GUID-726AB710-EE45-4756-918B-6BCF7EEBF8EA) in **Administering Node Manager for Oracle WebLogic Server**.

    All paths refer to paths on the Node Manager machine.

    -   If you provide values for the **Class Path** field, make sure that you provide the full class path required to start the Managed Server.

    -   If you want to add **Arguments**, make sure you prepend <code>-D</code> before each argument, like so <code>-Dweblogic.management.startupMode=*MODE*</code> .

        See [weblogic.Server Command-Line Reference](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ADMRF-GUID-2B7D4D3D-FB03-4D2D-ADBA-A4172C3502B7) in **Command Reference for Oracle WebLogic Server** for information on the Java options that set runtime behavior of a WebLogic Server instance and [Configuring Node Manager to Use Start and Stop Scripts](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=NODEM-GUID-64200729-17FB-4113-B213-CA962380D769) in **Administering Node Manager for Oracle WebLogic Server** for information on how <code>JAVA_OPTIONS</code> are combined and how duplicate values are handled.

6.  Click **Save**.

7.  Repeat for every applicable Managed Server.


### Specify a Startup Mode {#GUID-2802C481-742D-4EC6-8094-1734C19288C4}

The startup mode specifies the state in which a server instance should be started. The default is to start in the <code>RUNNING</code> state.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  Under the **General** tab, click **Show Advanced Fields**.

3.  In the **Startup Mode** field, enter one of the following startup modes (in uppercase as shown):

    -   <code>RUNNING</code> (default): a server offers its services to clients and can operate as a full member of a cluster.
    -   <code>ADMIN</code>: the server is up and running, but available only for administration operations, allowing you to perform server and application-level administration tasks without risk to running applications.
    -   <code>STANDBY</code>: the server listens for administrative requests only on the domain-wide administration port and only accepts life cycle commands that transition the server instance to either the <code>RUNNING</code> or <code>SHUTDOWN</code> state. Other administration requests are not accepted. If you specify <code>STANDBY</code>, you must also enable the domain-wide administration port. See [Configure the Domain-Wide Administration Port](#GUID-BC689DFE-0598-46B4-8E30-82B87D9CB354).
    See [Understanding Server Life Cycle](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=START-GUID-2C1BF849-3578-4BB8-A929-B491C10FF365) in **Administering Server Startup and Shutdown for Oracle WebLogic Server**.

4.  Click **Save**.


## Configure Clusters {#GUID-A7753EF9-756C-4F2D-9E70-495979B7EEE3}

A WebLogic Server cluster consists of multiple WebLogic Server server instances running simultaneously and working together to provide increased scalability and reliability.

A cluster appears to clients as a single WebLogic Server instance. The server instances that constitute a cluster can run on the same machine or be located on different machines. You can increase a cluster’s capacity by adding additional server instances to the cluster on an existing machine or you can add machines to the cluster to host the incremental server instances. Each server instance in a cluster must run the same version of WebLogic Server. See [Understanding WebLogic Server Clustering](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-7082EB65-5A7B-4211-B90D-B0482DCABCA4) in **Administering Clusters for Oracle WebLogic Server**.

You can also create dynamic clusters which consist of server instances that can be dynamically scaled up or down to meet the resource needs of your applications. A dynamic cluster uses a single server template to define configuration for a specified number of generated (dynamic) server instances. For more information, see [Dynamic Clusters](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-DA7F7FAD-49AA-4F3D-8A05-0D9921B96971) in **Administering Clusters for Oracle WebLogic Server**.

### Create a Cluster {#GUID-EEE59519-29C3-4003-828A-9A3DC25059DA}

Create a WebLogic Server cluster.

1.  In the **Edit Tree**, go to **Environment**, then **Clusters**.

2.  Click **New**.

3.  Enter a name for the cluster.

4.  Click **Create**.


### Assign a Managed Server to a Cluster {#GUID-82FCF3FB-DEA8-4C95-989D-80C9768A6C0E}

You can add an existing Managed Server to clusters.

1.  If you haven't already, create a cluster. See [Create a Cluster](#GUID-EEE59519-29C3-4003-828A-9A3DC25059DA).

2.  Shut down the Managed Server. You cannot change the cluster of a running server.

3.  In the **Edit Tree**, go to **Environment**, then **Servers**.

4.  Select the Managed Server you want to add to a cluster.

5.  From the **Cluster** drop-down list, select the cluster where you want to assign this Managed Server.

6.  Click **Save** and commit your changes.

7.  Start the Managed Server.


### Create a Dynamic Cluster {#GUID-487460DE-EDA6-477B-A91A-0661EB01181D}

Create a cluster that dynamically scales depending on the resource needs of your applications.

1.  If you haven't already, create a cluster and a server template. See [Create a Cluster](#GUID-EEE59519-29C3-4003-828A-9A3DC25059DA) and [Create a Server Template](#GUID-59447716-10A6-4CD0-B191-2427DFF24F14).

2.  Go to the **Environment**, then **Clusters**, then *myCluster* and select the **Dynamic** tab.

3.  Select a server template from the **Server Template** drop-down list.

    If you do not have a server template or if you want to create a new one, click **More ︙** beside the **Server Template** drop-down list and select **Create New Server Template**. Enter a unique name for the new server template.

4.  In the **Dynamic Cluster Size** field, enter the maximum number of running dynamic server instances allowed for scale up operations in this dynamic cluster. This number is the sum of the Dynamic Cluster Size and the additional number of dynamic server instances allowed for scale up operations.

5.  In the **Server Name Prefix**, specify the naming convention you want to use for the dynamic servers in your cluster.

6.  **Optional**: If you want to specify how the dynamic servers in your cluster are distributed across machines, turn on **Enable Calculated Machine Associations** and then configure **Machine Name Match Expression**.

    Machine distribution is determined by the pattern set in **Machine Name Match Expression**. If a machine in the domain matches the expression, then it will be included in the set of machines used by these dynamic servers. The expression is a comma-separated set of values that specifies the machines to match. The value can either match a machine name exactly or, you can use a trailing <code>*</code> to match multiple machine names. If you do not enter a pattern, then all machines in the domain are available to the dynamic servers.

7.  **Optional**: If you want to specify whether listen ports are calculated, turn on **Enable Calculated Listen Ports**.

8.  Click **Save**.


Consider configuring elasticity on the cluster to control how the cluster scales up or down. See [Configuring Dynamic Clusters](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ELAST-GUID-58D37E45-38A1-4EBF-BBD9-1BFE88F9C35E) in **Configuring Elasticity in Dynamic Clusters for Oracle WebLogic Server** for more information.

### Remove a Server from a Cluster {#GUID-35E653EF-EB9F-4BEA-A7EA-06EACF688C35}

You can remove a Managed Server from a cluster without deleting the server instance from the domain.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**.

2.  Select the Managed Server you want to remove from a cluster to make it a standalone server instance.

3.  From the **Cluster** drop-down list, select **None**.

4.  Click **Save**.


### Define a Singleton Service {#GUID-66A4699B-D616-41CF-AE77-BA832888D98C}

A singleton service is a service running on a Managed Server that is available on only one member of a cluster at a time. WebLogic Server lets you automatically monitor and migrate singleton services from one server to another.

{{< alert title="Note" color="primary" >}}



Singleton services can only be migrated automatically within a cluster. Ensure that you have created and configured a cluster and its member server instances.

{{< /alert >}}


1.  In the **Edit Tree**, go to **Environment**, then **Singleton Services**.

2.  Click **New**.

3.  Enter a name for the singleton service.

4.  Click **Create**.

5.  From the **Cluster** drop-down list, select the cluster in which you want to apply this singleton service.

6.  In the **Class Name** field, define the fully qualified name of the class. The class must also be contained in the server class path.

    The class specified in **Class Name** must implement the singleton service interface to function as a migratable singleton service. See [Service Migration](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CLUST-GUID-AEECC92D-88DA-4E07-8C42-A24DBC1C7076) in **Administering Clusters for Oracle WebLogic Server**.

7.  In the **Additional Migration Attempts** field, enter the number of additional attempts that should be tried to reach a migratable service after the service has failed on every possible configured server instance at least once.

8.  In the **Sleep Time Between Attempts** field, enter the interval between migration attempts.

9.  Click **Save**.

10. **Optional**: If you want to specify the migration behavior of this target, go to the **Migration** tab.

    1.  From the **User Preferred Server** drop-down list, select the preferred server instance for this singleton service.

    2.  In the **Constrained Candidate Servers** field, choose which server instances in the cluster to use as a backup for services on this singleton service. Move selected server instances from **Available** to **Chosen**.

11. Click **Save**.


By default, the singleton service iterates through all servers in the cluster to determine the list of candidate servers for migration.

## Create a Server Template {#GUID-59447716-10A6-4CD0-B191-2427DFF24F14}

Server templates define non-default settings and attributes that you can apply to a set of server instances.

When you create a server template and then apply it to Managed Servers, you can specify configuration attributes once and then propagate the new attribute settings to server instances without manually configuring each one. When you need to update an attribute, you can simply change the value in the server template, and the new value takes effect in all of the server instances that use that server template. You can also add a server template to a cluster, then all of the servers within the cluster will inherit the server template. See [Server Templates](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DOMCF-GUID-00800F4A-317B-45CB-AFE6-EB2FC129DF68) in **Understanding Domain Configuration for Oracle WebLogic Server**.

If you need to define any server-specific attributes, you can easily override the server template at the individual server level.

1.  In the **Edit Tree**, go to **Environment**, then **Server Templates**.

2.  Click **New**.

3.  Enter a unique name for the server template.

4.  Click **Create**


After you create a server template, you can configure its attributes as you would configure a traditional Managed Server.

### Apply a Server Template {#GUID-DD6EAFA9-5E7C-4B5C-AE2E-C4B9E4DEA3DD}

Server templates define common configuration attributes for a set of server instances in one centralized location. When you apply a server template to a Managed Server or a cluster, the server instances inherit the configurations from the server template.

-   To apply a server template to a standalone Managed Server:

    1.  In the **Edit Tree**, go to **Environment**, then **Servers**.

    2.  Select the Managed Server where you would like to apply the server template.

    3.  From the **Template** drop-down list, select a template. You can also click **More ︙** to create and apply a new server template.

    4.  Click **Save**.

-   To apply a server template to a cluster:

    1.  In the **Edit Tree**, go to **Environment**, then **Clusters**.

    2.  Select the cluster where you would like to apply the server template.

    3.  From the **Template** drop-down list, select a template. You can also click **More ︙** to create and apply a new server template.

    4.  Click **Save**.


## Configure Machines {#GUID-2B9396AC-B40B-4AB2-B055-EA8FB52DED0B}

A machine is the logical representation of the computer that hosts one or more WebLogic Server instances. Each Managed Server must be assigned to a machine.

As part of the machine configuration process, you'll also configure each machine in your domain to communicate with Node Manager, a program used to control WebLogic Server instances. A single Node Manager instance is used to control all of the server instances running on the same physical machine. These instances can reside in different clusters, domains, and so on. See [About Node Manager](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=NODEM-GUID-578A759B-B1BF-48CC-9D49-15A1FAA4B80D) in **Administering Node Manager for Oracle WebLogic Server**.

1.  In the **Edit Tree**, navigate to **Environment**, then **Machines**.

2.  Click **New**.

3.  Enter a name for the new machine.

4.  **Optional**: If you are creating a machine that will run on a UNIX platform, select **UNIX Machine** from the **Type** drop-down list.

5.  Click **Create**.

6.  Configure the settings of your new machine under **Environment**, then **Machines**, then *myMachine*.

7.  On the **Node Manager** tab, configure the following properties:

    1.  in the **Type** drop-down list, select the Node Manager type.

    2.  In the **Listen Address** field, enter the DNS name or IP address upon which Node Manager listens for incoming requests.

        If you identify the Listen Address by IP address, you must disable Host Name Verification on Administration Servers that will access Node Manager. For more information and instructions, see [Using Host Name Verification](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-B64AA53F-67AE-404B-A4DE-C18D9D745753) in **Administering Security for Oracle WebLogic Server** and [Enable Host Name Verification](../securing-domains#GUID-2B9A775D-A1E1-4A4B-B773-96CC37D9FBF0).

    3.  In the **Listen Port** field, enter the port value where Node Manager listens for incoming requests.

    4.  **Optional**: If you set **Type** to <code>SSH</code> or <code>RSH</code>, you should also specify values in the **Node Manager Home** and **Shell Commands** fields.

    5.  Turn on **Debug Enabled** if you want to enable Node Manager debugging.

    6.  Click **Save**.


The new machine entry now specifies the attributes required to connect to the Node Manager process running on the machine, as well as identify which WebLogic Server instances reside on the machine.

Next, see [Assign a Server Instance to a Machine](#GUID-47BC8E98-37A5-4F87-BB5A-F4DC4E40E5D5).

### Assign a Server Instance to a Machine {#GUID-47BC8E98-37A5-4F87-BB5A-F4DC4E40E5D5}

As part of the process for setting up Node Manager to administer Managed Servers, you must assign a server instance to a machine.

{{< alert title="Note" color="primary" >}}



You cannot change the machine of a server that's running, therefore you cannot use WebLogic Remote Console to change the machine of the Administration Server. Use an offline tool, such as WLST Offline instead.

{{< /alert >}}


1.  Shut down the Managed Server. You cannot change the machine of a running server.

2.  In the **Edit Tree**, go to **Environment**, then **Servers**.

3.  Select the Managed Server that you want to assign to a machine.

4.  In the **Machine** drop-down list, select the machine to which you want to assign this server.

5.  Click **Save**.


## Configure a Virtual Host {#GUID-A365EA04-E759-4E23-A596-E147916B8B80}

A virtual host is a set of host names to which servers or clusters respond. When you use virtual hosting, you use DNS to specify one or more host names that map to the IP address of a server or cluster. You also specify which web applications are served by each virtual host.

1.  In the **Edit Tree**, go to **Environment**, then **Virtual Hosts**.

2.  Click **New**.

3.  Enter a name for the virtual host.

4.  Click **Create**.

5.  In the **Virtual Host Names** field, enter the host names for which this virtual host will serve requests. Use line breaks to separate host names.

6.  In the **Network Access Point Name** field, enter the dedicated server channel name (NetworkAccessPoint) for which this virtual host serves HTTP requests.

7.  Click **Save**.

8.  On the **HTTP** tab, configure HTTP attributes for the virtual host as needed. Click **Save**.

9.  On the **Logging** tab, configure the default log file settings for the virtual host as needed. Click **Save**.

10. On the **Targets** tab, select the servers or clusters where you want to deploy this virtual host.

11. Click **Save**.


## Use Custom Classes to Configure Servers {#GUID-9DB23F7C-D6E8-4028-B0F0-40C63DAE312A}

You can create custom Java classes that extend server features or that perform some task when a server instance starts or shuts down.

These startup classes or shutdown classes are loaded by the system class loader and therefore are available to all resources on a server instance even if the resources are managed by different containers. For example, EJBs and JMX clients can access startup or shutdown classes even though their containers use their own, higher level class loaders.

These are system-level classes so you must place them on the server's class path. If you want to make custom classes available to multiple applications but do not need the classes to be available at the system level, consider deploying them as application startup classes.

For more information, see [Configuring Server Level Startup and Shutdown Classes](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=START-GUID-593B21F9-F73D-4401-BFFF-D1301B28074E) in **Administering Server Startup and Shutdown for Oracle WebLogic Server**.

### Configure Startup Classes {#GUID-6DE805E3-C3B3-4373-8016-AAD4A1498E25}

You can create custom Java classes that extend server features or that perform some task when a server instance starts.

1.  In the **Edit Tree**, go to **Environment**, then **Startup Classes**.

2.  Click **New**.

3.  Enter a name for the startup class and click **Create**.

4.  On the configuration page for your new startup class, in the **Class Name** field, enter the fully qualified name of the startup class.

    For example: <code>mycompany.myclasses.startupclass</code>.

5.  Modify other startup class attributes as necessary.

6.  Click **Save**.

7.  On the **Targets** tab, move the server instances or clusters where you want to deploy this startup class over to **Chosen**.

8.  Click **Save**.

9.  You must add the startup class to the class path of each server where it is deployed.
10. If you use a script to start server instances, perform these steps.

    1.  Open the start script in a text editor.

    2.  In the command that sets the class path, add the path of the directory that contains your class root package and save the script.

        For example, if you create a startup class named <code>StartBrowser</code> in a package named <code>com.mycompany.startup</code>, and you archive the class file in a JAR file named <code>/myDomain/src/myJAR.jar</code>, then the start script for your server must add <code>/myDomain/src/myJAR.jar</code> to the server's class path.

    3.  Restart the server.

11. If you use Node Manager to start server instances, perform the following steps on every server that will run the startup class.

    1.  Go to **Environment**, then **Servers**, then select the server you want to modify.

    2.  On the **Advanced** tab, select the **Node Manager** sub-tab.

    3.  In the **Class Path** field, add the pathname for your class or for a JAR file that contains your class.

        For example, if you create a startup class named <code>StartBrowser</code> in a package named <code>com.mycompany.startup</code>, and you archive the class file in a JAR file named <code>/myDomain/src/myJAR.jar</code>, then the Class Path field should contain this value: <code>/myDomain/src/myJAR.jar</code> to the server's class path.

        {{< alert title="Note" color="primary" >}}



        Ensure that all of the classes that WebLogic Server requires are also on the class path. Use absolute paths or paths relative to the Node Manager's home directory. Separate multiple classes with either <code>:</code> (BASH) or <code>;</code> (Windows).

        For example, <code>/Oracle/Middleware/wlserver/server/lib/weblogicsp.jar:/Oracle/Middleware/wlserver/server/lib/weblogic.jar:/myDomain/src/myJAR.jar</code>

        {{< /alert >}}


    4.  Click **Save**.

    5.  Repeat on any additional servers.


### Configure Shutdown Classes {#GUID-9B52831B-B82A-4348-BEA5-3492E8AEFF29}

You can create custom Java classes that extend server features or that perform some task when a server instance shuts down.

1.  In the **Edit Tree**, go to **Environment**, then **Shutdown Classes**.

2.  Click **New**.

3.  Enter a name for the shutdown class and click **Create**.

4.  On the configuration page for your new shutdown class, in the **Class Name** field, enter the fully qualified name of the shutdown class.

    For example: <code>mycompany.myclasses.shutdownclass</code>.

5.  Modify other shutdown class attributes as necessary.

6.  Click **Save**.

7.  On the **Targets** tab, move the server instances or clusters where you want to deploy this shutdown class over to **Chosen**.

8.  Click **Save**.

9.  You must add the shutdown class to the class path of each server where it is deployed.
10. If you use a script to stop server instances, perform these steps.

    1.  Open the stop script in a text editor.

    2.  In the command that sets the class path, add the path of the directory that contains your class root package and save the script.

        For example, if you create a shutdown class named <code>StopBrowser</code> in a package named <code>com.mycompany.shutdown</code>, and you archive the class file in a JAR file named <code>/myDomain/src/myJAR.jar</code>, then the stop script for your server must add <code>/myDomain/src/myJAR.jar</code> to the server's class path.

    3.  Restart the server.

11. If you use Node Manager to shutdown server instances, perform the following steps on every server that will run the shutdown class.

    1.  Go to **Environment**, then **Servers**, then select the server you want to modify.

    2.  On the **Advanced** tab, select the **Node Manager** sub-tab.

    3.  In the **Class Path** field, add the pathname for your class or for a JAR file that contains your class.

        For example, if you create a shutdown class named <code>StopBrowser</code> in a package named <code>com.mycompany.shutdown</code>, and you archive the class file in a JAR file named <code>/myDomain/src/myJAR.jar</code>, then the Class Path field should contain this value: <code>/myDomain/src/myJAR.jar</code> to the server's class path.

        {{< alert title="Note" color="primary" >}}



        Ensure that all of the classes that WebLogic Server requires are also on the class path. Use absolute paths or paths relative to the Node Manager's home directory. Separate multiple classes with either <code>:</code> (BASH) or <code>;</code> (Windows).

        For example, <code>/Oracle/Middleware/wlserver/server/lib/weblogicsp.jar:/Oracle/Middleware/wlserver/server/lib/weblogic.jar:/myDomain/src/myJAR.jar</code>

        {{< /alert >}}


    4.  Click **Save**.

    5.  Repeat on any additional servers.


{{< alert title="Note" color="primary" >}}



After you delete a shutdown class, it will run the first time you shut down the server. When you shut down the sever subsequently, it will no longer run.

{{< /alert >}}


## Configure Network Connections {#GUID-8364D22A-C92B-45F0-A385-CD350646809E}

Configure the network resources for your domain.

As your domain increases in complexity, it is imperative to carefully manage the network resources and connections within your domain to ensure secure and reliable communication between servers and applications.

WebLogic Server uses network channels to organize and define the attributes of its network connections. Among other attributes, network channels can define:

-   The protocol the connection supports
-   The listen address
-   The listen ports for secure and non-secure communication

See [Understanding Network Channels](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CNFGD-GUID-1C99CC52-D435-44C9-8CAD-6D8E29C7F9CE) in **Administering Server Environments for Oracle WebLogic Server**.

Each WebLogic Server instance provides default settings for the protocols, listen addresses, and listen ports through which it can be reached. These settings are referred to collectively as the default network channel. This default network channel provides two listen ports through which it receives requests: one for non-SSL/TLS requests and the other for SSL/TLS requests. You can disable one of these ports, but at least one must be enabled.

You can also configure your own custom network channels.

### Configure the Domain-Wide Administration Port {#GUID-BC689DFE-0598-46B4-8E30-82B87D9CB354}

An administration port restricts all administrative traffic between server instances in a WebLogic Server domain to a single port. Additionally, only secure, SSL/TLS traffic is accepted and all connections through the port require authentication by a server administrator.

Enabling the administration port imposes the following restrictions on your domain:

-   The Administration Server and all Managed Servers in your domain must be configured with support for the SSL/TLS protocol.
-   All servers in the domain, including the Administration Server, enable or disable the administration port at the same time.

See [Configure an Administration Port for the Domain](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=LOCKD-GUID-66E8EFE3-58AB-44C9-9DF1-EEC4C525A2FE) in **Securing a Production Environment for Oracle WebLogic Server**.

1.  Shut down all Managed Servers in the domain. You cannot enable the administration port dynamically on a Managed Server.

2.  Ensure that all servers in the domain are properly configured to use SSL/TLS. See [Set Up SSL/TLS](../securing-domains#GUID-E4A623A5-532D-443B-BA39-0E13B004EB94).

3.  In the **Edit Tree**, go to **Environment**, then **Domain**.

4.  Turn on the **Enable Administration Port** option.

5.  In the **Administration Port** field, enter the SSL/TLS port number that server instances in the domain should use as the administration port.

6.  **Optional**: If multiple server instances run on the same computer in a domain that uses a domain-wide administration port, then you must perform one of the following actions:

    -   Host the server instances on a multi-homed machine and assign each server instance a unique listen address
    -   Override the domain-wide administration port on all but one of the servers instances on the machine. On the **Environment**: **Servers**: *myServer* page for each Managed Server, enter a unique port value in the **Local Administration Port Override** field.
7.  Click **Save** and then commit your changes.

8.  Restart the Administration Server and start all the Managed Server instances in the domain.


Make sure the connection between the Managed Servers and the Administration Server uses the administration port.

### Configure Custom Network Channels {#GUID-4CFA9C9D-95F9-4B84-85A3-B89A20E1FC27}

A network channel is a configurable resource that defines the attributes of a network connection to WebLogic Server.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*, then **Channels**.

2.  Click **New**.

3.  Enter a name for the new network channel.

4.  Click **Create**.

    A node for the new network channel will appear under the **Channels** node.

5.  Go to the new node to define the configuration for the new network channel.

    At minimum, you should define the following information:

    -   Listen address
    -   Listen port
    -   External listen address
    -   External listen port
    The external listen address and port are used to support Network Address Translation (NAT) firewalls. These should match the IP address or DNS name that clients use to access application on the server.

6.  Click **Save**.


### Specify a Listen Address {#GUID-82313721-14D5-4A0B-81CE-44BA60717581}

Define the listen address that a server uses for incoming connections.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  In the **Listen Address** field, enter an IP address or DNS name for this server to use to listen for incoming connections.

    Note that the value you specify for the listen address is not the URL to the host machine and it does not include the communication protocol, listen port, or channel.

    Servers can be reached through the following URL: <code>*protocol*://*listen-address*:*listen-port*</code>

3.  Click **Save**.


### Specify Listen Ports {#GUID-9084C04C-06CC-4E14-85B6-CFC755E7A428}

Define the listen ports for secure and non-secure communication.

{{< alert title="Note" color="primary" >}}

 You cannot disable both **Listen Port Enabled** or **SSL Listen Port Enabled**. At least one type of listen port must be active.

{{< /alert >}}


1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  Enable **Listen Port Enabled** and enter a port number.

3.  Enable **SSL Listen Port Enabled** and enter a port number.

4.  Click **Save**.


If you plan to configure a domain-wide administration port, make sure the SSL Listen Port and the Administration Port are set to different port numbers.

### Configure General Protocol Settings {#GUID-1373D4D6-B288-4892-873B-9F5480531A66}

You can configure each WebLogic Server instance to communicate over a variety of protocols, such as HTTP, T3, and IIOP. You can also configure a group of communication settings that apply to all protocols.

The general protocol settings apply to connections that use the server's default listen port and listen address. If you create network channels for this server, each channel can override these settings. For more information, see [Configuring Network Resources](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CNFGD-GUID-7513DDF1-761B-4319-9D8C-2E4E8D6EE2CB) in **Administering Server Environments for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  On the **Protocols** tab, on the **General** tab, modify the default settings for protocols as necessary.

3.  Click **Save**.

4.  Repeat on applicable servers.


### Configure HTTP {#GUID-5E03A91F-D3B9-4583-AFB7-E4E6F187119A}

You can define settings for HTTP connections.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  On the **Protocols** tab, go to the **HTTP** subtab and update the settings for HTTP as necessary.

3.  **Optional**: If you want to enable the tunneling of connections, turn on the **Enable Tunneling** option and then enter values in the **Tunneling Client Ping** and **Tunneling Client Timeout** fields.

    {{< alert title="Note" color="primary" >}}



    These settings apply to all protocols in the server's default network configuration that support tunneling. See [Setting Up WebLogic Server for HTTP Tunneling](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CNFGD-GUID-9B08A327-0DBF-4DE9-B0E7-B4155DF51331) in **Administering Server Environments for Oracle WebLogic Server**.

    {{< /alert >}}


4.  Click **Save**.


### Configure T3 Protocol {#GUID-41375E59-57F5-48FA-BA34-7ED4AD7D9EF6}

T3 is an Oracle proprietary remote network protocol that implements the Remote Method Invocation (RMI) protocol.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  On the **Protocols** tab, in the **Complete Message Timeout** field, enter the maximum number of seconds that this server should wait for a complete message to be received.

3.  In the **Maximum Message Size** field, enter the maximum number of bytes allowed in messages that are received over all supported protocols, unless overridden by a protocol-specific setting or a custom channel setting.

4.  **Optional**: Turn on the **Enable Tunneling** option and then enter values in the **Tunneling Client Ping** and **Tunneling Client Timeout** fields.

    {{< alert title="Note" color="primary" >}}



    These settings apply to all protocols in the server's default network configuration that support tunneling. See [Setting Up WebLogic Server for HTTP Tunneling](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CNFGD-GUID-9B08A327-0DBF-4DE9-B0E7-B4155DF51331) in **Administering Server Environments for Oracle WebLogic Server**.

    {{< /alert >}}


5.  Click **Save**.


### Configure IIOP {#GUID-57BF14A3-C5BF-4E54-84FA-FE109DEF83AC}

The IIOP (Internet Inter-ORB Protocol) makes it possible for distributed programs written in different programming languages to communicate over the internet.

For information about using RMI-IIOP in your applications, see [Understanding WebLogic RMI](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLRMI-GUID-BDCB4A5A-867D-4D1F-92EA-4C5E2BEA3A3A) in **Developing RMI Applications for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  On the **Protocols** tab, go to the **IIOP** subtab.

3.  Turn on the **Enable IIOP**.

4.  If you want to modify the default configuration of IIOP (including the default IIOP user credentials), click **Show Advanced Fields** and update the options as necessary.

5.  Click **Save**.


## Change the Domain Mode {#GUID-8FA92B79-CB09-4ECA-9254-5323FECEC1E0}

The domain mode of your WebLogic Server domain determines its default security configuration. Select the domain mode that best meets the security requirements of the environment in which WebLogic Server runs.

The domain modes, in order from least to most secure, are Development Mode, Production Mode, and Secured Production Mode. We recommend that you only use development mode for domains in development or demonstration environments.

The default values for various security configurations will change to match the selected domain mode. See [Understand How Domain Mode Affects the Default Security Configuration](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=LOCKD-GUID-F980DB67-7CDE-4EF8-986D-D188D4EDB706) in **Securing a Production Environment for Oracle WebLogic Server**.

{{< alert title="Note" color="primary" >}}



As of WebLogic Server 14.1.2.0.0, production mode now turns on secured production mode by default. All *new* installations of WebLogic Server 14.1.2.0.0 and later follow this behavior. In previous releases, when you enabled production mode, secured production mode was disabled by default and you had to enable it explicitly.

If you *upgrade* from WebLogic Server 14.1.1.0.0 and earlier, the behavior of your domain mode will not change. For example, when a domain in production mode is upgraded from 14.1.1.0.0 to 14.1.2.0.0 or later, it will remain in production mode with secured production mode *disabled*. However, if you upgrade your domain to 14.1.2.0.0 or later, and *then* select production mode as the new domain mode, it will *enable* secured production mode by default.

{{< /alert >}}


1.  Shut down all of the Managed Servers in the domain.

    Changes to the domain mode require a full domain restart - a rolling restart is not sufficient.

2.  In the **Edit Tree**, go to **Environment**, then **Domain**.

3.  Change the domain mode:



<table id="GUID-8FA92B79-CB09-4ECA-9254-5323FECEC1E0__TABLE_MPM_VYN_SDC">
                              <span>Describes how to change the domain mode.</span>
                              <thead>
                                 <tr>
                                    <th>Target domain mode</th>
                                    <th>Perform these steps</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <td>Development Mode</td>
                                    <td>Disable the <span>Production Mode</span> option to convert your domain to development mode.</td>
                                 </tr>
                                 <tr>
                                    <td>Production Mode</td>
                                    <td>Enable the <span>Production Mode</span> option to convert your domain to production mode. <div id="GUID-8FA92B79-CB09-4ECA-9254-5323FECEC1E0__GUID-70E009C1-2051-420A-9B2D-17DD275701EE">
                                          <span>Note:</span> As of WebLogic Server 14.1.2.0.0, when you select production mode, <em>secured</em> production mode is enabled by default.<p> If you want to apply the features of basic production mode only, then you must explicitly disable the <span>Secured Production Mode</span> option. If you use Node Manager to start your Managed Servers, then you must also add the <code>-Dweblogic.securemode.SecureModeEnabled=false</code> startup argument to each Managed Server. See <a href="#GUID-C1986FE5-E41C-41CC-880E-D6C78A691A7C">Configure Startup Arguments for a Managed Server</a>.</p>
                                       </div>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td>Secured Production Mode</td>
                                    <td>Enable the <span>Production Mode</span> and <span>Secured Production Mode</span> options.<p>
                                          <strong>Note</strong>: For more information, see <a href="https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-9ED2EF38-F763-4999-80ED-27A3FBCB9D7D">Using Secured Production Mode</a> in <span>
                                             <cite>Administering Security for Oracle WebLogic Server</cite>
                                          </span>.</p>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>




4.  Click **Save**.

5.  Commit your changes and restart your Administration Server. Then, you can start your Managed Servers.


Changes to the domain mode can affect the default URL of the Administration Server, specifically the protocol and the port number. When SSL/TLS and the administration port are enabled (by default, both are enabled in secured production mode), the default URL is<code>https://*hostname*:9002</code>. When SSL/TLS and the administration port are disabled (by default, both are disabled in development mode), the default URL is <code>http://*hostname*:7001</code>.

## Resume a Server {#GUID-EC12E5AC-4E0A-41A5-8F3F-23E3670F3979}

If a server in the <code>STANDBY</code> or <code>ADMIN</code> state, when you are ready for the server to receive requests other than administration requests, you can resume the server to transition it into the <code>RUNNING</code> state.

For more information on the different server states, see [Understanding Server Life Cycle](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=START-GUID-2C1BF849-3578-4BB8-A929-B491C10FF365) in **Administering Server Startup and Shutdown for Oracle WebLogic Server**.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**.

2.  Select the servers that you want to transition into a <code>RUNNING</code> state and click **Resume**.


## Suspend a Server {#GUID-0DEF6963-839F-4E37-B080-6ADC2D694608}

When you suspend a server, it transitions a server instance from the <code>RUNNING</code> state to the <code>ADMIN</code> state. In the <code>ADMIN</code> state, the server is running, but it is only available for administration operations. This allows you to perform server and application-level administration tasks without risk to running applications.

For more information on the different server states, see [Understanding Server Life Cycle](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=START-GUID-2C1BF849-3578-4BB8-A929-B491C10FF365) in **Administering Server Startup and Shutdown for Oracle WebLogic Server**.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**.

2.  Select the servers that you want to transition into an <code>ADMIN</code> state.

3.  Click **Suspend** and choose how the server completes its current tasks:

    -   **When work completes**: initiates a graceful suspension, which gives WebLogic Server subsystems and services time to complete certain application processing currently in progress.
    -   **Force suspend now**: initiates a forced suspension, in which the server instructs subsystems to immediately drop in-flight requests.

## Shut Down a Server {#GUID-1CC6DCA5-E882-4940-82E0-3F64659FAE4A}

You can use WebLogic Remote Console to shut down a server instance of WebLogic Server.

WebLogic Remote Console is one of several tools you can use to shut down a server instance. For other options, see [Shutting Down Instances of WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=START-GUID-9AD29794-B51A-4DFC-9DBD-6D1EAD9AECFE) in **Administering Server Startup and Shutdown for Oracle WebLogic Server**.

If you shut down the Administration Server, you won't be able to manage the domain from WebLogic Remote Console until it is restarted.

1.  **Optional**: If you want to shut down a server gracefully and allow some WebLogic Server subsystems to complete existing tasks, then you can configure graceful shutdown settings.

    These options only apply when a server is shutdown gracefully. A forceful shutdown ignores them.

    1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then select the server where you want to apply grace shutdown settings.

    2.  On the **Advanced** tab, select the **Start/Stop** sub-tab.

    3.  Turn on **Ignore Sessions During Shutdown** to force the server to drop all HTTP sessions immediately instead of waiting for them to complete or timeout.

        Waiting for abandoned HTTP sessions to timeout can significantly lengthen the graceful shutdown process because the default session timeout is one hour.

    4.  Specify a **Graceful Shutdown Timeout** in seconds to determine how long the server should wait before forcing a shutdown.

    5.  Repeat on applicable servers.

2.  In the **Monitoring Tree**, go to **Environment**, then **Servers**.

3.  Select the servers that you want to shut down.

4.  Click **Shutdown** and choose how the server completes its tasks:

    -   **When work completes**: initiates a graceful shutdown, which gives WebLogic Server subsystems time to complete certain application processing currently in progress.
    -   **Force shutdown now**: initiates a forced shutdown, in which the server instructs subsystems to immediately drop in-flight requests.
    See [Understanding Server Life Cycle](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=START-GUID-2C1BF849-3578-4BB8-A929-B491C10FF365) in **Administering Server Startup and Shutdown for Oracle WebLogic Server**.
