---
title: Install and Configure the WebLogic Remote Console
date: 2021-04-27
draft: false
description: Instructions on how to install and use the WebLogic Remote Console
weight: 1
---


- [Console Prerequisites](#prerequisites)
- [Download the Remote Console](#download)
- [Install the Remote Console Extension in the WebLogic Server Domain](#extension)
- [Start the Remote Console and Connect to a Domain](#start-connect)
- [Connect to a WebLogic Domain using SSL/TLS](#SSL)
- [Connect to a WebLogic Domain Running on Kubernetes](#k8s)
- [Stop the Remote Console](#stop)
- [Advanced Configuration](#advanced)

## Console Prerequisites {id="prerequisites"}

If you run the WebLogic Remote Console using the `console.zip` method, your machine must have [Java SE 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or later installed.


To verify your Java version:
```
java -version
```
Java is bundled with the Remote Console desktop application so you do not need to install it separately.

## Download the Remote Console {id="download"}

The installers for the WebLogic Remote Console desktop applications are available for download at [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases). Applications are available for the Linux, macOS, and Windows operating systems.

To run the Remote Console in your browser instead, download `console.zip` and extract the ZIP archive to a directory of your choice. Once its contents are extracted, it creates a `console` directory that includes:
  * The console executable file `console.jar`
  * The libraries required to use the console in the `libs` subdirectory
  * The console extension, `console-rest-ext-1.0.war`, that you install in the WebLogic Server domain


## Install the Remote Console Extension in the WebLogic Server Domain {id="extension"}
To get the most functionality when using the WebLogic Remote Console, we recommend that you install the Remote Console extension in your domain.

{{% notice note %}}
The extension is supported for WebLogic Server 12.2.1.3, 12.2.1.4, and 14.1.1.0 domains.
{{% /notice %}}

1. Create a `management-services-ext` directory under the domain home.
2. Download the `console-rest-ext-1.0.war` from [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases) and save it in the `management-services-ext` directory you created in the previous step.
3. Reboot the Administration Server if it is already running.

## Start the Remote Console and Connect to a Domain {id="start-connect"}
Make sure the Administration Server in the domain to which you want to connect is running.
### Remote Console Application
To start the Remote Console on a local machine using the default settings:

1. Open the Remote Console desktop application.

1. In the Connect to WebLogic Domain window, enter the Administrator user name, password, and the URL of the domain, then click Connect.

### Remote Console in the Browser
To start the Remote Console on a local machine using the default settings - localhost (127.0.0.1) and port 8012:

1. Open a command window and on the command line, enter:

    ```
    java -jar <console_home>/console.jar
    ```
    In this command, ``<console_home>`` is the directory where you unzipped the installer.

1. Open a browser window and enter:
    ```
    http://localhost:8012
    ```
1. In the Connect to WebLogic Domain window, enter the Administrator user name, password, and the URL of the domain, then click Connect.

To connect to a domain using the HTTPS protocol, see [Connect to a WebLogic Domain using SSL/TLS](#SSL).

Note the following in this release:
* Only one active WebLogic Domain connection or session is allowed at a time. If another browser tab is opened, the console loads and reuses the existing WebLogic Domain connection from the new tab.
* If the same user establishes a connection with the same domain from a separate browser (or restarts the browser), then the original connection is shared.
* The active session is maintained in memory. After connecting, the session is valid until you disconnect or shut down the console process.
* The original connection/session is terminated if another user and/or another domain is used when the connection is made.

## Connect to a WebLogic Domain using SSL/TLS {id="SSL"}
If you specify HTTPS for the domain URL in the Connect to WebLogic Domain window, then the WebLogic Remote Console uses SSL/TLS to communicate with the WebLogic domain.

The SSL/TLS connection requires trust in the WebLogic domain, where the trust configuration is handled by the underlying JDK JSSE support. By default, the JDK uses the `cacerts` truststore provided with the JDK. If the WebLogic domain requires additional trust, separate trust, or is using the WebLogic demo trust (`demotrust.jks`), then you can use the JDK system properties when starting the Remote Console.

You can configure SSL/TLS trust with the JDK using one of these options:
- Import the required trust certificates into the `cacerts` truststore supplied with the JDK using the [`keytool`](https://docs.oracle.com/en/java/javase/11/tools/keytool.html) command.

- Update the JDK Java system properties for JSSE support at the command line (browser only). For example:
  ```
  java -Djavax.net.ssl.trustStore="/home/user/mytrust.jks" -Djavax.net.ssl.trustStoreType="JKS" -jar <console_home>/console.jar
  ```
  In this command, `<console_home>` is the directory where you unzipped the installer.

- Update the JDK Java system properties for JSSE support in a properties file to configure the location and type of truststore (application only).
  1. Create a file named `config.json` and save it in the applicable location for your operating system:
      - Linux: `$HOME/.config/weblogic-remote-console/`
      - macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/`
      - Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\`
  1. Add the following properties.
      ```
      {
        "javax.net.ssl.trustStore": "/home/user/mytrust.jks",
        "javax.net.ssl.trustStoreType": "JKS"
      }
      ```
      On Windows the path character `\` must be escaped, for example:
      ```
      {
        "javax.net.ssl.trustStore": "C:\\Users\\user\\mytrust.jks",
        "javax.net.ssl.trustStoreType": "JKS"
      }
      ```
  1. Save your changes and open the Remote Console application.

## Connect to a WebLogic Domain Running on Kubernetes {id="k8s"}
One of the benefits of the WebLogic Remote Console is the ability to connect to, and manage, a WebLogic Server domain running on Kubernetes. For details about how to setup access to WebLogic Server domains running on Kubernetes, see [Use the Remote Console](https://oracle.github.io/weblogic-kubernetes-operator/userguide/managing-domains/accessing-the-domain/admin-console/) in the *WebLogic Kubernetes Operator User Guide*.

## Stop the Remote Console {id="stop"}
To stop the Remote Console in the desktop application, close the desktop application.
To stop the Remote Console in the browser, kill the console process (for example, `Ctrl+c` ).

{{% notice note %}}
When you stop the Remote Console process in the browser, close the corresponding browser tab or window.
{{% /notice %}}

## Advanced Configuration {id="advanced"}
- [Specify a Listen Address for the Remote Console Host](#remote)
- [Disable Host Name Verification in the Connections to the WebLogic Domain](#hostname)

See [Tune the Remote Console Environment]({{< relref "tuning" >}}) for other possible configuration changes.

### Specify a Listen Address for the Remote Console Host {id="remote"}
To connect to a WebLogic Remote Console that is not running on the same machine as the browser, you can specify non-default values for the Remote Console host and port using Java system properties. The process differs depending on whether you are using the Remote Console through `console.zip` or the desktop application.

To specify a listen address when running `console.zip`:

1. On the host where the Remote Console is installed, open a command window.

2. On the command line, set these Java system properties when starting the Remote Console:
* `-Dserver.host=<host-address>` to have the Remote Console listen on a host other than `localhost` (IP address `127.0.0.1`)
* `-Dserver.port=<port-number>` to have the Remote Console bind to a port other than `8012`.

  For example:
  ```
  java -Dserver.host=0.0.0.0 -Dserver.port=8092 -jar <console_home>/console.jar
  ```
  In this example, `0.0.0.0` specifies that the host is listening on all IP addresses on that machine and ``<console_home>`` represents the directory where you unzipped the installer.

3. On the local machine, open a browser window and enter:

      ```
      http://hostname:8092
      ```
      In this example, `hostname` represents the machine where you started the Remote Console, and can be an IP address or a DNS name (such as `myhost.example.com`).
      {{% notice warning %}}
When you connect to a Remote Console process running on a different machine, you risk exposing sensitive data over the network.
      {{% /notice %}}

4. In the Connect to WebLogic Domain window, enter the Administrator user name, password, and the URL of the domain.

      When the Remote Console is not running on the same machine as the browser, the WebLogic domain URL must be accessible to the machine running the Remote Console process.

To specify a listen address when running the desktop application:

1. On the host where the Remote Console is installed, create a `config.json` file in the location applicable to your operating system.
    - Linux: `$HOME/.config/weblogic-remote-console/`
    - macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/`
    - Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\`
1. In `config.json`, add the following properties, updating the values to reflect the hostname and port you want.
    ```
    {
      "server.host": "0.0.0.0",
      "server.port": "8092"
    }
    ```
1. On the same machine, open a command window and enter the command applicable to your operating system:
    - Linux: `weblogic-remote-console --headless`
    - macOS: `/Applications/WebLogic Remote Console.app/Contents/MacOS/WebLogic Remote Console --headless`
    - Windows: `C:\Users\<user>\AppData\Local\Programs\weblogic-remote-console\WebLogic Remote Console.exe --headless`

1. On your local machine, open a browser window and enter:
    ```
    http://hostname:8092
    ```
      In this example, `hostname` represents the machine where you started the Remote Console, and can be an IP address or a DNS name (such as `myhost.example.com`).
{{% notice warning %}}
When you connect to a Remote Console process running on a different machine, you risk exposing sensitive data over the network.
      {{% /notice %}}

1. In the Connect to WebLogic Domain window, enter the Administrator user name, password, and the URL of the domain.

      When the Remote Console is not running on the same machine as the browser, the WebLogic domain URL must be accessible to the machine running the Remote Console process.

### Disable Host Name Verification in the Connections to the WebLogic Domain {id="hostname"}
When using WebLogic demo trust to connect to the WebLogic domain, you may need to disable host name verification. Disabling host name verification causes the Remote Console to skip the verification check of ensuring that the host name in the URL to which a connection is made matches the host name in the digital certificate that the server sends back as part of the SSL connection.

To disable host name verification, set the `console.disableHostnameVerification` property to `true` when required. The default is `false`.

For example, to connect to the domain using SSL/TLS with host name verification disabled:
```
java -Dconsole.disableHostnameVerification=true -Djavax.net.ssl.trustStore="/<path-to-wl-home>/server/lib/DemoTrust.jks" -Djavax.net.ssl.trustStoreType="JKS" -jar <console_home>/console.jar
```
or in the `config.json` file, add

```
  {
    "console.disableHostnameVerification": "true",
    "javax.net.ssl.trustStore": "/<path-to-wl-home>/server/lib/DemoTrust.jks",
    "javax.net.ssl.trustStoreType": "JKS"
  }
```

On Windows the path character `\` must be escaped, for example:

```
  {
    "console.disableHostnameVerification": "true",
    "javax.net.ssl.trustStore": "C:\\<path-to-wl-home>\\server\\lib\\DemoTrust.jks",
    "javax.net.ssl.trustStoreType": "JKS"
  }
```

{{% notice note %}}
We do not recommend using the demo certificates or turning off host name verification in production environments.
{{% /notice %}}
