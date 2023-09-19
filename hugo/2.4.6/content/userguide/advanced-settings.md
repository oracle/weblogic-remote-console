---
title: Customize settings
date: 2021-09-01
draft: false
description: A description of settings you can configure in the WebLogic Remote Console.
weight: 3
---
You can customize the settings of the WebLogic Remote Console to fit your needs.

1. In the WebLogic Remote Console, go to **File** > **Settings**. (**WebLogic Remote Console** > **Settings** on macOS).
1. Choose a section tab and make your changes as needed.
1. Click **Save** to apply your changes.

Customizations include:
* Networking
  * [Connect to a WebLogic domain using SSL/TLS ](#ssl)
  * [Configure a proxy server](#proxy)
  * [Change the network timeout settings for the server ](#network_timeout)
  * [Disable host name verification in the connections to the WebLogic domain ](#hostname)
* Other Java System Properties
  * [Set the SameSite cookie attribute if required for web browser support ](#samesite)
  * [Specify an alternative location for the JDK](#altjdk)

## Networking 

The **Networking** section manages connection related settings for the WebLogic Remote Console.

You can learn about other system properties related to networking at [Networking Properties](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/net/doc-files/net-properties.html) in the Java Platform, SE and JDK 11 API Specification. To avoid unexpected behavior, make sure your settings don't conflict with each other.

### Connect to a WebLogic domain using SSL/TLS {id="ssl"}

If you specify HTTPS for the domain URL in the Connect to WebLogic Domain window, then the WebLogic Remote Console uses SSL/TLS to communicate with the WebLogic domain.

The SSL/TLS connection requires trust in the WebLogic domain, where the trust configuration is handled by the underlying JDK JSSE support. By default, the JDK uses the `cacerts` truststore provided with the JDK. If the WebLogic domain requires additional trust, separate trust, or is using the WebLogic demo trust (`demotrust.jks`), then you'll need to configure SSL/TLS trust using one of these options:

- Import the required trust certificates into the `cacerts` truststore supplied with the JDK using [the `keytool` command](https://docs.oracle.com/en/java/javase/11/tools/keytool.html).

- Configure the type and location of the trust store.
  1. In the WebLogic Remote Console, go to **File** > **Settings**. (**WebLogic Remote Console** > **Settings** on macOS).
  1. Under the **Networking** section, in the Trust Store Type field, enter the algorithm name for your trust store. See [JDK Providers Documentation](https://docs.oracle.com/en/java/javase/20/security/oracle-providers.html#GUID-FE2D2E28-C991-4EF9-9DBE-2A4982726313) for specific algorithm names. Depending on the Trust Store Type that you provide, additional fields may appear.
      1. Click **Choose a trust store file** to browse to the file location of your trust store.
      1. Click **Change** beside **Trust Store Key**. Enter the secret for your trust store key and click **Save** to add the secret.
  1. Click **Save** to apply your changes.

### Configure a proxy server {id="proxy"}

You may need to configure settings for a proxy server to facilitate communication between a WebLogic Server domain that resides in a different network and the WebLogic Remote Console. You can configure a global proxy server that applies to all administration server connections or assign proxy server settings individually to each administration server connection. You can also configure a combination of global and individual settings; the individual proxy server settings will supersede the global proxy server settings.

#### Configure global proxy server settings

1. In the WebLogic Remote Console, go to **File** > **Settings**. (**WebLogic Remote Console** > **Settings** on macOS).
1. Under the **Networking** section, in the **Proxy Address** field, enter the address of the proxy server, including both the host name and port. 
1. Click **Save** to apply your changes.

This proxy server will apply to all administration server connections (unless superseded by an individual proxy server setting).

Because you can also use Java system properties to configure proxy server settings, it is technically possible to create multiple *global* proxy servers. We do not recommend this as configuring multiple global proxy servers can lead to unexpected behavior. The proxy server value in the Settings dialog box takes precedence over all other global proxy server settings. Additionally, if you use Java system properties to add one proxy server that uses HTTPS and another that uses SOCKS, the WebLogic Remote Console will ignore the SOCKS proxy server.

#### Configure individual proxy server settings

1. Open the Kiosk.
1. Beside the Administration Server provider where you want to configure a proxy server, click the ![Settings icon](/weblogic-remote-console/images/icons/data-providers-info-icon-brn_24x24.png) Settings icon.
1. In the **Proxy Override** field, enter the address of the proxy server, including both the host name and port.

    **NOTE**: If you want the WebLogic Remote Console to make a direct connection and bypass a global proxy server setting, enter `DIRECT`.
1. Click **OK**.

Individual proxy server settings take precedence over global proxy server settings.

### Change the network timeout settings for the server {id="network_timeout"}

You can change the default settings for the connection and read timeout limits used with a WebLogic domain from the WebLogic Remote Console.

1. In the WebLogic Remote Console, go to **File** > **Settings**. (**WebLogic Remote Console** > **Settings** on macOS).
1. Under the **Networking** section, in the **Administration Server Connection Timeout** field, specify an interval (in milliseconds) to determine how long the WebLogic Remote Console should wait when for a successful connection to a domain. The default is 10 seconds (10 000 milliseconds).
1. Then, in the **Administration Server Read Timeout** field, specify an interval (in milliseconds) to determine how long the WebLogic Remote Console should wait for a response from the server.  The default is 20 seconds (20 000 milliseconds).
1. Click **Save** to apply your changes.

When changing network timeout settings, the primary impact will be to the response time for Console threads, while the application will show no data when a timeout occurs. Timeouts are more likely to occur during requests where WebLogic Server experiences longer initialization or execution times, such as during runtime monitoring actions of servers.

### Disable host name verification in the connections to the WebLogic domain {id="hostname"}
When using WebLogic demo trust to connect to the WebLogic domain, you may need to disable host name verification. Disabling host name verification causes the WebLogic Remote Console to skip the verification check of ensuring that the host name in the URL to which a connection is made matches the host name in the digital certificate that the server sends back as part of the SSL connection.

{{% notice note %}}
We do not recommend using the demo certificates or turning off host name verification in production environments.
{{% /notice %}}

1. In the WebLogic Remote Console, go to **File** > **Settings**. (**WebLogic Remote Console** > **Settings** on macOS).
1. Under the **Networking** section, under **Disable Host Name Verification?**, select **Yes** or **No** to enable or disable host name verification, respectively.
1. Click **Save** to apply your changes.

## Other Java System Properties

The **Other Java System Properties** section lets you use Java system properties to customize the WebLogic Remote Console if a specific setting is not available elsewhere in the Settings dialog box.

Open the Settings dialog box and select the **Other Java System Properties** section. Click **+** to add a new row and enter the Java system property as a name-value pair, separated by `=`. For example, `server.port=8092`.

To delete a property, select the row and click **-**. 

{{% notice note %}}
If an equivalent setting already exists in the Settings dialog box, we recommend using that configuration option instead of the Java system property. For example, use the **Proxy Address** option under **Networking** rather than `https.proxyHost` and `https.proxyPort`.
{{% /notice %}}

### Set the SameSite cookie attribute if required for web browser support {id="samesite"}
When the WebLogic Remote Console establishes a connection with the WebLogic Domain, a HTTP Cookie is established with the Web Browser session.

For security reasons, the `SameSite` attribute of the HTTP Cookie may need to be set for the Web Browser to accept the HTTP session Cookie. There are two settings that control the Remote Console behavior:

1. In the WebLogic Remote Console, go to **File** > **Settings**. (**WebLogic Remote Console** > **Settings** on macOS).
1. Under the **Other Java System Properties** section, click **+** to add a new row and enter `console.enableSameSiteCookieValue=true` to include the `SameSite` attribute in the HTTP Cookie.
1. click **+** again and add `console.valueSameSiteCookie=<value>` to specify the value of the `SameSite` attribute. Possible values are `Strict` or `Lax`. The default is `Lax`.
1. Click **Save** to apply your changes.

### Specify an alternative location for the JDK {id="altjdk"}

You can configure the WebLogic Remote Console to use a JDK at a different location.

1. In the WebLogic Remote Console, go to **File** > **Settings**. (**WebLogic Remote Console** > **Settings** on macOS).
1. Under the **Other Java System Properties** section, click **+** to add a new row and enter `javaPath=<pathToJDK>`.
1. Click **Save** to apply your changes.