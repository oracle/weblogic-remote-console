# Copyright 2020, Oracle Corporation and/or its affiliates.  All rights reserved.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

![](../etc/images/console-backend_logo_300x300.png?raw=true "")

# Oracle WebLogic Console Remote System Test 
The system frontend console test is used to validate product in different platforms and browsers which is run with [Selenium nodejs language](https://www.selenium.dev/selenium/docs/api/javascript/).

The system frontend console test uses Selenium [Web Driver](https://www.selenium.dev/documentation/en/getting_started/quick/#webdriver) and [Browser Drivers](https://github.com/SeleniumHQ/) . Click [here](https://www.selenium.dev/documentation/en/introduction/the_selenium_project_and_tools/) for documentation on these two Selenium tools.
To write new test case, you can use either Selenium [IDE](https://www.selenium.dev/documentation/en/getting_started/quick/#ide) or [Chrome/Firefox Development](https://developers.google.com/web/tools/chrome-devtools) tools to locate a console element on a browser. 

[Mocha](https://mochajs.org/) is installed when you run the ojet restore command. The `frontend/pom.xml` file contains all the information for maven properties. 

To install requirements for remote console, please follow instruction from this [link.](https://gitlab-odx.oracledx.com/weblogic/console-backend/-/blob/master/frontend/README.md)

When `mvn test` command is executed from the frontend directory, it will run both unit and system test cases under directory:
`frontend/src/js/*-tests`

The system test beside [mocha test framework](https://github.com/mochajs), it's also required Selenium [webdriver browser drivers](https://www.selenium.dev/downloads/). You would need to install both [selenium-webdriver and browser-drivers](https://www.npmjs.com/package/selenium-webdriver) in your machine.

To install selenium-webdriver: `npm install selenium-webdriver --save-dev`.

To install chromedriver: `npm install chromedriver@85.0 --save-dev`, or on MacOS `brew cask install chromedriver@85.0`

To install firefoxdriver, `npm install geckodriver --save-dev` for firefox browser.

To avoid the proxy server problem, you can either download the chromedriver to the location which specified in runFETest.sh file, or npm set configuration below:
```npm config rm proxy
npm config rm https-proxy`
npm config set noproxy localhost,127.0.0.1,.local,.oracle.com,.oraclecorp.com`
npm config set registry https://artifacthub-tip.oraclecorp.com/api/npm/npmjs-remote`
npm config set chromedriver_cdnurl http://chromedriver.storage.googleapis.com`
```
Details to config npm registry is [here](https://confluence.oraclecorp.com/confluence/display/JET/JET+CLI+Setup)

To run selenium full test with build command. From console-backend directory, `./build-run-test.sh --selenium-long`

To run selenium short test with build command. From console-backend directory, `./build-run-test.sh --selenium-short`

To run a single test suite, (eg, domain property configuration test suite)
```
-Start domain and console-frontend
-From console-backend/frontend directory, 
./node_modules/.bin/mocha src/js/system-tests/tests/domainProps_test.js
```

The headless option is configured in admin.js file at statement: `browserName='chrome-headless' or browserName='firefox-headless'`
To view test run on the browser, uncomment statement `browserName=chrome`
