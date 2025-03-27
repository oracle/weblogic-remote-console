---
title: Upgrade the WebLogic Remote Console
weight: 4
---

Upgrade to the latest WebLogic Remote Console and extension and take advantage of the latest features in both the console and WebLogic Server. 

1. Open **Help** > **Check for WebLogic Remote Console Updates**.
1. Select **Download and install it** to download the update immediately. The update runs in the background so you can continue working in the WebLogic Remote Console with no interruption. The next time the console is launched, the updates will apply. 

    You can also select **Go to site** to go to the [GitHub repository](https://github.com/oracle/weblogic-remote-console/releases) where you can download the update manually.
1. Update the WebLogic Remote Console *extension*.

    1.  Go to <code>*DOMAIN_HOME*/management-services-ext</code> and delete the existing WebLogic Remote Console extension.
    1.  Download the new extension from the [GitHub repository](https://github.com/oracle/weblogic-remote-console/releases) and save it in <code>*DOMAIN_HOME*/management-services-ext</code>.

        **Note**: In WebLogic Remote Console 2.4.11, the versioning scheme of the WebLogic Remote Console *extension* was updated to match WebLogic Remote Console. There are no missing versions between `console-rest-ext-9.0.war` (released with WebLogic Remote Console 2.4.10) and `console-rest-ext-2.4.11.war` (released with WebLogic Remote Console 2.4.11).
    1.  Restart the Administration Server.

{{< alert title="Note" color="primary" >}}
If you're on Windows and upgrading from 2.2.0 or earlier, the upgrade may fail when attempting to uninstall the previous version. To fix it, edit the `PATH` environment variable to ensure that `%SystemRoot%\system32` is the first entry that contains the `find` command, then retry the upgrade.
{{< /alert >}}