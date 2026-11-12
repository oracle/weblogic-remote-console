---
weight: 288
title: Property Lists
---



Property lists are simple key-value pairs that facilitate the WDT variable feature in WDT model files. Use property lists to create a collection of key-value pairs that WebLogic Remote Console can insert into a WDT model file.

For more information on how property lists can enhance WDT model files, see [WDT Model Tokens](../wdt-model-files#GUID-0C7510AB-67B2-4EF5-8DAB-5A09DC2BD2E8).

You may want to create a single property list that applies to multiple WDT model files or multiple, discrete files for each WDT model file, depending on your usage.

Be careful when editing property list key *names*. If you change a key name, WebLogic Remote Console registers that change as a *new* key-value pair. If that key was actively used by a WDT model file, it becomes a standalone WDT model token instead of a WDT variable. Conversely, if you add a key name that matches an existing standalone WDT model token, WebLogic Remote Console converts that the previously standalone token into a WDT variable.

You can also independently create a property list and then upload it to WebLogic Remote Console. Save the property list as <code>*.properties</code>, <code>*.props</code>, or another text file format. Place each key-value pair on a new line and separate names from their values by <code>=</code>, <code>:</code>, or a space. For example, <code>key=value</code> or <code>key:value</code> or <code>key value</code>.

If you delete a property list that's connected to a WDT model file, the WDT model file will remain unchanged but all WDT variables are converted to standalone WDT model tokens.

## Create a Property List {#GUID-8A4D1F37-7E9A-47B7-BD7D-4EC0B69426FA}

Create a property list to collect key-value pairs for use with WDT model files.

Follow the instructions for your console environment.

1.  Open the **Projects / Providers** page for the project. If a provider is active, open its **More** menu and select **Go To Project/Provider Table**.

2.  Select **Create**, then **New Property List File Provider**.

3.  Enter a name for the property list provider.

4.  Specify the file for your console environment:

    -   **Desktop WebLogic Remote Console:** Select the file chooser icon beside **Property List Filename** and choose a location and filename for the new file. Use a <code>.properties</code> or <code>.props</code> extension.
    -   **Hosted WebLogic Remote Console:** Leave **Initial File Contents** empty to create an empty property list, or select the file chooser icon beside **Initial File Contents** and choose an existing property list file on your computer. When you click **Done**, the selected file’s contents are uploaded to create the property list on the server.
5.  Click **Done** to create the provider.

6.  Click **Activate** to edit the property list.


You can now use the property list to hold WDT variables for WDT model files.{{< alert title="Note" color="primary" >}}

 You cannot rename keys. If you change the name of a key, WebLogic Remote Console registers that action as deleting the previous key and then creating a new key. If the old key was actively being used as a WDT variable in a WDT model file, it will become a standalone WDT model token, unassociated with the property list.

{{< /alert >}}


