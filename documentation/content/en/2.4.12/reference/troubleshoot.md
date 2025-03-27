---
title: Troubleshoot issues
weight: 3
---

Learn how to prevent and recover from issues in the WebLogic Remote Console.

## Basic troubleshooting steps

1. Review [Known issues](known_issues) to see if there is a workaround.
1. Check the log files for errors. The WebLogic Remote Console provides log files for both front and back end processes. See [Check Log Files](../userguide/logging) to learn how to access these files.
1. Update to the latest versions of the WebLogic Remote Console and the WebLogic Remote Console extension.

---

## Issue: Connectivity issues

If you're having trouble connecting to your Administration server from the WebLogic Remote Console, here are some steps you can take to identify and fix the issue.

* Use curl to test access to the Administration server: 
    * For HTTP, run: `curl -v --user <username>:<password> http://<adminServerHost>:<adminServerPort>/management/weblogic/latest/domainConfig`
    * For HTTPS, run: `curl -v -k --user <username>:<password> https://<adminServerHost>:<adminServerPort>/management/weblogic/latest/domainConfig`
        
    If the curl command was successful on an HTTPS connection, the connection issues are likely because the WebLogic Remote Console does not trust the SSL certificate of the Administration server. To fix this, you can either import the Administration server's certificate into your client's keystore, or, if you're using demo certificates, turn on the Insecure Connection option when connecting to Administration server.

    If you receive a 401 error after running the curl command, make sure that the WebLogic user is assigned one of the following roles: Admin, Deployer, Operator or Monitor.

* If the WebLogic Server domain is in a different network, [configure the proxy server](../userguide/advanced-settings#proxy) of the WebLogic Remote Console.

* If your domain is behind a load-balancer or firewall, or is in a Docker container, make sure your Administration Server's management endpoint (`management/*`) is accessible to clients.

---

## Issue: Invalid WebLogic configuration error

You may encounter this error when making changes to an Administration Server provider. The WebLogic Remote Console checks for validation errors when you click **Save**, or when you commit the change using the Shopping Cart. If an error message occurs, you must identify and correct the problem before you can activate the changes.

{{< alert title="Note" color="primary" >}}
If you installed the console extension, you can review all pending changes in the Shopping Cart.
{{< /alert >}}

If the cause of the configuration error is not obvious:
* Check the output from the WebLogic Remote Console and the Administration Server.
* Check the WebLogic Administration Server log.

If you cannot determine the cause of the error, try discarding your configuration changes and then making them one at a time to isolate the change responsible for the error.

---

## Issue: WDT model files are invalid (and therefore cannot build a domain)

The WebLogic Remote Console *does not* validate the data that you insert into WDT model files. As a result, the WebLogic Remote Console may accept changes or values that are invalid and which may present problems when the model file is used to build or update a domain. For example, adding integer values that are invalid or out of range for a specific setting, or removing a server or target but not updating the deployments to select a different server or target can cause issues.

For more information on acceptable values, refer to the [WebLogic Deploy Tooling](https://oracle.github.io/weblogic-deploy-tooling/) documentation.

---

## Issue: Failure reading auto prefs error

If the WebLogic Remote Console application shuts down unexpectedly with this error: `Failure reading auto prefs`, the `auto-prefs.json` file may be corrupted. `auto-prefs.json` saves state information about the WebLogic Remote Console and should not be modified by users unless it is corrupted.

If the file is corrupted, you can reset it but you will lose all data regarding your projects.

To reset the file, delete the `auto-prefs.json` file, then relaunch the WebLogic Remote Console.

`auto-prefs.json` is located in:
- Linux: `$HOME/.config/weblogic-remote-console/auto-prefs.json`
- macOS: `/Users/<user>/Library/Application Support/weblogic-remote-console/auto-prefs.json`
- Windows: `C:\Users\<user>\AppData\Roaming\weblogic-remote-console\auto-prefs.json`

---

## Issue: The *Edit Tree / start and stop buttons / create buttons / ...* is missing

Check the role of the user you used to log into the Administration Server. Only administrators have access to the full functionality of WebLogic Remote Console. Users with other roles such as Deployers, Operators, or Monitors have limited access to areas outside the scope of their responsibility.

For an overview of what users in each role can view or do, see [Understand Access Discrepancies](../userguide/role-access).

---

## Issue: The domain is experiencing REST communication issues between servers {id="rest-communication"}

The Administration Server uses REST to communicate with itself and its Managed Servers. When REST communication is blocked, the Monitoring perspective of WebLogic Remote Console can neither report accurate information on the statuses or statistics of Managed servers nor perform most management tasks.  Also, the Edit perspective cannot create or remove deployments.

To test the REST connection:

1. Get the Administration Server's runtime statistics *directly*.
- For HTTP, run:

  `curl -v --user <username>:<password> http://<adminServerHost>:<adminServerPort>/management/weblogic/latest/serverRuntime`
- For HTTPS, run:

  `curl -v -k --user <username>:<password> https://<adminServerHost>:<adminServerPort>/management/weblogic/latest/serverRuntime`

  If the command fails, then a more general connectivity issue is affecting your domain. See 'Connectivity Issues' for next steps.

2. Get the Administration Server's runtime statistics *indirectly*.
- For HTTP, run:

  `curl -v --user <username>:<password> http://<adminServerHost>:<adminServerPort>/management/weblogic/latest/domainRuntime/serverRuntimes/<adminServerName>`
- For HTTPS, run:

  `curl -v -k --user <username>:<password> https://<adminServerHost>:<adminServerPort>/management/weblogic/latest/domainRuntime/serverRuntimes/<adminServerName>`

  If this command fails, then the problem is a REST communication failure between servers.

You need to identify and resolve the issue affecting REST communication. REST issues are often due to flawed domain configurations. Possible causes include, but are not limited to:
- Removing the default Credential Mapping provider
- Removing the default Identity Asserter provider
- Removing weblogic-jwt-token from the default Identity Asserter provider's Active Types
- Applying incompatible REST invocation policies to the WebLogic Server REST API. For example, using Oracle Web Services Manager (OWSM) to protect the domain may inadvertently restrict access to the REST API.
