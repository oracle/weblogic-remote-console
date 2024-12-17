# WebLogic Remote Console

WebLogic Remote Console is a lightweight, open source console that you can use to manage your WebLogic Server domain running anywhere, such as on a physical or virtual machine, in a container, Kubernetes, or in the Oracle Cloud. WebLogic Remote Console does not need to be colocated with the WebLogic Server domain.

You can install and run WebLogic Remote Console anywhere, and connect to your domain using WebLogic REST APIs. You simply launch the desktop application and connect to the Administration Server of your domain. Or, for domains running WebLogic Server 14.1.2.0.0 and later, WebLogic Remote Console is also available as a web application hosted on the Administration Server of the domain.

WebLogic Remote Console is compatible with WebLogic Server 12.2.1.4.0 and later.

## Key Features of the WebLogic Remote Console
WebLogic Remote Console provides an alternative WebLogic Server administration GUI that enables REST-based access to WebLogic management information, in alignment with current cloud-native trends. When connected to a WebLogic domain, you can:
* Configure WebLogic Server instances and clusters
* Create or modify WDT metadata models
* Configure WebLogic Server services, such as database connectivity (JDBC), and messaging (JMS)
* Deploy and undeploy applications
* Start and stop servers and applications
* Monitor server and application performance

Although WebLogic Remote Console strives to provide functionality that's comparable to the Administration Console, it does not strive to be an exact duplicate. Equivalent features may be implemented in new ways or not at all.

## Get Started
You can install WebLogic Remote Console as a desktop or as a web application, depending on your requirements, although the desktop application is recommended. The desktop application is available to download from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases). The web application is included in the WebLogic Server installation (14.1.2.0.0 or later only) and must be deployed to the domain.

Read documentation for WebLogic Remote Console at [https://oracle.github.io/weblogic-remote-console/](https://oracle.github.io/weblogic-remote-console/).

To begin, see [Get Started](https://oracle.github.io/weblogic-remote-console/set-console/) in the WebLogic Remote Console documentation.

If you're running WebLogic Server 14.1.1.0.0 or earlier, you should also download and install the WebLogic Remote Console extension for your WebLogic Server domain. The extension provides additional functionality that is not available with the console alone. Although installing the extension is optional, we recommend that you install it to get the optimum functionality from WebLogic Remote Console. The extension is pre-installed on domains running WebLogic Server 14.1.2.0.0 or later.

If you want to build WebLogic Remote Console from source, review [Contribute to WebLogic Remote Console](https://oracle.github.io/weblogic-remote-console/set-console/contribute-wrc-repository/).

## Known Issues
See the following list of [Known Issues](https://oracle.github.io/weblogic-remote-console/troubleshoot-weblogic-remote-console/#GUID-A2824DAE-C040-43E0-A645-041FDFB8936F), limitations, and workarounds.

## Need more help? Have a suggestion? Come and say, "Hello!"

We have a **Slack channel** where you can get in touch with us to ask questions about using WebLogic Remote Console or give us feedback or suggestions about what features and improvements you'd like to see.  We would love to hear from you. To join our channel, [click here to get an invitation](https://join.slack.com/t/oracle-weblogic/shared_invite/zt-1lnz4kpci-WdY2gWfeJc5jS_a_1Z06MA).
The invitation email includes details on how to access our Slack workspace. After you are logged in, join us over at `#remote-console` and say, "Hello!"