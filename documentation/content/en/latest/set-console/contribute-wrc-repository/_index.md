---
weight: 27
title: Contribute to WebLogic Remote Console
---



Contributions from the community to the WebLogic Remote Console project help us build a better experience together. You can contribute by raising a bug or enhancement request or by submitting pull requests to address an issue yourself.

1.  Open an issue in the [WebLogic Remote Console GitHub repository](https://github.com/oracle/weblogic-remote-console) that describes the issue you plan to address or the enhancement request.

    If you only want to raise a bug or file an enhancement request, you can stop here - you're done! Thank you for helping to improve WebLogic Remote Console.

2.  If you want to fix an issue yourself, you must sign the Oracle Contributor Agreement \(OCA\) before you can submit a pull request. For instructions, see the [Oracle Contributor Agreement](https://oca.opensource.oracle.com/). We cannot merge pull requests from contributors who have not signed the OCA.

3.  Fork the WebLogic Remote Console GitHub repository.

4.  Create a branch in your forked repository and implement your changes. Include the issue number in your branch's name. For example, <code>1234-fixlink</code>.

5.  Test your changes. Build WebLogic Remote Console as described in [Build from Source](#GUID-39A8D735-4891-4F9D-87F3-7F216219F8D0).

6.  If the base image was changed, update the samples.

7.  Commit your changes. Make sure to include a git commit signoff that lists your name and the email address that matches its entry in the OCA Signatories list. For example, <code>Signed-off-by: Your Name you@example.org</code>. You can add this automatically by adding the <code>--signoff</code> option to your git commit command: <code>git commit--signoff</code>.

8.  Submit the pull request. Include a link to its related issue and describe what you hope to accomplish with your changes and how to validate them.


Thank you for your contribution. We will assign reviewers to your pull request.

## Build from Source {#GUID-39A8D735-4891-4F9D-87F3-7F216219F8D0}

If you want to contribute to the WebLogic Remote Console project or just want a better understanding of how WebLogic Remote Console works, then you can generate the project from its source code to create a local build.

1.  Make sure the following software is installed in your local environment.

    -   Java SE 11 or later
    -   Maven 3.6.1 or later
    -   Node.js 18.0.0 or later
    To verify that you have installed the correct versions of the listed software, run:

    ```
    java -version
    mvn --version
    node -v
    ```

2.  Install the Oracle JET 19.0.0 client libraries.

    -   In Windows environments, run:

        ```
        npm install --location=global @oracle/ojet-cli@~19.0.0
        ```

    -   In Linux or macOS environments, run:

        ```
        sudo npm install --location=global @oracle/ojet-cli@~19.0.0
        ```

    You can run <code>ojet --version</code> to verify it installed correctly.

3.  Fork the [WebLogic Remote Console GitHub repository](https://github.com/oracle/weblogic-remote-console) and then clone it to your machine.

4.  Open a command-line interface and navigate to the home directory of the cloned repository.

5.  <a id="step_lfx_pzz_yhc"></a>Run <code>mvn clean install</code>.

    After the build finishes, confirm that <code>/installer/target/console.zip</code> was created.

6.  From the home directory of the repository, run the <code>build-electron.sh</code> script.


The WebLogic Remote Console executable file is created under <code>/electron/dist/</code>.

## Run WebLogic Remote Console in Development Mode {#GUID-4956F50D-B371-452F-A179-015BCDE1B826}

If you want to see your changes without building the full WebLogic Remote Console, you can run a development version of WebLogic Remote Console from within a browser.

{{< alert title="Note" color="primary" >}}



WebLogic Remote Console in development mode is distinct from Hosted WebLogic Remote Console. You should only use WebLogic Remote Console in development mode as a tool for development purposes. If you want to perform domain management tasks but your environment limits the installation of standalone applications, then you should use Hosted WebLogic Remote Console. See [Deploy Hosted WebLogic Remote Console](..#GUID-9974090F-7983-4641-9121-36A29B6F6735).

{{< /alert >}}


You must have a modern internet browser installed to run WebLogic Remote Console in the browser.

1.  Build WebLogic Remote Console from its source code. Follow the instructions at [Build from Source](#GUID-39A8D735-4891-4F9D-87F3-7F216219F8D0) through step [5](#step_lfx_pzz_yhc).

2.  Copy <code>/installer/target/console.zip</code> to a new directory and extract its contents.

3.  Open a command window and navigate to the new directory.

4.  Run <code>java -jar console.jar</code>.

5.  Open a browser window and enter <code>http://localhost:8012</code> in the address bar.

6.  Test your changes to WebLogic Remote Console.


To end the session, enter <code>Ctrl+C</code> in the command window.

Unsaved changes made in the browser application do not persist after you close the browser tab. If you accidentally close or refresh the browser tab, you may lose all of your changes. Changes to an Administration Server provider remain in a pending state and can generally be recovered in a new session. Changes to WDT model files, WDT Composite files, and property lists are lost if you do not click **Download File** at the end of your session.

