#### Copyright (c) 2020, 2021, 2022 Oracle Corporation and/or its affiliates.
#### [The Universal Permissive License (UPL), Version 1.0](http://oss.oracle.com/licenses/upl.)

# Oracle WebLogic Server Remote Console Remote System Test 
The system frontend console test is used to validate product in different platforms and browsers which is written in [Selenium nodejs language](https://www.selenium.dev/selenium/docs/api/javascript/) and run with [Mocha JavaScript test framework](https://mochajs.org/)

The system frontend console test uses Selenium [Web Driver](https://www.selenium.dev/documentation/en/getting_started/quick/#webdriver) and [Browser Drivers](https://github.com/SeleniumHQ/) . Click [here](https://www.selenium.dev/documentation/en/introduction/the_selenium_project_and_tools/) for documentation on these two Selenium tools.
To write new test case, you can use either Selenium [IDE](https://www.selenium.dev/documentation/en/getting_started/quick/#ide) or [Chrome/Firefox Development](https://developers.google.com/web/tools/chrome-devtools) tools to locate a console element on a browser. 

[Mocha](https://mochajs.org/) is installed when you run the ojet restore command. The `frontend/pom.xml` file contains all the information for maven properties. 

To install requisites for remote console, please follow instruction from this [link.](https://gitlab-odx.oracledx.com/weblogic/console-backend/-/blob/master/frontend/README.md)

The system test beside [mocha test framework](https://github.com/mochajs), it's also required Selenium [webdriver browser drivers](https://www.selenium.dev/downloads/). You would need to install both [selenium-webdriver and browser-drivers](https://www.npmjs.com/package/selenium-webdriver) on your machine.

To install selenium-webdriver: `npm install selenium-webdriver --save-dev`.

To install chromedriver: `npm install chromedriver@95.0 --save-dev`, or on MacOS `brew cask install chromedriver@85.0`

To install firefoxdriver, `npm install geckodriver --save-dev` for firefox browser.

To get around proxy configuration, you can download and copy chromedriver to frontend/node_modules/.bin and frontend/node_modules/chromedriver/lib/chromedriver directory.
Or, run command below to install chromedriver:
```
npm config rm proxy
npm config rm https-proxy
npm config set noproxy localhost,127.0.0.1,.local,.oracle.com,.oraclecorp.com
npm config set registry https://artifacthub-tip.oraclecorp.com/api/npm/npmjs-remote
npm config set chromedriver_cdnurl http://chromedriver.storage.googleapis.com
```
Details to config npm registry is [here](https://confluence.oraclecorp.com/confluence/display/JET/JET+CLI+Setup)

To build remote console and run selenium short test (basic_test). From console-backend directory, `./build-run-test.sh --selenium-short`

To build remote console and run selenium full test (long test). From console-backend directory, `./build-run-test.sh --selenium-long`

To run a single test suite, (eg, domain property configuration test suite)
```
-Start domain(AdminServer) and remote console(console.jar)
-From console-backend directory
./run/runFETest.sh then follow the usage syntax to run each different test suite, or all test cases

-From console-backend/frontend directory, 
./node_modules/.bin/mocha -g <suiteName_test> weblogic welcome1 http://localhost:7001 system-tests/index.js
```

The headless option is configured in admin.js file at statement: `browserName='chrome-headless' or browserName='firefox-headless'`
To view test run on the browser, uncomment statement `browserName=chrome`
