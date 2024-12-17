---
author: Oracle Corporation
publisherinformation: December 2024
weight: 78
title: Securing Domains
---



WebLogic Server offers a robust set of security tools to protect your WebLogic Server environment from unauthorized access. Use WebLogic Remote Console to secure your system.

For general information on security concepts in WebLogic Server, see:

-   [**Understanding Security for Oracle WebLogic Server**](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SCOVR-GUID-9907C106-65D8-431C-AF1C-1E7A5E2E44E6)
-   [**Administering Security for Oracle WebLogic Server**](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-9A27899E-4851-43F4-A422-2C54993EC9DD)
-   [**Securing Resources Using Roles and Policies for Oracle WebLogic Server**](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-1359F073-92CF-4ABC-A62A-4960F6EC8E3F)
-   [**Securing a Production Environment for Oracle WebLogic Server**](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=LOCKD-GUID-96BA142C-DD98-432B-8E1F-CC1A544F7877)

## Address Potential Security Issues {#GUID-5CEC217D-8EDB-4FF8-A258-869C32AEE3A1}

WebLogic Server regularly checks your domain to ensure it complies with its recommended security policies. If a domain does not meet the recommendations, a security warning is logged and displayed in WebLogic Remote Console.

When there are active security warnings in your domain, a red banner appears across the top of the WebLogic Remote Console window. It will remain until you have fixed the security issue.

For more information on the issues that might trigger a security warning, see [Review Potential Security Issues](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=LOCKD-GUID-4148D1BE-2D54-4DA5-8E94-A35D48DCEF1D) in **Securing a Production Environment for Oracle WebLogic Server**.

Do not rely on the Security Warnings Report alone to determine the security of your domain. While these security configuration settings cover a broad set of potential security issues, other security issues that do not generate warnings may still exist in your domain.

{{< notice note >}}



Environments running WebLogic Server 14.1.1.0 and earlier require the July 2021 Patch Set Update (PSU) to see security warnings.

{{< /notice >}}


1.  In the Security Warnings banner, click **View/Refresh Report** to see which issues have been flagged.

    You can also get to the Security Warnings page through the **Monitoring** perspective, then **Environment**, then **Domain Security Runtime**.

2.  Review the description of the issue to understand the security warning.

3.  Follow the steps suggested in Resolution Information to fix the problem.

    The same issue can affect multiple servers within your domain simultaneously. Make sure to fix the issue on every affected server.

    If you think certain policies don't apply to your environment or are not feasible to implement with your business needs, you can disable individual security checks, with the exception of the minimum JDK version check.

4.  If necessary, restart the servers to apply the fix and clear the security warnings.


### Security Warning Fixes {#GUID-965B4726-4622-454D-8049-C6B37A2EE867}

For the latest information on security warnings and their suggested steps for resolution, see the My Oracle Support article, *WebLogic Server Security Warnings (Doc ID 2788605.1)*.

{{< notice note >}}



The same issue may affect multiple servers within your domain simultaneously. As you review the Security Warnings Report, make sure that you fix the issue on every affected server. Depending on the problem and its resolution, you may need to restart servers to update the Security Warnings Report.

{{< /notice >}}


## Security Realms {#GUID-CBC31FBB-68EB-445A-972C-F0F70378AF1A}

A security realm is a collection of mechanisms designed to protect WebLogic Server resources. Each security realm consists of a set of configured security providers, users, groups, security roles, and security policies. A user must be defined in a security realm in order to access any WebLogic resources belonging to that realm.

For more information, see [Security Realms](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SCOVR-GUID-385F4F0A-A846-44C1-9AD5-8326CD14DA85) in **Understanding Security for Oracle WebLogic Server**.

WebLogic Server provisions each new domain with a security realm with pre-configured security configurations. See [The Default Security Configuration in WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-24E513F2-913C-4A9E-B840-2EFD75BED3C0) in **Administering Security for Oracle WebLogic Server**.

If the default security configurations do not meet your requirements, you can create a new security realm with custom settings and providers and set it as the default security realm. See [Customizing the Default Security Configuration](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-B7B5C407-788A-4E0E-B06A-2FF3ABD9EF03) in **Administering Security for Oracle WebLogic Server**.

