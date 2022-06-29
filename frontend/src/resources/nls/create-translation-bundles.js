/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

const fs = require('fs'),
  path = require("path"),
  yargs = require('yargs');

/**
 * Returns an array of file paths, which end with a file name.
 * @param {string} startPath - Base directory to start search from
 * @param {string} filter - File extension to filter the files selected 
 * @returns {Array} - An array of file paths, which end with a file name. An empty array will be returned, if ``filter`` eliminates the select of any files.
 */
function findFileNames(startPath, filter) {
  let results = [];
  filter = filter || "";

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
        results = results.concat(findFileNames(filename, filter)); //recurse
      }
      else if (filename.endsWith(filter)) {
//        console.log(`filename=${filename}`);
        results.push(filename);
      }
    }
  }

  return results;
}

/**
 * Returns a JSON object that is a merge of ``source`` into ``destination``.
 * <p>This function is called recursively.</p>
 * @param {map} destination - The JS object for the _merge into_ JS object
 * @param {map} source - The JS object to _merge with_ the ``destination`` JS object   
 * @returns {map} - A JSON object that is a merge of ``source`` into ``destination``
 */
function mergeJSObjects(destination, source) {
  const sources = [].slice.call( arguments, 0 );

  sources.forEach((source) => {
    for (let prop in source ) {
      if (source.hasOwnProperty(prop)) {
        if (prop in destination && Array.isArray(destination[prop])) {
          // Concat Arrays
          destination[prop] = destination[prop].concat(source[prop] );
        }
        else if (prop in destination && typeof destination[prop] === "object" ) {
          // Merge Objects
          destination[prop] = mergeJSObjects(destination[prop], source[prop]);
        }
        else {
          // Set new values
          destination[prop] = source[prop];
        }
      }
    }
  });

  return destination;
}

/**
 * Returns contents of a resource bundle associated with ``filePath``.
 * @param {string} filePath 
 * @returns {string} - contents of a resource bundle associated with ``filePath``.
 * @throws Error - If an Error occurs while attempting to read ``filePath``
 */
