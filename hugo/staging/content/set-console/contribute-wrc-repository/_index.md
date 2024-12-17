---
author: Oracle Corporation
publisherinformation: December 2024
weight: 26
title: Contribute to WebLogic Remote Console
---



Contributions from the community to the WebLogic Remote Console project help us build a better experience together. You can contribute by raising a bug or enhancement request or by submitting pull requests to address an issue yourself.

1.  Open an issue in the [WebLogic Remote Console GitHub repository](https://github.com/oracle/weblogic-remote-console) that describes the issue you plan to address or the enhancement request.

    If you only want to file an enhancement request, you can stop here - you're done! Thank you for helping to improve WebLogic Remote Console.

2.  If you want to fix an issue yourself, you must sign the Oracle Contributor Agreement (OCA) before you can submit a pull request. For instructions, see the [Oracle Contributor Agreement](https://oca.opensource.oracle.com/).

3.  Fork the WebLogic Remote Console GitHub repository.

4.  Create a branch in your forked repository and implement your changes. Include the issue number in your branch's name. For example, <code>1234-fixlink</code>.

5.  Test your changes. Build WebLogic Remote Console as described in [Build from Source](#GUID-39A8D735-4891-4F9D-87F3-7F216219F8D0).

6.  If the base image was changed, update the samples.

7.  Commit your changes. Make sure to include a git commit signoff that lists your name and the email address that matches its entry in the OCA Signatories list. For example, <code>Signed-off-by: Your Name you@example.org</code>. You can add this automatically by adding the <code>--signoff</code> option to your git commit command: <code>git commit--signoff</code>. We cannot merge pull requests from contributors who have not signed the OCA.

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

2.  Install the Oracle JET 15.1.0 client libraries.

    -   In Windows environments, run:

        ```
        npm install --location=global @oracle/ojet-cli@~15.1.0
        ```

    -   In Linux or macOS environments, run:

        ```
        sudo npm install --location=global @oracle/ojet-cli@~15.1.0
        ```

    You can run <code>ojet --version</code> to verify it installed correctly.

3.  Clone the WebLogic Remote Console repository from the [WebLogic Remote Console GitHub repository](https://github.com/oracle/weblogic-remote-console).

4.  Open a command-line interface and navigate to the home directory of the cloned repository.

5.  Run <code>mvn clean install</code>.

    After the build finishes, confirm that <code>/installer/target/console.zip</code> was created.

6.  From the home directory of the repository, run the <code>build-electron.sh</code> script.


The WebLogic Remote Console executable file is created under <code>/electron/dist/</code>.

## Run WebLogic Remote Console in the Browser {#GUID-4956F50D-B371-452F-A179-015BCDE1B826}

You can choose to run WebLogic Remote Console from within a browser.

{{< notice note >}}

 We do not recommend using the browser application to manage domains. It has significant limitations in both security and functionality and should be used for development purposes only.

{{< /notice >}}


You must have a modern internet browser installed to run WebLogic Remote Console in the browser.

1.  Build WebLogic Remote Console from its source code. Follow the instructions at [Build from Source](#GUID-39A8D735-4891-4F9D-87F3-7F216219F8D0).

2.  Copy <code>/installer/target/console.zip</code> to a new directory and extract its contents.

3.  Open a command window and navigate to the new directory.

4.  Run <code>java -jar console.jar</code>.

5.  Open a browser window and enter <code>http://localhost:8012</code> in the address bar.

6.  Connect to a provider and you can manage it as you would in the regular WebLogic Remote Console.


To end the session, enter <code>Ctrl+C</code> in the command window.

Unsaved changes made in the browser application do not persist after you close the browser tab. If you accidentally close or refresh the browser tab, you may lose all of your changes. Changes to an Administration Server provider remain in a pending state and can generally be recovered in a new session. Changes to WDT model files, WDT Composite files, and property lists are lost if you do not click **Download File** at the end of your session.

