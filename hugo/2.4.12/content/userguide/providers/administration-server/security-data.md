---
title: Editing security data
description: How to manage security data in the WebLogic Remote Console
weight: 2
---
You can manage security data and supported security providers for your domain in the Security Data tree perspective. 

{{% notice note %}}
You must be logged in as a user with the Admin role and have the WebLogic Remote Console extension installed to access this perspective. See [Install the WebLogic Remote Console]({{< relref "setup#install" >}}) for instructions. 
{{% /notice %}}

Any changes you make within the Security Data perspective are immediate - you don't need to commit or restart the server to apply your changes.

## Managing users and groups {id="user_groups"}

You can easily manage the WebLogic Server users and groups that are configured as part of the default authentication provider (WebLogic Authentication Provider) within a security realm. Only the default authentication provider is supported. If you're not using the default authentication provider, you'll need to manage its users and groups through its own external tools.


### Create a user 
1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm to which you want to add users.
1. Expand the Authentication Provider node and then select the authentication provider to which you want to add users.
1. Expand Users and click **New**.
1. Enter a Name, Description and Password for this user. User names must be unique in the security realm and passwords must be eight characters or longer.  
1. Click **Create**.

### Create groups

1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm to which you want to add groups.
1. Expand the Authentication Provider node and then select the authentication provider to which you want to add groups.
1. Expand Groups and click **New**.
1. Enter a Name and Description for this group. Group names must be unique in the security realm.
1. Click **Create**.

### Edit users

1. In the Security Data Tree perspective, go to Realms > *realmName* > Authentication Providers > *providerName* > Users.
1. Click the user that you want to edit. 
1. Move through the various tabs to update the properties of the user. You cannot edit the name of a user - you must delete and create a new user.
1. You can add users to groups. Under the Membership tab, select any Available group to which you want to add the user and move them over to Chosen.
1. Click **Save**.

### Edit groups

1. In the Security Data Tree perspective, go to Realms > *realmName* > Authentication Providers > *providerName* > Groups.
1. Click the group that you want to edit. You can modify the group description or, under the Membership tab, nest the current group under other groups. You cannot edit the name of a group - you must delete and create a new group.
1. Click **Save**.

### Delete users

1. In the Security Data Tree perspective, go to Realms > *realmName* > Authentication Providers > *providerName* > Users.
1. Beside the user that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).

### Delete groups

Deleting a group will not delete the users within that group.

1. In the Security Data Tree perspective, go to Realms > *realmName* > Authentication Providers > *providerName* > Groups.
1. Beside the group that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).

## Managing Security Policies and Roles

Use security policies to manage who can access a resource in a WebLogic Server domain.

A resource is an entity (such as a Web Service or a server instance) or an action (such as a method in a Web Service or the act of shutting down a server instance). For a list of resource types, see [Resource Types You Can Secure with Policies](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/roles/types.html).

A security policy specifies which users, groups, or roles can access the resource according to a set of conditions. Whenever possible, you should use security roles to determine access control. A security role, like a security group, grants an identity to a user. Unlike a group, however, membership in a role can be based on a set of conditions that are evaluated at runtime.  

For most types of WebLogic resources, you can use the WebLogic Remote Console to define the security policies and roles that restrict access. However, for Web application and EJB resources, you can also use deployment descriptors. 

The general process to secure a WebLogic resource is:

1. Create [users and groups]({{< relref "#user_groups" >}})
1. **Optional**: Manage default security roles or create new ones. We recommend that you use roles to secure WebLogic resources (instead of users or groups) to increase efficiency for administrators who work with many users. You can use the default roles that WebLogic Server provides or create your own.
1. Create and apply security policies.

