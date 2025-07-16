---
weight: 263
title: WDT Composite Models
---



WDT composite models are multiple WDT model files that have been merged together. WDT composite models are read-only files that are useful for comparison.

{{< alert title="Note" color="primary" >}}

 If there are conflicting properties between WDT model files, then the last WDT model file added overrides the properties of the previous file.

{{< /alert >}}


## Create a WDT Composite Model {#GUID-099438C8-E18F-49E5-8963-DD229B77910A}

Combine two or more WDT model files.

There must be at least two WDT model file providers in the active project.

1.  Open the Providers drawer and beside the project name, click **More ︙**. Select **Add WDT Composite Model File Provider**.

2.  Enter a name for the WDT Composite Model.

3.  Click inside the **WDT Models** field and select the WDT model files that you want to appear in the WDT Composite Model in the order that you want them to appear. Only WDT model files in the current project will appear in the drop-down list.

    Choose the order that the WDT model files are added to the composite carefully. Each subsequent WDT model file overrides the properties of the previous file. If there are any conflicting properties, the properties of the last WDT model file added to the composite takes precedence.

4.  Click **OK** to create the WDT composite model.


The selected WDT model files are merged and you can view the combined set in the **WDT Composite Model Tree**.

You can add or remove WDT model files from a WDT composite model as needed. Removing a WDT model file from a WDT composite model \(or deleting the WDT composite model entirely\) does not affect the constituent WDT model files.

