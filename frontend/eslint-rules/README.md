# Oracle WebLogic Server Remote Console Project

## ESLint Integration 

### Overview
[ESLint](https://eslint.org/) is an open source JavaScript linting utility that help you overcome developer errors, as JavaScript is a loosely-typed language. It consist of a CLI and a set of pluggable linting "rules" that the JavaScript code either pass or fail. 

A report is generated stating which "rules" (and which ``.js`` files) failed, along with what line number the offending code is on.

The ESLint CLI (and the "rules") are configurable, but it can only evaluate ``.js`` files or ``.html`` files that have a ``<script></script>`` tag in them.

A `.js` file can "work" at runtime, but still have ESLint warnings/errors reported against it. This is why we run ESLint as part of the make or build process, and treat ESLint rule failures as a failure of that process.  

Finally, ESLint rule evaluation is what the product is primarily used for, so it is well worth it to spend some time perusing the ESLint documentation on ["Working with Rules"](https://eslint.org/docs/developer-guide/working-with-rules).  

### Installing ESLint in the `frontend` Maven Module
ESLint is available as a npm package that has already been added as a devDependency in our `package.json` file. This means that it will automatically be added to your `frontend` project, if you (or the make) runs the `ojet restore` command.

### Configuring ESLint in the `frontend` Maven Module
We use the `<REPO_HOME>frontend/.eslintrc.js` and `<REPO_HOME>frontend/.eslintignore` files to configure ESLint. 

* __.eslintrc.js__ The file used to specify the rules used when running the `node_module/.bin/eslint` CLI command.
* __.eslintignore__ The file used to specify the directories that will be excluded when running the `node_module/.bin/eslint` CLI command. Current this includes the system tests, CFE unit tests and any custom eslint rules we write. 

#### Core Rule Overrides
The `overrides` array in the `<REPO_HOME>/frontend/.eslintrc.js` file, is used to specify which `files` and `rules` are not subjected to the core rules:
<pre>
    overrides: [
      {
        files: [
          <b>"main.js"</b>
        ],
        rules: {
          <b>"strict": "off",
          "no-undef": "off"</b>
        }
      }
    ]
</pre>

The `main.js` file is provided with the JET install, so we don't try to make it adhere to the same ESLint rules as our own ``.js`` files.

### Running ESLint CLI with ``Maven``
ESLint CLI is a standalone executable (`eslint`) located under the `<REPO_HOME>/frontend/node_modules/.bin` directory. The `exec-maven-plugin` is used to allow it to be called when a `mvn test` command is issued. 

Enter the following at a prompt to run ESLint on the `.js` files of the CFE:
```
$ cd <REPO_HOME>/frontend
$ mvn test
```

`node_modules/.bin/eslint` returns a non-zero value if the `--fix` option is not specified on the command line, and:
 
 1. The copyright is not located at the top of the ``.html``, or
 2. An existing copyright is at the top of the ``.html``, but something is incorrect in it.

The ``<REPO_HOME>/frontend/pom.xml`` file uses the ``compact`` as the ESLint report format:
```
<eslint-js.formatter>compact</eslint-js.formatter>
```

That format write ASCII text to ``stdout``.

### Running ESLint CLI with ``Node``
Type the following in a terminal, to run ESLint CLI with ``node``:
```
cd <REPO_HOME>/frontend
node_modules/.bin/eslint --rulesdir eslint-rules/ -f html -o eslint-js.html src/js
```
Here, the ``src/js`` argument determines which files will be linted. It can be a directory or a single file, but it must be under the ``src/js`` folder. 

Use the following table to find out what the command-line options mean and do:
 
<table>
  <tr>
    <th>Option</th>
    <th>Comment</th>
  </tr>
  <tr>
    <td>---rulesdir</td>
    <td>Directory path to custom rule implementations (e.g. Javascript files).</td>
  </tr>
  <tr>
    <td>-f</td>
    <td>Report format (or formatter).</td>
  </tr>    
  <tr>
    <td>-o</td>
    <td>Path/name of file for the report</td>
  </tr>    
</table>

When the prompt returns, you can load the `<REPO_HOME>/frontend/eslint-js.html` file into a web browser and use the ``[+]`` on each line to see report details on problems.

### The ESLint Report
The ESLint report identifies which ``.js`` files had rule violations, and where they occurred in the file.

This report is generated to ``stdout`` when the ESLint CLI is run as part of a ``mvn test`` command. The other formats available can be found [here](https://eslint.org/docs/user-guide/command-line-interface#options).  

#### Fixing Errors Appearing in the ESLint Report
The ESLint report contains the line and column location of each error, to aid in fixing errors. It may also include a message stating how to fix something. 

If you elect to use ``html`` as the format for the output report, you can load it into a web browser and use the ``[+]`` on each line to see report details on problems.

### GitLab CI Pipeline Integration
ESLint CLI return a zero or non-zero exit code, so you should be able to use it directly in shell scripts or CI pipeline rules.

### Custom ESLint Rules
ESLint provides a way for developers to write "custom rules" (in the JavaScript language) that can be used in concert with the ones that come with the product. We took advantage of this to create a "custom rule" that checks for Oracle copyright notices, at the very top of ``.js`` files:

```
/**
 * @license
 * Copyright (c) [\s*\d{4}$|\d{4}$\-\d{4}$|\d{4}$,]+[ ,|] Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
``` 

RegEx matching is the principle technology used in ``js-copyright.js``, but most of it's code is associated with what's required to be a custom rule. The ``regex`` matching is used to do the following:
 
1. To ensure the pieces of the Oracle copyright notice are present in a multi-line JavaScript comment, at the very top of a ``.js`` file. "Very top" means the first line of the ``.js`` file, not the first non-whitespace line.
2. To ensure that the words in each line match, from both a case and whitespace perspective. It does not do "spell-checking", but misspelling of a word will be caught by the case and whitespace enforcement.
3. To ensure that the year range specified properly, and that the ones used are in the ``acceptableYears`` array field, that appears in the ``<REPO_HOME>/frontend/.eslintrc.js`` file.

There is no specific documentation on _how to write a custom rule_, but there is documentation on _working with rules_, in general. This means that you kind of have to examine the latter, to figure out how to write one. Click [here](https://eslint.org/docs/developer-guide/working-with-rules) to check out the _Working with Rules_ section of the ESLint documentation.

The ESLint documentation talks about rules optionally being able to "fix" things. The ``js-copyright`` custom rule does not try to fix errors in the Oracle copyright notice. It simply reports that the expected regex match did not happen. The underlying reason could be a misspelled word, case-sensitivity or additional/missing whitespace. It does nt try to figure out which of those is true, but additional regex patterns (or code that performs the Levenshtein Distance algorithm) could be added to do that, if so desired. 

Care should be taken when modifying the ``<REPO_HOME>/frontend/.eslintrc.js`` file because:
 
1. The ESLint CLI will typically just generate a JavaScript stacktrace when it's not able to pass control to a custom rule. That stacktrace may or may not be useful for debugging purposes.
2. The ``js-copyright`` custom rule does not try to double as a "regex pattern validator". If there's something wrong with a regex pattern under the ``regexPatterns`` property in ``<REPO_HOME>/frontend/.eslintrc.js``, a JavaScript Error will occur when it gets passed as an argument to the built-in ``RegExp(pattern)`` JavaScript function. When that happens, you will need to figure out how to correct the regex pattern using your own experience, or the Internet.

Finally, the ESLint CLI can only process ``.html`` files that have a ``<script></script>`` tag in them. This restriction is passed down to custom rules that the ESLint CLI runs. None of the ``.html`` files under the ``<REPO_HOME>/src/js/view`` folder have ``<script></script>`` tags in them, so the ``js-copyright`` custom rule cannot be used on them. 

We experimented with just writing a JavaScript module that would run on ``node``, and produce output that looked like the ``html`` format ESLint report, but it was too complex and would have required a lot more effort to make it "appear to be" an ESLint custom rule.