For more information, see [Securing Resources Using Roles and Policies for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/roles/intro.html#GUID-E454A766-0F19-472B-A470-F2BD9B6BEF64).

### Security roles

A security role is an identity granted to users or groups based on specific conditions. Multiple users or groups can be granted the same security role and a user or group can be in more than one security role. Security roles are used by policies to determine who can access a WebLogic resource.

WebLogic Server provides a default set of roles that you can use with any policy (global roles). You can create your own global roles or create roles that can be used by policies only for a specific resource (scoped roles). For example, you can place all of your system administrators in WebLogic Server's Admin role. You can then create a scoped role for a specific EJB that contains highly sensitive business logic. When you create a policy for the EJB, you can specify that only the scoped role can access the EJB.

If two roles conflict, the role of a narrower scope overrides the role of the broader scope. For example, a scoped role for an EJB resource overrides a global role or a scoped role for the enterprise application that contains the EJB.

Security roles are created within a security realm, and the roles can be used only when the realm is active.

For more information, see [Overview of Security Roles](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/roles/secroles.html#GUID-79645C45-C982-454D-A22C-6115B86EDAD3).

#### Create global roles

Before creating a new global security role, review the [Global Security Roles](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/roles/secroles.html#GUID-84859935-E7A5-4D3E-8A11-CBF63F93571A) in *Securing Resources Using Roles and Policies for Oracle WebLogic Server* to assess if an existing role is sufficient for your needs.

1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm where you want to add a global role.
1. Expand Role Mappers > XACMLRoleMapper > Global > Roles.
1. Click **New**.
1. Enter a name for the new global role and click **Create**.
1. Click **Save**.

After the role is created, you can build a policy that uses conditions to determine which users or groups it encompasses. We recommend that whenever possible you use the Group condition which grants the security role to all members of the specified group. See [Edit a policy]({{< relref "#edit-policy" >}}) for more details on how you can edit conditions.

For a description of conditions in the Predicate List, see [Security Role Conditions](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/roles/secroles.html#GUID-06D3F08F-5A98-4649-A3F4-5D08B76C72CD)


#### Create scoped roles

Scoped roles can only be used with policies that apply to specific resources.

1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm where you want to add a scoped role.
1. Expand Role Mappers > XACMLRoleMapper > *Resource* > Roles.
1. Click **New**.
1. Enter a name for the new scoped role and click **Create**.

After the role is created, you can build a policy that uses conditions to determine which users or groups it encompasses. We recommend that whenever possible you use the Group condition which grants the security role to all members of a specified group. See [Edit a policy]({{< relref "#edit-policy" >}}) for more details on how you can edit conditions.

For a description of conditions in the Predicate List, see [Security Role Conditions](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/roles/secroles.html#GUID-06D3F08F-5A98-4649-A3F4-5D08B76C72CD)


### Security policies {id="sec_policies"}

A security policy specifies the conditions that users, groups, or roles must meet to access a resource. Policies must have one or more conditions and you can combine conditions to create complex policies for more dynamic access control.

Root level policies apply to all instances of a specific resource type, for example, all JMS resources in your domain. All default security policies are root level policies. 

You can also create policies that only apply to a specific resource instance. If the instance contains other resources, the policy will apply to the included resource as well. For example, you can create a policy for an entire JMS system resource, or for a particular queue or topic within that resource.

The policy of a narrower scope overrides policy of a broader scope. For example, if you create a security policy for a JMS system resource and a policy for a JMS queue within that system resource, the JMS queue will be protected by its own policy and will ignore the policy for the system resource.

For more information, see [Security Policies](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/roles/sec_poly.html) in *Securing Resources Using Roles and Policies for Oracle WebLogic Server*.

It's recommended that you use the Role condition where possible. Basing conditions on security roles lets you create one security policy that takes into account multiple users or groups, and is a more efficient method of management.

See [Security Policy Conditions](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/roles/sec_poly.html#GUID-F91088E1-EFA5-42BE-BD14-27127C797F23) in *Securing Resources Using Roles and Policies for Oracle WebLogic Server* to learn more.

#### Create a policy for resource instances

You can create a security policy that only applies to a specific resource instance. If the instance contains other resources, the policy will apply to the included resources as well.

1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm that contains the resource instance where you want to add a policy.
1. Expand Authorizers > XACMLAuthorizer > *resourceInstance*.
1. Click **Add Condition** to open the Add New First Condition dialog box.
1. Select a predicate from the **Predicate List**. Depending on the predicate you choose, you may need to configure arguments for the condition.
1. Click **OK**.
1. Click **Save**.

You can add more conditions to the policy to increase its complexity.

#### Edit a policy {id="edit-policy"}

You can edit a policy by modifying a condition's arguments or by modifying the relationships between conditions in the policy.

1. Go to the policy that you want to edit.
1. Click on the condition you want to edit. 
You can only edit the arguments of the condition. If you want to use a different predicate for the condition, you must add a new condition. 

Conditions have three different types of relationships: AND, OR, and Combination.

* AND: All of the conditions joined by an AND operator must be met.
* OR: At least one of the conditions joined by an OR operator must be met.
* Combination: Two or more conditions are combined and must be evaluated as a group. Conditions *within* a combination are themselves related to each other through AND or OR operators. 

By default, a new condition is added as a simple condition at the top of the list of conditions. To insert a new condition elsewhere, select an existing condition and then click Add Condition. You'll get a dropdown list with options to add the new condition either above or below the selected condition. The order of conditions is not meaningful to how the policy is interpreted.

A policy can contain multiple simple or compound conditions or a mix of simple and compound conditions. You can also nest compound conditions.

{{% notice tip %}}
Why should you use compound conditions? Consider this scenario: a resource exists where you want Administrators to always have access, but Deployers to only have access between 9 am and 5 pm. The following policy would address both requirements.

* Condition 1 (simple): Role: Admin

    * **OR**

* Condition 2 (compound): Role: Deployer **AND** access occurs between 09:00:00 and 17:00:00 GMT -7:00
{{% /notice %}}

Use the actions on the Policy page to edit a policy.

|Action |Description|
|---|---|
|Add Condition|Adds a new condition to the policy. You can choose to add the new condition above or below another condition. |
|Combine |When multiple conditions are selected, you can combine them to create a compound condition.  |
|Uncombine |When a compound condition is selected, you can break it into independent conditions. |
|Remove |Deletes a simple or compound condition from the policy. When there are no conditions in a policy, the default policy will apply.|
|Negate |Reverses the meaning of a condition. The criteria to access a resource becomes the opposite of the original condition.|
|Reset |Reverts the policy to its last *saved* change, not the last change. It's recommended that you save your policy frequently or you may unintentionally lose several changes using the Reset action.|

You can also edit a policy from its **Advanced** tab where the policy is expressed as string. Any changes made to a policy in the Advanced tab are reflected in the main Policy tab, and vice versa.

#### Delete a policy

Before you delete a policy, make sure that the default security policy for the resource instance will provide adequate access control.

1. Go to the policy you want to delete.
1. Delete all of the conditions in the policy.
1. Click **Save**.

## Managing credential mappers

A Credential Mapping provider lets WebLogic Server map a WebLogic resource to a set of credentials in an external system so that the WebLogic resource can log into that external system on behalf of a subject that has already been authenticated. You can map multiple WebLogic resources (of the same type) to the same external system (and even to the same subject within that system).

You can manage the credential mappings for the default credential mapper provider (WebLogic Credential Mapping Provider) within a security realm. Only the default credential mapping provider is supported.

The general process for mapping credentials remains the same across WebLogic resources:

1. Configure an applicable MBean in the Edit Tree perspective such as deploying an app or adding a data source. 
1. Commit your changes and restart the server if any of your changes are non-dynamic.
1. In the Security Data Tree perspective, under Credential Mappers, find the corresponding node for the MBean. If necessary, define the properties of a WebLogic resource to identify it and form a connection between the MBean's configuration data and its security data.
1. Create mappings for the WebLogic resource.

You can create credential mappings for the following WebLogic resources:

* App Deployments
    * [EJBs](#ejbs)
    * [JDBC applications](#jdbc-apps)
    * [JDBC modules](#jdbc-modules)
    * [Resource adapters](#resource-adapters)
* [Data Sources](#data-sources)
* [Remote Resources](#remote-resources)

### App Deployments: EJBs {id="ejbs"}

#### Identify an EJB Component

The first time you add a reference to an EJB component, you'll also create a credential mapping for that EJB component.

1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm where you want to add a EJB component. Go to Credential Mappers > *credentialMapperName* > App Deployments > *applicationName* > EJBs.
1. Click **New**.
1. Fill in the fields as required. 
1. Click **Create**.

A reference to the EJB component is added under the EJBs node. The name of the EJB component is generated by the properties of the application and those you set when adding the EJB component.

For information on how to manage the credential mappings, see [Credential Mappings](#credential-mappings).

#### Remove a reference to an EJB Component

You cannot delete a reference to an EJB component with multiple credential mappings. To delete an EJB component reference, you must delete all of the credential mappings first - which will then delete the EJB component reference automatically - or delete all but one of the credential mappings and then follow these steps: 

1. In the Security Data Tree perspective, go to Credential Mappers > *credentialMapperName* > App Deployments > *applicationName* > EJBs.
1. Beside the EJB component that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).

### App Deployments: JDBC Application {id="jdbc-apps"}

You can only add credential mappings for JDBC applications, not manage the JDBC applications themselves.

For information on how to manage the credential mappings, see [Credential Mappings](#credential-mappings).

### App Deployments: JDBC Modules {id="jdbc-modules"}

#### Identify a JDBC Module

The first time you add a reference to a JDBC module, you'll also create a credential mapping for that JDBC module.

1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm where you want to add a JDBC module. Go to Credential Mappers > *credentialMapperName* > App Deployments > *applicationName* > JDBC Modules.
1. Click **New**.
1. Fill in the fields as required. 
1. Click **Create**.

For information on how to manage the credential mappings, see [Credential Mappings](#credential-mappings).

#### Remove a reference to a JDBC Module

You cannot delete a reference to a JDBC module with multiple credential mappings. To delete a JDBC module reference, you must delete all of the credential mappings first - which will then delete the JDBC module reference automatically - or delete all but one of the credential mappings and then follow these steps: 

1. In the Security Data Tree perspective, go to Credential Mappers > *credentialMapperName* > App Deployments > *applicationName* > JDBC Module.
1. Beside the JDBC module that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).

### App Deployments: Resource Adapters {id="resource-adapters"}

#### Identify a Resource Adapter

The first time you add a reference to a resource adapter, you'll also create a credential mapping for that resource adapter.

1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm where you want to add a resource adapter. Go to Credential Mappers > *credentialMapperName* > App Deployments > *applicationName* > Resource Adapters.
1. Click **New**.
1. Fill in the fields as required. 
1. Click **Create**.

A reference to a resource adapter is added under the Remote Adapters node. The name of the resource adapter is generated by combining its property values.

For information on how to manage the credential mappings, see [Credential Mappings](#credential-mappings).


#### Remove a reference to Resource Adapter

You cannot delete a reference to a resource adapter with multiple credential mappings. To delete a resource adapter reference, you must delete all of the credential mappings first - which will then delete the resource adapter reference automatically - or delete all but one of the credential mappings and then follow these steps: 

1. In the Security Data Tree perspective, go to Credential Mappers > *credentialMapperName* > App Deployments > *applicationName* > Resource Adapter.
1. Beside the Resource Adapter that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).

### Data Sources {id="data-sources"}

You can only add credential mappings for data sources, not manage the data sources themselves. You can manage data sources in the Edit tree perspective.

For information on how to manage the credential mappings, see [Credential Mappings](#credential-mappings).

### Remote Resources {id="remote-resources"}

#### Identify a remote resource

The first time you add a reference to a remote resource, you'll also create a credential mapping for that remote resource.

{{% notice note %}}
If you add a remote resource with the cross-domain protocol enabled, it will create a WebLogic Server user named cross-domain. Only the cross-domain user can be used to create credential mappings. While the WebLogic Remote Console will let you add other WebLogic Server users and credential mappings within the remote resource, the mappings will not work and will not provide access to the remote resource.
{{% /notice %}}

1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm where you want to add a credential mapping. Navigate down to Credential Mappers > *credentialMapperName* > Remote Resources.
1. Click **New**.
1. Fill in the fields as needed. Certain fields are disabled depending on whether you choose to use the cross-domain protocol.
1. Click **Create**.

A reference to a remote resource is added under the remote resources node. The name of the remote resource is generated by combining its property values. 

For information on how to manage the credential mappings, see [Credential Mappings](#credential-mappings).

#### Remove a reference to a remote resource

You cannot delete a reference to a remote resource with multiple credential mappings. To delete a remote resource reference, you must delete all of the credential mappings first - which will then delete the remote resource reference automatically - or delete all but one of the credential mappings and then follow these steps: 

1. In the Security Data Tree perspective, go to Realms > *realmName* > Credential Mappers > *credentialMapperName* > Remote Resources.
1. Beside the remote resource that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).

### Credential mappings {id="credential-mappings"}

#### Add a credential mapping

You can add a new credential mapping to associate another WebLogic resource to a remote user. 

The credential mappings and credentials for each WebLogic resource appear under the resource's node.

1. In the Security Data Tree perspective, go to Realms > *realmName* > Credential Mappers > *credentialMapperName* > *wlResourceType* > *wlResourceName* > Credential Mappings.
1. Click **New**.
1. Fill in the fields as needed. If you want to map to a remote user that is already referenced in the remote resource, disable the Create Credential toggle.
1. Click **Create**.


#### Remap a WebLogic resource

You can edit a credential mapping to associate a WebLogic user for a WebLogic resource to a different remote user. The WebLogic Remote Console must already be aware of the remote user before you can remap the WebLogic Server user. If you want to remap the WebLogic resource to a new remote user, you must first add it to the WebLogic Remote Console.

1. In the Security Data Tree perspective, go to Realms > *realmName* > Credential Mappers > *credentialMapperName* > *wlResourceType* > *wlResourceName* > Credential Mappings.
1. Select the credential mapping you want to edit.
1. In the Remote User field, replace the current remote user with the username of the remote user you want to remap the WebLogic resource to.
1. Click **Save.**

#### Delete a credential mapping

When you delete a credential mapping, the remote user that the WebLogic resource was previously associated with is also deleted if it was the only credential mapping using that remote user.

1. In the Security Data Tree perspective, go to Realms > *realmName* > Credential Mappers > *credentialMapperName* > *wlResourceType* > *wlResourceName* > Credential Mappings.
1. Beside the credential mapping that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).

### Credentials {id="credentials"}

#### Add a credential

After you have added the first set of credentials for a remote system to a WebLogic resource, you can add more users from that remote system. 

1. In the Security Data Tree perspective, go to Realms > *realmName* > Credential Mappers > *credentialMapperName* > *wlResourceType* > *wlResourceName* > Credentials
1. Click **New**.
1. Enter the username and password for the remote user.
1. Click **Create**.

You can now map a WebLogic user for the WebLogic resource to the new set of credentials. 

#### Change a remote user password

If the password of the remote user changes, you'll need to update it in the WebLogic Remote Console or the mapping will break and prevent the WebLogic resource from logging into the remote system.

1. In the Security Data Tree perspective, go to Realms > *realmName* > Credential Mappers > *credentialMapperName* > *wlResourceType* > *wlResourceName* > Credentials.
1. Select the remote user whose password you want to change.
1. Change the password.
1. Click **Save**.

#### Remove a credential

Each WebLogic resource has its own set of credentials
Removing a credential from the WebLogic Remote Console will not affect the user in the remote system.

You cannot delete a credential that currently has a WebLogic resource mapped to it. 

1. In the Security Data Tree perspective, go to Realms > *realmName* > Credential Mappers > *credentialMapperName* > *wlResourceType* > *wlResourceName* > Credential Mappings.
1. You'll need to either map the current credential mapping to a different credential or delete all of the credential mappings using that credential:
    * Select any relevant mappings and update the Remote User field to a new remote user.
    * Beside any credential mappings that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png). Once all credential mappings associated with the credential are deleted, the credential itself will also be automatically deleted and you can skip the rest of the steps.
1. Under the same WebLogic resource, expand the Credentials node.
1. Beside the credential that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).
1. Click **Save**.

