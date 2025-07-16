---
weight: 250
title: WDT Model Files
---



WDT metadata model files are descriptions of a WebLogic Server domain configuration. These models are not connected to a running WebLogic Server domain; you make edits to a model file and then use WebLogic Deploy Tooling (WDT) to build or modify live domains.

WDT model files are simplistic representations of a domain. They are generally written in <code>YAML</code> but WebLogic Remote Console also accepts models in <code>JSON</code> format. For brevity, a WDT model file only describes departures from the default configuration.

{{< alert title="Note" color="primary" >}}

 WebLogic Remote Console does not validate the data that you insert into WDT model files. It will accept changes or values that are invalid and that will present problems when the model file is used to build or update a domain.

{{< /alert >}}


## WDT Model {#GUID-1416166A-7D57-4D8C-AB68-4D82914E59FB}

```
topology:
    Server:
        AdminServer:
        ManagedServer1:
            Cluster: Cluster2
        ManagedServer2:
            Cluster: Cluster2
        ManagedServer3:
    ServerTemplate:
        ServerTemplate1:
    Cluster:
        Cluster1:
            DynamicServers:
                ServerTemplate: ServerTemplate1
                DynamicClusterSize: 3
        Cluster2:
resources:
    JDBCSystemResource:
        DataSource1:
            JdbcResource:
                JDBCDriverParams:
                    DriverName: oracle.jdbc.replay.OracleXADataSourceImpl
                    URL: 'jdbc:oracle:thin:@//dbhost:1521/Database1'
                JDBCDataSourceParams:
                    JNDIName: [
                        jdbc/myDS
                    ]
                    GlobalTransactionsProtocol: TwoPhaseCommit
                DatasourceType: GENERIC
            Target: [
                Cluster2
            ]

appDeployments:
    Application:
        Application1:
            Target: [
                Cluster1
            ]
            SourcePath: /apps/benefits/benefits.war
            StagingMode: default
```

## WDT Model Tokens {#GUID-0C7510AB-67B2-4EF5-8DAB-5A09DC2BD2E8}

Use a WDT model token to increase the flexibility of a WDT model file by replacing a fixed value with a dynamic one.

With WDT model tokens, you can create WDT model files that adapt based on the applicable WDT tokens. Rather than creating multiple WDT model files whose only difference is a few fixed values, you can create a single file and update the tokens as needed.

