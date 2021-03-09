# Install and Configure the WebLogic Server Remote Console
- [Console Prerequisites](#prerequisites)
- [Download the Remote Console](#download)
- [Install the Remote Console Extension in the WebLogic Server Domain](#extension)
- [Start the Remote Console and Connect to a Domain](#start-connect)
- [Connect to a WebLogic Domain using SSL/TLS](#SSL)
- [Connect to a WebLogic Domain Running on Kubernetes](#k8s)
- [Stop the Remote Console](#stop)
- [Advanced Configuration](#advanced)

## Console Prerequisites <a name ="prerequisites"></a>

To run the Remote Console, you need [Java SE 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or later.

To verify the Java version:
```
java -version
```

## Download the Remote Console <a name ="download"></a>
The Oracle WebLogic Server Remote Console installer is available for download at [https://github.com/oracle/weblogic-remote-console/releases](https://github.com/oracle/weblogic-remote-console/releases). The Remote Console is delivered as a ZIP archive that, when extracted, creates a `console` directory that includes:
* The console executable file `console.jar`
* The libraries required to use the console in the `libs` subdirectory
* The console extension, `console-rest-ext-1.0.war`, that you install in the WebLogic Server domain

After you have downloaded the installer, extract the ZIP archive to a directory of your choice.

## Install the Remote Console Extension in the WebLogic Server Domain <a name ="extension"></a>
To get the most functionality when using the WebLogic Server Remote Console, we recommend that you install the Remote Console extension in your domain.

**Note:** The extension is supported for WebLogic Server 12.2.1.3, 12.2.1.4, and 14.1.1 domains.

1. Create a `management-services-ext` directory under the domain home.
2. Copy the `console-rest-ext-1.0.war` included in the ZIP archive to the `management-services-ext` directory you created in the previous step.
3. Reboot the Administration Server if it is already running.

## Start the Remote Console and Connect to a Domain <a name ="start-connect"></a>

To start the Remote Console on a local machine using the default settings - localhost (127.0.0.1) and port 8012:

1. Start the Administration Server in the domain to which you want to connect.

2. Open a command window and on the command line, enter:

    ```
    java -jar <console_home>/console.jar
    ```
    In this command, ``<console_home>`` is the directory where you unzipped the installer.

3. To connect to a domain, open a browser window and enter:
    ```
    http://localhost:8012
    ```
4. In the Connect to WebLogic Domain window, enter the Administrator user name, password, and the URL of the domain, then click Connect.

    To connect to a domain using the HTTPS protocol, see [Connect to a WebLogic Domain using SSL/TLS](#SSL).

Note the following in this release:
* Only one active WebLogic Domain connection or session is allowed at a time. If another browser tab is opened, the console loads and reuses the existing WebLogic Domain connection from the new tab.
* If the same user establishes a connection with the same domain from a separate browser (or restarts the browser), then the original connection is shared.
* The active session is maintained in memory. After connecting, the session is valid until you disconnect or shut down the console process.
* The original connection/session is terminated if another user and/or another domain is used when the connection is made.

## Connect to a WebLogic Domain using SSL/TLS <a name ="SSL"></a>
If you specify HTTPS for the domain URL in the Connect to WebLogic Domain window, then the WebLogic Server Remote Console uses SSL/TLS to communicate with the WebLogic domain.

The SSL/TLS connection requires trust in the WebLogic domain, where the trust configuration is handled by the underlying JDK JSSE support. By default, the JDK uses the `cacerts` truststore provided with the JDK. If the WebLogic domain requires additional trust, separate trust, or is using the WebLogic demo trust (`demotrust.jks`), then you can use the JDK system properties when starting the Remote Console.

You can configure SSL/TLS trust with the JDK using either of these options:
- Import the required trust certificates into the `cacerts` truststore supplied with the JDK using the [`keytool`](https://docs.oracle.com/en/java/javase/11/tools/keytool.html) command.
- Configure the location and type of the truststore using the JDK Java system properties for JSSE support. For example:
```
java -Djavax.net.ssl.trustStore="/home/user/mytrust.jks" -Djavax.net.ssl.trustStoreType="JKS" -jar <console_home>/console.jar
```
In this command, ``<console_home>`` is the directory where you unzipped the installer.

## Connect to a WebLogic Domain Running on Kubernetes<a name ="k8s"></a>
One of the benefits of the WebLogic Server Remote Console is the ability to connect to, and manage, a WebLogic Server domain running on Kubernetes. For details, see the Oracle WebLogic Server Kubernetes Operator documentation.

## Stop the Remote Console <a name ="stop"></a>
To stop the Remote Console, kill the console process (for example, `Ctrl+c` ).

**Note:** When you stop the Remote Console process, close the corresponding browser tab or window.

## Advanced Configuration<a name ="advanced"></a>
- [Specify a Listen Address for the Remote Console Host](#remote)
- [Disable Host Name Verification in the Connections to the WebLogic Domain](#hostname)

### Specify a Listen Address for the Remote Console Host<a name ="remote"></a>
To connect to a WebLogic Server Remote Console that is not running on the same machine as the browser, you can specify non-default values for the Remote Console host and port using Java system properties. To do so:

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

      **Caution:** When you connect to a Remote Console process running on a different machine, you risk exposing sensitive data over the network.

4. In the Connect to WebLogic Domain window, enter the Administrator user name, password, and the URL of the domain.

      When the Remote Console is not running on the same machine as the browser, the WebLogic domain URL must be accessible to the machine running the Remote Console process.


### Disable Host Name Verification in the Connections to the WebLogic Domain <a name ="hostname"></a>
When using WebLogic demo trust to connect to the WebLogic domain, you may need to disable host name verification. Disabling host name verification causes the Remote Console to skip the verification check of ensuring that the host name in the URL to which a connection is made matches the host name in the digital certificate that the server sends back as part of the SSL connection.

To disable host name verification, set the `-Dconsole.disableHostnameVerification` property to `true` when required. The default is `false`.

For example, to connect to the domain using SSL/TLS with host name verification disabled:
```
java -Dconsole.disableHostnameVerification=true -Djavax.net.ssl.trustStore="${WL_HOME}/server/lib/DemoTrust.jks" -Djavax.net.ssl.trustStoreType="JKS" -jar <console_home>/console.jar
```
**Note:**
Oracle does not recommend using the demo certificates or turning off host
name verification in production environments.
