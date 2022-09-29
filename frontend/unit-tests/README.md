# WebLogic Remote Console Project 
## ``frontend`` Unit Testing
The ``frontend`` portion of the WebLogic Remote Console has it's own set of unit tests, written in JavaScript. If ``frontend`` unit testing is the topic you're interested in, then this is the README you're looking for. If you're interested in unit testing for the ``backend`` portion of the WebLogic Remote Console, then you want to click here. __``TODO: Make the word "here" a hyperlink to the README.md for backend unit testing.``__

### Overview
The ``mvn test`` command is used to run the unit tests and quality control tools, for the ``frontend`` portion of the WebLogic Remote Console. That command enlists the `maven-exec-plugin` to run a ["karma start"](https://github.com/karma-runner/karma) command.

``Karma`` is a highly-configurable, unit testing environment that uses a combination of:
 1. The ``mocha`` testing framework.
 2. The [``sinon.js``](https://sinonjs.org/) JavaScript library (for creating spies, stubs and "fake" servers).
 3. Local fixture files (e.g. JSON documents) used as input for unit tests.
 
``karma`` also supports the [jasmine](https://jasmine.github.io/) testing framework, so you can elect to use that instead of (or in addition to) ``mocha``.

#### Library Dependencies
The ``frontend`` unit tests have the following library dependencies, so you're going to want to verify that they're under the ``<REPO_HOME>/frontend/node_modules`` directory:
 
* requirejs
* mocha
* chai
* sinon
* fixture
* karma
* karma-chai
* karma-chrome-launcher
* karma-coverage
* karma-fixture
* karma-json-fixtures-preprocessor
* karma-mocha
* karma-mocha-reporter
* karma-requirejs
* karma-sinon
* karma-typescript

All of those are under the ``devDependencies`` field in ``<REPO_HOME>/frontend/package.json``, so they should already be under the ``<REPO_HOME>/frontend/node_modules`` directory.

### Where Are the ``frontend`` Unit Tests Kept?
The unit tests for the ``frontend`` are kept in the following location:
```
<REPO_HOME>/frontend/unit-tests/specs
```
The ``<REPO_HOME>/frontend/pom.xml`` file contains all the maven properties the `maven-exec-plugin` needs to run the tests.

### Pre-requisites for Running the Existing ``frontend`` Unit Tests?
You must ensure the value assigned to the ``JET_VERSION`` variable in the ``<REPO_HOME>/frontend/unit-tests/test-main.js`` file is correct, before attempting to run the existing unit tests. It needs to be the name of the directory immediately under ``<REPO_HOME>/frontend/web/js/libs/oj``, which should be something like ``v12.0.2``.

### How Do I Run the Existing ``frontend`` Unit Tests?
There are two ways to run the unit tests under the ``<REPO_HOME>/frontend/unit-tests/specs`` directory:

1. You can run them using the ``npm`` command:
<br/><pre>
cd <REPO_HOME>/frontend
npm test</pre>
2. You can run them using the ``mvn`` (Maven) command:
<br/><pre>
cd <REPO_HOME>/frontend
mvn test</pre>

The latter will run the unit tests, as well as other quality control tools (e.g. ESlint, etc.).

__The GitLab CI pipeline will fail if the unit tests or quality control tools fail, so it is a good idea to run them locally BEFORE you do a commit/push.__

NOTE: If the unit tests don't run, the reason could be that the ``ojet restore`` command hasn't been run since that last time the ``mvn clean`` command was run. The ``mvn clean`` command removes the ``<REPO_HOME>/frontend/node_modules`` directory, which is where the ``karma`` binary is located. The fix is to just run the ``ojet restore`` command:
```
cd <REPO_HOME>/frontend
ojet restore
```
The ``ojet restore`` command calls ``npm install``, which is what causes the ``node_modules`` directory to be created and populated. When the prompt returns after the ``ojet restore`` command, just issue the ``mvn test`` command again.

#### Writing New ``frontend`` Unit Tests to Run Using `karma`
To write unit tests, you'll need to use a testing framework like ``mocha`` or ``jasmine``. 

If you examine the ``<REPO_HOME>/frontend/unit-tests/specs`` directory, you'll see some of the existing unit tests that have been written for the ``frontend``. To fully grasp what they're doing, you'll likely need to be familiar with the ``mocha`` testing framework. Click [here](https://mochajs.org/#getting-started) if you're new to ``mocha`` and interested in checking out their _"Getting Started"_ resource.

New unit tests that you write may require modifications to the ``<REPO_HOME>/frontend/unit-tests/karma.conf.js`` file. That's the configuration file that ``karma`` uses. Click [here](http://karma-runner.github.io/6.3/config/configuration-file.html) to find out more information about the ``karma.conf.js`` file, and what goes in it. If you're interested in other tools/subjects related to ``karma``, check out the links in the ["Resources"](#resources) section of this README file.

#### Examining the Code Coverage Report for ``frontend`` Unit Tests
We have configured ``karma`` to generate an HTML-based code coverage report, for ``frontend`` unit tests:
```
karma.config.js
===============
...
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      includeAllSources: true,
      type: 'html',
      dir: 'coverage/',
      file: 'index.html'
    },
...
``` 
 
Those settings generate the code coverage report to the following directory:
```
<REPO_HOME>/frontend/coverage
```
There will be sub-directory beneath that named after the browser being used. On a Mac, it will be a directory name like:
```
HeadlessChrome 88.0.4298 (Mac OS X 11.0.0)
``` 
Inside that sub-directory, will be an ``index.html`` file. Open that ``index.html`` file inside a web browser, to see the report and navigate to areas within it.

__IMPORTANT__: The code coverage percentage number is a good indicator of _how much of the code is being unit tested_. When you see percentages below 5%, it generally means that the code has little or no unit tests associated with it. Ideally, you'd want each module appearing in the code coverage report, to have a 98% or greater code coverage percent number. Writing more unit tests is the way to achieve that. 
 
### Resources
* [**Mocha**](https://mochajs.org/#getting-started)
* [**Jasmine**](https://jasmine.github.io/pages/getting_started.html)
* [**Karma-Mocha**](https://github.com/karma-runner/karma-mocha)
* [**Karma-Jasmine**](https://github.com/karma-runner/karma-jasmine)
* [**Sinon**](https://sinonjs.org/) 