function readResourceBundle(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Converts entries in a ``frontend[(_A-Za-z)+].properties`` file into an array of JS objects.
 * @param {string} text - The contents of the ``frontend[(_A-Za-z)+].properties`` file
 * @return {Array}
 */
function convertPropertiesFileToJSObject(text) {
  /**
   * Returns ``text`` with all of the blank lines removed
   * <p>Replace all regex looks for \r\n and \r, so will work on both Linux and Windows platforms.</p>
   * @param {string} text - String to remove blank lines from. 
   * @returns {string} - ``text`` with all of the blank lines removed, or whatever the value of ``test`` was when it was passed as an argument.
   */
  function removeBlankLines(text) {
    if (typeof text !== "undefined" && text !== null) {
      const regex = /^(?:[\t ]*(?:\r?\n|\r))+/g;
      if (regex.test(text)) {
        text = text.replaceAll(regex, '');
      }
    }
    return text;
  }

  /**
   * Returns ``text`` with all of the commented lines removed
   * @param {string} text
   * @returns {string} - ``text`` with all of the commented lines removed
   */
  function removeCommentLines(text) {
    const regex = /^\s*#/g;
    if (regex.test(text)) {
      text = text.replaceAll(regex, '');
    }
    return text;
  }

  /**
   * Converts a property file entry to a JS object.
   * <p>The dotted property name is converted to a tree of JS objects, where the innermost JS object is assigned the property value.</p>
   * @param {string} property - A line from a ``frontend[_A-Za-z].properties`` file, where the property name contains dot (.) characters.
   * @returns {object} - A tree of JS objects, where the innermost JS object is assigned the property value.
   * @throws {Error} - If ``property`` doesn't contain an equal sign.
   */
  function convertPropertyToJSObject(property) {
    let container, jsObject = {};
    // Set container to be a reference to jsObject
    container = jsObject;
    let keyValues = property.split("=");
    if (typeof keyValues === "undefined") {
      throw new Error("Property entry does not contain an equal sign ('=') character!");
    }
    // Remove any '' array items
    keyValues = keyValues.filter(x => x !== '');
    // keyValues[0] contains the dotted property
    // name, and keyValues[1] contains the property
    // value.
    const value = keyValues[1];
    // Create an array from the dotted property name
    const propNameParts = keyValues[0].split(".");
    if (typeof propNameParts === "undefined") {
      throw new Error("Name portion of property entry did not contain a dot ('.') character!");
    }
    let unicodeString;
    // Loop through the array, creating a map where
    // the array item (which is a string) is used as
    // the key, and the value is {} or keyValues[1].
    propNameParts.map((k, i, values) => {
      // Use decodeURIComponent to ensure unicode
      // characters (e.g. \u00E8) in keyValues[1],
      // get converted into a displayable character.
      if (i === values.length - 1) {
        unicodeString = decodeURIComponent(JSON.parse('"' + value.replace(/\"/g, '\\"') + '"'));
      }
      else {
        unicodeString = {};
      }
      // Update container, which because it is a reference
      // to jsObject, updates that as well.
      container = (container[k] = unicodeString);
    });

    return jsObject;
  }

  text = removeBlankLines(text);
  text = removeCommentLines(text);

  // Declare array used to store JS object created
  // from the dotted name of the property entry.
  const jsObjectArray = [];
  // Create array containing each property entry in
  // text. Use '/\r?\n/' as the regex expression for
  // the split, so the code works on both Windows and
  // non-Windows platforms
  const properties = text.split(/\r?\n/).filter(x => x !== '');
  // Loop through each property entry in the array
  properties.forEach((property) => {
    // Call function that converts the property entry
    // to a JS object
    const jsObject = convertPropertyToJSObject(property);
    // Put the JS object in array that will subsequently
    // be used to merge all the JS objects, into a single
    // JS document.
    jsObjectArray.push(jsObject);
  });

  // Declare JS object used as the single JS document that
  // is the return variable for this function.
  let jsObjectDocument = {};
  if (jsObjectArray.length > 1) {
    // There are at least 2 JS objects in the array, so
    // merge them together to form the initial contents of
    // the single JS document
    jsObjectDocument = mergeJSObjects(jsObjectArray[0], jsObjectArray[1]);
    // Loop through the remaining JS objects in the array,
    // merging each with the current contents of the single
    // JS document.
    for (let i = 2; i < jsObjectArray.length; ++i) {
      jsObjectDocument = mergeJSObjects(jsObjectDocument, jsObjectArray[i]);
    }
  }

  return jsObjectDocument;
}

/**
 * Returns an array of locale codes built from an array of file names.
 * <p>The assumption is that the file names contain a locale code. For e.g.: frontend_<b>ar_XB</b>.properties. Here, the <i>ar_XB</i> would be converted to <i>ar-AB</i>, and be added to the array returned from the function.</p>
 * @param {Array} filenames
 * @returns {Array}
 */
function getLocaleCodes(filenames) {
  const regex = /_([A-Za-z_]+)/g;
  const localeCodes = [], matched = [...filenames.join().matchAll(regex)];
  matched.forEach((match) => {
    // The properties files use "_" characters
    // in the locale code, but JET uses a "-"
    // character. This means we need to change
    // the "_" to a "-", before we put it in
    // the localeCodes array.
    localeCodes.push(match[1].replace("_", "-"));
  });
  return localeCodes;
}

/**
 * Writes a translation bundle to location specified in ``fileSpec``.
 * <p>The file will be written using the 744 permission mask. The path specified in <code>fileSpec.mkdirPath</code> will be created, if it doesn't already exist.</p>
 * @param {object} translationBundle
 * @param {{mkdirPath: Array, fileName: string}} fileSpec
 */
function writeTranslationBundle(translationBundle, fileSpec) {
  const path = fileSpec.mkdirPath.join("/");
  if (!fs.existsSync(path)){
    fs.mkdirSync(path, 0o744);
  }
  fs.writeFileSync(
    `${path}/${fileSpec.fileName}`, 
    `define(${JSON.stringify(translationBundle, null, 2)});`
  );
}

/**
 * Returns either the localeCode in ``inputFileName`` or an empty string.
 * @param {string} inputFileName
 * @returns {string} - Either the localeCode in ``inputFileName`` or an empty string.
 */
function getLocaleCode(inputFileName) {
  // Regex for capturing locale code
  const regex = /_([A-Za-z_]+)/;
  const matched = inputFileName.match(regex);
  // If match was found, then replace the
  // "_" character with a "-".
  return (matched !== null ? matched[1].replace("_", "-") : "");
}

/**
 * Adds a "root" JS object and supported locale codes JS objects to ``jsObjectDocument``
 * @param {object} jsObjectDocument
 * @param {Array} localeCodes
 * @returns {object} - ``jsObjectDocument`` wrapped in a "root" JS object, which has supported locale codes JS objects as siblings
 */
function createRootTranslationBundle(jsObjectDocument, localeCodes) {
  // This means we're doing a root translation
  // bundle, so assign jsObjectDocument to an object
  // named "root".
  jsObjectDocument = {"root": jsObjectDocument};

  // The "root" and supported locale JS objects,
  // need to be siblings. For example:
  //
  // {
  //   "root": {},
  //   "ar-XB": false,
  //   "de": true,
  //   "en-XA": false,
  //   "en-XC": false,
  //   "es": true,
  //   "fr": false,
  //   "it": false,
  //   "ja": false,
  //   "ko": false,
  //   "pt-BR": false,
  //   "zh-CN": false,
  //   "zh-TW": false
  // }
  localeCodes.forEach((localeCode) => {
    jsObjectDocument[localeCode] = (["de", "es", "fr", "it"].includes(localeCode));
  });

  return jsObjectDocument;
}

/**
 * Creates JET NLS translation bundles using specified parameters.
 * @param {string} pathParam - File path for the directory containing the resource bundles, or a specific resource bundle
 * @param {string} outputParam - File path for directory to create the translation bundles in, or a specific translation bundle
 */
function createTranslationBundles(pathParam, outputParam) {
  /**
   * Returns a JS object containing the path parts of ``outputFilePath``, and the name of the output file
   * @param {string} outputFilePath - Path to where the output file, as either a directory or file
   * @param {string} inputFileName - Name of the input file name, which may or may not contain a locale code
   * @returns {{mkdirPath: Array, fileName: string}} - A JS object containing the path parts of ``outputFilePath``, and the name of the output file
   */
  function getOutputFileSpec(outputFilePath, inputFileName) {
    // The locale code is specified in the file name of
    // a resource bundle. Call getLocaleCode() to extract
    // it, if this is the case, because we need to add
    // it to the mkdirPath field of the return variable.
    const tempPath = outputFilePath + "/" + getLocaleCode(inputFileName);
    // Create an array from outputFilePath and remove any
    // array elements that equal an empty string.
    let pathParts = tempPath.split("/").filter(x => x !== ''); 
    // See if the output path is for a file, as opposed
    // to a directory.
    const pathPart = pathParts.filter(pathPart => pathPart.includes(".js"));
    const index = pathParts.indexOf(pathPart[0]);
    if (index !== -1) {
      // It is for a file, so remove it from the pathParts
      // array.
      pathParts.splice(index, 1);
    }  

    return {mkdirPath: pathParts, fileName: "frontend.js"};
  }

  let translationBundle;

  // Get the file names of all the resource bundles,
  // without regard for the input or output params.
  let filenames = findFileNames('src/resources/nls', '.properties');
  // Populate an array with the locale codes that
  // where extracted from the file names.
  const localeCodes = getLocaleCodes(filenames);
  // Now, get the file names specified using the
  // value of the pathParam parameter.
  filenames = findFileNames(pathParam, '.properties');
  // Loop through the file names in the array
  filenames.forEach((filename, index) => {
    // Read contents of filename as UTF-8 text
    const text = readResourceBundle(filenames[index]);
    // Convert property entries into a JS
    // object, which is the result of merging
    // an array of JS objects together.
    translationBundle = convertPropertiesFileToJSObject(text);

    const localeCode = getLocaleCode(filename);
    if (localeCode === "" && localeCodes.length > 0) {
      // This means we're creating a "root"
      // translation bundle, not a "base" or
      // "regional dialect" translation bundle.
      translationBundle = createRootTranslationBundle(translationBundle, localeCodes);
    }

    // Get output path information that will be used
    // when writing out the translation bundle file.
    const fileSpec = getOutputFileSpec(outputParam, filename);

    // Write the translation bundle out using the
    // data in result (e.g. path to create if not already
    // present, name for the file, etc.)
    writeTranslationBundle(translationBundle, fileSpec);
  });
}

function getParams() {
  const argv = yargs
    .options({
      'path': {describe: 'Directory where resource bundles (.properties files) are located, or an individual resource bundle (.properties file) to use for input.', default: 'src/resources/nls/frontend.properties', alias: 'p'},
      'output': {describe: 'Directory where translation bundles (.js files), or an individual translation bundle (.js file) is written to.', default: 'src/js/resources/nls/frontend.js', alias: 'o'}
    })
    .help()
    .alias('help', 'h')
    .alias('version', 'v')
    .argv;

  return {
    path: argv.path,
    output: argv.output
  };
}

function main() {
  const params = getParams();
  console.log(`params.path=${params.path}, params.output=${params.output}`);
  let exitCode = 0;
  try {
    createTranslationBundles(params.path, params.output);
  }
  catch(reason) {
    console.log(reason.stack);
    exitCode = 2;
  }
  console.log(`exit code=${exitCode}`);
  return exitCode;
}

// node src/resources/nls/create-translation-bundles.js -p src/resources/nls -o src/js/resources/nls
// node src/resources/nls/create-translation-bundles.js -o .
// node src/resources/nls/create-translation-bundles.js -p src/resources/nls
// node src/resources/nls/create-translation-bundles.js -p src/resources/nls/frontend.properties -o .
// node src/resources/nls/create-translation-bundles.js -p src/resources/nls/frontend_ar_XB.properties -o .
// node src/resources/nls/create-translation-bundles.js -p src/resources/nls/frontend.properties -o src/js/resources/nls
process.exitCode = main();