---
title: Customize connection settings
date: 2021-09-01
draft: false
description: A description of the various settings you can configure when connecting with the WebLogic Remote Console.
weight: 3
---
You can customize the default connection settings of the WebLogic Remote Console by modifying its Java system properties.

* [Edit Java system properties](#edit_java_sp)
* [Java system properties](#system_prop)

Some possible customizations:
* [Connect to a WebLogic domain using SSL/TLS ](#ssl)
* [Specify a listen address for the WebLogic Remote Console host](#listen_address)
* [Configure a proxy server](#proxy)
* [Change the network timeout settings for the server ](#network_timeout)
* [Disable host name verification in the connections to the WebLogic domain ](#hostname)
* [Set the SameSite cookie attribute if required for web browser support ](#samesite)
* [Connect to a WebLogic domain running on Kubernetes](#k8s)
* [Specify an alternative location for the JDK](#altjdk)
* [Establish an insecure connection to an Administration Server](#insecure)


### Edit Java system properties {id="edit_java_sp"}

You can create a file that modifies the WebLogic Remote Console according to your preferences.

1. In the file location appropriate for your operating system, create a new file and name it `config.json`
    - Linux: `$HOME/.config/weblogic-remote-console/config.json`
    - macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/config.json`
    - Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\config.json`
      - Any Windows file paths entered in `config.json` must be properly escaped. For example, enter `C:\Users\Jane\myTrust.jks` as `C:\\Users\\Jane\\myTrust.jks`.
1. Add new settings as JSON name-value pairs.
  For example, to set the WebLogic Remote Console to listen on a host and port other than the default (`localhost:8012`), add 
    ```
    {
      "server.host": "0.0.0.0",
      "server.port": "8092"
    }
    ```
1. Save your changes and relaunch the WebLogic Remote Console.

{{% notice note %}}
If you using the browser application, you can set Java system properties at the command line when you launch the WebLogic Remote Console.

For example, to set the WebLogic Remote Console to listen on a host other than `localhost`:

At the command line, enter `java -Dserver.host=0.0.0.0 -jar <console_home>/console.jar`
{{% /notice %}}


### Java system properties {id="system_prop"}

| Property | Default | config.json | System Property |
|---|---|---|---|
|console.disableHostnameVerification | false | console.disableHostnameVerification | -Dconsole.disableHostnameVerification |
|console.enableSameSiteCookieValue | false | console.enableSameSiteCookieValue | -Dconsole.enableSameSiteCookieValue |
|console.valueSameSiteCookie | Lax | console.valueSameSiteCookie | -Dconsole.valueSameSiteCookie |
|console.readTimeoutMillis | 20000 | console.readTimeoutMillis | -Dconsole.readTimeoutMillis |
|console.connectTimeoutMillis | 10000 | console.connectTimeoutMillis | -Dconsole.connectTimeoutMillis |
|http.nonProxyHosts | N/A | http.nonProxyHosts | -Dhttp.nonProxyHosts |
|http.proxyHost / https.proxyHost | N/A | http.proxyHost / https.proxyHost | -Dhttp.proxyHost / -Dhttps.proxyHost |
|http.proxyPort / https.proxyPort | 80 / 443 | http.proxyPort / https.proxyPort | -Dhttp.proxyPort / -Dhttps.proxyPort |
|javax.net.ssl.trustStore |`<java-home>/lib/security/jssecacerts` or `<java-home>/lib/security/cacerts` | javax.net.ssl.trustStore | -Djavax.net.ssl.trustStore |
|javax.net.ssl.trustStoreType | jks | javax.net.ssl.trustStoreType | -Djavax.net.ssl.trustStoreType |
|server.host | 127.0.0.1 | server.host | -Dserver.host |
|server.port | 8012 | server.port | -Dserver.port |
|socksProxyHost | N/A | socksProxyHost | -DsocksProxyHost |
|socksProxyPort | 1080 | socksProxyPort | -DsocksProxyPort |

You can learn about other system properties related to networking at [Networking Properties](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/net/doc-files/net-properties.html) in the Java Platform, SE and JDK 11 API Specification. To avoid unexpected behavior, make sure your settings don't conflict with each other.

## Connect to a WebLogic domain using SSL/TLS {id="ssl"}

If you specify HTTPS for the domain URL in the Connect to WebLogic Domain window, then the WebLogic Remote Console uses SSL/TLS to communicate with the WebLogic domain.

The SSL/TLS connection requires trust in the WebLogic domain, where the trust configuration is handled by the underlying JDK JSSE support. By default, the JDK uses the `cacerts` truststore provided with the JDK. If the WebLogic domain requires additional trust, separate trust, or is using the WebLogic demo trust (`demotrust.jks`), then you can use the JDK system properties when starting the Remote Console.

You can configure SSL/TLS trust with the JDK using one of these options:
- Import the required trust certificates into the `cacerts` truststore supplied with the JDK using the [`keytool`](https://docs.oracle.com/en/java/javase/11/tools/keytool.html) command.

- Update the JDK Java system properties for JSSE support in a properties file to configure the location and type of truststore.
  1. In `config.json`, add the following properties.
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

To connect to a WebLogic Remote Console that is not running on the same computer as the browser, you can specify non-default values for the Remote Console host and port using Java system properties.

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

      When the Remote Console is not running on the same computer as the browser, the WebLogic domain URL must be accessible to the computer running the Remote Console process.

## Configure a proxy server {id="proxy"}

To facilitate communication between a WebLogic Server domain that resides in a different network and the WebLogic Remote Console, you may need to configure settings for a proxy server.

1. In the WebLogic Remote Console, go to **File** > **Modify Proxy Settings**.
1. Enter the address of the proxy server, including both the host name and port.
1. Click **Set**.

This setting adds a `proxy` setting to `config.json`.

You can also use Java system properties to configure proxy server settings in `config.json`, such as `{"https.proxyHost": "https://proxy.example.com", "https.proxyPort": "443"}`.

Avoid configuring multiple proxy servers which can lead to unexpected behavior. Not only does the `proxy` value supersede all other proxy server settings, but if you use Java system properties to add one proxy server that uses HTTPS and another that uses SOCKS, the WebLogic Remote Console will ignore the SOCKS proxy server.

## Change the network timeout settings for the server {id="network_timeout"}

To change the defaults for the connection and read timeout settings used with a WebLogic domain from the Remote Console, change the following Java system properties:
- Set `console.readTimeoutMillis=<millis>` for the timeout when waiting on a response, _Default:_ `20 seconds`
- Set `console.connectTimeoutMillis=<millis>` for the timeout when waiting to connect, _Default:_ `10 seconds`

For example, to tell the console to wait `60 seconds` before giving up on a response from the WebLogic domain,

In `config.json`, add:
```
{
    "console.readTimeoutMillis": "60000",
    "console.connectTimeoutMillis": "30000"
}
```

When changing network timeout settings, the primary impact will be the response time for Console threads, while the browser will show no data when a timeout occurs. Examples of where timeouts may happen include requests where WebLogic experiences longer initialization or execution times such as for runtime monitoring actions of servers.

## Disable host name verification in the connections to the WebLogic domain {id="hostname"}
When using WebLogic demo trust to connect to the WebLogic domain, you may need to disable host name verification. Disabling host name verification causes the Remote Console to skip the verification check of ensuring that the host name in the URL to which a connection is made matches the host name in the digital certificate that the server sends back as part of the SSL connection.

{{% notice note %}}
We do not recommend using the demo certificates or turning off host name verification in production environments.
{{% /notice %}}

To disable host name verification, set the `console.disableHostnameVerification` property to `true` when required. The default is `false`.

For example, to connect to the domain using SSL/TLS with host name verification disabled, in the `config.json` file, add:

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

For example, in the `config.json` file, add:
```
{"console.enableSameSiteCookieValue": "true"}
```
results in the HTTP session Cookie including the `SameSite` attribute with a value of `Lax`.

## Connect to a WebLogic domain running on Kubernetes {id="k8s"}
One of the benefits of the WebLogic Remote Console is the ability to connect to, and manage, a WebLogic Server domain running on Kubernetes. For details about how to setup access to WebLogic Server domains running on Kubernetes, see [Use the Remote Console](https://oracle.github.io/weblogic-kubernetes-operator/managing-domains/accessing-the-domain/remote-admin-console/) in the *WebLogic Kubernetes Operator User Guide*.

## Specify an alternative location for the JDK {id="altjdk"}

If you want the WebLogic Remote Console application to use a JDK at a different location, add an entry for `javaPath` to the `config.json` file. For example, if you want to point to a Java executable in `/usr/bin/java` add:

```
{"javaPath": "/usr/bin/java"}
```

On Windows, the path character `\` must be escaped.

## Establish an insecure connection to an Administration Server {id="insecure"}

You can allow WebLogic Remote Console to connect to an Administration Server regardless of warnings about expired, untrusted, or missing certificates. 

We *strongly* recommend that you only enable this setting for development or demonstration environments.

1. **Optional**: Update the `config.json` file to add HTTPS proxy server settings. 
1. Open the Kiosk and add a new Admin Server Connection Provider or edit an existing provider.
1. Enable the **Insecure Connection** checkbox.
1. Click **OK** to save your settings.
