---
author: Oracle Corporation
publisherinformation: January 2025
weight: 29
title: Support Information
---



WebLogic Remote Console offers several avenues to receive support and help.

{{< notice note >}}

 Stay up-to-date with the latest release of WebLogic Remote Console to get the latest features and fixes. If you experience issues, try upgrading to the latest release, which may address your issue. For more information, see [Upgrade Desktop WebLogic Remote Console](..#GUID-281298E0-AEE6-4DEC-ADF1-949780E75D76).

{{< /notice >}}


## Oracle Documentation {}

In addition to the current guide, you can retrieve information on WebLogic Remote Console from within the user interface. Click the **Help** icon in the Tool Bar or in dialog boxes to reveal descriptions of the fields on your current page.

You can also view general documentation for WebLogic Server at [Oracle WebLogic Server](http://www.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware&id=menuwls) in the Oracle Help Center.

## Oracle Support {}

Support for WebLogic Remote Console is available to Oracle customers that have purchased support for WebLogic Server.

## Community Support {}

-   [Join our Slack channel at #remote-console](https://join.slack.com/t/oracle-weblogic/shared_invite/zt-1ni1gtjv6-PGC6CQ4uIte3KBdm_67~aQ) in the Oracle WebLogic workspace! Ask questions, make suggestions, or just get in touch with developers and other users of WebLogic Remote Console.

-   [Visit our GitHub repository](https://github.com/oracle/weblogic-remote-console) where you can contribute directly to the development of WebLogic Remote Console, whether it's through raising issues or submitting your own code.


## Upcoming Features {#GUID-B8E14E40-2A68-42D5-8F64-C5B4709A9324}

WebLogic Remote Console is one of several tools available to manage your WebLogic Server domain. For a list of alternative administration options, see [Choosing the Appropriate Technology for Your Administrative Tasks](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=INTRO-GUID-69F2A2F8-3D8F-4DA3-9CE6-01645E34BA8C) in **Understanding Oracle WebLogic Server**.

WebLogic Remote Console is an evolving product that continues to add new features with each release. As WebLogic Remote Console is an open-source product, you can view our progress in our [WebLogic Remote Console GitHub repository](https://github.com/oracle/weblogic-remote-console).

## Frequently Asked Questions {#GUID-7B03E877-CDAC-4E81-B86F-353BE86B7057}

This section provides answers to frequently asked questions about WebLogic Remote Console.

### My domain is behind a firewall. How do I connect to WebLogic Remote Console? {}

For WebLogic Remote Console to connect to a domain's Administration Server, the management endpoint of the domain, <code>management/*</code>, must be publicly accessible. If your Administration Server is behind a firewall or load balancer, or otherwise externally unavailable, you will need to expose the endpoint manually.

If you use the Hosted WebLogic Remote Console, you will also need to expose <code>rconsole/*</code>.

{{< notice note >}}

**Tip:**

If you needed to expose <code>console/\*</code> to access the WebLogic Server Administration Console for your domain, simply follow the same procedure to expose <code>management/*</code> for WebLogic Remote Console.

{{< /notice >}}


### Can I connect WebLogic Remote Console to domains running in WebLogic on Oracle Cloud Infrastructure? {}

Yes, you can. First, make sure that the domain’s Administration Server is publicly accessible so WebLogic Remote Console can establish a connection to it. Then, in WebLogic Remote Console, enter your credentials and the publicly accessible URL for the WebLogic Administration Server.

### Can I connect WebLogic Remote Console to domains running on other cloud providers such as Amazon Web Services, Google Cloud, Microsoft Azure and so on? {}

Yes, you can connect to other cloud providers. You’ll need to make sure the domain’s Administration Server is publicly accessible to allow a connection between WebLogic Remote Console and the cloud provider. Then, in WebLogic Remote Console, enter your credentials and the publicly accessible URL for the WebLogic Administration Server.

Visit your cloud providers' documentation for more specific instructions on how to expose the <code>management/*</code> endpoint of the WebLogic Server.

### Can I connect WebLogic Remote Console to domains running in Kubernetes with the WebLogic Kubernetes Operator? {}

Yes. For details on how to set up access to WebLogic Server domains running on Kubernetes, see [Use the WebLogic Remote Console](https://oracle.github.io/weblogic-kubernetes-operator/managing-domains/accessing-the-domain/remote-admin-console/) in the **WebLogic Kubernetes Operator User Guide**.

### Which versions of WebLogic Server can I use with WebLogic Remote Console? {}

WebLogic Remote Console is compatible with WebLogic Server 12.2.1.4 or later.

### Can I use both WebLogic Remote Console and WebLogic Server Administration Console to manage WebLogic Server Administration Servers? {}

It depends on the WebLogic Server release that you have installed. The Administration Console was removed in WebLogic Server 14.1.2.0.0 and therefore is not available as of that release.

However, if you're running WebLogic Server 14.1.1.0 or earlier, then you can continue to use the Administration Console for domain management alongside WebLogic Remote Console. Any changes you make in WebLogic Remote Console are reflected in the Administration Console.

As with any combination of system administration tools, avoid using them simultaneously as it can cause configuration conflicts and unexpected behavior.

To see a full list of the tools that you can use to administer WebLogic Server, see [Overview of WebLogic Server System Administration](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=INTRO-GUID-3CAB0785-3188-402F-9138-50E62444E51E) in **Understanding Oracle WebLogic Server**.

### Do I need to upgrade my installation of WebLogic Remote Console whenever I upgrade or patch WebLogic Server? {}

No, older releases of WebLogic Remote Console will continue to work with newer releases of WebLogic Server. However, we recommend that you update WebLogic Remote Console (and its extension) as frequently as possible to take advantage of any fixes and improvements, both to WebLogic Remote Console itself and those added in WebLogic Server patches.

For example, if new fields or WebLogic MBeans were added in a WebLogic Server update, then outdated versions of WebLogic Remote Console will not detect or display those fields.

### Are there any security risks associated with WebLogic Remote Console? {}

No, WebLogic Remote Console accesses WebLogic Administration Servers through its standard WebLogic REST API, which is available out of the box. However, since your computer will be accessing potentially sensitive data, you need to make sure it is protected and secure.

### Why does WebLogic Remote Console disagree with attributes that I set at the command line? {}

When you make changes to the domain configuration using system properties, the properties override but do *not* change the <code>config.xml</code> file. The **Edit Tree** perspective, which is generated from <code>config.xml</code>, will only show the state of the domain as specified in the configuration file. In contrast, the **Configuration View Tree** perspective shows the current and effective state of the domain, including command line options.

See [Perspectives in the Administration Server Provider](../../administration-server/domain-configuration#GUID-E1D3A576-47A8-4291-9F56-617B1039168F).

As an example, if your domain is set to secured production mode and you choose to temporarily disable secured production mode with the following system property, <code>-Dweblogic.securemode.SecureModeEnabled=false</code>, then only the Configuration View Tree will accurately report the domain mode as production mode. The Edit Tree (and <code>config.xml</code>) will continue to report that secured production mode is enabled, even though it is not.

See [Verifying Attribute Values That Are Set on the Command Line](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=ADMRF-GUID-F7332CBC-80E4-4C77-B1D1-AD670EF29185) in **Command Reference for Oracle WebLogic Server**.