{{< notice note >}}

 You can set WebLogic Server to immediately apply non-dynamic changes to a security realm without restarting WebLogic Server. See [Enable Automatic Realm Restart](#GUID-65011AC0-166C-414C-8FD5-A085E7599FA7).

{{< /notice >}}


### Required Security Providers {#SECTION_HWH_VBM_NCC}

For a security realm to be valid, the following security providers must be configured:

-   Authentication provider
-   Authorization provider
-   Adjudication provider
-   Credential Mapping provider
-   Certification Path provider
-   Role Mapping provider

WebLogic Server includes a default option for each of the required security providers, plus alternative options if the default provider does not suit your needs. You can also create your own custom providers.

### Create a Security Realm {#GUID-E197F5AA-FFF5-46B3-A14D-58C5213F9BA1}

A security realm organizes the security configurations of a domain.

Before you create a new security realm, review the considerations outlined in [Before You Create a New Security Realm](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-283E1AB8-B7A0-41B0-B5E3-A92550B61FB7) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Security**, then **Realms**.

2.  Click **New**.

3.  Enter a name for the new security realm.

4.  Turn on the **Create Default Providers** option if you want WebLogic Server to add the required security providers to the security realm, ensuring that the new security realm is valid.

    You can modify the default providers or replace them with another provider as needed.

    {{< notice note >}}

    

    If you do not enable **Create Default Providers**, then you must manually configure the required security providers before you can commit the new security realm. For a list of which security providers are required, see [Required Security Providers](#SECTION_HWH_VBM_NCC).

    {{< /notice >}}


5.  Click **Create**.


### Change Default Security Realm {#GUID-7E4AA558-1D90-429E-987A-63A90056E708}

You can configure WebLogic Server to replace the default security configurations with a custom security realm.

{{< notice note >}}

 Although you can customize the original default security configuration, Oracle recommends creating an entirely new security realm and making changes to security configurations there, which allows you to easily revert to the original default security configuration if necessary.

{{< /notice >}}


1.  If you haven't done so already, create a new security realm. See [Create a Security Realm](#GUID-E197F5AA-FFF5-46B3-A14D-58C5213F9BA1).

2.  In the **Edit Tree**, go to **Environment**, then **Domain**.

3.  Select the **Security** tab.

4.  From the **Default Realm** drop-down list, select the security realm that you want to make the default.

5.  Click **Save**.


Consider enabling the configuration archive to save previous domain configurations so you can revert to a previous security configuration if necessary. See [Back Up Configuration Files](../domain-configuration#GUID-6A1B7D7D-174F-417F-907D-900442FF0A87).

### Revert to a Previous Security Configuration {#GUID-252EE9B4-2FF3-4B3C-83D1-61F28B7D0E1A}

Certain mistakes when configuring a new security realm or security providers can prevent you from booting the server. If this happens, then you can revert the configuration XML files to reinstate a previous realm configuration and recover from the error.

You can only revert to a previous configuration if configuration archiving is enabled and has been saving previous versions of the configuration. See [Back Up Configuration Files](../domain-configuration#GUID-6A1B7D7D-174F-417F-907D-900442FF0A87).

You can also use WLST Offline to correct a mistake that prevents you from booting the server.

{{< notice note >}}

 This process will only revert your security realm (meaning, the configuration of the realm and its providers), not the users, groups, roles, or security policies used by the realm, which are persisted in a data store and not in the configuration files.

{{< /notice >}}


1.  Locate the <code>config.jar</code> file that contains the security configuration to which you want to revert, copy it to a temporary directory, and unpack it.

2.  Copy the unpacked configuration files to the appropriate location in the <code>*DOMAIN_HOME*/config</code> directory. For information about which directories hold which configuration files, see [Domain Directory Contents](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DOMCF-GUID-F512F4B1-1282-40CD-8DBE-0836D9890924) in **Understanding Domain Configuration for Oracle WebLogic Server**.

3.  Restart WebLogic Server.


### Enable Automatic Realm Restart {#GUID-65011AC0-166C-414C-8FD5-A085E7599FA7}

You can set WebLogic Server to immediately apply non-dynamic changes to a security realm without restarting WebLogic Server.

In the default security realm, automatic realm restart is **disabled** by default. In *new* security realms that you create, automatic realm restart is **enabled** by default.

For more information, see [Using Automatic Realm Restart](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-EEF6E6C0-2E96-4345-AA66-4EBFB5434DCA) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*.

2.  Enable the **Automatically Restart after Non-Dynamic Changes** option.

3.  Click **Save**.


## Security Providers {#GUID-E2E214D3-BAA1-4F15-BFDE-0BD3BC035B31}

The WebLogic Security Service supports a wide variety of security architectures, including multiple security providers.

Before you configure security providers for your WebLogic security realm, you should have a good understanding of how the WebLogic Security Service works and what sort of security architecture you want for your WebLogic environment. See:

-   [Overview of the WebLogic Security Service](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SCOVR-GUID-03570476-120A-43CF-B399-080A2AA04DB9) in **Understanding Security for Oracle WebLogic Server**
-   [Configuring Security Providers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-63629F7C-1B06-433D-A208-A5FFE41CFA32) in **Administering Security for Oracle WebLogic Server**.
-   [Introduction to Developing Security Providers for WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEVSP-GUID-E21CBD90-0348-4F6E-B9E8-D9B7D5A5B1C2) in **Developing Security Providers for Oracle WebLogic Server**.
-   [Understanding WebLogic Resource Security](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-1359F073-92CF-4ABC-A62A-4960F6EC8E3F) in **Securing Resources Using Roles and Policies for Oracle WebLogic Server**.

Your security architecture can consist of a combination of the default security providers included in WebLogic Server, security providers developed by third parties, or custom security providers that you develop yourself.

Types of security providers include:

-   Authentication providers
-   Identity Assertion providers
-   Authorization providers
-   Adjudication providers
-   Role Mapping providers
-   Credential Mapping providers
-   Auditing providers

### Configure an Authentication or Identity Assertion Provider {#GUID-F8F5FE70-EB42-4F31-9AFE-70037E23510A}

Use authentication providers to prove the identity of users or system processes. The WebLogic Authentication provider and WebLogic Identity Assertion provider are enabled by default but you can configure additional authentication or identity assertion providers as needed.

For more information about the authentication and identity assertion providers included in WebLogic Server, see [Choosing an Authentication Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-2F36ABA6-2D49-4472-97F5-A06D3A35D345) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*, then **Authentication Providers**.

2.  Click **New**.

3.  In the **Name** field, enter a name for the new provider.

4.  From the **Type** drop-down list, select the type of authentication provider.

5.  Click **Create**.

6.  On the **Configuration** page for the new authentication provider, set the appropriate values on the **Common** and **Provider-Specific Parameters** tabs.

7.  Click **Save**.


We recommend that you configure the Password Validation provider immediately after configuring a new WebLogic domain. The password validation provider, which is included with WebLogic Server, can be configured with several out-of-the-box authentication providers to manage and enforce password composition rules. Whenever a password is created or updated in the security realm, the corresponding authentication provider automatically invokes the password validation provider to ensure that the password meets the established composition requirements. For more information, see [Configure the Password Validation Provider](#GUID-0F8BACA8-97AC-427F-8763-19628B13BF8D).

#### Set the JAAS Control Flag {#GUID-D4C6B9CA-C9B3-4B6A-9175-FC031A45B254}

If you have multiple Authentication providers in your domain, use the JAAS control flag to control how each Authentication provider is used in the login sequence.

For information on how WebLogic Server handles multiple Authentication providers, see [Using More Than One Authentication Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-34508D19-FA55-4A84-8A1A-F1FD21428DD8) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Security**, then **Realms** and choose the security realm where you want to make changes.

2.  Expand the **Authentication Providers** node and choose the Authentication provider that you want to configure.

3.  Select an option from the **Control Flag** drop-down list:

    -   Required
    -   Requisite
    -   Sufficient
    -   Optional
    For information on each value, see [Setting the JAAS Control Flag Option](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-271DE905-EB97-4416-8544-E4F014B0FFE2) in **Administering Security for Oracle WebLogic Server**.

4.  Click **Save**.

5.  Repeat for the rest of the Authentication providers in the domain.


### Configure an Authorization Provider {#GUID-82482298-C1CC-4C17-A49B-E3D1E95ECD20}

Use Authorization providers to determine who has access to a resource.

For more information on Authorization providers, see [Configuring an Authorization Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-0738AFBF-0D98-45D7-9473-10D8D2FAE10F) in **Administering Security for Oracle WebLogic Server**.

{{< notice note >}}

 The WebLogic Authorization provider was deprecated in WebLogic Server 14.1.1.0.0 and will be removed in a future release. The XACML Authorization provider is the default provider.

{{< /notice >}}


1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*, then **Authorizers**.

2.  Click **New**.

3.  In the **Name** field, enter a name for the new provider.

4.  From the **Type** drop-down list, select the type of Authorization provider.

5.  Click **Create**.

6.  On the new Authorization provider page, set the desired values.

7.  Click **Save**.


### Configure the WebLogic Adjudication Provider {#GUID-CFD6013B-DEA8-4E7E-AAB3-5C1EE61E8E7B}

An Adjudication provider resolves authorization conflicts by weighing each Authorization provider's access decision and determining whether to permit access to the requested resource.

If you only have one Authorization provider configured in the security realm and it is the WebLogic Authorization provider, then an <code>ABSTAIN</code> returned from the single Authorization provider is treated as a <code>DENY</code>.

Each security realm must have one, and only one, Adjudication provider.

WebLogic Server offers one Adjudication provider for the WebLogic Security Framework: the WebLogic Adjudication provider. Note that WebLogic Remote Console refers to the WebLogic Adjudication provider as the Default Adjudicator.

For more information on Adjudication providers, see [Configuring the WebLogic Adjudication Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-E043FEB2-B8BF-4EDD-90F8-CEAC72E6FE93) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*, then **Adjudicator**.

2.  Click **Create**.

3.  In the **Name** field, enter a name for the new provider.

4.  From the **Type** drop-down list, select the type of Adjudication provider.

5.  Click **Create**.

6.  On the new Adjudication provider page, set the appropriate values on the **Default Adjudicator Parameters** tab.

7.  Click **Save**.


### Configure a Role Mapping Provider {#GUID-122D3EE2-69C0-487B-AA7F-893FF19C8115}

Role mapping is the process whereby principals (users or groups) are dynamically mapped to security roles at runtime. A Role Mapping provider determines what security roles apply to the principals stored in a subject when the subject is attempting to perform an operation on a WebLogic resource.

Since these operations usually involve gaining access to a WebLogic resource, Role Mapping providers are typically used with Authorization providers.

{{< notice note >}}

 The WebLogic Role Mapping provider was deprecated in WebLogic Server 14.1.1.0.0 and will be removed in a future release. The XACML Role Mapping provider is the default provider.

{{< /notice >}}


For more information on Role Mapping providers, see [Configuring a Role Mapping Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-DACD6542-0A06-4730-AAB9-3AA8AC91E08B) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*, then **Role Mappers**.

2.  Click **New**.

3.  In the **Name** field, enter a name for the new provider.

4.  From the **Type** drop-down list, select the type of Role Mapping provider.

5.  Click **Create**.

6.  On the new Role Mapping provider page, update values as necessary.

7.  Click **Save**.


### Configure an Auditing Provider {#GUID-553E0BEB-BD7E-44EF-AD4D-782F1A01C3B8}

An Auditing provider collects, stores, and distributes information about operating requests and the outcome of those requests for the purposes of non-repudiation.

You can configure multiple Auditing providers in a security realm, but none are required. The default security realm does not include an Auditing provider.

WebLogic Auditing provider is the standard Auditing provider for the WebLogic Security Framework. Note that the WebLogic Remote Console refers to the WebLogic Auditing provider as the Default Auditor.

You can also configure WebLogic Server to audit configuration actions. See [Enable Configuration Auditing](../monitoring-domains#GUID-BB85D9BB-5E36-4067-AA9F-E01EBFF027CD).

For more information on Auditing providers, see [Configuring the WebLogic Auditing Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-9BF2B900-C8D0-4742-A405-5E155CF4D83F).

1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*, then **Auditors**.

2.  Click **New**.

3.  In the **Name** field, enter a name for the new provider.

4.  Click **Create**.

5.  On the new Auditing provider page, set the appropriate values on the **Default Auditor Parameters** tab.

6.  Click **Save**.


### Configure a Credential Mapping Provider {#GUID-49DE7039-810D-433A-A5EB-6A4E1FEB885C}

A Credential Mapping provider allows WebLogic Server to log into a remote system on behalf of a subject that has already been authenticated. You must have one Credential Mapping provider in a security realm, and you can configure multiple Credential Mapping providers in a security realm.

For more information on Credential Mapping providers, see [Configuring Credential Mapping Providers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-A84EB620-EFC6-409C-B05C-7E9508E30D87) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*, then **Credential Mappers**.

2.  Click **New**.

3.  In the **Name** field, enter a name for the new provider.

4.  From the **Type** drop-down list, select the type of Credential Mapper.

5.  Click **Create**.

6.  On the new Credential Mapping provider page, update the values on the **Default Credential Mapper Parameters** tab as necessary.

7.  Click **Save**.


After you have configured a credential mapping provider, you can map credentials to WebLogic resources. You can create credential mappings for the following WebLogic Server resources:

-   Application deployments
    -   EJBs
    -   JDBC applications
    -   Resource adapters
-   Data sources
-   Remote resources

The general process is:

1.  In the Edit Tree, configure an MBean. Commit your changes and then restart the server, if necessary.
2.  In the Security Data Tree, under Credential Mappers, find the corresponding node for the MBean you configured. You may need to define the properties of the WebLogic resource to identify it, forming a connection between the MBean's configuration data and its security data. See [Identify Resources for Credential Mapping](#GUID-1D5D77AF-5F1A-4AF4-8E97-31E30AF69891).
3.  Create mappings for the WebLogic resource.

#### Identify Resources for Credential Mapping {#GUID-1D5D77AF-5F1A-4AF4-8E97-31E30AF69891}

Certain WebLogic resources require that you manually form a connection between its MBean configuration data and its security data.

{{< notice note >}}

 As part of this process, you will create the first credential mapping for the resource.

{{< /notice >}}


You must configure the WebLogic resource before you can add any mappings.

1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Credential Mappers**.

2.  Continue until you reach the WebLogic resource that you want to prepare for credential mappings.

    For example:

    -   EJB component nodes appear under Credential Mappers: credentialMappingProvider: App Deployments: applicationName: EJBs
    -   Remote resources appear under Credential Mappers: credentialMappingProvider: Remote Resources.
    You do not need to identify data sources.

3.  Click **New** and fill in the fields as necessary.

4.  Click **Create**.


A reference to the resource is added under the resource's node. The name of the resource is generated by combining its property values.

You cannot delete a reference to a resource with multiple credential mappings. To delete a resource reference, you must delete all of the credential mappings first - which will then delete the resource reference automatically.

#### Add a Credential Mapping {#GUID-8D69A192-3B3D-46E8-A9F7-924641511E97}

You can add a new credential mapping to associate another WebLogic resource to a remote user.

1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Credential Mappers**, then *credentialMappingProvider*, then *wlResourceType*, then *wlResourceName*, then **Credential Mappings**.

2.  Click **New**.

3.  Fill in the fields as needed.

    {{< notice note >}}

     If you want to map to a remote user that is already referenced in the remote resource, disable the **Create Credential** option.

    {{< /notice >}}


4.  Click **Create**.


The credential mappings and credentials for each WebLogic resource appear under the resource’s node.

When you delete a credential mapping, the remote user that the WebLogic resource was previously associated with is also deleted if it was the only credential mapping using that remote user.

#### Remap a WebLogic Resource {#GUID-24164D96-F4B7-4F1B-91C6-A3A4A5A29DD9}

You can edit a credential mapping to associate a WebLogic user for a WebLogic resource to a different remote user.

WebLogic Remote Console must already be aware of the remote user before you can remap the WebLogic Server user. If you want to remap the WebLogic resource to a new remote user, you must first add it to WebLogic Remote Console.

1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Credential Mappers**, then *credentialMappingProvider*, then *wlResourceType*, then *wlResourceName*, then **Credential Mappings**.

2.  Select the credential mapping that you want to edit.

3.  In the **Remote User** field, replace the username of the current remote user with the username of the remote user that you want to remap the WebLogic resource to.

4.  Click **Save**.


#### Add a Set of Credentials {#GUID-D0937930-83A3-4405-BAF7-BD3813EF0121}

After you have added the first set of credentials for a remote system to a WebLogic resource, you can add more users from that remote system.

1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Credential Mappers**, then *credentialMappingProvider*, then *wlResourceType*, then *wlResourceName*, then **Credentials**.

2.  Click **New**.

3.  Enter the username and password for the remote user.

4.  Click **Create**.


You can now map a WebLogic user for the WebLogic resource to the new set of credentials.

{{< notice note >}}



If the password of the remote user changes, you’ll need to update it in WebLogic Remote Console or the mapping will break and prevent the WebLogic resource from logging into the remote system.

{{< /notice >}}


#### Delete a Set of Credentials {#GUID-D0D0CADB-77E3-4246-A6A9-D9398A98D0BC}

Each WebLogic resource has its own set of credentials. Removing a set of credential from WebLogic Remote Console will not affect the user in the remote system.

You cannot delete a credential that currently has a WebLogic resource mapped to it.

1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Credential Mappers**, then *credentialMappingProvider*, then *wlResourceType*, then *wlResourceName*, then **Credentials**.

2.  If the set of credentials that you want to delete has an active credential mapping, you can either:

    -   Select any relevant mappings and update the **Remote User** field to a new remote user.
    -   Delete all of the associated credential mappings. Once all credential mappings associated with this set of credential are deleted, the credential itself will also be automatically deleted and you can skip the rest of the steps.
3.  Under the same WebLogic resource, expand the **Credentials** node.

4.  Delete the set of credentials.

5.  Click **Save**.


### Configure a Certification Path Provider {#GUID-1AE293A9-6119-407F-A275-2311DAE6ECE9}

A Certification Path provider completes and validates certificate chains by using trusted CA based checking.

The provider checks the signatures in the chain, ensures that the chain has not expired, and confirms that one of the certificates in the chain is issued by one of the server’s trusted CAs. If any of these checks fail, the chain is not valid. Optionally, the provider checks the certificate chain’s basic constraints.

For more information on certificate validation on WebLogic Server, see [Configuring the Certificate Lookup and Validation Framework](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-14FD4062-DA8F-462D-BFC7-78948485F0A0) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*, then **Cert Path Providers**.

2.  Click **New**.

3.  In the **Name** field, enter a name for the new provider.

4.  Click **Create**.

5.  If you want to make this Certification Path provider the current builder of certificate chains for this realm, perform the following steps:

    1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*.

    2.  On the **Cert Path Builder** tab, select the Certification Path provider from the **Cert Path Builder** drop-down list.

    3.  Click **Save**.


### Configure the Password Validation Provider {#GUID-0F8BACA8-97AC-427F-8763-19628B13BF8D}

When configured in a security realm, the Password Validation provider is automatically invoked by a supported authentication provider whenever a password is created or updated for a user in that realm. The Password Validation provider then performs a check to determine whether the password meets the criteria established by the composition rules, and the password is accepted or rejected as appropriate.

The password composition rules you can configure for the Password Validation provider include:

-   User name policies, such as whether the password can be the same as the username.
-   Password length policies, such as a minimum or maximum length.
-   Character policies, such as the minimum or maximum number of alphabetic, numeric, or non-alphanumeric characters required in each password.

Passwords cannot contain a curly brace <code>{</code> as the first character.

{{< notice note >}}



If the Default Authentication provider is configured in the security realm, make sure that the setting for the minimum password length is consistent in both the Default Authentication provider and the Password Validation provider.

{{< /notice >}}


1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*, then **Password Validators**.

2.  Click **New**.

3.  Enter a name for the password validator.

4.  Click **Create**.

5.  On the configuration page of the password validator that you just created, select the **System Password Validator Parameters** tab.

6.  Use the configuration options to determine the criteria for an acceptable password.

7.  Click **Save**.


### Configure Custom Security Providers {#GUID-2632B8A6-F48D-4A48-A20C-E681BC14F365}

If the security providers provided by WebLogic Server do not meet the needs of your environment, then you can design your own custom security providers.

1.  Create a custom security provider. For guidance, see [Introduction to Developing Security Providers for WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEVSP-GUID-E21CBD90-0348-4F6E-B9E8-D9B7D5A5B1C2) in **Developing Security Providers for Oracle WebLogic Server**.

2.  Place the MBean JAR file for the custom provider in the <code>*WL_HOME*/server/lib/mbeantypes</code> directory.

3.  Add the custom security provider to the domain's security realm using WLST or the WebLogic Server RESTful management interface.

    {{< notice note >}}

    

    -   If you are adding a deployable Authorization provider and the provider does not support parallel security policy, then set the <code>RealmMBean.DeployableProviderSynchronizationEnabled</code> attribute to <code>true</code>. Next, for the <code>RealmMBean.DeployableProviderSynchronizationTimeout</code> attribute, enter a timeout value (in milliseconds) or accept the default value.

    -   If you are adding a deployable Role Mapping provider and the provider does not support role modification, then set the <code>RealmMBean.DeployableProviderSynchronizationEnabled</code> attribute to <code>true</code>. Next, for the <code>RealmMBean.DeployableProviderSynchronizationTimeout</code> attribute, enter a timeout value (in milliseconds) or accept the default value.

    For more information, see [Is Your Custom Authorization Provider Thread Safe?](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEVSP-GUID-EBD9A070-313E-468A-BB03-10B965F20172) or [Is Your Custom Role Mapping Provider Thread Safe?](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=DEVSP-GUID-A4BBD4FC-6721-49CF-8311-ECF7BC276D98) in **Developing Security Providers for Oracle WebLogic Server**.

    {{< /notice >}}



After you add the custom security provider to the security realm, you can use WebLogic Remote Console to configure and manage the inherited, standard attributes of the custom security provider. However, you cannot use WebLogic Remote Console to manage the custom attributes from your MDF file.

## Configure the Embedded LDAP Server {#GUID-36DD7EB8-924F-4A43-A61C-3EE5E871F0BB}

The embedded LDAP server contains user, group, group membership, security role, security policy, and credential map information. By default, each WebLogic Server domain has an embedded LDAP server configured with the default values set for each attribute.

The WebLogic Authentication, Authorization, Credential Mapping, and Role Mapping providers use the embedded LDAP server as their database. If you use any of these providers in a new security realm, you may want to change the default values for the embedded LDAP server to optimize its use in your environment.

1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

2.  On the **Security** tab, select the **Embedded LDAP** subtab.

3.  Update the values as appropriate for your environment.

    Consider updating the settings for backing up for the embedded LDAP servers. Specifically **Backup Hour**, **Backup Minute**, and **Backup Copies**. For information on how WebLogic Server backs up data for the embedded LDAP server, see [Backup and Recovery](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-1EF7A84B-708C-4806-B1DF-1E5B0279D315) in **Administering Security for Oracle WebLogic Server**.

4.  Click **Save** and commit your changes.

5.  Restart the server.


{{< notice note >}}



The WebLogic Security providers store their data in the embedded LDAP server. When you delete a WebLogic Security provider, the security data in the embedded LDAP server is not automatically deleted. The security data remains in the embedded LDAP server in case you want to use the provider again. Use an external LDAP browser to delete the security data from the embedded LDAP server.

{{< /notice >}}


## Users and Groups {#GUID-BFD3516F-073A-4AC0-8804-1FEFE6B439E4}

WebLogic Server employs users and groups to control access to its resources.

Users are entities that can be authenticated in a security realm. A user can be a person, such as application end user, or a software entity, such as a client application, or other instances of a WebLogic Server. As a result of authentication, a user is assigned an identity or principal. Each user is given a unique identity within the security realm. Users may be placed into groups that are associated with security roles, or can be directly associated with security roles.

Groups are logically ordered sets of users. Users are organized into groups that can have different levels of access to WebLogic resources, depending on their job functions. Managing groups is more efficient than managing large numbers of users individually. All user and group names must be unique within a security realm.

For more information, see [Users, Groups, And Security Roles](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-A313D8DB-50DB-43EE-8BA1-EDECDC0DE2FE) in **Securing Resources Using Roles and Policies for Oracle WebLogic Server**.

WebLogic Remote Console can only add, edit, or delete the users and groups within the default authentication provider (WebLogic Authentication Provider). If you are using another authentication provider that supports the required WebLogic Server APIs, you can view its users and groups in WebLogic Remote Console, but to manage them, you'll need to use an external tool specific to the provider. Providers that do not support the required WebLogic Server APIs do not appear in the Security Data tree.

### Create a User {#GUID-7A265AF1-F634-45EE-B685-C969A95DC476}

You can add users to the WebLogic Authentication provider.

1.  In the **Security Data Tree**, go to **Realms**, *myRealm*, then **Authentication Providers**, then **DefaultAuthenticator**, then **Users**.

2.  Click **New**.

3.  Enter a **Name**, **Description**, and **Password** for the user.

    User names must be unique in the security realm and passwords must be eight characters or longer.

4.  Click **Create**.

5.  If you want to add the new user to a group, then under the **Membership** tab, select a group under the **Available** section and move it to the **Chosen** section.

    User groups provide an efficient way to manage multiple users with the same responsibilities.


### Create a Group {#GUID-93577843-1040-4085-8AE9-EE64C6BDA935}

You can add groups to the WebLogic Authentication provider.

1.  In the **Security Data Tree**, go to **Realms**, *myRealm*, then **Authentication Providers**, then **DefaultAuthenticator**, then **Groups**.

2.  Click **New**.

3.  Enter a **Name** (and optionally, a **Description**) for the group.

    Group names must be unique in the security realm.

4.  Click **Create**.


You can nest a group under another so it inherits policies. Under the **Membership** tab, move groups from **Available** over to **Chosen** and the current group will be nested under the Chosen groups.

### Set User Lockout Attributes {#GUID-B1CBD6D5-6BAA-4DD6-A809-CE0E58707CF4}

You can control how many login attempts can be made by the same user account before WebLogic Server locks the account.

For more information, see [How Passwords Are Protected in WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-54984E78-43A9-4132-83EF-7BF7DFA58BA2) and [Protecting User Accounts](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-50C4FC1B-7E2C-44A2-9C3E-3FA6433F5023) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*.

2.  On the **User Lockout** tab, turn on the **Lockout Enabled** option.

3.  In the **Lockout Threshold** field, set the maximum number of invalid user login attempts that you want to allow before the user account is locked.

4.  Modify any additional user lockout attributes as necessary.

5.  Click **Save**.


### Unlock a User {#GUID-6BC2CFC8-FC4D-4D50-8B32-B06C34782B77}

You can unlock user accounts that became locked because of excessive failed login attempts on a per server basis.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  Go to **Security**, then **Realm Runtimes**, then *myRealm*.

3.  Click **Unlock User**.

4.  Enter the username of the locked user account. If applicable to your domain, you can also enter the identity domain.

5.  Click **Done**.


### View Users and Groups {#GUID-16E007EA-6BA2-49D9-9005-FF40C304792B}

If you added an authentication provider other than the default authentication provider (WebLogic Authentication Provider) to your security realm, you can view its users and groups but you cannot edit them in WebLogic Remote Console.

1.  In the **Security Data Tree**, go to **Realms**, *myRealm*, then **Authentication Providers**.

2.  Select the authentication provider whose users and groups you want to view.

3.  Expand the **Users** or **Groups** nodes to view the users and groups.


To edit these users and groups, you'll need to use an external tool specific to the provider.

## Security Policies and Roles {#GUID-6FDCFBD8-33DE-4962-9A17-F25BB3028D1E}

Use security policies to manage who can access a resource in a WebLogic Server domain.

A resource is an entity (such as a Web Service or a server instance) or an action (such as a method in a Web Service or the act of shutting down a server instance). For a list of resource types, see [Resource Types You Can Secure with Policies](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-A2DC979A-E464-4CDA-8B24-D9213709A7E3) in **Securing Resources Using Roles and Policies for Oracle WebLogic Server**.

A security policy specifies which users, groups, or roles can access the resource according to a set of conditions. Whenever possible, you should use security roles to determine access control. A security role, like a security group, grants an identity to a user. Unlike a group, however, membership in a role can be based on a set of conditions that are evaluated at runtime.

For most types of WebLogic resources, you can use WebLogic Remote Console to define the security policies and roles that restrict access. For Web applications and EJB resources, you can also use deployment descriptors.

The general process to secure a WebLogic resource is:

1.  Create users and groups.
2.  Manage default security roles or create new ones. We recommend that you use roles to secure WebLogic resources (instead of users or groups) to increase efficiency for administrators who work with many users. You can use the default roles that WebLogic Server provides or create your own.
3.  Create and apply security policies.

For more information, see [**Securing Resources Using Roles and Policies for Oracle WebLogic Server**](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-E454A766-0F19-472B-A470-F2BD9B6BEF64).

### Security Roles {#GUID-97E19315-7FE5-402F-ADB7-DD7351A49039}

A security role is an identity granted to users or groups based on specific conditions. Multiple users or groups can be granted the same security role and a user or group can be assigned more than one role. Security roles are used by policies to control access a WebLogic resource.

WebLogic Server provides a default set of roles that you can use with any policy. These are called global roles and you can create your own if the default global roles do not meet your needs.

You can also create roles that are only used by policies for a specific resource. These are called scoped roles. For example, You can create a scoped role for a specific EJB that contains highly sensitive business logic. When you create a policy for the EJB, you can specify that only the scoped role can access the EJB.

If two roles conflict, the role of a narrower scope overrides the role of the broader scope. For example, a scoped role for an EJB resource overrides a global role or a scoped role for the enterprise application that contains the EJB.

Security roles are created within a security realm, and the roles can be used only when the realm is active.

For more information, see [Overview of Security Roles](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-79645C45-C982-454D-A22C-6115B86EDAD3) in **Securing Resources Using Roles and Policies for Oracle WebLogic Server**.

#### Create a Global Role {#GUID-1D9925E8-CF23-4D3A-B4FF-61BBD466C454}

Create a new role that applies to all WebLogic resources deployed within a security realm (and thus the entire WebLogic Server domain).

{{< notice note >}}



Before creating a new global security role, review the [Default Global Roles](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-84859935-E7A5-4D3E-8A11-CBF63F93571A) in **Securing Resources Using Roles and Policies for Oracle WebLogic Server** to assess if an existing role is sufficient for your needs.

{{< /notice >}}


1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Role Mappers**, then **XACMLRoleMapper**, then **Global**, then **Roles**.

2.  Click **New**.

3.  Enter a name for the new global role.

4.  Click **Create**.


After a role is created, you can build a policy that uses conditions to determine which users or groups it encompasses. We recommend that whenever possible, you use the Group condition which grants the security role to all members of a specified group.

#### Create a Scoped Role {#GUID-CB641FD2-694F-452C-AC47-8E126374EF8D}

Create a new role that can only be used with policies that apply to specific resources.

1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Role Mappers**, then **XACMLRoleMapper**, then *myResource*, then **Roles**.

    *myResource* is the node path to the resource and may contain multiple node children. For example, to create a scoped role for a queue in a JMS module, your path would be …**XACMLRoleMapper**, then **JMS Modules**, then *jmsModuleName*, then **Queues**, then *queueName*, then **Roles**.

2.  Click **New**.

3.  Enter a name for the new scoped role.

4.  Click **Create**.


After a role is created, you can build a policy that uses conditions to determine which users or groups it encompasses. We recommend that whenever possible, that you use the Group condition which grants the security role to all members of a specified group.

### Security Policies {#GUID-A58BF20A-1E41-4AB3-8682-7EFE898A4169}

A security policy specifies the conditions that users, groups, or roles must meet to access a resource. Policies must have one or more conditions and you can combine conditions to create complex policies for more dynamic access control.

Root level policies apply to all instances of a specific resource type, for example, all JMS resources in your domain. All default security policies are root level policies.

You can also create policies that only apply to a specific resource instance. If the instance contains other resources, the policy will apply to the included resource as well. For example, you can create a policy for an entire JMS system resource, or for a particular queue or topic within that resource.

The policy of a narrower scope overrides policy of a broader scope. For example, if you create a security policy for a JMS system resource and a policy for a JMS queue within that system resource, the JMS queue will be protected by its own policy and will ignore the policy for the system resource.

For more information, see [Security Policies](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-1352BEAD-2CE9-4C5E-A77F-DB8E5FC5A4FB) in **Securing Resources Using Roles and Policies for Oracle WebLogic Server**.

It's recommended that you use the Role condition where possible. Basing conditions on security roles lets you create one security policy that takes into account multiple users or groups, and is a more efficient method of management.

See [Security Policy Conditions](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ROLES-GUID-F91088E1-EFA5-42BE-BD14-27127C797F23) in **Securing Resources Using Roles and Policies for Oracle WebLogic Server**.

#### Building Security Policies {#GUID-338F66D1-8D4C-40A0-ADF2-B84F4EF99A0B}

You can build and edit a policy by modifying a condition's arguments or by modifying the relationships between conditions in the policy.

{{< notice note >}}



You can only edit the arguments of the condition. If you want to use a different predicate for the condition, you must add a new condition.

{{< /notice >}}


Conditions have three different types of relationships: <code>AND</code>, <code>OR</code>, and <code>Combination</code>.

-   <code>AND</code>: All of the conditions joined by an <code>AND</code> operator must be met.
-   <code>OR</code>: At least one of the conditions joined by an <code>OR</code> operator must be met.
-   <code>Combination</code>: Two or more conditions are combined and must be evaluated as a group. Conditions *within* a combination are themselves related to each other through <code>AND</code> or <code>OR</code> operators.

By default, a new condition is added as a simple condition at the top of the list of conditions. To insert a new condition elsewhere, select an existing condition and then click **Add Condition**. You will get a drop-down list with options to add the new condition either above or below the selected condition. The order of conditions is not meaningful to how the policy is interpreted.

A policy can contain multiple simple or compound conditions or a mix of simple and compound conditions. You can also nest compound conditions.

{{< notice note >}}



Why should you use compound conditions? Consider the following scenario: a resource exists where you want Administrators to always have access, but to restrict Deployer access to between 9 a.m. and 5 p.m EST. The following policy would address both requirements:

-   Condition 1 (simple): Role: Admin

<code>OR</code>

-   Condition 2 (compound): Role: Deployer <code>AND</code> access occurs between 09:00:00 and 17:00:00 GMT -5:00

{{< /notice >}}


Use the actions on the Policy page to edit a policy.



<table id="GUID-338F66D1-8D4C-40A0-ADF2-B84F4EF99A0B__TABLE_HWN_KZT_ZZB">
                           <span>The actions available to configure a security policy.</span>
                           <thead>
                              <tr>
                                 <th id="d34709e3218">Action</th>
                                 <th id="d34709e3220">Description</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td>Add Condition</td>
                                 <td>
                                    <p>Adds a new condition to the policy. You can choose to add the new condition above or below another condition.</p>
                                 </td>
                              </tr>
                              <tr>
                                 <td>Combine</td>
                                 <td>
                                    <p>When multiple conditions are selected, you can combine them to create a compound condition.</p>
                                 </td>
                              </tr>
                              <tr>
                                 <td>Uncombine</td>
                                 <td>
                                    <p>When a compound condition is selected, you can break it into independent (simple) conditions.</p>
                                 </td>
                              </tr>
                              <tr>
                                 <td>Remove</td>
                                 <td>
                                    <p>Deletes a simple or compound condition from the policy. </p>
                                    <p>When there are no conditions in a policy, the default policy applies.</p>
                                 </td>
                              </tr>
                              <tr>
                                 <td>Negate</td>
                                 <td>
                                    <p>Reverses the meaning of a condition. The criteria to access a resource becomes the opposite of the original condition.</p>
                                 </td>
                              </tr>
                              <tr>
                                 <td>Reset</td>
                                 <td>
                                    <p>Reverts the policy to its last <em>saved</em> change, not the last change. It's recommended that you save your policy frequently or you may lose several changes unintentionally using the Reset action.</p>
                                 </td>
                              </tr>
                           </tbody>
                        </table>




You can also edit a policy from its **Advanced** tab where the policy is expressed as string. Any changes made to a policy in the Advanced tab are reflected in the main Policy tab, and vice versa.

To delete a policy, simply delete all of its conditions. Confirm that the default security policy for the resource instance will provide adequate access control before you delete a policy.

#### Create a Policy for Resource Instances {#GUID-4D84C60C-9BBC-4DF2-B721-7F361F6D656A}

You can create a security policy that only applies to a specific resource instance. If the instance contains other resources, the policy will apply to the included resources as well.

1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Authorizers**, then **XACMLAuthorizer**, then *myResourceInstance*.

    *myResourceInstance* is the node path to the resource instance and may contain multiple nodes. For example, to create a policy for a queue in a JMS module, your path would be "…**XACMLAuthorizer**, then **JMS Modules**, then *jmsModuleName*, then **Queues**, then *queueName*."

2.  Click **Add Condition**.

3.  Select a predicate from the **Predicate List**. Depending on the predicate you choose, you may need to configure arguments for the condition.

4.  Click **OK**.

5.  Click **Save**.

6.  Add more conditions to the policy to increase its complexity.


## Identity and Trust {#GUID-219D9EBA-79E1-430F-AECD-28B4A41FDAE9}

WebLogic Server uses private keys, digital certificates, and trusted certificates issued by certificate authorities to establish and verify server identity and trust.

WebLogic Server provides a default identity keystore and a default trust keystore. These default keystores are appropriate for testing and development purposes only.

-   In WebLogic Server 14.1.1.0 and earlier, the default identity keystore and default trust keystore are <code>DemoIdentity.jks</code> and <code>DemoTrust.jks</code>, respectively.
-   In WebLogic Server 14.1.2.0 and later, the default identity keystore and default trust keystore are <code>DemoIdentity.p12</code> and <code>DemoTrust.p12</code>, respectively.

Additionally, WebLogic Server trusts the certificate authorities in the <code>cacerts</code> file in the JDK.

For more information, see:

-   [Identity and Trust](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SCOVR-GUID-37762D14-EFD1-4060-A067-7C38910A90E3) in **Understanding Security for Oracle WebLogic Server**
-   [Configuring Keystores](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-7F03EB9C-9755-430B-8B86-17199E0C01DC) in **Administering Security for Oracle WebLogic Server**

{{< notice note >}}



If you are using the demo certificates in a multi-server domain, Managed Server instances will fail to boot if you specify the fully-qualified DNS name. For information about this limitation and suggested workarounds, see [Limitation on CertGen Usage](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-1EDCFA15-FB24-4B70-AEEF-63AF46F80D00) in **Administering Security for Oracle WebLogic Server**

{{< /notice >}}


The OPSS Keystore Service (KSS) provides an alternative mechanism to manage keys and certificates for message security. See [Managing Keys and Certificates](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=JISEC-GUID-4B6B2303-D7F2-4E50-A8CE-02A04D7CF3A7) in **Securing Applications with Oracle Platform Security Services**. The OPSS KSS makes using certificates and keys easier by providing central management and storage of keys and certificates for all servers in a domain. You can use the OPSS KSS to create and maintain keystores of type KSS. If the Oracle Java Required Files (JRF) template is installed on the WebLogic Server system, you have the option to use KSS keystores. The KSS keystore is available only with the JRF template and is not available with the default WebLogic Server configuration.

### Configuring Identity and Trust in WebLogic Server {}

1.  Obtain digital certificates, private keys, and trusted CA certificates from the <code>CertGen</code> utility, the <code>keytool</code> utility, the OPSS Keystore Service, or a reputable vendor that creates and signs certificates for use on the internet. You can also use the digital certificates, private keys, and trusted CA certificates provided by WebLogic Server. The demonstration digital certificates, private keys, and trusted CA certificates should be used in a development environment only.

    See [Configure Keystores](#GUID-E7406380-0590-42EA-8C3F-C5C302D0A692).

2.  If using KSS, verify whether KSS is properly populated, and note the KSS URIs and aliases of the required certificates and keys. You will need the KSS URIs and key aliases when specifying keystores, keys, and certificates.
3.  Store the private keys, digital certificates, and trusted CA certificates. Private keys and trusted CA certificates are stored in a keystore. If using KSS, import the required keys and certificates to KSS.
4.  Configure the identity and trust keystores for a WebLogic Server instance. See [Configure Keystores](#GUID-E7406380-0590-42EA-8C3F-C5C302D0A692).
5.  Configure SSL/TLS attributes for the server. These attributes describe the location of the identity key and certificate in the keystore. See [Set Up SSL/TLS](#GUID-E4A623A5-532D-443B-BA39-0E13B004EB94).

### Configure Keystores {#GUID-E7406380-0590-42EA-8C3F-C5C302D0A692}

WebLogic Server uses private keys, digital certificates, and trusted certificates issues by certification authorities to establish and verify server identity and trust. You can use JKS or PKCS12 keystores for identity and trust.

For more information, see [Configuring Keystores](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-7F03EB9C-9755-430B-8B86-17199E0C01DC) in **Administering Security for Oracle WebLogic Server**.

{{< notice note >}}



For testing and development purposes *only*, WebLogic Server provides a demonstration identity keystore and a demonstration trust keystore. For production environments, you should configure your own identity and trust keystores.

-   In WebLogic Server 14.1.1.0 and earlier, the demo identity keystore and demo trust keystore are <code>*DOMAIN_NAME*/security/DemoIdentity.jks</code> and <code>*WL_HOME*/server/lib/DemoTrust.jks</code>, respectively.
-   In WebLogic Server 14.1.2.0 and later, the demo identity keystore and demo trust keystore are <code>*DOMAIN_NAME*/security/DemoIdentity.p12</code> and <code>*DOMAIN_NAME*/security/DemoTrust.p12</code>, respectively.

Additionally, the JDK installation provides the <code>cacerts</code> truststore in JKS format at <code><code>*JDK*/lib/security/cacerts</code></code>.

{{< /notice >}}


1.  If you are using custom identity and custom trust keystores:

    1.  Obtain private keys and digital certificates from a reputable third-party certificate authority (CA).

    2.  Create identity and trust keystores.

    3.  Load the private keys and trusted CAs into the keystores.

2.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

3.  Click the **Security** tab, then the **Keystores** tab.

4.  From the **Keystores** drop-down list, select a type for storing and managing private keys/digital certificate pairs and trusted CA certificates.

    -   **Demo Identity and Demo Trust** - Select this option to use the demo certificates (suitable for development and testing). This is the default setting, and uses the demonstration identity and trust keystores, and the JDK <code>cacerts</code> keystore.

        To use a KSS keystore for demo identity and trust, you must first enable the **Use KSS For Demo** option (on the **Environment: Domain** page, under the **Security** tab (click **Show Advanced Fields**)) which determines whether the Demo Identity and Demo Trust key stores should be obtained from the Oracle Key Store Service (KSS).

    -   **Custom Identity and Java Standard Trust** - Select this option to use an identity keystore you created and the trusted CAs that are defined in the <code>cacerts</code> file in the <code>*JAVA_HOME*/jre/lib/security</code> directory.
    -   **Custom Identity and Custom Trust** - Select this option to use both identity and trust keystores that you created.
    -   **Custom Identity and Command Line Trust** - Select this option to use an identity keystore that you created, but the trust keystore is passed as an argument in the command that starts WebLogic Server.
5.  Define attributes for the identity and trust keystores. Depending on the keystore type that you selected, different options are available.

6.  Click **Save**.

7.  Repeat on all applicable servers.

8.  If you are updating a keystore configuration and have SSL/TLS configured already, you can check that all SSL/TLS connections exist according to the specified connection. In the **Monitoring Tree**, go to **Environment**, then **Servers**. Restart the applicable servers.

9.  If you enabled custom keystores and want to use Node Manager to start Managed Servers, you must also update the <code>nodemanager.properties</code> file to match.

    At minimum, update the following node manager properties as applicable to your environment:

    -   <code>CustomIdentityAlias</code>
    -   <code>CustomIdentityKeyStoreFileName</code>
    -   <code>CustomIdentityPrivateKeyPassPhrase</code>
    -   <code>CustomIdentityKeyStorePassPhrase</code>
    -   <code>KeyStores</code>
    See [Node Manager Properties](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=NODEM-GUID-ED02A005-A23A-4CF3-81F7-95805817CD77) in **Administering Node Manager for Oracle WebLogic Server**.


### Enable Certificate Revocation Checking {#GUID-C8C53705-3C69-4525-AE9D-39BBB6478C44}

WebLogic Server’s JSSE implementation supports X.509 certificate revocation (CR) checking, which checks a certificate’s revocation status as part of the SSL/TLS certificate validation process. CR checking improves the security of certificate usage by ensuring that received certificates have not been revoked by the issuing certificate authority. By default, CR checking is disabled in WebLogic Server.

WebLogic Server's CR checking implementation includes both the Online Certificate Status Protocol (OCSP) and certificate revocation lists (CRLs). For more information, see [X.509 Certificate Revocation Checking](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-3833DBD7-32E5-4CCF-AC3C-09D68696AA0F) in **Administering Security for Oracle WebLogic Server**.

Ensure that you have configured the identity and trust keystores for WebLogic Server. See [Identity and Trust](#GUID-219D9EBA-79E1-430F-AECD-28B4A41FDAE9).

1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

2.  On the **Security** tab, click the **SSL Certificate Revocation Checking** subtab.

3.  Turn on the **Enable Certificate Revocation Checking** option.

4.  Select a revocation checking method from the **Revocation Checks** drop-down list. The default is OCSP_THEN_CRL.

    Use the **OCSP** and **CRL** tabs to customize settings for the revocation checking method. For information on the options, see [Using the Online Certificate Status Protocol](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-6708C14D-1F37-4454-8DB7-69F2EC86ACBA) or [Using Certificate Revocation Lists](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-4E2A9AB6-233E-475C-A32E-FAACEB12052E) in **Administering Security for Oracle WebLogic Server**.

5.  If you want a certificate whose revocation status cannot be determined to fail SSL/TLS certificate path validation, turn on the **Fail on Unknown Revocation Status** option.

    When this option disabled, if an X.509 certificate’s revocation status cannot be determined, but the SSL/TLS certificate path validation is otherwise successful, the certificate will be accepted.

6.  Click **Save**.


You can configure certificate authority overrides to the certificate revocation configuration. See [Configure Certificate Authority Overrides](#GUID-E94764E7-FE43-49E7-A6F5-8699F2039103).

#### Configure Certificate Authority Overrides {#GUID-E94764E7-FE43-49E7-A6F5-8699F2039103}

Configuring a certificate authority override allows you to specify CR checking behavior that is specific to certificates issued by a particular certificate authority (CA). A certificate authority override always supersedes the corresponding certificate revocation (CR) checking configuration that is set at the domain level.

A certificate authority override can be used to supersede, for a given CA, any domain-wide CR checking configuration settings, with the exception of the CRL local cache, which is configured on a domain-wide basis only.

1.  If you haven't done so already, enable certificate revocation checking as described in [Enable Certificate Revocation Checking](#GUID-C8C53705-3C69-4525-AE9D-39BBB6478C44).

2.  In the **Edit Tree**, go to **Security**, then **Certificate Authority Overrides**.

3.  Click **New** and then enter a name for the new certificate authority override.

4.  Click **Create**.

5.  In the **Distinguished Name** field, enter the distinguished name of the CA. This must be the complete issuer distinguished name (defined in RFC 2253) of the certificates for which this override applies.

    For example, <code>CN=CertGenCAB, OU=FOR TESTING ONLY, O=MyOrganization, L=MyTown, ST=MyState,C=US</code>.

6.  Use the **General**, **OCSP**, and **CRL** tabs to modify the settings as necessary for your environment. For descriptions of the attributes and when you might want to configure them, see:

    -   [General Certificate Authority Overrides](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-D12F4E0A-F3FA-4A7A-9275-8D3AB9FD3E71)
    -   [Configuring OCSP Properties in a Certificate Authority Override](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-EE764391-4415-49C9-A6E5-D3C46995197F)
    -   [Configuring CRL Properties in a Certificate Authority Override](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-AD3E8E04-D26C-4C9B-B390-EEBA80E20906)
    in **Administering Security for Oracle WebLogic Server**.

7.  Click **Save**.


## SSL/TLS {#GUID-63D4159D-840B-4E4F-BAB7-1D12CCCD62DE}

Transport Layer Security (TLS) and its predecessor, Secure Sockets Layer (SSL), ensure secure connections by allowing two applications connecting over a network connection to authenticate the other's identity and by encrypting the data exchanged between the applications.

Authentication allows a server and optionally a client to verify the identity of the application on the other end of a network connection. Encryption makes data transmitted over the network intelligible only to the intended recipient.

WebLogic Server supports SSL/TLS on a dedicated listen port which defaults to 7002. To establish an SSL/TLS connection, a Web browser connects to WebLogic Server by supplying the SSL/TLS listen port and the HTTPs protocol in the connection URL, for example, <code>https://myserver:7002</code>.

You can configure SSL/TLS as either one-way or two-way.

-   With one-way SSL/TLS, the server is required to present a certificate to the client but the client is not required to present a certificate to the server.
-   With two-way SSL/TLS, the server presents a certificate to the client and the client presents a certificate to the server. WebLogic Server can be configured to require clients to submit valid and trusted certificates before completing the SSL/TLS handshake.

For more information on how SSL/TLS is used in WebLogic Server, see [Configuring SSL](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-5274E688-51EC-4A63-A35E-FC718B35C897) in **Administering Security for Oracle WebLogic Server**.

{{< notice note >}}



Although the terms TLS, SSL, and SSL/TLS are used interchangeably throughout WebLogic Server documentation, it is expected and encouraged that you use a currently supported version of TLS, not SSL, to secure communication in WebLogic Server.

{{< /notice >}}


### Set Up SSL/TLS {#GUID-E4A623A5-532D-443B-BA39-0E13B004EB94}

Establish secure communication between multiple applications connecting over a network connection.

Configure the identity and trust keystores for WebLogic Server. See [Configure Keystores](#GUID-E7406380-0590-42EA-8C3F-C5C302D0A692).

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  Click the **Security** tab, then the **SSL** subtab.

3.  Set SSL/TLS attributes for the private key alias and password.

4.  In the **Server Private Key Alias** field, enter the keystore attribute that defines the string alias used to store and retrieve the server's private key.

5.  In the **Server Private Key Pass Phrase** field, enter the keystore attribute that defines the passphrase used to retrieve the server's private key.

6.  Click **Show Advanced Fields**.

7.  Turn off the **Disable Hostname Verification** option.

    See [Enable Host Name Verification](#GUID-2B9A775D-A1E1-4A4B-B773-96CC37D9FBF0).

8.  In the **Export Key Lifespan** field, indicate the number of times WebLogic Server can use an exportable key between a domestic server and an exportable client before generating a new key. The more secure you want WebLogic Server to be, the fewer times the key should be used before generating a new key.

9.  For both the **Inbound Certificate Validation** and the **Outbound Certificate Validation** drop-down lists, select a validation method.

    -   **Builtin SSL Validation Only**: Uses the built-in trusted CA-based validation. This is the default.
    -   **Builtin SSL Validation and Cert Path Validators**: Uses the built-in trusted CA-based validation and uses configured CertPathValidator providers to perform extra validation.
    For more information, see [Using Certificate Lookup and Validation Providers](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-21503641-395C-4F70-AAD7-6C3195B1EB02) in **Administering Security for Oracle WebLogic Server**.

10. Enable two-way SSL/TLS.

    By default, WebLogic Server is configured to use one-way SSL/TLS, where the server passes its identity to the client. In a two-way SSL/TLS connection, the client verifies the identity of the server and then passes its identity certificate to the server. The server then validates the identity certificate of the client before completing the SSL/TLS handshake. The server determines whether or not two-way SSL/TLS is used.

    Before enabling two-way SSL/TLS, ensure that the trust keystore for the server includes the certificate for the trusted certificate authority that signed the certificate for the client. See [Identity and Trust](#GUID-219D9EBA-79E1-430F-AECD-28B4A41FDAE9).

    1.  Turn on the **Two Way SSL Enabled** option.

    2.  Choose whether to enable the **Client Certificate Enforced** option. When enabled, a client is required to present a certificate. If a certificate is not presented, the SSL/TLS connection is terminated. When disabled, the SSL/TLS connection continues even if a certificate is not presented by the client.

    You may also want to force all administration clients use two way SSL/TLS. If an administration client attempts to connect to a server on a channel that does not require two-way SSL/TLS, then the connection is rejected.

    1.  Under **Environment**, then **Domain**, click the **Security** tab and enable **Show Advanced Fields**.

    2.  Turn on the **Require 2 way TLS for Admin Clients** option.

11. Click **Save**.

12. Repeat on all applicable servers.


### Enable Host Name Verification {#GUID-2B9A775D-A1E1-4A4B-B773-96CC37D9FBF0}

A host name verifier ensures the host name in the URL to which the client connects matches the host name in the digital certificate that the server sends back as part of the SSL/TLS connection. If the host name in the certificate matches the local machine’s host name, host name verification passes if the URL specifies <code>localhost</code>, <code>127.0.0.1</code>, or the default IP address of the local machine.

A host name verifier is useful when a SSL/TLS client (or a WebLogic Server acting as an SSL/TLS client) connects to an application server on a remote host. Host name verification is performed only by a SSL/TLS client. By default, WebLogic Server has host name verification enabled and we recommend keeping it enabled for production environments.

{{< notice note >}}



The following steps only apply when a WebLogic Server instance is acting as an SSL/TLS client. Stand alone SSL/TLS clients specify the use of host name verification using command-line arguments or the API.

{{< /notice >}}


1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  Click the **Security** tab, then **SSL**.

3.  Click **Show Advanced Fields**.

4.  Turn off **Disable Hostname Verification**.

5.  Choose a hostname verifier from the **Hostname Verifier** drop-down list.

    As of WebLogic Server 14.1.1.0.0, the default verifier is the wildcard verifier.

6.  If you want to use a custom verifier, follow these steps.

    {{< notice note >}}

    

    If you write a custom host name verifier, the class that implements the host name verifier must be specified in the <code>CLASSPATH</code> of WebLogic Server (when acting as an SSL/TLS client) or a stand alone SSL/TLS client.

    When you use stand alone SSL/TLS clients, a custom host name verifier must be specified on the command line using the following argument or through the API: <code>-Dweblogic.security.SSL.HostnameVerifier=*classname*</code> where *classname* specifies the implementation of the <code>weblogic.security.SSL.HostnameVerifier</code> interface.

    {{< /notice >}}


    1.  Create a custom host name verifier as described in [Using a Custom Hostname Verifier](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SCPRG-GUID-82FA86BC-5592-486E-B6CB-75C39739DBA4) in **Developing Applications with the WebLogic Security Service**.

    2.  From the **Hostname Verifier** drop-down list, select **Custom Verifier**.

    3.  In the **Custom Hostname Verifier** field, enter the name of the implementation of the <code>weblogic.security.SSL.HostnameVerifier</code> interface.

7.  Click **Save**.


All the server SSL/TLS attributes are dynamic. When modified using WebLogic Remote Console, they cause the corresponding SSL/TLS server or channel SSL/TLS server to restart and use the new settings for new connections. Old connections will continue to run with the old configuration.

### Restart SSL/TLS {#GUID-9F87B333-4F7E-461B-876A-1345105CC86C}

All server SSL/TLS attributes are dynamic. You can modify these attributes and then apply your changes without rebooting WebLogic Server. Instead, only the corresponding SSL/TLS server or channel SSL/TLS server will restart and use the new settings for new connections. Existing connections continue to run with the old configuration.

1.  If you haven't done so already, turn on automatic realm restart in the default security realm. See [Enable Automatic Realm Restart](#GUID-65011AC0-166C-414C-8FD5-A085E7599FA7).

    If automatic realm restart is not enabled, old connections will continue to run with the old configuration and you must restart WebLogic Server after restarting SSL/TLS to ensure that all the SSL/TLS connections exist according to the specified configuration.

2.  In the **Monitoring Tree**, go to **Environment**, then **Servers**.

3.  Select the checkbox for each server where you want to restart SSL/TLS.

4.  Click **Restart SSL** to restart the SSL/TLS listen sockets to apply changes to your keystore.


## Specify Cipher Suites {#GUID-E7FC39A4-F406-4242-93EE-513724E610A8}

Configure cipher suites supported by WebLogic Server.

1.  In the **Edit Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  Click the **Security** tab, then the **SSL** subtab.

3.  Click **Show Advanced Fields**.

4.  In the **Cipher Suites** field, enter the cipher suites that you want to support on this server.

5.  In the **Excluded Cipher Suites** field, enter any cipher suites that you want to block on this server.

6.  Click **Save**.

7.  Repeat for other servers as necessary.


## Enable Cross Domain Security {#GUID-A76CFD94-8A70-4149-924C-4AEE42D828FB}

Cross domain security establishes trust between two WebLogic Server domains by using a credential mapper to configure communication between the WebLogic Server domains.

For more information, see [Configuring Cross-Domain Security](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-44F58D74-DFE2-417A-9528-5D6F3991592B) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

2.  On the **Security** tab, turn on **Cross Domain Security Enabled**.

    To reduce the impact on performance, WebLogic Server caches the authenticated subject. If you want to modify the cache settings for your environment, click **Show Advanced Fields** and change the following settings:

    -   To disable the cache, turn off **Cross Domain Security Cache Enabled**.
    -   To change how often the cache is cleared, update the **Cross Domain Security Cache TTL** value (in seconds).
3.  Click **Save** and then commit your changes.

4.  Create a user for cross domain security and assign it to the <code>CrossDomainConnectors</code> group. See [Create a User](#GUID-7A265AF1-F634-45EE-B685-C969A95DC476).

    For more information on, see [Configuring Cross-Domain Users](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-6732713E-C103-4808-9D8C-0E4CA70DCC5A) in **Administering Security for Oracle WebLogic Server**.

5.  Configure a cross-domain security credential mapping for the cross-domain security user.

    For information on credential mapping, see [Configure a Credential Mapping Provider](#GUID-49DE7039-810D-433A-A5EB-6A4E1FEB885C).

    1.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Credential Mappers**, then *myCredentialMapper*, then **Remote Resources**.

    2.  Click **New**.

    3.  Turn on the **Use cross-domain protocol** option.

    4.  In the **Remote Domain** field, enter the name of the remote domain that needs to interact with the local domain.

    5.  In the **Remote User** field, enter the username of the user configured in the remote domain that is authorized to interact with the local domain.

    6.  In the **Remote Password** field, enter the password of the user configured in the remote domain that is authorized to interact with the local domain.

    7.  Click **Create**.


## Enable Global Trust Between Domains {#GUID-61D9E1FF-834E-4692-9770-DF23C3374D3C}

If you want multiple WebLogic Server domains to interoperate, you can specify the same domain credential for each of the domains. Typically, the domain credential is randomly generated by default and therefore, no two domains have the same domain credential.

When this feature is enabled, identity is passed between WebLogic Server domains over an RMI connection without requiring authentication in the second domain. When inter-domain trust is enabled, transactions can commit across domains. A trust relationship is established when the domain credential for one domain matches the domain credential for another domain. For more information, see [Enabling Global Trust](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-F00E7299-2E4D-40DE-B740-3529A5BB7BF0) in **Administering Security for Oracle WebLogic Server**.

Instead of enabling global trust between domains, consider using the CrossDomainConnector role, as described in [Enable Cross Domain Security](#GUID-A76CFD94-8A70-4149-924C-4AEE42D828FB).

1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

2.  On the **Security** tab, click **Show Advanced Fields**.

3.  In the **Security Credential** field, enter a new password for the domain. Choose a strong password.

4.  Click **Save**.

5.  Perform the same procedure in each domain for which you want to enable global trust, entering the exact same password.


## Configure Connection Filtering {#GUID-96104A94-1BBE-4DC0-9D02-69197EA51530}

Connection filters allow you to deny access at the network level. They can be used to protect server resources on individual servers, server clusters, or an entire internal network or intranet.

For more information on connection filters, see [Using Connection Filters](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-EE77970D-3E75-4015-94EB-CD9BB8DC254E) in **Administering Security for Oracle WebLogic Server**.

1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

2.  On the **Security** tab, select the **Filter** subtab.

3.  Turn on the **Connection Logger Enabled** option to enable the logging of accepted messages. The Connection Logger logs successful connections and connection data in the server. This information can be used to debug problems relating to server connections.

4.  In the **Connection Filter** field, specify the connection filter class to be used in the domain.

    -   To configure the default connection filter, specify <code>weblogic.security.net.ConnectionFilterImpl</code>.
    -   To configure a custom connection filter, specify the class that implements the network connection filter. This class must also be present in the class path for WebLogic Server.
5.  In the **Connection Filter Rules** field, enter the syntax for the connection filter rules.

    For more information about connection filter rules, see [Guidelines for Writing Connection Filter Rules](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SCPRG-GUID-A312878D-EC41-48DF-B318-E1E0D5A9307E) in **Developing Applications with the WebLogic Security Service**.

6.  If you want WebLogic Server to ignore errors in filter rules during server startup, turn on the **Connection Filter Ignore Rule Errors** option.

7.  Click **Save**.


## Create an Allowlist for JEP 290 Filtering {#GUID-8467DDDA-C721-416C-BEBD-0BDD704BEFBC}

To improve security, WebLogic Server uses the JDK JEP 290 mechanism to filter incoming serialized Java objects and limit the classes that can be deserialized.

For more information, see [Using JEP 290 in Oracle WebLogic Server](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-74A34AA1-B139-431C-B87A-578DAAA682B1) in **Administering Security for Oracle WebLogic Server**.

When using the allowlist model, WebLogic Server and the customer define a list of the acceptable classes and packages that are allowed to be deserialized, and block all other classes.

{{< notice note >}}



WebLogic Server also supports using blocklists for JEP 290 filtering. For instructions on using blocklists, see [How WebLogic Server Uses JEP 290 Blocklists and Allowlists](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-56C7F67B-69EC-4F03-A057-F32024B26E3F) in **Administering Security for Oracle WebLogic Server**.

{{< /notice >}}


1.  Configure the domain to record all of the classes and packages used in both WebLogic Server and customer application deserialization.

    1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

    2.  On the **Security** tab, select the **Allow List** subtab.

    3.  Turn on the **Recording Enabled** option.

        When recording is enabled, all classes are allowed during deserialization except for the classes specified in the blocklist.

    4.  Save and commit the change.

2.  Run a full set of tests to ensure that the recorded allowlist configuration file provides appropriate coverage of all packages and classes that must be allowed in order for your application to run successfully. When deserialization occurs, each class is recorded in <code>*DOMAIN_HOME*/config/security/jep290-recorded.serial.properties</code>.

    A sample <code>jep290-recorded.serial.properties</code> is shown below:

    <pre>Wed May 19 23:55:13 UTC 2021
    weblogic.oif.serialFilter=\
        com.company1.common.collections.objs.*;\
        com.company1.common.tools.Calculator;\
        com.company2.shared.tools.Converter
    weblogic.oif.serialGlobalFilter=\
        com.company1.common.lists.AList;\
        com.company1.common.tools.Calculator;\
        com.company2.shared.tools.*
    </pre>

3.  Turn off the **Recording Enabled** option. Save and commit the change.

4.  Configure the domain to use allowlists.

    1.  In the **Edit Tree**, go to **Environment**, then **Domain**. Click the **Security** tab, then the **Allow List** subtab. From the **Violation Action** drop-down list, select the appropriate setting.

        -   <code>IGNORE</code> - Ignore the allowlist and use the blocklists. If any class found during deserialization is present in the blocklist, the class is blocked from being deserialized.

        -   <code>LOG</code> - Log a message if a violation occurs but allow the class unless it is listed in the blocklist.

        -   <code>DENY</code> - Block everything except the classes specified in the allowlist, and log a message when a class is blocked.

        {{< notice note >}}

        

        You can also set the <code>AllowListViolationAction</code> on a channel using the network access point. Doing so allows you to use an allowlist on untrusted external channels and a blocklist on internal trusted channels.

        {{< /notice >}}


    2.  Click **Save** and commit your changes.

5.  By default, the directory containing the allowlist configuration file is polled every 60 seconds. If you want to change the default polling interval, do the following:

    1.  In the **Edit Tree**, go to **Environment**, then **Domain**.

    2.  Click the **Security** tab, then the **Allow List** subtab.

    3.  In the **Serial Profile Polling Interval** field, enter the new interval.

    4.  Click **Save**.

6.  Configure your production domain to use allowlists by copying the recorded allowlist configuration file that you just created to the <code>*DOMAIN_HOME*/config/security</code> directory of the production domain.

    {{< notice note >}}

     Oracle recommends that you run your production domain with <code>AllowListViolationAction</code> set to <code>Log</code> for some period of time to ensure that all classes and packages were recorded.

    {{< /notice >}}



It's important to maintain the accuracy of the allowlist configuration file. Whenever a new application is deployed to the domain, or a new version of the application is deployed, you should repeat this entire process, to recreate the allowlist or verify the allowlist with the new application to ensure that all packages and classes required by the new or updated application are included in the allowlist.

## Configure SAML 2.0 Services: Main Steps {#GUID-40F47509-2155-4280-8438-E4E54F4EB082}

You can configure your WebLogic Server instance as either a Service Provider or Identity Provider.

For more information on using SAML 2.0 with WebLogic Server, see [Configuring SAML 2.0 Services](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-6064D37D-5934-4A10-A8BD-527CA778A642) in **Administering Security for Oracle WebLogic Server**.

{{< notice note >}}

 You cannot configure SAML 1.1 services using WebLogic Remote Console.

{{< /notice >}}


1.  If you plan to have SAML 2.0 services running in more than one WebLogic Server instance in the domain, then create a domain in which the RDBMS security store is configured. See [Use the RDBMS Security Store](#GUID-76152470-62AE-434B-93EF-E6EF31AF1B7A).

    The RDBMS security store is required by SAML 2.0 security providers in production environments so that the data they manage can be synchronized across all of the WebLogic Server instances that share that data.

    Oracle does not recommend upgrading an existing domain in place to use the RDBMS security store. If you want to use the RDBMS security store, then you should configure the RDBMS security store at the time of domain creation. If you have an existing domain with which you want to use the RDBMS security store, then create the new domain and migrate your existing security realm to it.

    See [Managing the RDBMS Security Store](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-7AE06479-0168-4277-AA84-6D5C87F1A004) in **Administering Security for Oracle WebLogic Server**.

2.  Review the considerations described in [Web Application Deployment Considerations for SAML 2.0](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-AB58954F-E9B6-41BC-AF03-3C5C106F034F) in **Administering Security for Oracle WebLogic Server**.

3.  Configure SAML 2.0 general services. Apply the same configuration settings to each server instance. See [Configure SAML 2.0 General Services](#GUID-E1F19992-4206-480A-982D-330FDA4BA315).

4.  If you are configuring a SAML 2.0 Identity Provider site,

    1.  Create an instance of the SAML 2.0 Credential Mapping provider in the security realm. See [Configure a Credential Mapping Provider](#GUID-49DE7039-810D-433A-A5EB-6A4E1FEB885C).

    2.  Configure SAML 2.0 Identity Provider services. Apply the same configuration settings to each server instance. See [Configure SAML 2.0 Identity Provider Services](#GUID-7D3ABA17-47D8-42D0-84FF-BDBF3C5B6C9B).

    3.  Publish the metadata file describing your site, and manually distribute it to your Service Provider partners. See [Publish SAML Metadata](#GUID-895BD614-CF55-4553-934F-39FF9152A35F).

    4.  Create and configure your Service Provider partners. See [Create a SAML 2.0 Web Service Service Provider Partner](#GUID-7398DB64-9761-46ED-821F-3C94ADFC5363) or [Create a SAML 2.0 Web Single Sign-On Service Provider Partner](#GUID-F89D61B8-4931-4B96-B113-CC8AB0885996).

5.  If you are configuring a SAML 2.0 Service Provider site,

    1.  Create an instance of the SAML 2.0 Identity Assertion provider in the security realm. See [Configure an Authentication or Identity Assertion Provider](#GUID-F8F5FE70-EB42-4F31-9AFE-70037E23510A)

    2.  If you are allowing virtual users to log in using SAML, create an instance of the SAML Authentication provider. See [Configuring the SAML Authentication Provider](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-2F98AC11-0161-4D2E-868B-ED778802F57A) in **Administering Security for Oracle WebLogic Server**.

    3.  Configure SAML 2.0 Service Provider services. Apply the same configuration settings to each server instance. See [Configure SAML 2.0 Service Provider Services](#GUID-63E10B5D-0DE1-42B3-90D2-DEE3BAC93CC9)

    4.  Publish the metadata file describing your site, and manually distribute it to your Identity Provider partners. See [Publish SAML Metadata](#GUID-895BD614-CF55-4553-934F-39FF9152A35F)

    5.  Create and configure your Identity Provider partners. See [Create a SAML 2.0 Web Service Identity Provider Partner](#GUID-CF599ABB-5F8F-4218-949F-F32A40F368E8) or [Create a SAML 2.0 Web Single Sign-On Identity Provider Partner](#GUID-6E546B34-2490-4372-B811-2A3992244A7E).


### Configure SAML 2.0 General Services {#GUID-E1F19992-4206-480A-982D-330FDA4BA315}

Whether you configure a WebLogic Server instance as a SAML 2.0 Identity Provider or as a SAML 2.0 Service Provider, you must configure the server's general SAML 2.0 services.

For more information, see [Configuring SAML 2.0 General Services](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-F9E5C1F5-4E5C-466A-90AB-B78B029F5407) in **Administering Security for Oracle WebLogic Server**.

1.  Review the general steps for configuring SAML 2.0 services as described in [Configure SAML 2.0 Services: Main Steps](#GUID-40F47509-2155-4280-8438-E4E54F4EB082).

2.  In the **Edit Tree**, go to **Environment**, then **Servers**.

3.  Select the server instance where you want to configure SAML general services.

4.  Click the **Security** tab, then the **SAML 2.0 General** subtab.

5.  Turn on the **Replicated Cache** option to use the persistent cache for storing SAML 2.0 artifacts.

    This option is required if you are configuring SAML 2.0 services in two or more WebLogic Server instances in your domain. If you are configuring SAML 2.0 services in a cluster, you must enable this option in each Managed Server instance individually.

6.  Modify the settings as necessary for your environment. For descriptions of the fields and when you might want to configure them, see [About SAML 2.0 General Services](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-F11352EE-6FF1-4B96-83B4-FA375BF4D5E5) in **Administering Security for Oracle WebLogic Server**.

7.  Click **Save**.

8.  Repeat for the rest of the servers in domain. Make sure you apply the exact same configuration settings to all servers.

9.  Publish the metadata file. See [Publish SAML Metadata](#GUID-895BD614-CF55-4553-934F-39FF9152A35F).


Next, configure the server as an Identity Provider or as a Service Provider. See [Configure SAML 2.0 Identity Provider Services](#GUID-7D3ABA17-47D8-42D0-84FF-BDBF3C5B6C9B) or [Configure SAML 2.0 Service Provider Services](#GUID-63E10B5D-0DE1-42B3-90D2-DEE3BAC93CC9), respectively.

### Publish SAML Metadata {#GUID-895BD614-CF55-4553-934F-39FF9152A35F}

The SAML metadata file contains the information about this site's SAML 2.0 services. Share this file with your federated partners to facilitate SAML 2.0 web single sign-on.

1.  In the **Monitoring Tree**, go to **Environment**, then **Servers**, then *myServer*.

2.  On the **SAML 2.0** tab, click **Publish Metadata**.

3.  In the **Publish Metadata** dialog box, specify a file path location to save the metadata file. The file path must be relative to the Administration Server.

4.  Click **Done**.

5.  Distribute the metadata file to your federated partners. For distribution recommendations, see [Publishing and Distributing the Metadata File](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-9E47C1A3-10C6-4C85-8B2F-69481B7ACFE8) in **Administering Security for Oracle WebLogic Server**.


### Configure SAML 2.0 Identity Provider Services {#GUID-7D3ABA17-47D8-42D0-84FF-BDBF3C5B6C9B}

A SAML 2.0 Identity Provider creates, maintains, and manages identity information for principals, and provides principal authentication to other Service Provider partners within a federation by generating SAML 2.0 assertions for those partners.

1.  Perform the SAML 2.0 general services configuration as described in [Configure SAML 2.0 General Services](#GUID-E1F19992-4206-480A-982D-330FDA4BA315).

2.  Configure a SAML 2.0 Credential Mapping provider if you haven't done so already. See [Configure a Credential Mapping Provider](#GUID-49DE7039-810D-433A-A5EB-6A4E1FEB885C).

3.  In the **Edit Tree**, go to **Environment**, then **Servers**.

4.  Select the server instance where you want to perform SAML configuration for servers in the role of Identity Provider.

5.  Click the **Security** tab, then the **SAML 2.0 Identity Provider** subtab.

6.  Turn on the **Enabled** option to activate this server's SAML 2.0 services in the role of Identity Provider.

7.  Modify the settings as necessary for your environment. For descriptions of the attributes and when you might want to configure them, see [Configure SAML 2.0 Identity Provider Services](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-9F82F829-AF5D-474D-83A9-994CF6E19C2E) in **Administering Security for Oracle WebLogic Server**.

8.  Click **Save**.

9.  Repeat for the rest of the servers. Make sure you apply the same configuration settings to all servers.


Create and configure your Service Provider partners. See [Create a SAML 2.0 Web Single Sign-On Service Provider Partner](#GUID-F89D61B8-4931-4B96-B113-CC8AB0885996) or [Create a SAML 2.0 Web Service Service Provider Partner](#GUID-7398DB64-9761-46ED-821F-3C94ADFC5363).

Coordinate with your federated partners to ensure that the SAML bindings you have enabled for this SAML authority, as well as your requirements for signed documents, are compatible with your partners.

#### Create a SAML 2.0 Web Service Service Provider Partner {#GUID-7398DB64-9761-46ED-821F-3C94ADFC5363}

A SAML 2.0 Service Provider partner is an entity that consumes the SAML 2.0 assertions generated by the Identity Provider site.

1.  Obtain, using a trusted and secure mechanism, the metadata file from your federated partner that describes the partner, the binding support, certificates and keys, and so on. See [Obtain Your Service Provider Partner's Metadata File](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-A2518F8E-1BC6-4714-B7F7-A6309DC9360E) in **Administering Security for Oracle WebLogic Server**.

2.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Credential Mappers** and select the SAML 2.0 credential mapping provider that you configured for the server.

3.  Click the **Partners** node.

4.  Click **New**.

5.  Enter a name for the Service Provider partner.

6.  From the **Type** drop-down list, select **Web Service Service Partner**.

7.  Click **Create**.

8.  Turn on the **Enabled** option to enable interactions between this server and this Service Provider partner.

9.  Modify the settings as necessary for your environment. For descriptions of the settings and when you might want to configure them, see [Create and Configure Web Single Sign-On Service Provider Partners](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-5B5DDD42-3176-48B8-AE23-635B8F30466E) in **Administering Security for Oracle WebLogic Server**.

10. Click **Save**.


#### Create a SAML 2.0 Web Single Sign-On Service Provider Partner {#GUID-F89D61B8-4931-4B96-B113-CC8AB0885996}

A SAML 2.0 Service Provider partner is an entity that consumes the SAML 2.0 assertions generated by the Identity Provider site.

1.  Obtain, using a trusted and secure mechanism, the metadata file from your federated partner that describes the partner, the binding support, certificates and keys, and so on. See [Obtain Your Service Provider Partner's Metadata File](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-A2518F8E-1BC6-4714-B7F7-A6309DC9360E) in **Administering Security for Oracle WebLogic Server**.

2.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Credential Mappers** and select the SAML 2.0 credential mapping provider that you configured for the server.

3.  Click the **Partners** node.

4.  Click **New**.

5.  Enter a name for the Service Provider partner.

6.  From the **Type** drop-down list, select **Web Single Sign-On Service Partner**.

7.  In the **Meta Data File Name** field, enter the file path to the metadata partner file you received from your federated partner.

8.  Click **Create**.

9.  Turn on the **Enabled** option to enable interactions between this server and this Service Provider partner.

10. Modify the settings as necessary for your environment. For descriptions of the settings and when you might want to configure them, see [Create and Configure Web Single Sign-On Service Provider Partners](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-5B5DDD42-3176-48B8-AE23-635B8F30466E) in **Administering Security for Oracle WebLogic Server**.

11. Click **Save**.


### Configure SAML 2.0 Service Provider Services {#GUID-63E10B5D-0DE1-42B3-90D2-DEE3BAC93CC9}

A Service Provider is a SAML authority that can receive SAML assertions and extract identity information from those assertions. The identity information can then be mapped to local Subjects, and optionally groups as well, that can be authenticated.

1.  Perform the SAML 2.0 general services configuration as described in [Configure SAML 2.0 General Services](#GUID-E1F19992-4206-480A-982D-330FDA4BA315).

2.  If you haven't done so already, configure a SAML 2.0 Identity Assertion provider . See [Configure an Authentication or Identity Assertion Provider](#GUID-F8F5FE70-EB42-4F31-9AFE-70037E23510A).

3.  In the **Edit Tree**, go to **Environment**, then **Servers**.

4.  Select the server instance where you want to perform SAML configuration.

5.  Click the **Security** tab, then the **SAML 2.0 Service Provider** subtab.

6.  Turn on the **Enabled** option to activate this server's SAML 2.0 services in the role of Service Provider.

7.  Modify the settings as necessary for your environment. For descriptions of the attributes and when you might want to configure them, see [Configure SAML 2.0 Service Provider Services](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-BF9103AB-20B6-4B18-BE69-78E3689A21F1) in **Administering Security for Oracle WebLogic Server**.

8.  Click **Save**.

9.  Repeat for the rest of the servers. Make sure you apply the same configuration settings to all servers.


Create and configure your Identity Provider partners. See [Create a SAML 2.0 Web Single Sign-On Identity Provider Partner](#GUID-6E546B34-2490-4372-B811-2A3992244A7E) or [Create a SAML 2.0 Web Service Identity Provider Partner](#GUID-CF599ABB-5F8F-4218-949F-F32A40F368E8).

#### Create a SAML 2.0 Web Service Identity Provider Partner {#GUID-CF599ABB-5F8F-4218-949F-F32A40F368E8}

A SAML 2.0 Identity Provider partner is an entity that generates SAML 2.0 assertions consumed by the Service Provider site.

1.  Obtain, using a trusted and secure mechanism, the metadata file from your federated partner that describes the partner, the binding support, certificates and keys, and so on. See [Obtain Your Identity Provider Partner's Metadata File](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-6E250FB2-3794-4BC3-B6E7-401F3FD7CECF) in **Administering Security for Oracle WebLogic Server**.

2.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Authentication Providers** and select the SAML 2.0 Identity Assertion provider that you configured.

3.  Click **Partners** node.

4.  Click **New**.

5.  Enter a name for the Identity provider partner.

6.  From the **Type** drop-down list, select **Web Service Identity Partner**.

7.  Click **Create**.

8.  Turn on the **Enabled** option to enable interactions between this server and this Identity Provider partner.

9.  Modify the settings as necessary for your environment. For descriptions of the settings and when you might want to configure them, see [Create and Configure Web Single Sign-On Identity Provider Partners](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-939BFCCB-40F6-43EA-A5A5-6C36B017FF32) in **Administering Security for Oracle WebLogic Server**.

10. Click **Save**.

11. Click the **Assertion Signing Certificate** tab to configure the Identity Provider partner's assertion signing certificate.

    1.  Coordinate with your partner to obtain the Assertion Signing Certificate in a secure manner. For more information, see [Using Security Assertion Markup Language (SAML) Tokens For Identity](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WSSOV-GUID-6965897A-0826-4BEB-897D-1524A1F1901D) in **Securing WebLogic Web Services for Oracle WebLogic Server**.

    2.  Click **Import Certificate from File** and enter the file path to the <code>.pem</code> or <code>.der</code> file containing the X.509 certificate.

    3.  Click **Done**.

        WebLogic Remote Console will populate the page with information pulled from the imported certificate.


#### Create a SAML 2.0 Web Single Sign-On Identity Provider Partner {#GUID-6E546B34-2490-4372-B811-2A3992244A7E}

A SAML 2.0 Identity Provider partner is an entity that generates SAML 2.0 assertions consumed by the Service Provider site.

1.  Obtain, using a trusted and secure mechanism, the metadata file from your federated partner that describes the partner, the binding support, certificates and keys, and so on. See [Obtain Your Identity Provider Partner's Metadata File](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-6E250FB2-3794-4BC3-B6E7-401F3FD7CECF) in **Administering Security for Oracle WebLogic Server**.

2.  In the **Security Data Tree**, go to **Realms**, then *myRealm*, then **Authentication Providers** and select the SAML 2.0 Identity Assertion provider that you configured for the server.

3.  Click the **Partners** node.

4.  Click **New**.

5.  Enter a name for the Identity Provider partner.

6.  From the **Type** drop-down list, select **Web Single Sign-On Identity Partner**.

7.  In the **Meta Data File Name** field, enter the file path to the metadata partner file you received from your federated partner.

8.  Click **Create**.

9.  Modify the settings as necessary for your environment. For descriptions of the settings and when you might want to configure them, see [Create and Configure Web Single Sign-On Identity Provider Partners](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-939BFCCB-40F6-43EA-A5A5-6C36B017FF32) in **Administering Security for Oracle WebLogic Server**.

10. Click **Save**.


## Use the RDBMS Security Store {#GUID-76152470-62AE-434B-93EF-E6EF31AF1B7A}

You can use an external RDBMS as a data store for the authorization, role mapping, credential mapping, and certificate registry providers. This data store, called the RDBMS security store, is strongly recommended when using SAML 2.0 services in two or more WebLogic Server instances in a domain.

If you plan to use the RDBMS security store, you should set it up when you first create the domain. If you have an existing domain, then you should create a new domain, configure it for RDBMS, and then migrate security data from the existing domain over to the new domain. We do not recommend trying to enable the RDBMS security store on an existing domain.

For information on using the RDBMS security store in WebLogic Server, see [Managing the RDBMS Security Store](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-7AE06479-0168-4277-AA84-6D5C87F1A004) in **Administering Security for Oracle WebLogic Server**.

For a list of security providers affected by the RDBMS, see [Security Providers that Use the RDBMS Security Store](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-0A2733DC-7EF6-4452-BA40-683202EDB4C0) in **Administering Security for Oracle WebLogic Server**.

For a list of the specific RDBMS systems supported in this release of WebLogic Server for use as an RDBMS security store, see [Oracle Fusion Middleware Supported System Configurations](unilink:suppconf).

1.  Create a new WebLogic domain using either the Domain Configuration wizard or WLST Offline. See [Creating a WebLogic Domain](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLDCW-GUID-40F10C88-F8A2-4849-869C-65CFC5243B71) in **Creating WebLogic Domains Using the Configuration Wizard** or [Creating WebLogic Domains Using WLST Offline](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=WLSTG-GUID-5FC3AA22-BCB0-4F98-801A-8EBC5E05DC6A) in **Understanding the WebLogic Scripting Tool**, respectively.

    {{< notice note >}}

    

    Do not start the domain at this time.

    {{< /notice >}}


2.  Enable the RDBMS security store using WLST Offline. See [Use WLST Offline to Create the RDBMS Security Store](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-347B49A7-E107-4FEB-90BF-89E60E846404) in **Administering Security for Oracle WebLogic Server**.

3.  Create the RDBMS tables in your data store. The WebLogic Server installation directory includes a set of scripts for each supported RDBMS system.

    Typically this step is performed by the database administrator. See [Create RDBMS Tables in the Security Datastore](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-EFEDC853-FDA1-49A0-877A-214CA52B6B40) in **Administering Security for Oracle WebLogic Server** for a description of the scripts, their locations in the product installation directory, and instructions for running them.

4.  Start the domain.


### Configure the RDBMS Security Store {#GUID-604B84D1-AFBE-4A15-ABB5-2F46DB7EAEE8}

You can update the RDBMS security store settings. However, you should avoid modifying the database settings of the RDBMS security store after it has been created.

1.  In the **Edit Tree**, go to **Security**, then **Realms**, then *myRealm*, then **RDBMS Security Store**.

2.  Click **New**.

3.  Enter values for the **Name**, **Connection URL**, **Driver Name**, and **Username** fields.

    The database name, type, and user credentials must match the values you set when you created the domain.

4.  Click **Create**.

5.  Specify the appropriate settings for JNDI and JMS so that the RDBMS security store can cache database information in memory correctly. If the RDBMS is running in more than one JVM, for example, the domain has multiple servers, or other Oracle products are sharing the same RDBMS store with the new domain, these caches must be synchronized to ensure the integrity of the security data. To configure server synchronization:

    1.  Specify a JNDI user name and password. This can be any valid user in the security realm who has access to JNDI.

    2.  Create a JMS topic. You can reuse an existing one. See [Configure Resources for JMS System Modules](../configuring-services#GUID-723C3B6E-6C57-48E7-B265-C4FF90D270A6).

        {{< notice note >}}

        

        Failure to configure JMS actions in a multiserver domain in which the RDBMS security store is configured may result in a security vulnerability.

        {{< /notice >}}


6.  Click **Save**.


If the JMS topic with which the RDBMS security store is configured goes down, see [Managing the RDBMS Security Store](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=SECMG-GUID-7AE06479-0168-4277-AA84-6D5C87F1A004) in **Administering Security for Oracle WebLogic Server** for important information about restoring it.

