---
title: Editing Security Data
draft: false
description: How to manage security data in the WebLogic Remote Console
weight: 2
---
You can manage security data and supported security providers for your domain in the Security Data tree perspective. 

{{% notice note %}}
You must be logged in as a user with the Admin role and have the WebLogic Remote Console extension installed to access this perspective. See [Install the WebLogic Remote Console]({{< relref "setup#install" >}}) for instructions. 
{{% /notice %}}

Any changes you make within the Security Data perspective are immediate - you don't need to commit or reboot the server to apply your changes.

### Managing users and groups

You can easily manage the WebLogic Server users and groups that are configured as part of the default authentication provider (WebLogic Authentication Provider) within a security realm. Only the default authentication provider is supported. If you're not using the default authentication provider, you'll need to manage its users and groups through its own external tools.


#### Create a user 
1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm to which you want to add users.
1. Expand the Authentication Provider node and then select the authentication provider to which you want to add users.
1. Expand Users and click **New**.
1. Enter a Name, Description and Password for this user. User names must be unique in the security realm and passwords must be eight characters or longer.  
1. Click **Create**.

#### Create groups

1. In the Security Data Tree perspective, expand Realms.
1. Select the Security Realm to which you want to add groups.
1. Expand the Authentication Provider node and then select the authentication provider to which you want to add groups.
1. Expand Groups and click **New**.
1. Enter a Name and Description for this group. Group names must be unique in the security realm.
1. Click **Create**.

#### Edit users

1. In the Security Data Tree perspective, go to Realms > *realmName* > Authentication Providers > *providerName* > Users.
1. Click the user that you want to edit. 
1. Move through the various tabs to update the properties of the user. You cannot edit the name of a user - you must delete and create a new user.
1. You can add users to groups. Under the Membership tab, select any Available group to which you want to add the user and move them over to Chosen.
1. Click **Save**.

#### Edit groups

1. In the Security Data Tree perspective, go to Realms > *realmName* > Authentication Providers > *providerName* > Groups.
1. Click the group that you want to edit. You can modify the group description or, under the Membership tab, nest the current group under other groups. You cannot edit the name of a group - you must delete and create a new group.
1. Click **Save**.

#### Delete users

1. In the Security Data Tree perspective, go to Realms > *realmName* > Authentication Providers > *providerName* > Users.
1. Beside the user that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).

#### Delete groups

Deleting a group will not delete the users within that group.

1. In the Security Data Tree perspective, go to Realms > *realmName* > Authentication Providers > *providerName* > Groups.
1. Beside the group that you want to delete, click the trash icon ![Settings icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png).

## Managing credential mappers

A Credential Mapping provider lets WebLogic Server map a WebLogic resource to a set of credentials in an external system so that the WebLogic resource can log into that external system on behalf of a subject that has already been authenticated. You can map multiple WebLogic resources (of the same type) to the same external system (and even to the same subject within that system).

You can manage the credential mappings for the default credential mapper provider (WebLogic Credential Mapping Provider) within a security realm. Only the default credential mapping provider is supported.

The general process for mapping credentials remains the same across WebLogic resources:

1. Configure an applicable MBean in the Edit Tree perspective such as deploying an app or adding a data source. 
1. Commit your changes and reboot the server if any of your changes are non-dynamic.
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

