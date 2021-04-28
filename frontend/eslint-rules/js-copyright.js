/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

// ----------------
// Rule Definition
// ----------------

// "js-copyright": [1, { "regexCopyright": 'regex-pattern' }]
//
// "rules": {
//    "js-copyright": "error"
// }
//
module.exports = {
  meta: {
    type: "problem",
    fixable: "whitespace",
    schema: [
      {
        type: "object",
        properties: {
          regexPatterns: {
            type: "object",
            properties: {
              startLine: {
                type: "string",
                default: "^\\/\\*\\*\\s*"
              },
              licenseTag: {
                type: "string",
                default: "\\s*\\*\\s*@license"
              },
              copyrightLine: {
                type: "string",
                default: "\\s*\\*\\s*Copyright\\s*\\(c\\)\\s*[\\s*\\d{4}|\\d{4}\\-\\d{4}|\\d{4},]+[ ,|]\\s*Oracle[ |Corporation]+and\\/or its affiliates."
              },
              uplLine: {
                type: "string",
                default: "\\s*\\*\\s*The Universal Permissive License \\(UPL\\), Version 1\\.0"
              },
              ignoreTag: {
                type: "string",
                default: "\\s*\\*\\s*@ignore"
              },
              endLine: {
                type: "string",
                default: "\\s*\\*\\/"
              },
              licenseWord: {
                type: "string",
                default: "\\s*@license"
              },
              copyrightWord: {
                type: "string",
                default: "\\s*Copyright"
              }
            }
          },
          validCopyright: {
            type: "string",
            default: "/**\n * @license\n * Copyright (c) 2020, 2021 Oracle Corporation and/or its affiliates.\n * The Universal Permissive License (UPL), Version 1.0\n * @ignore\n */\n"
          }
        }
      }
    ],
    messages: {
      "missingCopyright": "Oracle copyright missing from {{fileType}} file.",
      "startLineError": "First line of .js file does not begin with /**.",
      "licenseTagError": "@license tag missing or in the wrong location. Change second line to ' * @license'",
      "copyrightLineError": "Copyright line is incorrect or in the wrong location. Change second line to ' * Copyright (c) 2021 ${0} ${1} and/or its affiliates.' ${0} must be in ('2020', '2020,', '2021', '2021,'). ${1} must be in ('Oracle', 'Oracle Corp', 'Oracle Corp.', 'Oracle Corporation').",
      "uplLineError": "Universal Permissive License (UPL) line is incorrect or in the wrong location. Change fourth line to ' * The Universal Permissive License (UPL), Version 1.0'",
      "ignoreTagError": "@ignore tag missing or in the wrong location. Change fifth line to ' * @ignore'",
      "endLineError": "Last line of .js file is not */, or is in the wrong location. Change sixth line to '*/'"
    }
  },

  create(context) {
    const config = Object.assign({}, context.options[0]);
    const sourceCode = context.getSourceCode();
    const levenshtein = require('./js-levenshtein');
    const os = require('os');
    console.log(`platform=${os.platform()}`);
    const eolChars = (os.platform() === "win32" ? "\r\n" : "\n");
    console.log(`eolChars=${eolChars}`);

    function computeFixRanges(text) {
      let ranges = [], solIndex, eolIndex = -1;

      solIndex = text.indexOf('/**');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "startLine", text: `/**${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      solIndex = text.indexOf(' * @license');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "licenseTag", text: ` * @license${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      solIndex = text.indexOf(' * Copyright (c) 2020, 2021 Oracle and/or its affiliates.');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "copyrightLine", text: ` * Copyright (c) 2020, 2021 Oracle and/or its affiliates.${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      solIndex = text.indexOf(' * The Universal Permissive License (UPL), Version 1.0');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "uplLine", text: ` * The Universal Permissive License (UPL), Version 1.0${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      solIndex = text.indexOf(' * @ignore');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "ignoreTag", text: ` * @ignore${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      solIndex = text.indexOf(' */');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "endLine", text: ` */${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      return ranges;
    }

    function computeActualRanges(text) {
      let ranges = [], solIndex, eolIndex = -1;

      solIndex = text.indexOf('/**');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "startLine", text: `${text.substring(solIndex, eolIndex)}${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      solIndex = text.indexOf(' * @license');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "licenseTag", text: `${text.substring(solIndex, eolIndex)}${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      solIndex = text.indexOf(' * Copyright');
      if (solIndex !== -1 ) {
        eolIndex = text.indexOf(eolChars, solIndex);
        if (eolIndex !== -1) {
          ranges.push(
            {key: "copyrightLine", text: `${text.substring(solIndex, eolIndex)}${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
          );
        }
      }
      else {
        ranges.push(
          {key: "copyrightLine", text: ` * Copyright (c) 2020, 2021 Oracle and/or its affiliates.${eolChars}`, solIndex: -1, eolIndex: -1}
        );
      }

      solIndex = text.indexOf(' * The Universal Permissive License (UPL), Version 1.0');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "uplLine", text: `${text.substring(solIndex, eolIndex)}${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      solIndex = text.indexOf(' * @ignore');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "ignoreTag", text: `${text.substring(solIndex, eolIndex)}${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

      solIndex = text.indexOf(' */');
      if (solIndex !== -1 ) eolIndex = text.indexOf(eolChars, solIndex);
      ranges.push(
        {key: "endLine", text: `${text.substring(solIndex, eolIndex)}${eolChars}`, solIndex: solIndex, eolIndex: eolIndex}
      );

//      console.log(`text=${text}\nrange=[0, ${eolIndex}]`);
      return ranges;
    }

    function isLinePresent(lineKey, lineText) {
      const regex = new RegExp(config.regexPatterns[lineKey]);
      return regex.test(lineText);
    }

    function isWordInLine(wordKey, lineText) {
      const regex = new RegExp(config.regexPatterns[wordKey]);
      return regex.test(lineText);
    }

    function reportError(range, messageId) {
      context.report({
        loc: {start: range.solIndex, end: range.eolIndex},
        messageId: messageId,
      });
    }

    return {
      Program() {
        const fixRanges = computeFixRanges(config.validCopyright);
        let lineText = sourceCode.getText().substring(fixRanges[0].solIndex, fixRanges[0].eolIndex);

        if (!isLinePresent(fixRanges[0].key, lineText)) {
          // There is no  /** on the first line of .js file,
          // so insert a complete copyright
          context.report({
            node: sourceCode.ast,
            messageId: "missingCopyright",
            data: {
              fileType: ".js",
            }
          });
        }

        if (isLinePresent(fixRanges[0].key, lineText)) {
          // Any deviation from config.validCopyright after
          // the first line, is an error. Deviations are
          // determined by a regex pattern testing, where
          // any deviation (including not being on the
          // correct line) results in an error being
          // reported.

          const eolIndex = sourceCode.getText().indexOf(" */", 0);
          const actualRanges = computeActualRanges(sourceCode.getText().substring(0, eolIndex + ' */\n'.length));

          for (let i = 1; i < actualRanges.length; i++) {
            lineText = actualRanges[i].text;
//            console.log(`lineKey=${actualRanges[i].key}, lineText=${lineText}`);
            if (!isLinePresent(actualRanges[i].key, lineText)) reportError(actualRanges[i],`${actualRanges[i].key}Error`);
          }
        }
      }
    }
  }
};
