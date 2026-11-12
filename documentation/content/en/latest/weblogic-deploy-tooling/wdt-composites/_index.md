---
weight: 286
title: WDT Composite Models
---



WDT composite models are multiple WDT model files that have been merged together. WDT composite models are read-only files that are useful for comparison.

{{< alert title="Note" color="primary" >}}

 If there are conflicting properties between WDT model files, then the last WDT model file added overrides the properties of the previous file.

{{< /alert >}}


## Create a WDT Composite Model {#GUID-099438C8-E18F-49E5-8963-DD229B77910A}

Combine two or more WDT model files.

Before you begin, ensure that the project contains at least two WDT model file providers.

1.  Open the **Projects / Providers** page for the project. If a provider is active, open its **More** menu and select **Go To Project/Provider Table**.

2.  Select **Create**, then **WDT Composite Model File Provider**.

3.  Enter a name for the WDT composite model.

4.  In **WDT Models**, select the model files in the order you want them applied. Only model files in the current project are listed.

    Each subsequent model file overrides conflicting properties from earlier files. The last model file takes precedence.

5.  Click **Done** to create the provider.

6.  Click **Activate** to view the combined model.


The selected WDT model files are merged and you can view the combined set in the **WDT Composite Model Tree**.

You can add or remove WDT model files from a WDT composite model as needed. Removing a WDT model file from a WDT composite model \(or deleting the WDT composite model entirely\) does not affect the constituent WDT model files.

