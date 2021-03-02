/**
 * @license
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

const fs = require('fs'), path = require('path'), yargs = require('yargs');

const regexPatterns = {
  startLine: "^\\/\\*\\!\\s*",
  copyrightLine: "\\s*Copyright\\s*\\(c\\)\\s*[\\s*\\d{4}$|\\d{4}$\\-\\d{4}$|\\d{4}$,]+[ ,|]\\s*Oracle[ |Corporation|Corp|Corp\\.]+and\\/or its affiliates. All rights reserved.",
  endLine: "\\s*\\*\\/"
};

const validCopyright = "/*! Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved. */\n";

const messages = {
  "missingCopyright": "Oracle copyright missing from .css file.",
  "startLineError": "First line of .css file does not begin with /*!.",
  "copyrightLineError": "Copyright and legal sentences are incorrect. Change it to 'Copyright (c) ${0} ${1} and/or its affiliates. All rights reserved.' ${0} must be in ('2020', '2020,'). ${1} must be in ('Oracle', 'Oracle Corp', 'Oracle Corp.', 'Oracle Corporation').",
  "endLineError": "First line of .css file does not end with */."
};

function findFileNames(startPath, filter, excludePaths) {
  let results = [];

  if (excludePaths.includes(startPath)) return results;

  let stat = fs.lstatSync(startPath);

  if (!stat.isDirectory()) {
    results.push(startPath);
  }
  else {
    const files = fs.readdirSync(startPath);
//  console.log(`startPath=${startPath}, files.length=${files.length}`);
    for (let i = 0; i < files.length; i++) {
      const filename = path.join(startPath, files[i]);
      stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        results = results.concat(findFileNames(filename, filter, excludePaths)); //recurse
      }
      else {
//        console.log(`filename=${filename}`);
        if (filename.endsWith(".css")) results.push(filename);
      }
    }
  }

  return results;
}

function fixCopyright(filepath, text, fixRanges) {
  let reportEntries = [{loc: '0:0', errorMessage: ''}];
  const lineText = text.substring(fixRanges[0].solIndex, fixRanges[0].eolIndex);
//  console.log(`lineText=${lineText}`);
  if (!isLinePresent(fixRanges[0].key, lineText)) {
    // There is no  <!-- on the first line of .html file,
    // so insert a complete copyright
    text = `${validCopyright}${text}`;
    fs.writeFileSync(filepath, text);
  }
  return reportEntries;
}

function checkForCopyright(text, fixRanges) {
  let reportEntries = [];
  let lineText = text.substring(fixRanges[0].solIndex, fixRanges[0].eolIndex);
//  console.log(`lineText=${lineText}`);
  if (!isLinePresent(fixRanges[0].key, lineText)) {
    reportEntries.push({loc: '1:1', errorMessage: messages['missingCopyright']});
  }
  else {
    // Any deviation from validCopyright after
    // the first line, is an error. Deviations are
    // determined by a regex test, and consider
    // mis-location to be an error.

    const eolIndex = text.indexOf(" */", 0);
    const actualRanges = computeActualRanges(text.substring(0, eolIndex + ' */\n'.length));

    for (let i = 1; i < actualRanges.length; i++) {
      lineText = actualRanges[i].text;
//      console.log(`lineKey=${actualRanges[i].key}, lineText=${lineText}`);
      if (!isLinePresent(actualRanges[i].key, lineText)) {
        reportEntries.push({loc: `${i}:1`, errorMessage: messages[`${actualRanges[i].key}Error`]});
      }
    }
  }

  return reportEntries;
}

function processFileNames(params, filenames) {
  const reportFeeder = { problemsCount: 0, entries: []};

  filenames.forEach(function (filename) {
    let reportEntries = [];

    try {
      const text = fs.readFileSync(filename, 'utf8');
      const fixRanges = computeFixRanges(validCopyright);
      if (params.fix) {
        reportEntries = fixCopyright(filename, text, fixRanges);
      }
      else {
        reportEntries = checkForCopyright(text, fixRanges);
      }
    }
    catch (e) {
      console.log('Error:', e.stack);
    }

    let entry = reportFeeder.entries.find(entry => entry.path === filename );
    if (typeof entry === "undefined") {
      entry = {path: filename, problems: []};
    }
    if (reportEntries.length > 0) {
      entry.problems = reportEntries;
    }
    reportFeeder.entries.push(entry);
    reportFeeder.problemsCount += entry.problems.length;
  });

  return reportFeeder;
}

// node src/js/eslint-rules/css-copyright.jsx --path src/css
// node src/js/eslint-rules/css-copyright.jsx --fix --path src/css
// node src/js/eslint-rules/css-copyright.jsx --path src/css/app.css
// node src/js/eslint-rules/css-copyright.jsx --fix --path src/css/app.css
// node src/js/eslint-rules/css-copyright.jsx -o css-copyright.html --path src/css
// node src/js/eslint-rules/css-copyright.jsx -o css-copyright.html --fix --path src/css/app.css
function getParams() {
  const argv = yargs
    .options({
      'fix': {describe: 'Fix by adding copyright to top of .css file.'},
      'path': {describe: 'Directory to start checking from, or an individual file to check.', demandOption: true},
      'exclude': {describe: 'Comma-delimited list of directories to exclude when checking.', default: 'src/css/redwood', alias: 'e'},
      'output': {describe: 'Path to output .html file to write results in.', default: 'eslint-css.html', alias: 'o'}
    })
    .help()
    .alias('help', 'h')
    .alias('version', 'v')
    .argv;

  return {
    fix: (typeof argv.fix !== "undefined"),
    path: argv.path,
    output: (!argv.output.includes('.htm') ? argv.output + '.html' : argv.output),
    exclude: argv.exclude
  };
}

