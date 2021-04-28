# Oracle WebLogic Server Remote Console Project 
## ``frontend`` Unit Testing
The ``frontend`` portion of the Oracle WebLogic Server Remote Console has it's own set of unit tests, written in JavaScript. If that's the topic you're interested in, then this README is what you're looking for. If you're interested in the unit tests and/or unit testing of the ``backend`` portion of the Oracle WebLogic Server Remote Console, then you want to click here. __``TODO: Make the word "here" a hyperlink to the README.md for backend unit testing.``__.

### Overview
The ``frontend`` portion of the Oracle WebLogic Server Remote Console uses the `mvn test` command to run unit tests. That command results in the `maven-exec-plugin` running a ["karma start"](https://github.com/karma-runner/karma) command.

``Karma`` is not a testing framework, nor an assertion library. The existing unit tests are written using a combination of:
 1. The ``mocha`` testing framework.
 2. The [``sinon.js``](https://sinonjs.org/) JavaScript library (for creating spies, stubs and "fake" servers).
 3. Local test files that typically contain JSON documents,
 
``karma`` also supports the [jasmine](https://jasmine.github.io/) testing framework, so you can elect to use that instead of (or in addition to) ``mocha``.

The ``frontend`` unit tests have the following library dependencies, so you're going to want to verify that they're under the ``<REPO_HOME>/frontend/node_modules`` directory:
 
* requirejs
* mocha
* chai
* sinon
* fixture
* karma-typescript

All of those are under the ``devDependencies`` field in ``<REPO_HOME>/frontend/package.json``, but so they should actually be there, already.

NOTE: ``Karma`` is also listed in the ``package.json`` file, so it will be installed whenever the `ojet restore` command is run.
 
### Where Are the ``frontend`` Unit Tests Kept?
The unit tests for the ``frontend`` are kept in the following location:
```
<REPO_HOME>/frontend/unit-tests/specs
```
The ``<REPO_HOME>/frontend/pom.xml`` file contains all the maven properties the `maven-exec-plugin` needs, in order to run the tests located there using `karma`.
### How Do I Run the Existing ``frontend`` Unit Tests?
To run the unit tests under the ``<REPO_HOME>/frontend/unit-tests/specs`` directory, you just need to enter the following commands in a ``TERMINAL``:
```
cd <REPO_HOME>
mvn test -f frontend/pom.xml
```
If they don't run, the reason could be that the ``ojet restore`` command hasn't been run since that last time the ``mvn clean`` command was run. The ``mvn clean`` command removes the ``<REPO_HOME>/frontend/node_modules`` directory, which is where the ``karma`` binary is located. The fix is to just run the ``ojet restore`` command:
```
cd <REPO_HOME>/frontend
ojet restore
cd ..
```
The ``ojet restore`` command calls ``npm install``, which is what causes the ``node_modules`` directory to be created and populated. When the prompt returns after the ``cd ..`` command, just issue the ``mvn test -f frontend/pom.xml`` command again.

#### Writing New ``frontend`` Unit Tests to Run Using `karma`
To write unit tests, you'll need to use a testing framework like ``mocha`` or ``jasmine``. 

If you examine the ``<REPO_HOME>/frontend/unit-tests/specs`` directory, you'll see some of the existing unit tests that have been written for the ``frontend``. To fully grasp what they're doing, you'll likely need to be familiar with the ``mocha`` testing framework. Click [here](https://mochajs.org/#getting-started) if you're new to ``mocha`` and interested in checking out their _"Getting Started"_ resource.

New unit tests that you write may require modifications to the ``<REPO_HOME>/frontend/unit-tests/karma.conf.js`` file. That's the configuration file that ``karma`` uses. Click [here](http://karma-runner.github.io/6.3/config/configuration-file.html) to find out more information about the ``karma.conf.js`` file, and what goes in it. If you're interested in other tools/subjects related to ``karma``, check out the links in the ["Resources"](#resources) section of this README file.

### Resources
* [**Mocha**](https://mochajs.org/#getting-started)
* [**Jasmine**](https://jasmine.github.io/pages/getting_started.html)
* [**Karma-Mocha**](https://github.com/karma-runner/karma-mocha)
* [**Karma-Jasmine**](https://github.com/karma-runner/karma-jasmine)
* [**Sinon**](https://sinonjs.org/) 
