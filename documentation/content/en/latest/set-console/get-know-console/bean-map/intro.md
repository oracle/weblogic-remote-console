---
title: A Map of WebLogic Remote Console
draft: true
weight: 256
---

Use this page to understand how the MBeans and other components that make up a WebLogic Server domain are organized in WebLogic Remote Console.

{{< alert title="" color="secondary" >}}
The Map of the Console is generated from the latest available release of WebLogic Server. If you are running an earlier release of WebLogic Server, then you won't see all of the items listed on this page because WebLogic Remote Console adjusts its user interface to hide features that are not supported by the active Administration Server provider.

Additionally, depending on the security role assigned to your user, some items in the UI may be hidden by default. See [Access Limitations](/weblogic-remote-console/administration-server/domain-configuration/#GUID-BA0BFEB9-FA9D-4063-90E0-1D44551FB2E2) for more information.
{{< /alert >}}

The Map of the Console is split into two sections, both of which have subsections:

* **Perspective Trees**: Use this section to see a high-level, hierarchal view of how MBeans are organized, by [perspective](/weblogic-remote-console/administration-server/domain-configuration/#GUID-E1D3A576-47A8-4291-9F56-617B1039168F). These trees go to the page-level of the console. 
    * Jump to [Monitoring Tree](#monitoring)
    * Jump to [Configuration View/Configuration Edit Trees](#edit)
    * Jump to [Security Data Tree](#securityData)
* **Page Summaries**: Use this section to learn about the specific attributes of an MBean: how they are labeled in the UI, which page tab they're located on, and a short description of the field (plus a link to their respective page in the [WebLogic Server MBean Reference](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/wlmbr/core/index.html)). MBeans in the Page Summaries section are listed alphabetically.
    * Jump to [Page Summaries](#bean-tree)