function main() {
  const params = getParams();
  console.log(`params.fix=${params.fix}, params.path=${params.path}, params.output=${params.output}, params.exclude=${params.exclude}`);
  const excludePaths = params.exclude.split(',');
  const filenames = findFileNames(params.path, '.css', excludePaths);
  const reportFeeder = processFileNames(params, filenames);
//  console.log(`reportFeeder=${JSON.stringify(reportFeeder)}`);
  process.exitCode = (reportFeeder.problemsCount > 0 ? 1 : 0);
  const htmlTemplate = getHtmlTemplate('eslint-html.template');
  writeResultsHtml(reportFeeder, htmlTemplate, params.output);
}

function getHtmlTemplate(filepath) {
  let htmlTemplate;
  try {
    htmlTemplate = fs.readFileSync(filepath, 'utf8');
  }
  catch (e) {
    console.log('Error:', e.stack);
  }
  return htmlTemplate;
}

function writeResultsHtml(reportFeeder, htmlTemplate, outputFilepath){
  const reportDateTime = new Date();

  const overview = '<div id="overview" class="' + (reportFeeder.problemsCount > 0 ? 'bg-2' : 'bg-0') + '">';
  htmlTemplate = htmlTemplate.replace('<!-- overview -->', overview);

  let pluralize = (reportFeeder.problemsCount === 1 ? '' : 's');
  const problemSummary = '<span>' + reportFeeder.problemsCount + ' problem' + pluralize + ' (' + reportFeeder.problemsCount + ' error' + pluralize + ')</span> - Generated on ' + reportDateTime;
  htmlTemplate = htmlTemplate.replace('<!-- problemSummary -->', problemSummary);

  let htmlTR = '';

  reportFeeder.entries.forEach((entry, index) => {
    const problemsCount = entry.problems.length;
    const dataGroup = `f-${index}`;
    pluralize = (problemsCount === 1 ? '' : 's');
    htmlTR += '<tr class="' + (problemsCount > 0 ? 'bg-2' : 'bg-0') + '" data-group="' + dataGroup + '">';
    htmlTR += '<th colspan="4">';
    htmlTR += '[+] ' + entry.path;
    htmlTR += '<span>' + problemsCount + ' problem' + pluralize + ' (' + problemsCount + ' error' + pluralize + ')</span>';
    htmlTR += '</th>';
    htmlTR += '</tr>';

    if (problemsCount > 0) {
      entry.problems.forEach((problem) => {
        htmlTR += '<tr style="display:none" class="' + dataGroup + '">';
        htmlTR += '<td>' + problem.loc + '</td>';
        htmlTR += '<td class="clr-2">Error</td>';
        htmlTR += '<td>' + problem.errorMessage + '</td>';
        htmlTR += '<td>';
        htmlTR += '<a href="#">css-copyright.jsx</a>';
        htmlTR += '</td>';
        htmlTR += '</tr>';
      });
    }
  });

  htmlTemplate = htmlTemplate.replace('<!-- htmlTR -->', htmlTR);

  fs.writeFileSync(outputFilepath, htmlTemplate);
}

function computeFixRanges(text) {
  let ranges = [], solIndex, eolIndex = -1;

  solIndex = text.indexOf('/*! ');
  if (solIndex !== -1) eolIndex = text.indexOf(' ', solIndex);
  ranges.push(
    {key: "startLine", text: "/*! ", solIndex: solIndex, eolIndex: eolIndex}
  );

  solIndex = text.indexOf('Copyright');
  if (solIndex !== -1) eolIndex = text.indexOf(' reserved.', solIndex);
  ranges.push(
    {
      key: "copyrightLine",
      text: "Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.",
      solIndex: solIndex,
      eolIndex: eolIndex + " reserved.".length
    }
  );

  solIndex = text.indexOf(' */');
  if (solIndex !== -1) eolIndex = text.indexOf('\n', solIndex);
  ranges.push(
    {key: "endLine", text: " */\n", solIndex: solIndex, eolIndex: eolIndex}
  );

  return ranges;
}

function computeActualRanges(text) {
  let ranges = [], solIndex, eolIndex = -1;

  solIndex = text.indexOf('/*! ');
  if (solIndex !== -1) eolIndex = text.indexOf(' ', solIndex);
  ranges.push(
    {key: "startLine", text: `${text.substring(solIndex, eolIndex)}`, solIndex: solIndex, eolIndex: eolIndex}
  );

  solIndex = text.indexOf('Copyright');
  if (solIndex !== -1) {
    eolIndex = text.indexOf(' reserved. ', solIndex);
    if (eolIndex !== -1) {
      eolIndex += " reserved.".length
      ranges.push(
        {
          key: "copyrightLine",
          text: `${text.substring(solIndex, eolIndex)}`,
          solIndex: solIndex,
          eolIndex: eolIndex
        }
      );
    }
  } else {
    ranges.push(
      {
        key: "copyrightLine",
        text: "Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.",
        solIndex: -1,
        eolIndex: -1
      }
    );
  }

  solIndex = text.indexOf(' */');
  if (solIndex !== -1) eolIndex = text.indexOf('\n', solIndex);
  ranges.push(
    {key: "endLine", text: `${text.substring(solIndex, eolIndex)}\n`, solIndex: solIndex, eolIndex: eolIndex}
  );

//  console.log(`text=${text}range=[0, ${eolIndex}]`);
  return ranges;
}

function isLinePresent(lineKey, lineText) {
  const regex = new RegExp(regexPatterns[lineKey]);
  return regex.test(lineText);
}

main();
