# Oracle WebLogic Remote Console Project 

## CFE-JET Unit Testing

<b style="color: blue;">IMPORTANT 1: The GitLab CI pipeline will fail if the unit tests or `eslint` fail, so it is a good idea to run them locally BEFORE you do a commit/push.</b>

<b style="color: blue;">IMPORTANT 2: These CFE-JET unit tests CANNOT BE USED TO TEST THE UI!! They only test JavaScript modules and their code execution flows!!! If you need to test the UI, check out the README.md file under the &lt;REPO_HOME>frontend/system-test</code>> directory.</b>

<b style="color: blue;">IMPORTANT 3: These UI test for the <i>Electron Side of the WRC-CFE</i> are not CFE-JET unit tests!! If you need to test the <i>Electron Side of the WRC-CFE</i>, then check out the README.md file under the &lt;REPO_HOME>frontend/electron-test</code> directory.</b>

<a name="readme-section-links"></a>
### README Section Links

* [Technical Overview](#technical-overview)
* [CFE-JET Unit Testing Topics](#cfe-jet-unit-testing-topics)
* [Topic: Prerequisites for CFE-JET Unit Testing](#prerequisites-for-cfe-jet-unit-testing)
* [Topic: Running the CFE-JET Unit Tests](#running-cfe-jet-unit-tests)
* [Topic: Troubleshooting Unit Testing Issues](#troubleshooting-cfe-jet-unit-testing-issues)
* [Topic: Writing a CFE-JET Unit Test](#writing-a-cfe-jet-unit-test)
* [Appendix A](#appendix-a)

<a name="technical-overview"></a>
### Technical Overview 

The unit tests for the CFE-JET are located under the `<REPO_HIME>/frontend/unit-tests` directory, and are written in JavaScript.

CFE-JET unit testing leverage the [`karma`](https://karma-runner.github.io/latest/index.html), [`mocha`](https://mochajs.org/) and [`sinon.js`](https://sinonjs.org/), which are Javascript libraries from the Javascript unit testing ecosystem:

<ul>
	<li><p><b>karma</b>&nbsp;&nbsp;&nbsp;A highly-configurable, test runner that is ideal for executing unit tests from any JavaScript testing framework.</p></li>
	<li><p><b>mocha</b>&nbsp;&nbsp;&nbsp;A Javascript testing framework. <code>karma</code> also supports the <a href="https://jasmine.github.io/"><code>jasmine</code></a> JavaScript testing framework, so you can elect to use that instead of (or in addition to) <code>mocha</code>.</p></li>
<li><p><b>sinon.js</b>&nbsp;&nbsp;&nbsp;A JavaScript library (for creating spies, stubs and "fake" servers).</p></li>
<li><p><b>fixtures</b>&nbsp;&nbsp;&nbsp;Local JSON documents used as inputs, for unit tests that require or use them.</p></li>
</ul>

<a name="cfe-jet-unit-testing-topics"></a>
### CFE-JET Unit Testing Topics``

<a name="prerequisites-for-cfe-jet-unit-testing"></a>
### Topic: Prerequisites for CFE-JET Unit Testing

This section of the README talks about things you need to verify, before attempting to run the CFE-JET unit tests.

#### Verify Value Assigned to `JET_VERSION` Variable

You must ensure the value assigned to the `JET_VERSION` variable in the `<REPO_HOME>/frontend/unit-tests/test-main.js` file is correct, before attempting to run the CFE-JET unit tests. 

It needs to be the name of the directory immediately under `<REPO_HOME>/frontend/web/js/libs/oj`, which should be something like `v12.0.2`.

#### Verify Presence of Dependent JavaScript Libraries

See the ["JavaScript Library Dependencies"](#cfe-jet-unit-tests-library-dependencies) section in "Appendix A", for specifics.

<a name="running-cfe-jet-unit-tests"></a>
### Topic: Running the CFE-JET Unit Tests

You can run the CFE-JET unit tests using either the `mvn` or `npm` commands.

The `mvn` command way uses the `maven-exec-plugin` in the `<REPO_HOME>/frontend/pom.xml` file:

```
...
   <execution>
      <id>run-npm-test</id>
      <phase>test</phase>
      <configuration>
        <executable>npm</executable>
        <commandlineArgs>test</commandlineArgs>
      </configuration>
      <goals>
        <goal>exec</goal>
      </goals>
    </execution-->
...
```

The `npm` command way uses the `"scripts"` field in the `<REPO_HOME>/frontend/package.json` file:

```
  "scripts": {
    "test": "npx karma start unit-tests/karma.conf.js",
    "eslint": "node_modules/eslint/bin/eslint.js --rulesdir eslint-rules/ -f compact src/js"
  },

```
#### Using the `mvn` Command Way

Type the following in a terminal window:
```
$cd <REPO_HOME>/frontend
mvn test
```

#### Using the `npm` Command Way

Type the following in a terminal window:

```
$cd <REPO_HOME>/frontend
npm run test
```

<a name="troubleshooting-cfe-jet-unit-testing-issues"></a>
### Topic: Troubleshooting CFE-JET Unit Testing Issues

This section of the README talks about the various reasons why the CFE-JET unit test don't run.

<ol>
	<li>
	<p><b>Have they been commented out in the <code>pom.xml</code> file?</b>&nbsp;&nbsp;&nbsp;If so, then there is no issue. Someone has just commented them out the <i>automatic running</i> of them. You can still run them manually, using the <code>npm run test</code> so command.
	</p></li>
	<li><p><b>Was a <code>mvn clean</code> command run directly or indirectly, earlier?</b>&nbsp;&nbsp;&nbsp;If so, then there is no issue. The <code>mvn clean</code> command removes the <code>&lt;REPO_HOME>/frontend/node_modules</code> directory, which is where the <code>karma</code> binary is located. The fix is to just run the <code>ojet restore</code> command again, so it can put the <code>karma</code> binary back.</p>
	</li>
</ol>

<a name="writing-a-cfe-jet-unit-test"></a>
### Topic: Writing a CFE-JET Unit Test

You'll need to use a testing framework like `mocha` or `jasmine` to write unit tests for the CFE-JET. 

If you examine the `<REPO_HOME>/frontend/unit-tests/specs` directory, you'll see some of the existing CFE-JET unit tests that have been written. To fully grasp what they're doing, you'll likely need to be (or become) familiar with the `mocha` testing framework. Click [here](https://mochajs.org/#getting-started) if you're new to `mocha` and are interested in checking out their _"Getting Started"_ resource.

#### Existing Unit Tests Are Great Teachers!

If you're not familiar with `mocha` or writing unit test with it, you should start by exploring the code in existing CFE-JET unit tests. They can be a great teacher and minimize the number of Google searches you need to do, to figure something out.

#### Existing Unit Tests Are Great Places to Copy Code From!

A lot of times you know what you want to do, but you don't know the `mocha` *built-in* function or correct syntax! In those scenarios, looking at existing CFE-JET unit tests can be very fruitful, for both knowledge and borrowing code.

#### Write Unit Tests That Are "Mischievious"!
Write unit tests where you intentionally don't "follow the rules" for function parameters! 

For example:

* Pass in the wrong data type for a parameter
* Pass in invalid values for a parameter
* Don't pass in a required parameter
* Pass `undefined` or `null` for a parameter that should have a value

#### Write Unit Tests That Have > 90% Code Coverage!

Check out the ["Examining the CFE-JET Unit Tests Code Coverage Report"](#cfe-jet-unit-tests-code-coverage") section, to learn more about getting good code coverage with the CFE-JET unit tests you write.

#### You Need to Run `ojet build` After Changing a CFE-JET Module!

In most cases, you'll be fixing the CFE-JET JavaScript module that your unit test found a bug in. When that happens, you'll need to run the `ojet build` command, so that the unit testing environment gets the change in the JavaScript modules it sees.

#### You Might Need to Modify the `karma.conf.js` File!

New unit tests may require modifications to the `<REPO_HOME>/frontend/unit-tests/karma.conf.js` file. That's the configuration file that `karma` uses. Click [here](http://karma-runner.github.io/6.3/config/configuration-file.html) to find out more information about the `karma.conf.js` file, and what goes in it. 

<a name="appendix-a"></a> 
## Appendix A
<a name="cfe-jet-unit-tests-resources"></a> 
### Resources
* [**Mocha**](https://mochajs.org/#getting-started)
* [**Jasmine**](https://jasmine.github.io/pages/getting_started.html)
* [**Karma-Mocha**](https://github.com/karma-runner/karma-mocha)
* [**Karma-Jasmine**](https://github.com/karma-runner/karma-jasmine)
* [**Sinon**](https://sinonjs.org/) 

<a name="cfe-jet-unit-tests-library-dependencies"></a>
### JavaScript Library Dependencies

The CFE-JET unit tests have the following JavaScript library dependencies, so you're going to want to verify that they're under the `<REPO_HOME>/frontend/node_modules` directory:
 
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

All of those are under the `devDependencies` field in `<REPO_HOME>/frontend/package.json` file, so they should get put in the `<REPO_HOME>/frontend/node_modules` directory when the `ojet restore` command is run.

<a name="cfe-jet-unit-tests-code-coverage"></a> 
### Examining the CFE-JET Unit Tests Code Coverage Report

We have configured `karma` to generate an HTML-based code coverage report, for CFE-JET unit tests:

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

Inside that sub-directory, will be an `index.html` file. Open that `index.html` file inside a web browser, to see the report and navigate to areas within it.

<b style="color: blue;">IMPORTANT: The code coverage percentage number is a good indicator of <i>how much of the code is being unit tested</i>. When you see percentages below 5%, it generally means that the code has little or no unit tests associated with it. Ideally, you'd want each module appearing in the code coverage report, to have a 98% or greater code coverage percent number. Writing more unit tests is the way to achieve that.</b>