WebLogic Remote Console supports multiple types of WDT model tokens. All tokens follow this format: <code>@@TYPE:KEY@@</code> where <code>TYPE</code> is the model token type and <code>KEY</code> is the variable value. For more information on the different types of WDT model tokens and their syntax, see Model Tokens in [*WebLogic Deploy Tooling*](https://oracle.github.io/weblogic-deploy-tooling/).

WebLogic Remote Console allows you to insert WDT model tokens in two ways:

-   Standalone WDT model tokens
-   WDT variables

### Standalone WDT Model Tokens {}

Standalone WDT model token are tokens that replaced when the WDT model file is passed through WebLogic Deploy Tooling or through another external process. WebLogic Remote Console knows nothing about the value of the token and cannot update it.

### WDT Variables {}

WDT variables allow you to manage WDT model tokens and their values from within WebLogic Remote Console. First, you create a property list with a set of tokens and their values, then you assign a property list to a WDT model file. After they are linked, any properties that you create in the property list become available to insert into the associated WDT model file. By centralizing model tokens in a property lists, you can easily update their values and review available tokens.

For more information, see [Property Lists](../property-lists#GUID-62721515-29E5-4DC4-BBD8-E2D1C8A7529D).

Each WDT model file can only pull from one property list, but you can use the same property list for multiple WDT model files.

{{< alert title="Note" color="primary" >}}



You can use both standalone WDT model tokens and WDT variables in the same WDT model file. This can be useful if you want to synchronize certain values and leave other values as slightly more static or to be changed by a later process.

{{< /alert >}}


## Create a WDT Model File {#GUID-1ECF1B50-BE85-413F-8417-34A8E0CC8FB0}

To create a WDT model file for use with the WebLogic Deploy Tooling:

1.  Open the Providers drawer and beside the project name, click **More ︙**. Select **Create Provider for New WDT Model File**.

2.  Enter a name for the WDT model file provider.

3.  In the **WDT Model Filename** field, enter a name for the WDT model file. Include <code>.yaml</code> or <code>.json</code> at the end of the file name.

4.  Click **Pick Directory** and browse to the directory where you want to save the new WDT model file.

5.  **Optional**: Enable **Use Sparse Template** to create a WDT model file which does not contain any references to an Administration Server.

6.  **Optional**: If you want to use WDT variables with this WDT model file, then from the **WDT Variables** dropdown list, choose a property list provider. If you don't have a property list provider yet, you can add one later.

7.  Click **OK** to create the WDT model file.


## Upload a WDT Model File {#GUID-EC821453-1C8A-49DD-A2AB-B5BF58B0B00E}

If you created a WDT model file elsewhere, you can upload it to WebLogic Remote Console and continue to edit it.

1.  Open the Providers drawer and beside the project name, click **More ︙**. Select **Add WDT Model File Provider**.

2.  Enter a name for the WDT model file provider.

3.  Click **Upload File** and browse to the directory where you saved the WDT model file.

    The WDT model file must be in <code>YAML</code> or <code>JSON</code> format.

4.  **Optional**: If you want to use WDT variables with this WDT model file, then from the **WDT Variables** drop-down list, choose a property list provider. If you don't have a property list provider yet, you can edit this provider's settings later to add one.

5.  Click **OK** to upload the WDT model file.


## Edit a WDT Model File {#GUID-B0B9CBA4-29E4-417D-8094-5BA8B4522ED7}

To make changes to a WDT model file:

{{< alert title="Note" color="primary" >}}



For guidance on where to find specific domain configuration options and how to apply them, review the tasks under [Administration Server](../../administration-server#GUID-BC6883D0-1917-4130-B79B-02727F1242D6). The WDT Model Tree perspective is very similar to the Edit Tree perspective in an Administration Server provider.

{{< /alert >}}


1.  Open the WDT model file that you want to edit.

2.  Click **WDT Model Tree** and go to the node where you want to make your changes.

3.  Beside the domain configuration that you want to modify, click **WDT Settings** to open the WDT settings dialog box.

4.  Set a new value for the field, using one of the following options:



<table id="GUID-B0B9CBA4-29E4-417D-8094-5BA8B4522ED7__TABLE_YMB_PZN_SDC">
                              <span>Describes the various ways to set values for a field.</span>
                              <thead>
                                 <tr>
                                    <th>Option</th>
                                    <th>Description</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <td>Default (unset)</td>
                                    <td>Restore field to its default value.</td>
                                 </tr>
                                 <tr>
                                    <td>Select Value</td>
                                    <td>Select a reference to a component that exists in the current WDT model file.</td>
                                 </tr>
                                 <tr>
                                    <td>Enter Value</td>
                                    <td>Enter a fixed value.</td>
                                 </tr>
                                 <tr>
                                    <td>Enter Model Token</td>
                                    <td>Enter a WDT model token.</td>
                                 </tr>
                                 <tr>
                                    <td>Enter Unresolved Reference</td>
                                    <td>Enter a reference to a component that does not exist in the current WDT model file but will exist at a later point.</td>
                                 </tr>
                                 <tr>
                                    <td>Select Model Token Variable</td>
                                    <td>Select a WDT model token variable from the list of available options. The WDT model file must be connected with a property list to see this option.</td>
                                 </tr>
                                 <tr>
                                    <td>Create Model Token Variable</td>
                                    <td>Enter a Variable Name and Variable Value to create a new WDT model token variable. New model token variables are added to the connected property list. The WDT model file must be connected with a property list to see this option.</td>
                                 </tr>
                              </tbody>
                           </table>




5.  Click **Save Now** to update the <code>YAML</code> file with your changes.


If you want to restore fields to their default value, right-click on a field and click **Restore to default**.

## Build a WebLogic Server Domain {#GUID-4A5C092D-A16B-4F7F-A5CC-38DCF2293FBE}

When you're satisfied with the properties of your WDT model file, you can transform it into a live WebLogic Server domain with WebLogic Deploy Tooling (WDT).

1.  Save the WDT model file in WebLogic Remote Console. Make a note of the location of the <code>YAML</code> file on your computer.

2.  Download the latest version of WDT from the [WDT GitHub Repository](https://github.com/oracle/weblogic-deploy-tooling).

3.  Follow the instructions in the [WDT Documentation](https://oracle.github.io/weblogic-deploy-tooling/) for creating a domain from a WDT model file.
