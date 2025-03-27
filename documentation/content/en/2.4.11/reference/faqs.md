---
title: Frequently asked questions
weight: 1
---

This section provides answers to frequently asked questions about the WebLogic Remote Console.

#### My domain is behind a firewall. How do I connect to the WebLogic Remote Console?

For WebLogic Remote Console to connect to a domain's Administration Server, the management endpoint of the domain, `management/*`, must be publicly accessible. If your Administration Server is behind a firewall or load balancer, or otherwise externally unavailable, you will need to expose the endpoint manually.

**TIP**: If you needed to expose `console/*` to access the WebLogic Server *Administration* Console for your domain, simply follow the same procedure to expose `management/*` for the WebLogic Remote Console.

#### Can I connect the WebLogic Remote Console to domains running in WebLogic on Oracle Cloud Infrastructure?

Yes, you can. First, make sure that the domain's Administration Server is publicly accessible so the WebLogic Remote Console can establish a connection to the administration server. Then, in the WebLogic Remote Console, enter your credentials and the publicly accessible URL for the WebLogic Administration Server.

#### Can I connect the WebLogic Remote Console to domains running on other cloud providers such as Amazon Web Services, Google Cloud, Microsoft Azure and so on?

Yes, you can connect to other cloud providers. You'll need to make sure the domain's administration server is publicly accessible to allow a connection between the WebLogic Remote Console and the cloud provider. Then, in the WebLogic Remote Console, enter your credentials and the publicly accessible URL for the WebLogic Administration Server.

Visit your cloud providers' documentation for more specific instructions on how to expose the `management/*` endpoint of the WebLogic Server.

#### Can I connect the WebLogic Remote Console to domains using the WebLogic Kubernetes Operator?

Yes. For details on how to set up access to WebLogic Server domains running on Kubernetes, see [Use the WebLogic Remote Console](https://oracle.github.io/weblogic-kubernetes-operator/managing-domains/accessing-the-domain/remote-admin-console/) in the *WebLogic Kubernetes Operator User Guide*.

#### Can I use both the WebLogic Remote Console and the WebLogic Server Administration Console?

Yes. The WebLogic Remote Console uses the same configuration mechanisms used by the WebLogic Server Administration Console. You can make changes to your domain using any of these methods: Administration Console, WebLogic Remote Console, JMX, REST, WLST, and so on - they're all compatible. However, it's not recommended that you use multiple methods simultaneously since that may cause conflicts and unexpected behavior.

#### Which versions of WebLogic Server can I use with WebLogic Remote Console?
You can use WebLogic Remote Console with WebLogic Server 12.2.1.3, 12.2.1.4, or 14.1.1.0.

#### Do I need to upgrade my installation of WebLogic Remote Console whenever I upgrade or patch WebLogic Server?

It's recommended that you keep WebLogic Remote Console up to date as it is updated to work with the latest versions of WebLogic Server, including patches. However, it's not required. Older versions of the WebLogic Remote Console will continue to work with newer versions WebLogic Server.

Note that if new fields or new beans were added as part of the WebLogic Server update, outdated versions of the WebLogic Remote Console will not detect those fields.

#### How do I know if an update is available?

The WebLogic Remote Console checks if a newer version is available whenever it starts. If an update becomes available while the application is already running, you can open **Help** > **Check for WebLogic Remote Console Updates** and click **Download and install it** to download the update immediately. If you are running both the [WebLogic Kubernetes Toolkit UI](https://oracle.github.io/weblogic-toolkit-ui/) (which runs the WebLogic Remote Console in the background) and the standalone WebLogic Remote Console simultaneously, you may need to restart both applications to apply the update.

#### Are there any security risks associated with the WebLogic Remote Console?
No, the WebLogic Remote Console accesses the WebLogic Administration Server through its standard REST API, which is available out of the box. However, since your desktop will be accessing potentially sensitive data, you need to make sure it is protected and secure - just like the WebLogic Administration Console.