---
title: Customize connection settings
date: 2021-09-01
draft: false
description: A description of the various settings you can configure when connecting with the WebLogic Remote Console.
weight: 3
---
You can customize the default connection settings of the WebLogic Remote Console by modifying its Java system properties.

* [Edit Java system properties in the desktop application](#desktopapp)
* [Edit Java system properties in the browser-based application](#browserapp)
* [Java system properties](#system_prop)

Some possible customizations:
* [Connect to a WebLogic Server domain using SSL/TLS ](#ssl)
* [Specify a listen address for the WebLogic Remote Console host](#listen_address)
* [Change the network timeout settings for the server ](#network_timeout)
* [Disable host name verification in the connections to the WebLogic Server domain ](#hostname)
* [Set the SameSite cookie attribute if required for web browser support ](#samesite)
* [Connect to a WebLogic Server domain running on kubernetes ](#k8s)


### Edit Java system properties in the desktop application {id="desktopapp"}
If you installed the WebLogic Remote Console desktop application, you can edit a `config.json` file with your preferred settings before launching the application.

The `config.json` file is located in:
- Linux: `$HOME/.config/weblogic-remote-console/config.json`
- macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/config.json`
- Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\config.json`
    - Any Windows file paths entered in `config.json` must be properly escaped. For example, enter `C:\Users\Jane\myTrust.jks` as `C:\\Users\\Jane\\myTrust.jks`.

{{% notice note %}}
You may need to create the `config.json` file manually.
{{% /notice %}}

For example, to set the WebLogic Remote Console to listen on a host other than `localhost` (IP address `127.0.0.1`):

In the `config.json` file, enter:
```
{"server.host": "0.0.0.0"}
```

### Edit Java system properties in the browser-based application {id="browserapp"}
If you installed the WebLogic Remote Console browser version, you set the Java system properties at the command line whenever you launch the WebLogic Remote Console.

For example, to set the WebLogic Remote Console to listen on a host other than `localhost` (IP address `127.0.0.1`):

At the command line, enter:
```
java -Dserver.host=0.0.0.0 -jar <console_home>/console.jar
```

### Java system properties {id="system_prop"}

| Property | Default | config.json | System Property |
|---|---|---|---|
|console.disableHostnameVerification | false | console.disableHostnameVerification | -Dconsole.disableHostnameVerification |
|console.enableSameSiteCookieValue | false | console.enableSameSiteCookieValue | -Dconsole.enableSameSiteCookieValue |
|console.valueSameSiteCookie | Lax | console.valueSameSiteCookie | -Dconsole.valueSameSiteCookie |
|console.readTimeoutMillis | 20000 | console.readTimeoutMillis | -Dconsole.readTimeoutMillis |
|console.connectTimeoutMillis | 10000 | console.connectTimeoutMillis | -Dconsole.connectTimeoutMillis |
|server.host | 127.0.0.1 | server.host | -Dserver.host |
|server.port | 8012 | server.port | -Dserver.port |
|javax.net.ssl.trustStore |`<java-home>/lib/security/jssecacerts` or `<java-home>/lib/security/cacerts` | javax.net.ssl.trustStore | -Djavax.net.ssl.trustStore |
|javax.net.ssl.trustStoreType | jks | javax.net.ssl.trustStoreType | -Djavax.net.ssl.trustStoreType |

## Connect to a WebLogic Server domain using SSL/TLS {id="ssl"}

If you specify HTTPS for the domain URL in the Connect to WebLogic Domain window, then the WebLogic Remote Console uses SSL/TLS to communicate with the WebLogic Server domain.

The SSL/TLS connection requires trust in the WebLogic Server domain, where the trust configuration is handled by the underlying JDK JSSE support. By default, the JDK uses the `cacerts` truststore provided with the JDK. If the WebLogic Server domain requires additional trust, separate trust, or is using the WebLogic demo trust (`demotrust.jks`), then you can use the JDK system properties when starting the Remote Console.

You can configure SSL/TLS trust with the JDK using one of these options:
- Import the required trust certificates into the `cacerts` truststore supplied with the JDK using the [`keytool`](https://docs.oracle.com/en/java/javase/11/tools/keytool.html) command.

- Update the JDK Java system properties for JSSE support at the command line (browser only). For example:
  ```
  java -Djavax.net.ssl.trustStore="/home/user/mytrust.jks" -Djavax.net.ssl.trustStoreType="JKS" -jar <console_home>/console.jar
  ```
  In this command, `<console_home>` is the directory where you unzipped the installer.

- Update the JDK Java system properties for JSSE support in a properties file to configure the location and type of truststore (application only).
  1. Create a file named `config.json` and save it in the [applicable location for your operating system](#desktopapp).
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


## Specify a listen address for the WebLogic Remote Console host {id="listen_address"}

To connect to a WebLogic Remote Console that is not running on the same computer as the browser, you can specify non-default values for the Remote Console host and port using Java system properties. The process differs depending on whether you are using the Remote Console through `console.zip` or the desktop application.

### Browser (console.zip)

To specify a listen address when running `console.zip`:

1. On the host where the Remote Console is installed, open a command window.

1. On the command line, set these Java system properties when starting the Remote Console:
* `-Dserver.host=<host-address>` to have the Remote Console listen on a host other than `localhost` (IP address `127.0.0.1`)
* `-Dserver.port=<port-number>` to have the Remote Console bind to a port other than `8012`.

  For example:
  ```
  java -Dserver.host=0.0.0.0 -Dserver.port=8092 -jar <console_home>/console.jar
  ```
  In this example, `0.0.0.0` specifies that the host is listening on all IP addresses on that computer and ``<console_home>`` represents the directory where you unzipped the installer.

1. On the local computer, open a browser window and enter:

      ```
      http://hostname:8092
      ```
      In this example, `hostname` represents the computer where you started the Remote Console, and can be an IP address or a DNS name (such as `myhost.example.com`).

    {{% notice warning %}}When you connect to a Remote Console process running on a different computer, you risk exposing sensitive data over the network.
    {{% /notice %}}

1. In the Connect to WebLogic Domain window, enter the Administrator user name, password, and the URL of the domain.

      When the Remote Console is not running on the same computer as the browser, the WebLogic Server domain URL must be accessible to the computer running the Remote Console process.

### Desktop application

To specify a listen address when running the desktop application:

1. On the host where the Remote Console is installed, create a `config.json` file in [the location applicable to your operating system](#desktopapp).

1. In `config.json`, add the following properties, updating the values to reflect the hostname and port you want.
    ```
    {
      "server.host": "0.0.0.0",
      "server.port": "8092"
    }
    ```
1. On the same computer, open a command window and enter the command applicable to your operating system:
    - Linux: `weblogic-remote-console --headless`
    - macOS: `/Applications/WebLogic Remote Console.app/Contents/MacOS/WebLogic Remote Console --headless`
    - Windows: `C:\Users\<user>\AppData\Local\Programs\weblogic-remote-console\WebLogic Remote Console.exe --headless`

1. On your local computer, open a browser window and enter:
    ```
    http://hostname:8092
    ```
      In this example, `hostname` represents the computer where you started the Remote Console, and can be an IP address or a DNS name (such as `myhost.example.com`).

    {{% notice warning %}}
When you connect to a Remote Console process running on a different computer, you risk exposing sensitive data over the network.
    {{% /notice %}}

1. In the Connect to WebLogic Domain window, enter the Administrator user name, password, and the URL of the domain.

      When the Remote Console is not running on the same computer as the browser, the WebLogic Server domain URL must be accessible to the computer running the Remote Console process.

## Change the network timeout settings for the server {id="network_timeout"}

To change the defaults for the connection and read timeout settings used with a WebLogic Server domain from the Remote Console, change the following Java system properties:
- Set `console.readTimeoutMillis=<millis>` for the timeout when waiting on a response, _Default:_ `20 seconds`
- Set `console.connectTimeoutMillis=<millis>` for the timeout when waiting to connect, _Default:_ `10 seconds`

For example:
```
java -Dconsole.readTimeoutMillis=60000 -Dconsole.connectTimeoutMillis=30000 -jar <console_home>/console.jar
```
In this example, <console_home> represents the directory where you unzipped the installer, and will result in the console waiting `60 seconds` before giving up on a response from the WebLogic Server domain.

or in `config.json`, add:
```
{
    "console.readTimeoutMillis": "60000",
    "console.connectTimeoutMillis": "30000"
}
```

When changing network timeout settings, the primary impact will be the response time for Console threads, while the browser will show no data when a timeout occurs.  Examples of where timeouts may happen include requests where WebLogic experiences longer initialization or execution times such as for runtime monitoring actions of servers.

## Disable host name verification in the connections to the WebLogic Server domain {id="hostname"}
When using WebLogic demo trust to connect to the WebLogic Server domain, you may need to disable host name verification. Disabling host name verification causes the Remote Console to skip the verification check of ensuring that the host name in the URL to which a connection is made matches the host name in the digital certificate that the server sends back as part of the SSL connection.

{{% notice note %}}
We do not recommend using the demo certificates or turning off host name verification in production environments.
{{% /notice %}}

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

On Windows, the path character `\` must be escaped, for example:

```
  {
    "console.disableHostnameVerification": "true",
    "javax.net.ssl.trustStore": "C:\\<path-to-wl-home>\\server\\lib\\DemoTrust.jks",
    "javax.net.ssl.trustStoreType": "JKS"
  }
```

## Set the SameSite cookie attribute if required for web browser support {id="samesite"}
When the WebLogic Remote Console establishes a connection with the WebLogic Domain, a HTTP Cookie is established with the Web Browser session.

For security reasons, the `SameSite` attribute of the HTTP Cookie may need to be set for the Web Browser to accept the HTTP session Cookie. There are two settings that control the Remote Console behavior:

- Set `console.enableSameSiteCookieValue=true` to include the `SameSite` attribute in the HTTP Cookie, _Default:_ `false`
- Set `console.valueSameSiteCookie="<value>"` to specify the value of the `SameSite` attribute, _Default:_ `Lax`

For example:
```
java -Dconsole.enableSameSiteCookieValue=true -jar <console_home>/console.jar
```
or
```
{"console.enableSameSiteCookieValue": "true"}
```
results in the HTTP session Cookie including the `SameSite` attribute with a value of `Lax`.

## Connect to a WebLogic Server domain running on kubernetes {id="k8s"}
One of the benefits of the WebLogic Remote Console is the ability to connect to, and manage, a WebLogic Server domain running on Kubernetes. For details about how to setup access to WebLogic Server domains running on Kubernetes, see [Use the Remote Console](https://oracle.github.io/weblogic-kubernetes-operator/userguide/managing-domains/accessing-the-domain/admin-console/) in the *WebLogic Kubernetes Operator User Guide*.
