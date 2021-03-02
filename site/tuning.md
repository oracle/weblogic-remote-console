# Tune the Remote Console Environment

Although not required, you may want to tune your environment to optimize the performance of the console.
- [Customize the Default Configuration](#customize)
- [Change the Network Timeout Settings for the Server](#timeout)
- [Set the SameSite Cookie attribute if Required for Web Browser Support](#samesite)

## Customize the Default Configuration <a name ="customize"></a>
By default, the WebLogic Server Remote Console uses the `application.yaml` file inside the `runnable/console-backend-server-{version}.jar` file.

If the default configuration is sufficient, then you don't need to do anything. However, if you need to modify the configuration, you can pass the following Java system properties when starting the Remote Console:

```
-D console.connectTimeoutMillis (defaults to 10000)
-D console.readTimeoutMillis (defaults to 20000)
-D console.disableHostnameVerification (defaults to false)
-D console.enableSameSiteCookieValue (defaults to false)
-D console.valueSameSiteCookie (defaults to Lax - include a pointer to the site that explains how same site cookies work)
```

## Change the Network Timeout Settings for the Server <a name ="timeout"></a>
To change the defaults for the connection and read timeout settings used with a WebLogic domain from the Remote Console, use the following Java system properties to start the console:
- Set `-Dconsole.readTimeoutMillis=<millis>` for the timeout when waiting on a response, _Default:_ `20 seconds`
- Set `-Dconsole.connectTimeoutMillis=<millis>` for the timeout when waiting to connect, _Default:_ `10 seconds`

For example:
```
java -Dconsole.readTimeoutMillis=60000 -jar <console_home>/console.jar
```
In ths example, <console_home> represents the directory where you unzipped the installer, and will result in the console waiting `60 seconds` before giving up on a response from the WebLogic domain.

When changing network timeout settings, the primary impact will be the response time for Console threads, while the browser will show no data when a timeout occurs.  Examples of where timeouts may happen include requests where WebLogic experiences longer initialization or execution times such as for runtime monitoring actions of servers.

## Set the SameSite Cookie attribute if Required for Web Browser Support <a name ="samesite"></a>
When the WebLogic Server Remote Console establishes a connection with the WebLogic Domain, a HTTP Cookie is established with the Web Browser session.

For security reasons, the `SameSite` attribute of the HTTP Cookie may need to be set for the Web Browser to accept the HTTP session Cookie. There are two settings that control the Remote Console behavior:

- Set `-Dconsole.settings.enableSameSiteCookieValue=true` to include the `SameSite` attribute in the HTTP Cookie, _Default:_ `false`
- Set `-Dconsole.settings.valueSameSiteCookie="<value>"` to specify the value of the `SameSite` attribute, _Default:_ `Lax`

For example:
```
java -Dconsole.settings.enableSameSiteCookieValue=true -jar <console_home>/console.jar
```
results in the HTTP session Cookie including the `SameSite` attribute with a value of `Lax`.
