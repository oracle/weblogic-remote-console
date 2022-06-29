---
title: Tune the Remote Console Environment
date: 2021-04-27
draft: false
description: Tips on how to configure your WebLogic Remote Console for your environment
weight: 3
---

Although not required, you may want to tune your environment to optimize the performance of the console.
- [Customize the Default Configuration](#customize)
- [Change the Network Timeout Settings for the Server](#timeout)
- [Set the SameSite Cookie attribute if Required for Web Browser Support](#samesite)

## Customize the Default Configuration {id="customize"}
By default, the WebLogic Remote Console uses the `application.yaml` file inside the `runnable/console-backend-server-{version}.jar` file.

If the default configuration is sufficient, then you don't need to do anything. However, if you need to modify the configuration, you can update the Java system properties by changing the properties in a `config.json` file or, for the browser version, by passing the modified Java system properties at the command line when starting the Remote Console.

The `config.json` file is located in: 
- Linux: `$HOME/.config/weblogic-remote-console/config.json`
- macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/config.json`
- Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\config.json`
    - Any Windows file paths entered in `config.json` must be properly escaped. For example, enter `C:\Users\Jane\myTrust.jks` as `C:\\Users\\Jane\\myTrust.jks`.

{{% notice note %}}
You may need to create the `config.json` file manually.
{{% /notice %}}

You can modify the following Java system properties:
- `console.disableHostnameVerification` _Default:_ `false`
- `console.enableSameSiteCookieValue` _Default:_  `false`
- `console.valueSameSiteCookie` _Default:_ `Lax` (Possible values: Lax, Strict, None) <!-- left in by mistake?: include a pointer to the site that explains how same site cookies work-->
- `console.readTimeoutMillis` _Default:_ `20000`
- `console.connectTimeoutMillis`  _Default:_ `10000`
- `server.host` _Default:_ `127.0.0.1`
- `server.port` _Default:_ `8012`

For example, to set the Remote Console to listen on a host other than `localhost` (IP address `127.0.0.1`):

At the command line:
```
java -Dserver.host=0.0.0.0 -jar <console_home>/console.jar
```
In the `config.json` file:
```
{"server.host": "0.0.0.0"}
```

## Change the Network Timeout Settings for the Server {id="timeout"}
To change the defaults for the connection and read timeout settings used with a WebLogic domain from the Remote Console, change the following Java system properties:
- Set `console.readTimeoutMillis=<millis>` for the timeout when waiting on a response, _Default:_ `20 seconds`
- Set `console.connectTimeoutMillis=<millis>` for the timeout when waiting to connect, _Default:_ `10 seconds`

For example:
```
java -Dconsole.readTimeoutMillis=60000 -Dconsole.connectTimeoutMillis=30000 -jar <console_home>/console.jar
```
In this example, <console_home> represents the directory where you unzipped the installer, and will result in the console waiting `60 seconds` before giving up on a response from the WebLogic domain.

or in `config.json`, add:
```
{
    "console.readTimeoutMillis": "60000",
    "console.connectTimeoutMillis": "30000"
}
```

When changing network timeout settings, the primary impact will be the response time for Console threads, while the browser will show no data when a timeout occurs.  Examples of where timeouts may happen include requests where WebLogic experiences longer initialization or execution times such as for runtime monitoring actions of servers.

## Set the SameSite Cookie attribute if Required for Web Browser Support {id="samesite"}
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
