
# WebLogic Remote Console

The WebLogic Remote Console is a lightweight, open source console that you can use to manage your WebLogic Server domain running anywhere, such as on a physical or virtual machine, in a container, Kubernetes, or in the Oracle Cloud. The WebLogic Remote Console does not need to be colocated with the WebLogic Server domain.

You can install and run the WebLogic Remote Console anywhere, and connect to your domain using WebLogic REST APIs. You simply launch the desktop application and connect to the Administration Server of your domain. Or, you can start the console server, launch the console in a browser and then connect to the Administration Server.

The WebLogic Remote Console is fully supported with WebLogic Server 12.2.1.3, 12.2.1.4, and 14.1.1.0.

## Key Features of the WebLogic Remote Console
The WebLogic Remote Console provides an alternative WebLogic Server administration GUI that enables REST-based access to WebLogic management information, in alignment with current cloud-native trends. When connected to a WebLogic domain using the WebLogic Remote Console, you can:
* Configure WebLogic Server instances and clusters
* Create or modify WDT metadata models
* Configure WebLogic Server services, such as database connectivity (JDBC), and messaging (JMS)
* Deploy and undeploy applications
* Start and stop servers and applications
* Monitor server and application performance

## Get Started
You can install the WebLogic Remote Console as a desktop or browser application, depending on your usecases although the desktop application is recommended. Both versions are available to download from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases).

Review the system requirements at [Get Started](https://oracle.github.io/weblogic-remote-console/setup/)

You should also download and install the WebLogic Remote Console extension for your WebLogic Server domain. The extension provides additional functionality that is not available with the console alone. Although installing the extension is optional, we recommend that you install it to get the optimum functionality from the WebLogic Remote Console.

Documentation for the WebLogic Remote Console is [available here](https://oracle.github.io/weblogic-remote-console/setup/). 

To build the WebLogic Remote Console from source, see the [Developer Guide](https://oracle.github.io/weblogic-remote-console/develop/build-source/).

## Known Issues
See the following list of [Known Issues](https://oracle.github.io/weblogic-remote-console/reference/known_issues/), limitations, and workarounds.

## Need more help? Have a suggestion? Come and say, "Hello!"

We have a **public Slack channel** where you can get in touch with us to ask questions about using the WebLogic Remote Console or give us feedback
or suggestions about what features and improvements you would like to see.  We would love to hear from you. To join our channel,
please [visit this site to get an invitation](https://weblogic-slack-inviter.herokuapp.com/). The invitation email will include
details of how to access our Slack workspace.  After you are logged in, please come to `#remote-console` and say, "hello!"
