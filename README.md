
# WebLogic Remote Console

The WebLogic Remote Console is a lightweight, open source console that you can use to manage your WebLogic Server domain running anywhere, such as on a physical or virtual machine, in a container, Kubernetes, or in the Oracle Cloud. The Remote Console does not need to be colocated with the WebLogic Server domain. 

You can install and run the Remote Console anywhere, and connect to your domain using WebLogic REST APIs. You simply launch the desktop application and connect to the Administration Server of your domain. Or, you can start the console server, launch the console in a browser and then connect to the Administration Server.

The Remote Console is fully supported with WebLogic Server 12.2.1.3, 12.2.1.4, and 14.1.1.

Ready to download and use the Remote Console? See [Get Started](#start).

## Key Features of the WebLogic Remote Console
The WebLogic Remote Console provides an alternative WebLogic Server administration GUI that enables REST-based access to WebLogic management information, in alignment with current cloud-native trends. When connected to a WebLogic domain using the Remote Console, you can:
* Configure WebLogic Server instances
* Configure WebLogic Server clusters
* Configure WebLogic Server services, such as database connectivity (JDBC), and messaging (JMS)
* Deploy and undeploy applications
* Start and stop servers and applications
* Monitor server and application performance
* View server and domain log files
* View application deployment descriptors
* Edit selected runtime application deployment descriptor elements


## Differences With the WebLogic Server Administration Console
If you are already familiar with the WebLogic Server Administration Console deployed as part of your WebLogic domain, you'll notice these key differences in the WebLogic Remote Console:
* The user interface has been completely redesigned to conform to the Oracle Alta UI Design system and the Oracle Redwood theme included with Oracle JET.
* The configuration and monitoring content is separated into separate pages in the Remote Console. In the WebLogic Server Administration Console, the configuration and runtime information is presented on one page. See [Separation of Configuration and Runtime Data](site/console_uidesign.md#separation).
* The Change Center is now expressed as a shopping cart. See [Use the Shopping Cart](site/console_uidesign.md#cart).
* Instead of logging directly into the Administration Console deployed in a WebLogic domain, the Remote Console connects to the Administration Server in a WebLogic domain, with the credentials supplied by the user, using WebLogic REST APIs.

## Get Started <a name ="start"></a>
You can access the Remote Console through your browser or by running a desktop application. Both versions are available to download from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases). The browser installer, `console.zip`, consists of the Remote Console JAR file and associated libraries necessary to use the console. For the desktop application, simply run the appropriate installer for your operating system.

You should also download and install the Remote Console extension for your WebLogic Server domain. The extension provides additional functionality that is not available with the console alone. Although installing the extension is optional, we recommend that you install it to get the optimum functionality from the Remote Console.

For details about installing and running the Remote Console, see [Install and Configure the WebLogic Remote Console](site/install_config.md).

To build the Remote Console from source, see the [Developer Guide](site/developer_guide.md).

## Known Issues
See the following list of [Known Issues](site/known_issues.md), limitations, and workarounds.

## Additional Information

* For information about the console user interface, see [Console Design and Usage Notes](site/console_uidesign.md).
* For information for tuning the environment, see [Tuning the Remote Console Environment](site/tuning.md).
* For information for developers, such as building the Remote Console from source, see the [Developer Guide](site/developer_guide.md).
* For information to help troubleshoot configuration issues, see [Troubleshoot](site/troubleshoot.md).

## Need more help? Have a suggestion? Come and say, "Hello!"

We have a **public Slack channel** where you can get in touch with us to ask questions about using the Remote Console or give us feedback
or suggestions about what features and improvements you would like to see.  We would love to hear from you. To join our channel,
please [visit this site to get an invitation](https://weblogic-slack-inviter.herokuapp.com/). The invitation email will include
details of how to access our Slack workspace.  After you are logged in, please come to `#remote-console` and say, "hello!"
