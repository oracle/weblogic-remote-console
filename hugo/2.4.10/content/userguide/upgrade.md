---
title: Upgrade the WebLogic Remote Console
date: 2021-09-01
draft: false
description: Instructions for upgrading the WebLogic Remote Console
weight: 4
---

Upgrade to the latest WebLogic Remote Console and take advantage of the latest features in both the console and WebLogic Server. 

{{% notice note %}}
The WebLogic Remote Console *extension* is periodically updated. Check if there's also a newer version of the extension available when you upgrade the WebLogic Remote Console. 

Delete and replace any previous versions of the extension. Keeping multiple versions of the extension installed can lead to unexpected behavior.
{{% /notice %}}

1. Open **Help** > **Check for WebLogic Remote Console Updates**.
1. Select **Download and install it** to download the update immediately. The update runs in the background so you can continue working in the WebLogic Remote Console with no interruption. The next time the console is launched, the updates will apply. 

    Select **Go to site** to go to the [GitHub repository](https://github.com/oracle/weblogic-remote-console/releases) where you can download the update manually.


{{% notice note %}}
If you're on Windows and upgrading from 2.2.0 or earlier, the upgrade may fail when attempting to uninstall the previous version. To fix it, edit the `PATH` environment variable to ensure that `%SystemRoot%\system32` is the first entry that contains the `find` command, then retry the upgrade.
{{% /notice %}}