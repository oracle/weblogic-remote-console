/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

/**
 * # Dependencies
 */
/* 3rd party */
const fs = require('fs-extra');
const glob = require('glob');
const terser = require('terser');

const _ = {};
_.mergeWith = require('lodash.mergewith');

/* Node.js native */
const http = require('http');
const https = require('https');
const childProcess = require('child_process');
const path = require('path');
const StringDecoder = require('string_decoder').StringDecoder;
const url = require('url');

const { performance, PerformanceObserver } = require('perf_hooks');

/* Oracle */
const constants = require('./constants');
const exchangeUtils = require('./utils.exchange');
const config = require('./config');
const validate = require('./validations');

/**
 * # Utils
 *
 * @public
 */
const util = module.exports;

util.rootPath = __dirname;

util.convertJsonToObject = (string) => {
  let obj;
  try {
    obj = JSON.parse(string);
    // If came to here, then valid json
  } catch (e) {
    util.log.error(`String '${string}' is not valid 'json'.`);
  }
  return obj;
};

util.validateSassInstall = () => validate.sassInstall();

util.hasJsdocInstalled = function () {
  const hasJsdocPackageJson = util.getModulePath(
    path.join(
      'node_modules',
      'jsdoc',
      'package.json'
    ),
    'jsdoc'
  );

  if (hasJsdocPackageJson) {
    return true;
  }
  return false;
};

/**
 * get the minified component path.
 * @private
 * @param {String} path to component
 * @returns the minified componentPath
 */
util.getComponentDest = function (componentPath) { // eslint-disable-line
  return path.join(componentPath, 'min');
};

/**
 * @private
 * @param {Object} context
 * @returns an updated config object.
 */
util.processContextForHooks = function (context) {
  //
  // Assemble the necessary environment variables for writing hooks
  // Create hooks context from context parameter.
  // Note that "ojet build" defines the .platform, .opts, and .buildType properties,
  // while ojet build component" defines the componentConfig property.
  // We ensure idempotence by checking for 'known' properties that
  // could have previously been copied in from opts (see the else if conditions).
  //
  // Allow hooks to modify contents of context by making it the same object
  // We used to copy up and over specific proprties.
  const obj = context;
  if (context) {
    if (context.opts && context.opts.theme) {
      obj.theme = context.opts.theme;
    } else if (context.theme) {
      obj.theme = context.theme;
    }

    if (context.opts && context.opts.userOptions) {
      obj.userOptions = context.opts.userOptions;
    }

    // requireJs properties can now be modified by the user in the before_optimize hook.
    if (context.opts && context.opts.requireJs) {
      obj.requireJs = context.opts.requireJs;
    }

    // Component requireJs properties can now be modified
    // by the user in the before_component_optimize hook.
    if (context.opts && context.opts.componentRequireJs) {
      obj.componentRequireJs = context.opts.componentRequireJs;
    }

    if (context.opts && context.opts.typescript) {
      obj.typescript = context.opts.typescript;
    }

    if (context.opts && context.opts.webpack) {
      obj.webpack = context.opts.webpack;
    }
  }

  const _config = require('./config'); // eslint-disable-line global-require
  const configPaths = _config('paths');
  if (obj) {
    obj.paths = configPaths;
  }
  return obj;
};

/**
 * ## templatePath
 * Determines the templatePath.
 *
 * @public
 * @param {String} rootDir
 * @returns {String} The path of where this script lives.
 * Getting the src when copying hooks from this module.
 */
util.templatePath = function (rootDir) {
  const templatePath = rootDir || '';
  return path.resolve(__dirname, '..', templatePath);
};

/**
 * ## destPath
 * Determines the destinationPath.
 *
 * @public
 * @param  {String} rootDir
 * @returns {String} The path to appDir directory.
 */
util.destPath = function (rootDir) {
  const destPath = rootDir || '';
  return path.resolve(_getDestCwd(), destPath);
};

/**
 * ## posixPattern
 * Convert paths to '/'
 *
 * @param {*} pattern
 */
util.posixPattern = function (pattern) {
  return pattern.split(path.sep).join(path.posix.sep);
};

/**
 * ## _getDestCwd
 *
 * @private
 * @returns {String}
 */
function _getDestCwd() {
  return process.cwd();
}

/**
 * ## deleteDir
 * Recursive removal, still not built-in officially
 *
 * @public
 * @param {string} dirPath
 */
util.deleteDirSync = function (dirPath) {
  if (fs.existsSync(dirPath)) {
    util.readDirSync(dirPath).forEach((file) => {
      const curPath = `${dirPath}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        util.deleteDirSync(curPath);
      } else { // delete file
        util.deleteFileSync(curPath);
      }
    });
    util.deleteFsSync(dirPath, 'dir');
  }
};

/**
 * ## deleteFileSync
 *
 * @public
 * @param {string} dirPath
 * @param {boolean} noexit on failure if set
 */
util.deleteFileSync = function (source, noexit) {
  util.deleteFsSync(source, 'file', noexit);
};

/**
 * ## deleteFsSync
 * https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_rmdirsync_path
 * https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_unlinksync_path
 *
 * @public
 * @param {string} source
 * @param {'dir' | 'file'} type
 * @param [boolean} don't exit on failure if set
 */
util.deleteFsSync = function (source, type, noexit) {
  try {
    switch (type) {
      case 'dir':
        fs.rmdirSync(source);
        break;
      case 'file':
        fs.unlinkSync(source);
        break;
      default:
        util.log.error(`Unsupported '${type}' file system type.`);
    }
  } catch (error) {
    util.log.error(error, undefined, noexit);
  }
};

/**
 * ## ensureDir
 * Check if directory exists. If not, create it.
 *
 * @public
 * @param {string} dirPath - Path to check
 */
util.ensureDir = function (dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * ## ensureParameters
 *
 * @public
 * @param {string || Array} parameters
 */
util.ensureParameters = function (parameters, apiName) {
  if (typeof parameters === 'undefined' || (typeof parameters === 'object' && parameters.length === 0)) {
    util.log.error(`Please specify parameters for ojet.${apiName}()`);
  }
};

/**
 * ## ensurePathExists
 *
 * @public
 * @param {Array} parameters
 */
util.ensurePathExists = function (pathTo) {
  if (!fs.fsExists(pathTo)) {
    util.log.error(`${pathTo} does not exists.`);
  }
};

/**
 * ## exec
 * Executes shell commands asynchronously, outputting Buffer.
 *
 * @public
 * @param {string} command - The command to run, with space-separated arguments
 * @param {string} successMessage - If the string appears in output stream, Promise will be resolved
 * @returns {Promise}
 */
util.exec = (command, successMessage) => {
  util.log(`Executing: ${command}`);
  return new Promise((resolve, reject) => {
    const child = childProcess.exec(command, {
      maxBuffer: 1024 * 5000,
      env: {
        ...process.env,
        // speed up npm install by telling npm not to
        // check if libraries need updates
        NO_UPDATE_NOTIFIER: true
      }
    });
    child.stdout.on('data', (data) => {
      util.log(data);
      if (successMessage && data.indexOf(successMessage) !== -1) {
        resolve();
      }
    });

    child.stderr.on('data', (data) => {
      util.log(data);
    });

    child.on('error', (err) => {
      reject(err);
    });
    // If childProcess invokes multiple proccesses
    // The close event is triggered when all these processes stdio streams are closed.
    child.on('close', (code) => {
      if (code === 0) {
        util.log(`child process exited with code: ${code}`);
        resolve();
      } else {
        if (code === null) resolve();
        reject(`child process exited with code: ${code}`);
      }
    });
  });
};

/**
 * ## isObjectEmpty
 *
 * @param {Object} object
 * @returns {boolean}
 */
util.isObjectEmpty = function (object) {
  if (typeof object === 'object') {
    // Because Object.keys(new Date()).length === 0; we have to do some additional check
    return Object.keys(object).length === 0 && object.constructor === Object;
  }
  return true;
};

/**
 * ## spawn
 * Executes shell commands asynchronously, returning Stream.
 *
 * @public
 * @param {string} command              - The command to run
 * @param {Array} options               - Array of arguments
 * @param {string} [outputString]       - If the string appears in output stream,
 *                                        Promise will be resolved
 * @param {boolean} [logOutputArg=true] - Logs the output stream
 * @returns {Promise}
 */
util.spawn = (command, options, outputString, logOutputArg) => {
  /* unfortunately this is necessary for one to preserve the PATH for windows
   * there is a bug for nodejs (don't recall) dating back to 2012 or 13 and think
   * they won't fix it, since there were comments regarding status update from 2015
   */
  let cmd = '';
  let args = [];
  let logOutput = logOutputArg;
  if (process.platform === 'win32') {
    cmd = 'cmd.exe';
    args = ['/s', '/c', command];
  } else {
    cmd = command;
  }

  /* Join with other options*/
  args = args.concat(options);

  util.log(`Executing: ${cmd} ${args.join(' ')}`);

  return new Promise((resolve, reject) => {
    const task = childProcess.spawn(cmd, args);
    const decoder = new StringDecoder('utf8');

    task.stdout.on('data', (data) => {
      const search = decoder.write(data);

      if (logOutput === undefined) {
        logOutput = true;
      }

      if (outputString && search.indexOf(outputString) !== -1) {
        /*
         * We want to log this even when logging is disabled, since the outputString
         * typically contains key information that the user needs to know, eg. the
         * hostname:port in the server-only case.
         */
        util.log(search);
        resolve();
      } else if (logOutput) {
        util.log(search);
      }
    });

    task.stderr.on('data', data => util.log(_toString(data)));

    task.on('error', err => reject(err));

    task.on('close', (code) => {
      if (code === 0) {
        util.log(`child process exited with code: ${code}`);
        resolve();
      } else {
        if (code === null) resolve();
        reject(`child process exited with code: ${code}`);
      }
    });
  });
};

function _toString(bufferOrString) {
  return (Buffer.isBuffer(bufferOrString)) ?
    bufferOrString.toString('utf8') :
    bufferOrString;
}

/**
 * ## log
 * Prints each argument on a new line
 *
 * @public
 */
util.log = function () {
  // todo: come up with logging mechanism
  const OJET = JSON.parse(process.env.OJET || false);
  const log = !OJET || (OJET && OJET.logs);
  if (log) {
    // Disabling eslint as spread operator is required
    Object.keys(arguments).forEach((arg) => { // eslint-disable-line
      console.log(arguments[arg]); // eslint-disable-line
    });
  }
};

/**
 * ## log.success
 *
 * @public
 * @param {string} message
 */
util.log.success = function (message) {
  util.log(`Success: ${message}`);
};

/**
 * ## log.warning
 *
 * @public
 * @param {string} message
 */
util.log.warning = function (message) {
  util.log(`Warning: ${message}`);
};

/**
 * ## log.error
 *
 * @public
 * @param {string} message
 * @param {boolean} [omitErrorString=false] avoid double 'Error' when node native exception passed
 * @param {boolean} noexit if set to true, don't exit.  Can be ommitted
 */
util.log.error = function (message, omitErrorString, noexit) {
  const omit = typeof omitErrorString === 'boolean' ? omitErrorString : false;
  util.log(`${omit ? '' : 'Error: '}${message}`);

  if (!process.env.OJET && !noexit) {
    process.exit(1);
  }
};

/**
 * ## validateType
 *
 * @public
 * @param {string} propertyName - Property name
 * @param {*} value             - Property value
 * @param {string} type         - Expected type
 * @returns {error}
 */
util.validateType = (propertyName, value, type) => {
  if (typeof value !== type) { // eslint-disable-line
    // Strings are expected from callers - see JSDoc
    // To pass the eslint rule we would need separate method for every type
    util.log.error(`'${propertyName}' value '${value}' is not valid. Expected: ${type}`);
  }
};

/**
 * ## getValidArraySize
 *
 * @public
 * @param {object} array
 * @returns {number}
 */
util.getValidArraySize = (array) => {
  const size = array.filter(value => value !== undefined).length;

  return size;
};

/**
 * ## fsExist
 * Checks if file/direcotry exists
 *
 * @public
 * @param {string} pathParam    - Path to check
 * @returns {function} callback - Callback
 * @returns {function}          - Callback
 */
util.fsExists = (pathParam, callback) => {
  fs.access(pathParam, fs.F_OK, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

/**
 * ## fsExistSync
 * Checks if file/direcotry exists
 *
 * @public
 * @param {string} pathParam - Path to check
 * @returns {boolean}        - 'true' if path exists, 'false' otherwise
 */
util.fsExistsSync = (pathParam) => {
  try {
    fs.statSync(pathParam);
    return true;
  } catch (err) {
    // file/directory does not exist
    return false;
  }
};

/**
 * ## hasProperty
 *
 * @public
 * @param {Object} object
 * @param {string} propertyName
 * @returns {boolean}
 */
util.hasProperty = function (object, propertyName) {
  return Object.prototype.hasOwnProperty.call(object, propertyName);
};


/**
 * ## hasMissingProperty
 *
 * @public
 * @param {Object} object
 * @param {string} propertyName
 * @returns {boolean}
 */
util.hasMissingProperty = function (object, propertyName) {
  if (!util.hasProperty(object, propertyName) ||
      (util.hasProperty(object, propertyName) && object[propertyName].length === 0)) {
    return true;
  }
  return false;
};

/**
 * ## hasWhiteSpace
 * Checks if string includes white space (space, tab, carriage return, new line,
 * vertical tab, form feed character)
 *
 * @public
 * @param {string} string
 * @returns {boolean} - 'true' if includes, 'false' otherwise
 */
util.hasWhiteSpace = string => /\s/g.test(string);

function _removeNonFile(matches, cwd) {
  const result = matches.filter((dir) => {
    const fullPath = path.join(cwd, dir);
    return fs.statSync(fullPath).isFile();
  });
  return result;
}

function _processMatch(srcArray, destArray) {
  const resultArray = [];
  for (let i = 0; i < srcArray.length; i++) {
    const element = {
      src: srcArray[i],
      dest: destArray[i]
    };
    resultArray.push(element);
  }
  return resultArray;
}

function _mapFileNamePrefix(matches, prefix, rename) {
  const result = matches.map((name) => {
    if (rename) {
      return (typeof rename === 'function') ? rename(prefix, name) : path.join(prefix, rename);
    }

    return path.join(prefix, name);
  });
  return result;
}

function _addFileListPathPrefix(match, dest, cwd, rename) {
  const destMatch = _mapFileNamePrefix(match, dest, rename);
  const srcMatch = _mapFileNamePrefix(match, cwd);
  return _processMatch(srcMatch, destMatch);
}
/**
 * ## getFileList
 * Obtain the file list array of objects contain src and dest pairs
 *
 * @public
 * @param {string} buildType - dev or release
 * @param {object} fileList - raw fileList from config
 * @param {object} cwdContext - the object to cwd value
 * @param {object} destContext  - the object to set dest value
 * @returns {array}  - fileListArray
 */
util.getFileList = (buildType, fileList, cwdContext, destContext) => {
  let result = [];
  fileList.filter(_buildTypeMatch, buildType).forEach((file) => {
    const normalizedFile = {
      cwd: _getNonNullPathString(file.cwd, cwdContext),
      dest: _getNonNullPathString(file.dest, destContext),
      src: (typeof file.src === 'string') ? [file.src] : file.src,
      rename: file.rename
    };
    result = result.concat(_getListFromPatternArray(normalizedFile));
  });
  return result;
};

function _buildTypeMatch(file) {
  return (file.buildType === this || !file.buildType);
}

/**
 * ## getDirectories
 *
 * @public
 * @param {string} source
 * @returns {array}
 */
util.getDirectories = function (source) {
  if (fs.existsSync(source)) {
    return util.readDirSync(source).filter((sourceItem) => { // eslint-disable-line
      return util.isDirectory(path.join(source, sourceItem));
    });
  }
  return [];
};

/**
 * ## isDirectory
 *
 * @public
 * @param {string} source
 * @returns {boolean}
 */
util.isDirectory = function (source) {
  return fs.statSync(source).isDirectory();
};

/**
 * ## getFiles
 *
 * @public
 * @param {string} source
 * @returns {array}
 */
util.getFiles = function (source) {
  if (util.fsExistsSync(source)) {
    return util.readDirSync(source).filter((sourceItem) => { // eslint-disable-line
      return util.isFile(path.join(source, sourceItem));
    });
  }
  return [];
};

/**
 * ## isFile
 *
 * @public
 * @param {string} source
 * @returns {boolean}
 */
util.isFile = function (source) {
  return fs.statSync(source).isFile();
};

/**
 * Return difference between arrays
 *
 * @param {array} matches
 * @param {array} match
 */
util.difference = function (matches, match) {
  return [matches, match].reduce((a, b) => a.filter(c => !b.includes(c)));
};

/**
 * Union two arrays
 *
 * @param {array} array1
 * @param {array} array2
 * @returns
 */
util.union = function (array1, array2) {
  return [...new Set(array1.concat(...array2))];
};

function _getListFromPatternArray(file) {
  let matches = [];
  file.src.forEach((src) => {
    const exclusion = src.indexOf('!') === 0;
    const srcPattern = util.posixPattern(path.normalize(exclusion ? src.slice(1) : src));

    let match = glob.sync(srcPattern, { cwd: util.destPath(file.cwd) });
    match = _removeNonFile(match, util.destPath(file.cwd));
    if (exclusion) {
      matches = util.difference(matches, match);
    } else {
      matches = util.union(matches, match);
    }
  });
  return _addFileListPathPrefix(matches, file.dest, util.destPath(file.cwd), file.rename);
}

function _getNonNullPathString(filePath, context) {
  return (typeof filePath === 'function' ? filePath(context) : filePath) || '';
}

util.getThemeCssExtention = function (buildType, isCdn) {
  const sep = isCdn ? '-' : '.';
  return buildType === 'release' ? `${sep}min.css` : `.css`; // eslint-disable-line quotes
};

util.needsMainEntryFile = () => {
  const version = util.getJETVersion();
  return util.isPreJETVer(version, 16);
};

util.isPreJETVer = (version, beforeVer) => {
  const dotPos = version.indexOf('.');
  const majorVer = version.substring(0, dotPos);
  return (parseInt(majorVer, 10) < beforeVer);
};

util.getJETVersionV = (version) => {
  // Determine if we need a "v" in front (pre 13)
  if (util.isPreJETVer(version, 13)) {
    // Prepend a v for pre-JET 13
    return `v${version}`;
  }
  // Just the version
  return version;
};

util.getJETVersion = (checkPackage = false) => {
  let version;
  const jetPath = util.getOraclejetPath();

  if (jetPath) {
    const packageJsonPath = util.destPath(path.join(jetPath, 'package.json'));
    version = fs.readJsonSync(packageJsonPath).version;
    // npm 5 will put long url
    if (version.length > 5) {
      version = version.replace(new RegExp('(.*oraclejet-)(.*).tgz'), '$2');
    }
  } else if (checkPackage) {
    const pathToPackageJson = path.join(util.destPath(), 'package.json');
    const oracleJetDependency = util.readJsonAndReturnObject(pathToPackageJson).dependencies['@oracle/oraclejet'];
    // eslint-disable-next-line no-useless-escape
    const match = new RegExp('([0-9]+(\.[0-9]+)+)', 'gm').exec(oracleJetDependency);
    version = match[0] || ' ';
  } else {
    util.log.error('Your project does not have oraclejet installed.  Please run "ojet restore"');
  }

  return version;
};

util.getInstalledCssPackage = () => {
  // Check for postcss-calc in app's package.json
  const packageJson = fs.readJsonSync('package.json');
  const devDeps = packageJson.devDependencies;
  if (devDeps) {
    if (devDeps['postcss-calc']) {
      return true;
    }
  }
  return false;
};

/**
 * ## getPathComponents
 * Decomposes the path to the prefix, src directory and suffix.
 * Returns an object with 3 properties - 'beg' includes the path prefix,
 * 'mid' is the src folder (src, src-web), 'end' is the path suffix.
 *
 * @public
 * @param {string} filePath - file path to process
 * @returns {object}        - decomposed path
 */
util.getPathComponents = (filePath) => {
  const configPaths = util.getConfiguredPaths();
  let token = configPaths.src.web;
  let index = filePath.indexOf(token);
  if (index < 0) {
    token = configPaths.src.common;
    index = filePath.indexOf(token);
    if (index < 0) {
      index = 0;
      token = '';
    }
  }
  const pathComponents =
    {
      beg: filePath.substring(0, index),
      mid: token,
      end: filePath.substring(index + token.length)
    };
  return pathComponents;
};

/**
 * ## getRequestedComponentVersion
 *
 * @private
 * @param {string} componentName
 * @returns {string || undefined} version
 */
util.getRequestedComponentVersion = (componentName) => {
  const split = componentName.split('@');
  if (split.length > 2) {
    util.log.error('Wrong version specification: "@" can be used only once.');
  }
  const version = split[1];
  return version;
};

/**
 * ## getPlainComponentName
 *
 * @private
 * @param {string} componentName
 * @returns {string} componentName - version specification is trimmed
 */
util.getPlainComponentName = (componentName) => {
  // Trim version specification from the user input
  const versionSymbolIndex = componentName.indexOf('@');

  if (versionSymbolIndex === 0) {
    util.log.error('Missing component name');
  }
  return versionSymbolIndex > 0 ? componentName.substring(0, componentName.indexOf('@')) : componentName;
};

util.mergeDefaultOptions = (options, defaultConfig) => {
// function customizer(objValue, srcValue, key, obj, src) {
// todo: check caller's params
  function customizer(objValue, srcValue, key) {
  // do not merge for fileList or files, override with values in config
    if (srcValue instanceof Array) {
      if (key === 'fileList' || key === 'files') {
        return srcValue;
      }
    }
    return undefined;
  }
  return _.mergeWith({}, defaultConfig, options, customizer);
};

util.mergePlatformOptions = (options, platform) => {
  if ((platform === constants.SUPPORTED_WEB_PL) && options.web) {
    return util.mergeDefaultOptions(options.web, options);
  }
  return options;
};

util.deepMerge = (obj1, obj2) => {
  const typeOfObj1 = getType(obj1);
  const typeOfObj2 = getType(obj2);

  if (typeOfObj1 !== typeOfObj2) {
    return isPrimitive(obj2) ? obj2 : deepCopy(obj2);
  }

  if (typeOfObj1 === 'object') {
    const result = {};

    const allKeys = new Set([
      ...Object.keys(obj1),
      ...Object.keys(obj2)
    ]);

    allKeys.forEach((key) => {
      if (key in obj1 && key in obj2) {
        result[key] = util.deepMerge(obj1[key], obj2[key]);
      } else if (key in obj1) {
        result[key] = isPrimitive(obj1[key]) ? obj1[key] : deepCopy(obj1[key]);
      } else {
        result[key] = isPrimitive(obj2[key]) ? obj2[key] : deepCopy(obj2[key]);
      }
    });

    return result;
  }

  if (typeOfObj1 === 'array') {
    const result = [];

    obj1.forEach(item => result.push(item));

    obj2.forEach((item) => {
      if (!contains(result, item)) {
        result.push(item);
      }
    });

    return result;
  }

  return obj2;
};

function getType(val) {
  if (Array.isArray(val)) return 'array';
  if (val === null) return 'null';
  return typeof val;
}

function isPrimitive(val) {
  return val === null || (typeof val !== 'object' && typeof val !== 'function');
}

function deepCopy(value) {
  const type = getType(value);

  if (type === 'array') {
    return value.map((v) => {
      if (isPrimitive(v)) {
        return v;
      }
      return deepCopy(v);
    });
  }

  if (type === 'object') {
    const copy = {};

    Object.keys(value).forEach((key) => {
      copy[key] = isPrimitive(value[key]) ? value[key] : deepCopy(value[key]);
    });

    return copy;
  }

  return value;
}

function contains(arr, val) {
  return arr.some(v => JSON.stringify(v) === JSON.stringify(val));
}

util.getAllThemes = () => {
  // scan both appDir/src/themes and appDir/staged-themes directories
  // merge them
  const _config = require('./config'); // eslint-disable-line global-require
  const configPaths = _config('paths');
  const themesDir = util.destPath(path.join(configPaths.src.themes));
  const themesSrcDir = util.destPath(path.join(configPaths.src.common, configPaths.src.themes));

  const allThemes = util.union(_getThemesFileList(themesDir), _getThemesFileList(themesSrcDir));
  return allThemes.filter((themeDir) => {
    if (themeDir === constants.DEFAULT_THEME || themeDir === constants.DEFAULT_PCSS_THEME ||
      themeDir === constants.DEFAULT_STABLE_THEME) {
      return false;
    }
    return themeDir.indexOf('.') === -1;
  });
};

function _getThemesFileList(Dir) {
  return util.fsExistsSync(Dir) ? util.readDirSync(Dir) : [];
}

/**
 * ## cloneObject
 *
 * @public
 * @param {Object} original
 * @returns {Object}
 */
util.cloneObject = function (original) {
  // Previously used method: 'return Object.assign({}, original);'
  // only does a shallow copy of the keys and values, similarly to return {...original},
  // meaning if one of the values in the object is another object or an array,
  // then it is the same reference as was on the original object.

  // Since we need a copy to modify UrlRequestOptions.headers.Authorization (object in object) per
  // we need deep copy an object.
  return JSON.parse(JSON.stringify(original));
};

/**
 * ## checkForHttpErrors
 *
 * @public
 * @param {Object} serverResponse
 * @param {string} serverResponseBody
 * @param {function} [doBeforeErrorCallback] - e.g. delete temporary files
 */
util.checkForHttpErrors = function (serverResponse, serverResponseBody, doBeforeErrorCallback) {
  // Log error for 4xx or 5xx http codes
  // except of 401 (triggers authentication)
  const code = serverResponse.statusCode.toString();

  let responseBody;
  try {
    responseBody = JSON.parse(serverResponseBody);
  } catch (e) {
    responseBody = serverResponseBody;
  }

  if (responseBody.warnings && responseBody.warnings.length > 0) {
    logExceptions(responseBody, 'warnings');
  }

  if (code !== '401' && ['4', '5'].indexOf(code.charAt(0)) > -1) {
    if (typeof doBeforeErrorCallback === 'function') {
      doBeforeErrorCallback();
    }
    if (responseBody.errors && responseBody.errors.length > 0) {
      logExceptions(responseBody, 'errors');
    }
    logExceptions(`${code} ${serverResponse.statusMessage}\n${responseBody}`, 'errors');
  }
};

function logExceptions(responseBody, exceptionObjectKey) {
  if (typeof responseBody === 'object' && responseBody[exceptionObjectKey]) {
    let exceptions = '';
    responseBody[exceptionObjectKey].forEach((exception) => {
      const exchange = url.parse(process.env.exchangeUrl);
      const exceptionPath = `${exchange.path}exceptions/${exception.id}`;
      const exceptionLink = `${exchange.host}${exceptionPath.replace('//', '/')}`;
      exceptions += `${exception.message}. More info: ${exceptionLink}${responseBody[exceptionObjectKey].length > 1 ? '\n' : ''}`;
    });
    if (exceptionObjectKey === 'errors') {
      util.log.error(exceptions);
    } else {
      util.log(exceptions);
    }
  } else {
    // False positive 'no-lonely-if', disabling line below
    // https://github.com/eslint/eslint/issues/3722
    if (exceptionObjectKey === 'errors') { // eslint-disable-line
      util.log.error(responseBody);
    } else {
      util.log(responseBody);
    }
  }
}

/**
 * ## isCCASassFile
 *
 * @public
 * @param {String} filePath
 * @returns {Boolean}
 */
util.isCcaSassFile = function (filePath) {
  const configPaths = util.getConfiguredPaths();
  const jetCCA = new RegExp(configPaths.components);
  if (typeof filePath === 'string') {
    let pathToComponents;
    const stagingFolder = configPaths.staging.stagingPath || configPaths.staging.web;
    if (util.isVDOMApplication()) {
      pathToComponents = path.join(stagingFolder, configPaths.components);
    } else if (util.isTypescriptApplication()) {
      pathToComponents = path.join(stagingFolder, 'ts', configPaths.components);
    } else {
      pathToComponents = path.join(stagingFolder, 'js', configPaths.components);
    }
    const componentInStaging = util.getLocalComponents();
    const baseName = path.basename(filePath);
    const isASassFile = baseName.endsWith('.scss') || baseName.endsWith('.sass');
    // Check that filepath is a sass file and is in the components folder:
    if (isASassFile && filePath.includes(pathToComponents)) {
      // We extract the folder name in filePath of the form
      // web/components/<folderName>/../<fileName>.scss:
      // code not hit in tests
      const folderName = filePath.split(path.sep)[2];
      // Check that the folder is not a component:
      if (!componentInStaging.includes(folderName)) {
        return false;
      }
    }
  }
  return jetCCA.test(filePath);
};

/**
 * ## isVerbose
 *
 * @returns {boolean}
 */
util.isVerbose = function () {
  return process.env.verbose !== 'false';
};

/**
 * ## getConfiguredPaths
 *
 * @returns {object} paths
 */
util.getConfiguredPaths = () => {
  // eslint-disable-next-line global-require
  let configPaths = config('paths');
  // only load config paths if not already loaded
  if (!configPaths) {
    config.loadOraclejetConfig();
    configPaths = config('paths');
  }
  return configPaths;
};


/**
 * Return the proper installer command
 * @param {Object} options
 * @returns {Object} installer command & verb
 */
util.getInstallerCommand = ({ options }) => {
  let installerCmd;
  if (options && options.installer) {
    installerCmd = options.installer;
  } else {
    const _config = require('./config'); // eslint-disable-line global-require
    _config.loadOraclejetConfig();
    installerCmd = _config('installer');
  }

  const useCI = util.hasProperty(options, 'ci');
  const npmInstallCmd = useCI ? 'ci' : 'install';
  return installerCmd === 'yarn' ?
    {
      installer: 'yarn',
      verbs: {
        install: 'add'
      },
      flags: {
        save: '--dev',
        exact: '--exact'
      }
    } :
    {
      installer: 'npm',
      verbs: {
        install: npmInstallCmd
      },
      flags: {
        save: '--save-dev',
        exact: '--save-exact',
        legacy: '--legacy-peer-deps'
      }
    };
};


/**
 * ## getOraclejetConfigJson
 *
 * @public
 * @param {String=} appPath
 * @returns {Object} | @throws
 */
util.getOraclejetConfigJson = (appPath) => {
  const configPath = appPath ? path.join(appPath, constants.ORACLE_JET_CONFIG_JSON) :
    path.join('.', constants.ORACLE_JET_CONFIG_JSON);
  if (fs.existsSync(configPath)) {
    return util.readJsonAndReturnObject(configPath);
  }
  return null;
};

/**
 * Get path to tsconfig
 * @param {String=} appPath
 */
util.getPathToTsConfig = (appPath) => {
  const actualPath = appPath || '.';
  const oraclejetConfigJson = this.getOraclejetConfigJson(appPath);
  const pathsObj = oraclejetConfigJson && oraclejetConfigJson.paths;
  const customPath = pathsObj && pathsObj.source && pathsObj.source.tsconfig;
  return customPath ? path.join(actualPath, customPath, constants.TSCONFIG) :
    path.join(actualPath, constants.TSCONFIG);
};

util.printList = (itemsInConfig, itemsByFolder) => {
  // Output variables
  const nameMaxLength = 30;
  const space = ' ';

  // Print headline
  const headlineName = 'name';
  const headlineNote = 'note';
  let headline = '';
  const headlineNameSpaces = nameMaxLength - headlineName.length;
  if (headlineNameSpaces < 0) {
    headline += `<${headlineName.substring(0, nameMaxLength - 2)}>`;
  } else {
    headline += `<${headlineName}>${space.repeat(headlineNameSpaces - 2)}`;
  }
  headline += `${space}<${headlineNote}>`;
  util.log(headline);

  // Print components list
  itemsByFolder.forEach((comp) => {
    let line = _constructLineOutput(comp, nameMaxLength, space);
    line += `${space}${_addWarningMissingInConfig(comp, itemsInConfig)}`;
    util.log(line);
  });

  // Print components from the config file which are not install
  itemsInConfig.forEach((comp) => {
    if (itemsByFolder.indexOf(comp) === -1) {
      let line = _constructLineOutput(comp, nameMaxLength, space);
      line += `${space}Warning: found in the config file but not installed. Please restore.`;
      util.log(line);
    }
  });
};

/**
 * ## _constructLineOutput
 *
 * @private
 * @param {string} componentName
 * @param {number} nameMaxLength
 * @param {string} space
 * @returns {string}
 */
function _constructLineOutput(componentName, nameMaxLength, space) {
  const componentNameSpaces = nameMaxLength - componentName.length;
  if (componentNameSpaces < 0) {
    return `${componentName.substring(0, nameMaxLength)}`;
  }
  return `${componentName}${space.repeat(componentNameSpaces)}`;
}

/**
 * ## _addWarningMissingInConfig
 *
 * @private
 * @param {string} componentName
 * @param {Array} componentsInConfigFile
 * @returns {string}
 */
function _addWarningMissingInConfig(componentName, componentsInConfigFile) {
  if (componentsInConfigFile.indexOf(componentName) === -1) {
    return 'Local component or installed as dependency. Not found in the config file.';
  }
  return '';
}

/**
 * ## readPathMappingJsonFile
 *
 * @public
 */
util.readPathMappingJson = () => {
  const configPaths = util.getConfiguredPaths();
  const legacyPathToPathingmapingJson = path.join(
    configPaths.src.common,
    configPaths.src.javascript,
    constants.PATH_MAPPING_JSON
  );
  const pathToPathmappingJson = constants.PATH_MAPPING_JSON;
  let pathMappingJson;
  if (util.fsExistsSync(legacyPathToPathingmapingJson)) {
    pathMappingJson = util.readJsonAndReturnObject(legacyPathToPathingmapingJson);
  } else if (util.fsExistsSync(pathToPathmappingJson)) {
    pathMappingJson = util.readJsonAndReturnObject(pathToPathmappingJson);
  } else {
    pathMappingJson = {};
  }
  if (!pathMappingJson.baseUrl) {
    pathMappingJson.baseUrl = configPaths.src.javascript;
  }
  return pathMappingJson;
};

/**
 * ## readJsonAndReturnObject
 *
 * @public
 * @param {string} file
 * @param {Object} [options]
 * @param {Object | string} [options]
 * @param {string} [options.encoding = 'utf-8']
 * @param {string} [options.suppressNotFoundError]
 * @param {string} [options.flag = 'r'] System flag:
 * https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_file_system_flags
 * @returns {Object} | @throws
 */
util.readJsonAndReturnObject = function (file, options) {
  let object = {};
  const fileContent = util.readFileSync(file, options);
  // If suppressNotFoundError was used in util.readFileSync() options
  // and the file did not exist, const fileContent is undefined.
  // So just return 'undefined' and did not try to parse.
  if (fileContent) {
    try {
      object = JSON.parse(fileContent);
      // If came to here, then valid json
    } catch (e) {
      util.log.error(`File '${file}' is not of type 'json'.`);
    }
    return object;
  }
  return fileContent;
};

/**
 * ## readFileSync
 * Blocking synchronous file read
 *
 * @public
 * @param {string} source
 * @param {Object | string} [options]
 * @param {string} [options.encoding = 'utf-8']
 * @param {string} [options.suppressNotFoundError]
 * @param {string} [options.flag = 'r']
 * @returns content
 */
util.readFileSync = function (source, options) {
  return util.readFsSync(source, 'file', options);
};

/**
 * ## readDirSync
 * Blocking synchronous dir read
 *
 * @public
 * @param {string} source
 * @param {Object | string} [options]
 * @param {string} [options.encoding = 'utf-8']
 * @param {string} [options.suppressNotFoundError]
 * @param {string} [options.withFileTypes = false] Dir read case
 * @returns content
 */
util.readDirSync = function (source, options) {
  return util.readFsSync(source, 'dir', options);
};

/**
 * ## readFsSync
 * Blocking synchronous dir/file read
 * https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_readdirsync_path_options
 * https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_readfilesync_path_options
 *
 * @public
 * @param {string} source
 * @param {'dir' | 'file'} type
 * @param {Object | string} [options]
 * @param {string} [options.encoding = 'utf-8']
 * @param {string} [options.suppressNotFoundError]
 * @param {string} [options.flag = 'r'] File read case
 * @param {string} [options.withFileTypes = false] Dir read case
 * @returns content
 */
util.readFsSync = function (source, type, options) {
  // If options is not defined or an object, merge with defaults
  let opts = options;
  if (typeof opts === 'undefined' || util.isObject(opts)) {
    opts = Object.assign({
      encoding: 'utf-8',
    }, opts);
  }
  let content;
  try {
    switch (type) {
      case 'dir':
        content = fs.readdirSync(source, opts);
        break;
      case 'file':
        content = fs.readFileSync(source, opts);
        break;
      default:
        util.log.error(`Unsupported '${type}' file system type.`);
    }
  } catch (error) {
    if (error.code === 'ENOENT' &&
      util.hasProperty(opts, 'suppressNotFoundError') &&
      opts.suppressNotFoundError) {
      // Exception - do not log info if the source file is
      // Exchange access-token or global url configuration.
      // Access token is not needed as long as authentication is not required
      // e.g. when only consuming from Internal Exchange
      // Logging 'not-found' info for each Exchange request was confusing users.
      if (!source.endsWith(constants.EXCHANGE_TOKEN_STORE_FILE) &&
        !source.endsWith(constants.EXCHANGE_URL_FILE)
      ) {
        util.log(`Directory/File '${source}' not found. Skipping.`);
      }
    } else {
      util.log.error(`Directory/File '${source}' could not be read. More details: ${error}`);
    }
  }
  return content;
};

/**
 * ## isObject
 *
 * @public
 * @param {any} variable
 * @returns {boolean}
 */
util.isObject = function (variable) {
  return typeof variable === 'object' && variable !== null;
};

util.requestWithRetry = function (count, metadata, options, body, multipartFormData) {
  return new Promise(async (resolve, reject) => {
    let response = null;
    let err = null;
    for (let c = 0; c < count; c++) {
      try {
        response = await util.request(options, body, multipartFormData); // eslint-disable-line
        resolve(response);
        return;
      } catch (error) {
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNRESET') {
          err = error;
          util.log.warning(`Retrying fetch for ${metadata.name}`);
        } else {
          reject(`Problem with request: ${error}`);
        }
      }
    }
    reject(`Problem with request: ${err}`);
  });
};

/**
 * ## request
 *
 * @public
 * @param {Object|string} options   - List: https://nodejs.org/api/http.html#http_http_request_url_options_callback
 * @param {string|undefined} [body]
 * @param {Object} [multipartFormData]
 * @returns {Promise}
 */
util.request = function (options, body, multipartFormData) {
  return new Promise((resolve, reject) => {
    let opts = {};
    if (options) {
      opts = Object.assign(opts, options);
    }

    // HTTP/HTTPS request
    // https://nodejs.org/api/http.html#http_http_request_url_options_callback
    // https://nodejs.org/api/https.html#https_https_request_options_callback

    // Add 'secure' property if missing
    if (util.hasProperty(opts, 'secure')) {
      // Save for next request of this session
      process.env.options = JSON.stringify(
        // Merge current state with 'secure' option
        Object.assign(JSON.parse(process.env.options), { secure: opts.secure })
      );
    } else {
      // Create 'secure' property with cach
      opts.secure = util.getOptionsProperty('secure');
    }

    // Automatically Add Authorization header
    // Except of the token request
    if (opts.path !== '/auth/token') {
      const token = exchangeUtils.getAccessTokenFromFS();
      // And except of expired token
      if (token) {
        // Add authorization header
        opts.headers = Object.assign(opts.headers || {}, {
          Authorization: token
        });
      }
    }

    if (opts.useUrl) {
      // Overwrite protocol, host, path, port etc. by values from provided url
      opts = Object.assign(opts, url.parse(opts.useUrl));
    } else {
      // If exchange url defined, use it as the default
      const defaults = url.parse(exchangeUtils.getExchangeUrl());
      if (defaults.path && opts.path) {
        // Even we could normalize exchange url on input (ojet configure --exchange-url)
        // we can not prevent user from modifying oraclejetconfig.json manually.
        // That's why we need to check whether it ends with slash here when constructing url
        if (defaults.path.endsWith('/')) {
          defaults.path = defaults.path.substring(0, defaults.path.length - 1);
        }
        // Note: we removed previous '.replace()' method:
        // opts.path = (defaults.path + opts.path).replace('//', '/');
        // because of https://github.com/nodejs/node/issues/18288 saying:
        // http://nodejs.org//foo/bar//baz/ is a valid URL that may have a different meaning from
        // http://nodejs.org/foo/bar/baz/. It would be semantically incorrect to disallow this distinction.
        opts.path = (defaults.path + opts.path);
      }
      opts = Object.assign(defaults, opts);
    }
    const protocol = _validateProtocol(opts);

    if (util.isVerbose()) {
      const optionsCopy = util.cloneObject(opts);

      if (util.hasProperty(optionsCopy, 'headers')) {
        if (util.hasProperty(optionsCopy.headers, 'Authorization')) {
          // Do not log base64 hash as it is not cryptographically secure
          const authHash = optionsCopy.headers.Authorization;

          // We only want to hide Authorization value when requesting access token with:
          // headers: {Authorization: Basic <base64_hash_value>}
          // as credentials are part of the 'base64_hash_value' and can be decoded.
          //
          // We are not hiding value when using other Authorization types e.g.:
          // headers: {Authorization: Bearer <JWT_access_token_value>}
          // because 'JWT_access_token_value' is completely public information.
          // Our decoded JWT tokens do not include sensitive information.
          const [authType, authValue] = authHash.split(' ');
          if (authType === 'Basic' && authValue) {
            optionsCopy.headers.Authorization = `${authType} ${'*'.repeat(authValue.length)}`;
          }
        }
      }

      util.log('Request options:');
      util.log(optionsCopy);
      util.log('Request body:');
      util.log(body);
    }

    const request = protocol.request(opts, (response) => {
      if (util.isVerbose()) {
        util.log('Response status code:');
        util.log(response.statusCode);
        util.log('Response status message:');
        util.log(response.statusMessage);
        util.log('Response headers:');
        util.log(response.headers);
      }

      let responseBody = '';
      const buffer = [];
      response.on('data', (respBody) => {
        responseBody += respBody;
        buffer.push(respBody);
      });
      response.on('end', () => {
        if (util.isVerbose()) {
          try {
            JSON.parse(responseBody);
            util.log('Response body:');
            util.log(responseBody);
          } catch (e) {
            util.log('Response body could not be parsed. Skipping log.');
          }
        }
        resolve({
          response,
          responseBody,
          buffer
        });
      });
    });

    request.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        reject('Could not connect to defined url.\nPlease check your proxy setting and configure Exchange url \'ojet help configure\'');
      } else {
        reject(error);
      }
    });

    if (body) {
      request.write(body);
      request.end();
    } else if (multipartFormData) {
      multipartFormData.pipe(request);
    } else {
      request.end();
    }
  });
};

util.loginIfCredentialsProvided = () => {
  const username = util.getOptionsProperty('username');
  const password = util.getOptionsProperty('password');

  if (username && password) {
    // Credentials were provided, get and store brand new access token
    // even there might be a one (even valid) stored
    return exchangeUtils.getAccessToken(username, password)
      .then((authInfo) => {
        exchangeUtils.writeAuthInfoToFS(util.convertJsonToObject(authInfo));
      });
  }
  // Credentials not provided, just continue
  return Promise.resolve();
};

util.getOptionsProperty = (property) => {
  const options = process.env.options;
  if (options && options !== 'undefined') {
    return JSON.parse(options)[property];
  }
  return null;
};

/**
 * ## _checkProtocol
 *
 * @private
 * @param {string} requestedProtocol - http || https
 * @param {boolean} [secure='true']  - security option
 * @returns {Object} | @throws       - returns valid protocol or throws error
 */

function _validateProtocol(options) { // eslint-disable-line
  const protocol = options.protocol;
  if (protocol === 'https:' || options.secure === false) {
    return protocol === 'https:' ? https : http;
  }
  util.log.error('HTTP protocol is insecure. Please use HTTPS instead. At your own risk, you can force the HTTP protocol with the —secure=false or {secure: false} option.');
}

/**
 * ## getLibVersionsObj
 *
 * @public
 */
util.getLibVersionsObj = () => {
  const jetVer = _getVersionFromNpm('oraclejet');
  const versionsObj = {
    ojcss: jetVer,
    'ojs/ojcss': jetVer,
    ojs: jetVer,
    ojL10n: jetVer,
    ojtranslations: jetVer,
    'oj-c': _getVersionFromNpm('@oracle/oraclejet-core-pack'),
    jquery: _getVersionFromNpm('jquery'),
    'jqueryui-amd': _getVersionFromNpm('jquery-ui'),
    hammerjs: _getVersionFromNpm('hammerjs'),
    knockout: _getVersionFromNpm('knockout')
  };
  return versionsObj;
};

function _getVersionFromNpm(libPath) {
  if (libPath === 'oraclejet') {
    return util.getJETVersion();
  }
  const modulePath = util.getModulePath(path.join(constants.NODE_MODULES_DIRECTORY,
    libPath), libPath);
  if (modulePath) {
    const packageJSONPath = path.join(modulePath, 'package.json');
    const packageJSON = fs.readJsonSync(packageJSONPath);
    return packageJSON.version;
  }
  return null;
}

util.getNodeModuleVersion = libPath => _getVersionFromNpm(libPath);

/**
 * Map the tooling theme skin to JET distribution
 * @param  {String} skin name
 * @returns {String} skin name
 */
util.mapToSourceSkinName = function (skin) {
  switch (skin) {
    case 'web':
      return 'alta';
    case 'ios':
      return 'alta-ios';
    case 'android':
      return 'alta-android';
    case 'windows':
      return 'alta-windows';
    case 'common':
      return 'common';
    default:
      return skin;
  }
};

/**
 * Map the tooling pcss theme skin to JET distribution
 * @param  {String} skin name
 * @returns {String} skin name
 */
util.mapToPcssSourceSkinName = function (skin) {
  switch (skin) {
    case 'web':
      return 'redwood';
    case 'common':
      return 'common';
    default:
      return skin;
  }
};

util.isPathCCA = (filePath) => {
  const configPaths = util.getConfiguredPaths();
  const javascriptBase = path.join(
    configPaths.src.common,
    configPaths.src.javascript,
    configPaths.components
  );
  const typescriptBase = path.join(
    configPaths.src.common,
    configPaths.src.typescript,
    configPaths.components
  );
  // go from <src>/(<js>|<ts>)/<components>/<component>/* to
  // to <component>/* e.g. web/ts/jet-composites/oj-foo/loader.ts to
  // oj-foo
  const componentPath = path.normalize(filePath).startsWith(javascriptBase) ?
    path.dirname(path.relative(javascriptBase, filePath)) :
    path.dirname(path.relative(typescriptBase, filePath));
  const [componentRoot] = componentPath.split(path.sep);
  if (util.isWebComponent({ component: componentRoot })) {
    return true;
  }
  return false;
};

/**
 * ## getDestBase
 *
 * @private
 * @return {string}
 *
 * Return the path to the destination base.
 *
 */
util.getDestBase = function () {
  const _config = require('./config'); // eslint-disable-line
  const configPaths = _config('paths');
  let destBase = null;
  destBase = path.join(
    configPaths.staging.web,
    configPaths.src.javascript,
    configPaths.components
  );
  return destBase;
};

/**
 * ## getComponentPath
 *
 * The pack argument should only be provided
 * for a component inside a JET pack. Pack components
 * are treated like singleton components and so the
 * pack name should be provided as the "component" argument
 * and the "pack" argument should be omitted.
 *
 * @private
 * @param {object} options.context
 * @param {object} options.pack
 * @param {object} options.component
 * @param {boolean} options.built whether to get component path in /src or /<staging>
 * @param {boolean} options.release whether this is a release build or not
 * @return {string}
 *
 * Return the src path to a web component.
 *
 */
util.getComponentPath = function ({ context, pack = '', component, built, release = false }) {
  if (built) {
    const configPaths = util.getConfiguredPaths();
    const stagingPath = context ?
      context.opts.stagingPath : configPaths.staging.stagingPath;
    return util.generatePathToComponentRoot({
      context,
      pack,
      component,
      root: stagingPath,
      scripts: configPaths.src.javascript,
      min: release
    });
  }

  const configPaths = util.getConfiguredPaths();
  const componentJavascriptPath = path.join(
    configPaths.src.common,
    configPaths.src.javascript,
    configPaths.components,
    pack,
    component
  );
  const componentTypescriptPath = path.join(
    configPaths.src.common,
    configPaths.src.typescript,
    configPaths.components,
    pack,
    component
  );
  let componentPath;
  if (util.fsExistsSync(componentJavascriptPath)) {
    componentPath = componentJavascriptPath;
  } else if (util.fsExistsSync(componentTypescriptPath)) {
    componentPath = componentTypescriptPath;
  } else if (pack === '') {
    util.log.error(`The component ${component} was not found`);
  } else {
    util.log.error(`The component ${component} was not found in pack ${pack}`);
  }
  return componentPath;
};

/**
 * ## getComponentVersion
 *
 * The pack argument should only be provided
 * for a component inside a JET pack. Pack components
 * are treated like singleton components and so the
 * pack name should be provided as the "component" argument
 * and the "pack" argument should be omitted.
 *
 * @private
 * @param {object} options.pack
 * @param {object} options.component
 * @return {string} component version
 */
util.getComponentVersion = function ({ pack = '', component }) {
  const fullComponentName = pack ? `${pack}-${component}` : component;
  const componentsCache = util.getComponentsCache();
  const componentCache = componentsCache[fullComponentName];
  if (componentCache &&
      util.hasProperty(componentCache, 'componentJson' &&
      util.hasProperty(componentCache.componentJson, 'version'))
  ) {
    return componentCache.componentJson.version;
  }
  let version;
  if (util.isVComponent({ pack, component })) {
    version = util.getVComponentVersion({ pack, component });
  } else if (util.isExchangeComponent({ pack, component }) &&
            !util.isLocalComponent({ pack, component })) {
    version = util.getExchangeComponentVersion({ pack, component });
  } else {
    version = util.getCompositeComponentVersion({ pack, component });
  }
  componentsCache.componentJson = {
    ...(componentsCache.componentJson || {}),
    version
  };
  return version;
};

/**
 * ## getCompositeComponentVersion
 *
 * @private
 * @param {object} options.pack
 * @param {object} options.component
 * @return {string} composite component version
 */
util.getCompositeComponentVersion = ({ pack, component }) => {
  const componentJson = util.getCompositeComponentJson({ pack, component });
  if (!util.hasProperty(componentJson, 'version')) {
    util.log.error(`Missing property 'version' in '${component}' component's/pack's definition file.`);
  }
  return componentJson.version;
};

/**
 * ## getExchangeComponentVersion
 *
 * @private
 * @param {object} options.pack
 * @param {object} options.component
 * @return {string} exchange component version
 */
util.getExchangeComponentVersion = ({ pack, component }) => {
  const componentJson = util.getExchangeComponentComponentJson({ pack, component });
  if (!util.hasProperty(componentJson, 'version')) {
    util.log.error(`Missing property 'version' in '${component}' component's/pack's definition file.`);
  }
  return componentJson.version;
};

/**
 * ## getJetpackCcaNameFromConfigObj
 *
 * @private
 * @param {string} pathComponentsEnd
 * @return {string}
 *
 * Return the name of a jetpack component.
 *
 * The component config for a jetpack component might look something like this:
 *   {"oj-ref-fullcalendar":"3.9.0",
 *     "oj-ref-moment":"2.22.2",
 *     "oj-ref-showdown":"1.9.0",
 *     "oj-sample":"0.0.28-beta"}
 * We want to extract the name/version from the component config -
 * but the jetpack component name first needs to be discovered.
 * We infer the CCA name (say "oj-sample") - this is accomplished by checking the path for
 * all keys in the config object
 * ("oj-ref-fullcalendar", "oj-ref-moment", "oj-ref-showdown", "oj-sample")
 * Then the calling function can use the key/prop value for the name/version, e.g.,
 * "oj-sample":"0.0.28-beta" will be name/version.
 *
 */
util.getJetpackCompNameFromConfigObj = function (pathComponentsEnd) {
  const componentsCache = util.getComponentsCache();
  const matchingName = Object.keys(componentsCache).find(key => pathComponentsEnd.split(path.sep).indexOf(`${key.toString()}`) !== -1);
  return matchingName;
};

/**
 * ## getNpmPckgInitFileRelativePath
 *
 * @private
 * @param {String} componentJson component json file
 * @param {String} buildType build type
 * @returns {Object} with two fields, npmPckgInitFileRelativePath which is the file path,
 *  and a boolean cdn, which is true if the path is a cdn path.
 *
 * Return the preferred component path.
 * The component path is returned as a relative path.
 *
 * Example path from component.json:
 *
 *  "paths": {
 *    "npm": {
 *      "min": "dist/showdown.min",
 *      "debug": "dist/showdown"
 *     }
 *    "cdn": {
 *      "min": "https://static.oracle.com/cdn/jet/packs/3rdparty/showdown/1.9.0/showdown.min",
 *      "debug": "https://static.oracle.com/cdn/jet/packs/3rdparty/showdown/1.9.0/showdown.min"
 *     }
 *  }
 *
 * The path selected to return is based on the following search pattern:
 *
 *  For ojet build:
 *   1. npm.min
 *   2. npm.debug
 *   3. cdn.debug
 *   4. cdn.min
 *
 *  For ojet build --release:
 *   1. cdn.min
 *   2. cdn.debug
 *   3. npm.min
 *   4. npm.debug
 */
util.getNpmPckgInitFileRelativePath = function (componentJson, buildType) {
  const retObj = {};
  retObj.npmPckgInitFileRelativePath = undefined;
  retObj.npm = true;

  if (!componentJson.paths) return retObj;
  if (buildType === 'release') {
    if (componentJson.paths.cdn !== undefined) {
      retObj.npm = false;
      if (componentJson.paths.cdn.min !== undefined) {
        retObj.npmPckgInitFileRelativePath = componentJson.paths.cdn.min;
      } else if (componentJson.paths.cdn.debug !== undefined) {
        retObj.npmPckgInitFileRelativePath = componentJson.paths.cdn.debug;
      }
    } else if (componentJson.paths.npm !== undefined) {
      if (componentJson.paths.npm.min !== undefined) {
        retObj.npmPckgInitFileRelativePath = componentJson.paths.npm.min;
      } else if (componentJson.paths.npm.debug !== undefined) {
        retObj.npmPckgInitFileRelativePath = componentJson.paths.npm.debug;
      }
    }
  } else {
    if (componentJson.paths.npm !== undefined) { // eslint-disable-line no-lonely-if
      if (componentJson.paths.npm.min !== undefined) {
        retObj.npmPckgInitFileRelativePath = componentJson.paths.npm.min;
      } else if (componentJson.paths.npm.debug !== undefined) {
        retObj.npmPckgInitFileRelativePath = componentJson.paths.npm.debug;
      }
    } else if (componentJson.paths.cdn !== undefined) {
      retObj.npm = false;
      if (componentJson.paths.cdn.debug !== undefined) {
        retObj.npmPckgInitFileRelativePath = componentJson.paths.cdn.debug;
      } else if (componentJson.paths.cdn.min !== undefined) {
        retObj.npmPckgInitFileRelativePath = componentJson.paths.cdn.min;
      }
    }
  }
  return retObj;
};

/**
 * ## isTypescriptFile
 *
 * Returns true if the file path refers to a
 * Typescript file and false otherwise
 *
 * @private
 * @param {object} options
 * @param {string} options.filePath
 * @returns {boolean}
 */
util.isTypescriptFile = function ({ filePath }) {
  return !!filePath.match(/(\.ts|\.tsx)$/);
};

/**
 * ## writeObjectAsJsonFile
 *
 * @public
 * @param {string} file
 * @param {Object} object
 * @param {string} [options.encoding = 'utf-8']
 * @param {string} [options.mode = '0o666']
 * @param {string} [options.flag = 'w'] System flag
 * https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_file_system_flags
 */
util.writeObjectAsJsonFile = (file, object, options) => {
  // Object validation - warning only, empty object written
  if (util.isObjectEmpty(object)) {
    util.log.warning(`Empty object written to ${file}`);
  }

  const compiledObject = JSON.stringify(object || {}, null, 2);
  util.writeFileSync(file, compiledObject, options);
};

/**
 * ## readFileSync
 * Blocking synchronous file write
 * https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_writefilesync_file_data_options
 *
 * @public
 * @param {string} file
 * @param {string | Buffer} data
 * @param {Object | string} [options]
 * @param {string} [options.encoding = 'utf-8']
 * @param {string} [options.mode = '0o666']
 * @param {string} [options.flag = 'w'] System flag
 * https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_file_system_flags
 */
util.writeFileSync = function (file, data, options) {
  try {
    fs.writeFileSync(file, data, options);
  } catch (error) {
    util.log.error(`File '${file}' could not be written. More details: ${error}`);
  }
};

/**
 * ## isTypescriptComponent
 * @private
 * @param {string} option.pack pack name
 * @param {string} option.component component name
 * @returns {boolean} true if the component is written
 * in typescript and false otherwise
 */
util.isTypescriptComponent = function ({ pack = '', component }) {
  const configPaths = util.getConfiguredPaths();
  return util.fsExistsSync(path.join(
    configPaths.src.common,
    configPaths.src.typescript,
    configPaths.components,
    pack,
    component,
    constants.JET_COMPONENT_JSON
  ));
};

/**
 * ## getVComponentVersion
 *
 * Determine the version of the vcomponent.
 *
 * @private
 * @param {string} option.pack pack name
 * @param {string} option.component component name
 * @returns {string|void} VComponent version
 */
util.getVComponentVersion = ({ pack = '', component }) => {
  const configPaths = util.getConfiguredPaths();
  const versionRegex = new RegExp('@ojmetadata version "(?<version>.+)"');
  const pathToVComponent = path.join(
    configPaths.src.common,
    configPaths.src.typescript,
    configPaths.components,
    pack,
    component,
    `${component}.tsx`
  );
  const vcomponentContent = util.readFileSync(pathToVComponent);
  const matches = versionRegex.exec(vcomponentContent);
  // Initialze version to the empty string - providing an
  // indicator for future substitution with the packs's version
  // (for the case where the pack component's version is missing from the .tsx file)
  let version = '';
  if (matches && matches.groups.version) {
    version = matches.groups.version;
  } else {
    const componentsCache = util.getComponentsCache();
    if (componentsCache[pack] && componentsCache[pack].componentJson &&
      util.hasProperty(componentsCache[pack].componentJson, 'version')) {
      version = componentsCache[pack].componentJson.version;
    }
  }
  return version;
};

/**
 * ## isVComponent
 *
 * The current standard is that all vcomponents
 * will have their folder name be the same as the
 * .tsx file name i.e oj-vcomponent will have
 * oj-vcomponent.tsx. Also, vcomponents do not have
 * component.json files; hence, an added check.
 *
 * @private
 * @param {string} option.pack JET pack name
 * @param {string} option.component component name
 * @returns {boolean} true if the component is a
 * vcomponent and false otherwise
 */
util.isVComponent = function ({ pack = '', component }) {
  const configPaths = util.getConfiguredPaths();
  const pathToComponentTSXFile = path.join(
    configPaths.src.common,
    configPaths.src.typescript,
    configPaths.components,
    pack,
    component,
    `${component}.tsx`
  );
  const pathToComponentJSON = path.join(
    configPaths.src.common,
    configPaths.src.typescript,
    configPaths.components,
    pack,
    component,
    constants.JET_COMPONENT_JSON
  );
  return util.fsExistsSync(pathToComponentTSXFile) && !util.fsExistsSync(pathToComponentJSON);
};

/**
 * ## isJavascriptComponent
 * @private
 * @param {string} option.pack pack name
 * @param {string} option.component component name
 * @returns {boolean} true if the component is written
 * in javascript and false otherwise
 */
util.isJavascriptComponent = function ({ pack = '', component }) {
  const configPaths = util.getConfiguredPaths();
  return util.fsExistsSync(path.join(
    configPaths.src.common,
    configPaths.src.javascript,
    configPaths.components,
    pack,
    component,
    constants.JET_COMPONENT_JSON
  ));
};

/**
 * ## isExchangeComponent
 *
 * @private
 * @param {string} option.pack JET pack name
 * @param {string} option.component component name
 * @returns {boolean} true if the component is from the
 * exchange and false otherwise
 */
util.isExchangeComponent = ({ pack = '', component }) => {
  const configPaths = util.getConfiguredPaths();
  if (util.fsExistsSync(
    path.join(configPaths.exchangeComponents, pack, component,
      constants.JET_COMPONENT_JSON
    ))) {
    return true;
  }
  // External pack component references will have the pack name embedded.
  // If the above path check fails, the component may still be an exchange component.
  const packCompObj = util.chopExchangeComponentName(component);
  if (packCompObj.pack !== '') {
    if (util.fsExistsSync(
      path.join(configPaths.exchangeComponents,
        packCompObj.pack, packCompObj.component,
        constants.JET_COMPONENT_JSON
      ))) {
      return true;
    }
  }
  return false;
};

/**
 * ## isLocalComponent
 *
 * Determine if the provided component name is
 * a valid JET local component
 *
 * @private
 * @param {string} pack pack name
 * @param {string} component component name
 * @returns {boolean} whether the provided component name is
 * a local component
 */
util.isLocalComponent = ({ pack, component }) => (
  util.isTypescriptComponent({ pack, component }) ||
  util.isJavascriptComponent({ pack, component }) ||
  util.isVComponent({ pack, component })
);

/**
 * ## chopExchangeComponentName
 *
 * @private
 * @param {string} component component name
 * @returns {object} with pack and component properties
 *
 * External pack component references will have the pack name embedded.
 * For example, oj-dynamic-form refers to the component form in pack oj-dynamic.
 * This routine will return {pack: oj-dynamic, component: form} given oj-dynamic-form.
 */
util.chopExchangeComponentName = (component) => {
  const configPaths = util.getConfiguredPaths();
  // Get all external pack names.
  const externPacks = util.getExchangePacks();
  // Check if the component name begins with a pack name.
  let matchedPack = null;
  externPacks.some((p) => {
    if (component.startsWith(p)) {
      matchedPack = p;
      return true;
    }
    return false;
  });
  if (matchedPack) {
    const externalComponentName = component.slice(matchedPack.length + 1);
    if (util.fsExistsSync(path.join(configPaths.exchangeComponents,
      matchedPack, externalComponentName, constants.JET_COMPONENT_JSON
    ))) {
      return { pack: matchedPack, component: externalComponentName };
    }
  }
  return { pack: '', component };
};

/**
 * ## isExchangePack
 *
 * @private
 * @param {string} option.component component name
 * @returns {boolean} true if the name is a pack downloaded from the exchange
 *
 * This command is used to issue warnings - for example, we warn
 * if the user inadvertently lists an external pack name as a dependency.
 *
 *
 * Example: checking oraclejetconfig.json for an external pack name.
 *
 * If this were the returned json .components
 *  "demo-analog-clock": "^1.0.4",
 *  "oj-dynamic": {
 *    "components": {
 *       "form": "^9.0.0-alpha10"
 *     }
 *   }
 *
 * The Object.keys(externalComponentObj) would be ["demo-analog-clock", "oj-dynamic"]
 * So we check if both:
 *  - the name parameter matches indexOf, and
 *  - and it also has a .components subfield.
 *
 * This indicates that the name parameter is a pack name.
 *
 */
util.isExchangePack = (name) => {
  const externalComponentObj = util.getOraclejetConfigJson().components;
  if (externalComponentObj) {
    if (Object.keys(externalComponentObj).indexOf(name) !== -1 &&
        externalComponentObj[name].components) {
      return true;
    }
  }
  return false;
};


/**
 * ## getExchangePacks
 *
 * @private
 * @returns {Array} Array of pack names (which have been downloaded from the exchange)
 *
 */
util.getExchangePacks = () => {
  const externalComponentObj = util.getOraclejetConfigJson().components;
  const returnPacks = [];
  if (externalComponentObj) {
    Object.keys(externalComponentObj).forEach((componentOrPack) => {
      if (externalComponentObj[componentOrPack].components) {
        // If we have a .component sub field, then the variable
        // componentOrPack is a pack name
        returnPacks.push(componentOrPack);
      }
    });
  }
  return returnPacks;
};

/**
 * ## runPromisesInSeries
 * Run functions that return promises in sequence
 * i.e only run the next function after the previous
 * one resolves
 * @private
 * @param {Array} promiseFunctions array containing funcitons that
 * return promises
 * @param {Object} initiaValue initial value passed to first promise function
 * @returns {Promise} promise chain that runs
 * in sequence
 */
util.runPromisesInSeries = (promiseFunctions, initialValue = {}) => (
  promiseFunctions.reduce(
    (prev, next) => prev.then(next),
    Promise.resolve(initialValue)
  )
);

/**
 * ## runPromiseIterator
 * Run a single promise function iteratively (and synchronously) over an array of input parameters.
 * The first parameter is an array and serves as both an iterator and also as a series of
 * different input parameters to the promise function (second parameter).
 * @private
 * @param {args} array of args that are used with the second promiseFn param
 * @param {promiseFn} a Promise function
 * @returns {Promise} promise chain that runs in sequence
 */
util.runPromiseIterator = function (args, promiseFn) {
  if (!Array.isArray(args)) {
    return Promise.reject(new Error('runPromiseIterator expects an array as first parameter'));
  }
  if (args.length === 0) {
    return Promise.resolve();
  }
  return args.reduce((p, item) => { // eslint-disable-line arrow-body-style
    return p.then(() => promiseFn(item));
  }, Promise.resolve());
};

/**
 * ## isTypescriptApplication
 * @private
 * @returns {boolean} true if the host application
 * is written in typescript
 */
util.isTypescriptApplication = () => (
  util.fsExistsSync(util.getPathToTsConfig())
);

/**
 * ## getTypescriptComponentsSourcePath
 *
 * @private
 * @returns {string} path to typescript components
 */
util.getTypescriptComponentsSourcePath = () => {
  const configPaths = util.getConfiguredPaths();
  return path.join(
    configPaths.src.common,
    configPaths.src.typescript,
    configPaths.components
  );
};

/**
 * ## getLocalComponentPathMappings
 *
 * Look through src/ts/jet-composites and create
 * path mappings that point to the staging location
 * of the components
 *
 * @private
 * @param {Object} options.context build context
 * @returns {Object} local component path mappings
 */
util.getLocalComponentPathMappings = ({ context }) => {
  const configPaths = util.getConfiguredPaths();
  const componentsBasePath = util.getTypescriptComponentsSourcePath();
  const pathMappings = {};
  if (util.fsExistsSync(componentsBasePath)) {
    util.getDirectories(componentsBasePath).forEach((folder) => {
      if (util.isWebComponent({ component: folder })) {
        const component = folder;
        const pathToComponent = util.generatePathToComponentRoot({
          context,
          component,
          root: context.opts.stagingPath,
          scripts: configPaths.src.typescript
        });
        pathMappings[`${component}/*`] = [
          path.join(pathToComponent, 'types', '*'),
          path.join(pathToComponent, '*')
        ];
      }
    });
  }
  return pathMappings;
};

/**
 * ## getExchangeComponentPathMappings
 *
 * Look through /jet_components and create
 * path mappings for components with a /types folder that point to
 * theirt staging location
 *
 * @private
 * @param {Object} options.context build context
 * @returns {Object} exchange component path mappings
 */
util.getExchangeComponentPathMappings = ({ context }) => {
  const configPaths = util.getConfiguredPaths();
  const componentsBasePath = path.join(configPaths.exchangeComponents);
  const pathMappings = {};
  if (util.fsExistsSync(componentsBasePath)) {
    util.getDirectories(componentsBasePath).forEach((folder) => {
      const isComponent = util.isExchangeComponent({ component: folder });
      const hasTypesFolder = util.fsExistsSync(path.join(
        componentsBasePath,
        folder,
        'types'
      ));
      if (isComponent && hasTypesFolder) {
        const component = folder;
        pathMappings[`${component}/*`] = [path.join(
          util.generatePathToComponentRoot({
            context,
            component,
            root: context.opts.stagingPath,
            scripts: configPaths.src.javascript
          }),
          'types',
          '*'
        )];
      }
    });
  }
  return pathMappings;
};

/**
 * ## shouldNotRunTypescriptTasks
 * Determine if build process should not run
 * tasks
 * @private
 * @param {object} context build context
 * @returns {boolean} true if should not run Typescript tasks,
 * false otherwise
 */
util.shouldNotRunTypescriptTasks = context => !util.isTypescriptApplication() ||
  !!context.opts.notscompile;

/**
 * ## getSourceScriptsFolder
 * Get application's source scripts folder
 * @private
 * @returns {string} either ts or js
 */
util.getSourceScriptsFolder = () => {
  const configPaths = util.getConfiguredPaths();
  return util.isTypescriptApplication() ?
    configPaths.src.typescript : configPaths.src.javascript;
};

/**
 * ## getComponentPathFromThemingFileFest
 *
 * Get path data for the component that the theming
 * file (pcss or scss) belongs to e.g
 *
 * dest = web/js/jet-composites/oj-foo/css/oj-foo-styles.scss results
 * in an object = {
 *  componentPath: 'web/js/jet-composites/oj-foo/1.0.0/',
 *  subfolders: 'css'
 * }
 *
 * @private
 * @param {string} options.dest destination path for theming file
 * @param {boolean} options.isReleaseBuild
 * @returns {object} object containing the path to the component that theming
 * file belongs to and the subfolders between the theming file and the component
 * root
 */
util.getComponentPathFromThemingFileDest = ({ context, dest, isReleaseBuild }) => {
  const configPaths = util.getConfiguredPaths();
  const { pack, component, subFolders } = util.getComponentInformationFromFilePath({
    filePath: dest,
    filePathPointsToSrc: false
  });
  const componentPath = util.generatePathToComponentRoot({
    context,
    pack,
    component,
    root: configPaths.staging.stagingPath,
    scripts: configPaths.src.javascript,
    min: isReleaseBuild
  });
  return {
    componentPath,
    subFolders: util.pathJoin(subFolders)
  };
};

/**
 * ## isWebComponent
 *
 * Determine if the provided component name is
 * a valid JET web component
 *
 * @private
 * @param {string} pack pack name
 * @param {string} component component name
 * @returns {boolean} whether the provided component name is
 * a valid component
 */
util.isWebComponent = ({ pack, component }) => (
  util.isTypescriptComponent({ pack, component }) ||
  util.isJavascriptComponent({ pack, component }) ||
  util.isVComponent({ pack, component }) ||
  util.isExchangeComponent({ pack, component })
);

/**
 * ## getVComponentsInFolder
 *
 * Get vcomponents in the given folder by searching for sub folders
 * with a matching *.tsx file i.e folder/subfolder/subfolder.tsx
 *
 * @private
 * @returns {Array} array with vcomponent names if found
 */
util.getVComponentsInFolder = ({ folder }) => {
  const vcomponents = [];
  const files = glob.sync(util.posixPattern(path.join(folder, '*/*.tsx')));
  files.forEach((filepath) => {
    const file = path.basename(filepath, '.tsx');
    const subfolder = path.basename(path.dirname(filepath));
    if (file === subfolder) {
      vcomponents.push(subfolder);
    }
  });
  return vcomponents;
};

/**
 * ## getLocalVComponents
 *
 * Get local vcomponents
 *
 * @private
 * @returns {Array} array with vcomponent names if found
 */
util.getLocalVComponents = () => {
  const componentsCache = util.getComponentsCache();
  return util.getLocalComponents()
    .filter(component => componentsCache[component].isVComponent);
};

/**
 * ## getLocalCompositeComponents
 *
 * @private
 * @returns {Array} array with composite components names if found
 */
util.getLocalCompositeComponents = () => {
  const componentsCache = util.getComponentsCache();
  return util.getLocalComponents()
    .filter(component => !componentsCache[component].isVComponent);
};

/**
 * ## getLocalComponents
 *
 * Get local components
 *
 * @private
 * @returns {Array} array with component names if found
 */
util.getLocalComponents = () => {
  const componentsCache = util.getComponentsCache();
  const result = [];
  Object.keys(componentsCache).forEach((component) => {
    const { isLocal, componentJson } = componentsCache[component];
    if (isLocal && !util.hasProperty(componentJson, 'pack')) {
      result.push(component);
    }
  });
  return result;
};

/**
 * ## getVComponentComponentJson
 *
 * Determine if the provided component name is
 * a valid component
 *
 * @private
 * @param {object} option.context build context
 * @param {string} option.pack name of JET pack
 * @param {string} option.component name of vcomponent
 * @param {boolean} option.built whether the vcomponent has been built
 * @returns {object} vcomponent component.json
 */
util.getVComponentComponentJson = ({ context, pack = '', component, built = false }) => {
  if (!built) {
    return {
      name: component,
      version: util.getComponentVersion({ pack, component })
    };
  }
  const configPaths = util.getConfiguredPaths();
  const stagingPath = context ?
    context.opts.stagingPath : configPaths.staging.stagingPath;
  const pathToBuiltVComponentJson = path.join(
    util.generatePathToComponentRoot({
      context,
      pack,
      component,
      root: stagingPath,
      scripts: configPaths.src.javascript
    }),
    constants.JET_COMPONENT_JSON
  );
  return util.readJsonAndReturnObject(pathToBuiltVComponentJson);
};

/**
 * ## pointTypescriptPathMappingsToStaging
 *
 * Update typescript path mappings to point to the
 * staging directory i.e ./src/ts/* becomes ./<staging>/ts/*
 *
 * @private
 * @param {object} option.context build context
 * @param {object} option.pathMappings current path mappings
 * @returns {object} updated path mappings
 */
util.pointTypescriptPathMappingsToStaging = ({ context, pathMappings }) => {
  const updatedPathMappings = {};
  const configPaths = util.getConfiguredPaths();
  const srcFolder = configPaths.src.common;
  // eslint-disable-next-line prefer-template
  const sourceFolderRegex = new RegExp('^(\\.\\/)*' + srcFolder + '\\/');
  const stagingFolderPrefix = `./${context.opts.stagingPath}/`;
  Object.keys(pathMappings).forEach((key) => {
    updatedPathMappings[key] = pathMappings[key].map(mapping =>
      (mapping.replace(sourceFolderRegex, stagingFolderPrefix))
    );
  });
  return updatedPathMappings;
};

/**
 * ## addComponentToTsconfigPathMapping
 *
 * If in a typescript application, create a path mapping for the component
 * in the tsconfig.json file
 *
 * @param {string} options.component
 * @param {boolean} options.isLocal
 */
util.addComponentToTsconfigPathMapping = ({ component, isLocal }) => {
  if (util.isTypescriptApplication()) {
    const configPaths = util.getConfiguredPaths();
    const tsconfigJsonPath = util.getPathToTsConfig();
    const tsconfigJson = util.readJsonAndReturnObject(tsconfigJsonPath);
    const componentJson = util.getExchangeComponentComponentJson({ component });
    const srcFolder = configPaths.src.common;
    const compositesFolder = configPaths.components;
    const typescriptFolder = configPaths.src.typescript === '.' ? '' : `${configPaths.src.typescript}/`;
    let pathMapping = `${component}/*`;
    let exchangeCompPath;
    // Ensure that the reference components are also added to the tsconfig.json file:
    if (componentJson && componentJson.type === constants.COMPONENT_TYPE.REFERENCE) {
      const pathName = (componentJson.paths && componentJson.paths.name) ?
        componentJson.paths.name : componentJson.package;
      const modulePath = util.getModulePath(
        path.join(
          constants.NODE_MODULES_DIRECTORY,
          componentJson.package
        ),
        componentJson.package
      );
      if (modulePath !== null) {
        pathMapping = `${pathName}/*`;
        exchangeCompPath = `./${constants.NODE_MODULES_DIRECTORY}/${componentJson.package}/*`;
      }
    } else if (util.isExchangeComponent({ component })) {
      exchangeCompPath = `./${configPaths.exchangeComponents}/${component}/types/*`;
    }

    const typesPath = isLocal ?
      `./${srcFolder}/${typescriptFolder}${compositesFolder}/${component}/*` : exchangeCompPath;
    if (!tsconfigJson.compilerOptions.paths[pathMapping] && typesPath) {
      tsconfigJson.compilerOptions.paths = {
        ...(tsconfigJson.compilerOptions.paths || {}),
        [pathMapping]: [typesPath]
      };
      util.writeObjectAsJsonFile(tsconfigJsonPath, tsconfigJson);
    }
  }
};

/**
 * ## removeComponentFromTsconfigPathMapping
 *
 * @param {string} options.component
 */
util.removeComponentFromTsconfigPathMapping = ({ component }) => {
  if (util.isTypescriptApplication()) {
    const tsconfigJsonPath = util.getPathToTsConfig();
    const tsconfigJson = util.readJsonAndReturnObject(tsconfigJsonPath);
    const pathMapping = `${component}/*`;
    if (tsconfigJson.compilerOptions.paths[pathMapping]) {
      delete tsconfigJson.compilerOptions.paths[pathMapping];
      util.writeObjectAsJsonFile(tsconfigJsonPath, tsconfigJson);
    }
  }
};

/**
 * ## pathJoin
 *
 * Provide a consistent way of joining paths
 * thats independent of the OS i.e avoid using
 * path/to/resource over path\to\resource
 *
 * @returns {string} joined path
 */
util.pathJoin = (...paths) => (paths
  .filter(_path => !!_path)
  .filter((_path, index) => {
    // only first . or ./ is allowed through
    if (index !== 0 && (_path === '.' || _path === './')) {
      return false;
    }
    return true;
  })
  .join('/')
);

/**
 * ## isJETPack
 *
 * Determine if component or componentJson represents
 * a JET Pack
 * @param {string} pack
 * @param {object} componentJson
 * @returns {boolean}
 */
util.isJETPack = ({ pack, componentJson }) => {
  let _componentJson = {};
  if (componentJson) {
    _componentJson = componentJson;
  } else if (pack) {
    const componentCache = util.getComponentsCache()[pack];
    _componentJson = componentCache ? componentCache.componentJson
      : util.getComponentJson({ component: pack });
  }
  return util.hasProperty(_componentJson, 'type') && (_componentJson.type === 'pack' || _componentJson.type === constants.PACK_TYPE.MONO_PACK);
};

/**
 * ## getVComponentsInJETPack
 *
 * Get vcomponents inside JET pack by searching src/ts/jet-composites/<pack>
 * for folders that have a matching *.tsx file
 *
 * @private
 * @returns {Array} array with vcomponent names if found
 */
util.getVComponentsInJETPack = ({ pack }) => (
  util.getVComponentsInFolder({
    folder: util.getComponentPath({ component: pack })
  })
);

/**
 * ## getCompositeComponentJson
 *
 * @private
 * @param {object} options.context
 * @param {String} options.pack
 * @param {String} options.component
 * @param {boolean} built whether to get component.json from /src or /<staging>
 * @returns {object} component.json file
 */
util.getCompositeComponentJson = ({ context, pack, component, built }) => (
  util.readJsonAndReturnObject(path.join(
    util.getComponentPath({ context, pack, component, built }),
    constants.JET_COMPONENT_JSON
  ))
);

/**
 * ## getExchangeComponentComponentJson
 *
 * @private
 * @param {String} options.pack
 * @param {String} options.component
 * @returns {object} component.json file
 */
/**
 * ## getExchangeComponentComponentJson
 *
 * @private
 * @param {String} options.pack
 * @param {String} options.component
 * @returns {object} component.json file
 */
util.getExchangeComponentComponentJson = ({ pack = '', component }) => {
  const configPaths = util.getConfiguredPaths();
  if (util.fsExistsSync(
    path.join(configPaths.exchangeComponents,
      pack, component, constants.JET_COMPONENT_JSON))) {
    return util.readJsonAndReturnObject(path.join(
      configPaths.exchangeComponents,
      pack, component,
      constants.JET_COMPONENT_JSON));
  }
  const packCompObj = util.chopExchangeComponentName(component);
  if (packCompObj.pack !== '') {
    if (util.fsExistsSync(
      path.join(configPaths.exchangeComponents,
        packCompObj.pack, packCompObj.component,
        constants.JET_COMPONENT_JSON
      ))) {
      return util.readJsonAndReturnObject(path.join(
        configPaths.exchangeComponents,
        packCompObj.pack, packCompObj.component,
        constants.JET_COMPONENT_JSON));
    }
  }
  return null;
};

/**
 * ## getComponentJson
 *
 * @private
 * @param {object} options.context
 * @param {String} options.pack
 * @param {String} options.component
 * @param {boolean} options.built whether to get component.json from /src or /<staging>
 * @returns {object} component.json file
 */
util.getComponentJson = ({ context, pack, component, built }) => {
  if (util.isVComponent({ component, pack })) {
    return util.getVComponentComponentJson({ context, pack, component, built });
  } else if (util.isExchangeComponent({ pack, component }) &&
            !util.isLocalComponent({ pack, component })) {
    return util.getExchangeComponentComponentJson({ pack, component });
  }
  return util.getCompositeComponentJson({ context, pack, component, built });
};

/**
 * ## Replace content with expression
 * @param {string} content need to to be replaced
 * @param {expression} token literal which need to be matched
 * @param {string} Value string which need to be replaced
 */
util.regExReplace = (content, token, value) => {
  const regEx = new RegExp(token, 'g');
  return content.replace(regEx, value);
};

/**
 * ## minifyFiles
 *
 * Minifies an array of files using the
 * minification options provided
 *
 * @private
 * @param {object} options
 * @param {string[]} options.files list of files to minify
 * @param {object} options.options options to pass to minifier (terser)
 * @param {boolean} options.generateSourceMaps determine whether to generate
 * source maps for the minified files
 * @param {boolean} options.minify should terser be run
 */
util.minifyFiles = ({ files, options, generateSourceMaps, minify }) => (
  new Promise((resolve, reject) => {
    try {
      files.forEach(async (file) => {
        const destDir = file.dest;
        const code = util.readFileSync(file.src);
        const filename = path.parse(file.src).base;
        const sourceMap = generateSourceMaps ?
          { filename, url: `${filename}.map` } :
          false;
        const data = minify ? (await terser.minify(code, { ...options, sourceMap })) : { code };
        if (data.error) throw data.error;
        fs.outputFileSync(util.destPath(destDir), data.code);
        if (data.map) fs.outputFileSync(util.destPath(`${destDir}.map`), data.map);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  })
);

/**
 * ## getComponentsCahe
 *
 * Get components cache which maps each component's
 * full name to a map containing its componentJson, import name
 * etc
 * @returns {object} components cache
 */
util.getComponentsCache = () => (config('componentsCache') || {});

/**
 * ## getComponentInformationFromFilePath
 *
 * Get pack, component and subFolders from a
 * component file path e.g src/jet-composites/oj-pack/oj-foo/resources/config.json
 * will result in { pack: "oj-pack", component: "oj-foo", subFolders: ["resources"]}
 *
 * @param {object} options
 * @param {string} options.filePath
 * @param {boolean} options.filePathPointsToSrc
 * @returns {object} { pack, component, subFolders }
 */
util.getComponentInformationFromFilePath = ({ filePath, filePathPointsToSrc }) => {
  const configPaths = util.getConfiguredPaths();
  const basePath = filePathPointsToSrc ? configPaths.src.common : configPaths.staging.stagingPath;
  const javascriptBase = path.join(
    basePath,
    configPaths.src.javascript,
    configPaths.components
  );
  const typescriptBase = path.join(
    basePath,
    configPaths.src.typescript,
    configPaths.components
  );
  // go from (src|<staging>)/(js|ts)/jet-composites/<component>/* to
  // to <component>/* e.g. web/ts/jet-composites/oj-foo/loader.ts to
  // oj-foo
  const componentPath = path.normalize(filePath).startsWith(javascriptBase) ?
    path.dirname(path.relative(javascriptBase, filePath)) :
    path.dirname(path.relative(typescriptBase, filePath));
  const [componentRoot, ...subFolders] = componentPath.split(path.sep);
  let pack = '';
  let component = '';
  if (subFolders.length && util.isWebComponent({ pack: componentRoot, component: subFolders[0] })) {
    // componentPath corresponds to a pack component e.g oj-pack/oj-foo/loader.ts
    // results in componetRoot = oj-pack & subFolers[0] = oj-foo (pack component)
    // first subfolder corresponds to the pack component name so remove it from subFolders
    pack = componentRoot;
    component = subFolders.shift();
  } else {
    // componentPath corresponds to a singleton component e.g oj-foo/loader results
    // in componentRoot = oj-foo
    component = componentRoot;
  }
  return {
    pack,
    component,
    subFolders
  };
};

/**
 * ## getComponentBasePaths
 *
 * Returns a component's source and destination
 * base paths. It is primarily used by copy and minify tasks.
 * When copying, our source should always be src.common. When
 * minifying, our source shouuld always be staging.stagingPath
 *
 * @private
 * @param {object} context build context
 * @param {string} component component name
 * @param {boolean} minify whether base paths are for minify
 * task
 * @returns {string} result.srcBase -  component source's base path
 * @returns {string} result.destBase -  component destination's base path
 */
util.getComponentBasePaths = ({ context, component, minify = false }) => {
  // we always minify from the staging dir and copy from the src dir
  const srcBaseRoot = minify ? context.opts.stagingPath : config('paths').src.common;
  const isTypescriptComponent = util.isTypescriptComponent({ component }) ||
    util.isVComponent({ component });
  const scriptsSource = isTypescriptComponent ?
    config('paths').src.typescript : config('paths').src.javascript;
  // we always minify using javascript files. for copying, it
  // depends on whether the component is ts or js based
  const baseScripts = minify ? config('paths').src.javascript : scriptsSource;
  const srcBase = path.join(
    srcBaseRoot,
    baseScripts,
    config('paths').components
  );
  const destBase = path.join(
    context.opts.stagingPath,
    baseScripts,
    config('paths').components
  );
  return {
    srcBase,
    destBase
  };
};

/**
 * ## generatePathToComponentRoot
 *
 * Generate a path to the component root e.g
 * <root>/<scripts>/jet-composites/<pack>/<version>/<component>
 * if pack is passed or <root>/<scripts>/jet-composites/<component>/<version>
 * otherwise. A "versioned" paramter (true by default) can be passed to
 * generate a path with a version or not
 *
 * @param {object} options
 * @param {string} options.pack
 * @param {string} options.component
 * @param {string} options.root
 * @param {string} options.scripts
 * @param {boolean} options.versioned
 * @param {boolean} options.min
 */
util.generatePathToComponentRoot = ({
  context,
  pack,
  component,
  root,
  scripts,
  versioned = true,
  min = false
}) => {
  const _versioned = util.useUnversionedStructure(context) ? false : versioned;
  const configPaths = util.getConfiguredPaths();
  const baseComponentPath = path.join(
    root,
    scripts,
    configPaths.components
  );
  return pack ? path.join(
    baseComponentPath,
    pack,
    _versioned ? util.getComponentVersion({ component: pack }) : '',
    min ? 'min' : '',
    component
  ) : path.join(
    baseComponentPath,
    component,
    _versioned ? util.getComponentVersion({ component }) : '',
    min ? 'min' : ''
  );
};

/**
 * Resolve local app library first (for things like webpack, etc)
 * @param {string}
 * @returns module reference
 */
util.requireLocalFirst = (moduleName) => {
  try {
    const localAppPath = path.join(process.cwd(), constants.NODE_MODULES_DIRECTORY, moduleName);
    // eslint-disable-next-line
    const module = require(localAppPath);
    return module;
  } catch (e) {
    // Couldn't find it locally, try general require
    // eslint-disable-next-line
    return require(moduleName);
  }
};

/**
 * Determine the proper @oracle/oraclejet-tooling module location path (global or local)
 * @returns {string} path to @oracle/oraclejet-tooling, preferring local
 */
util.getToolingPath = () => util.getModulePath(constants.TOOLING_PATH,
  constants.ORACLEJET_TOOLING_NAME);

/**
 * Determine the correct path to an installed module
 * @param {string} modulePath hard path to module to check first
 * @param {string} name of module to find
 *
 * @returns {string} path to a module.  null if not found
 */
util.getModulePath = (modulePath, name) => {
  let source;
  if (modulePath) {
    source = path.resolve(modulePath);
    if (util.fsExistsSync(source)) {
      return source;
    }
  }
  try {
    source = path.dirname(require.resolve(`${name}/package.json`));
    if (util.fsExistsSync(source)) {
      return source;
    }
  } catch (e) {
    try {
      // Finally, check the cwd
      source = path.dirname(require.resolve(`${name}/package.json`, { paths: [process.cwd()] }));
      if (util.fsExistsSync(source)) {
        return source;
      }
    } catch (e2) {
      // Problem: couldn't find
      return null;
    }
  }

  // Not found at all
  return null;
};

/**
 * Determine the proper @oracle/oraclejet module location path (global or local)
 * @returns {string} path to @oracle/oraclejet, preferring local
 */
util.getOraclejetPath = () => util.getModulePath(constants.ORACLEJET_PATH,
  constants.ORACLEJET_NAME);

/**
 * Determine the proper @oracle/oraclejet-icu-l10n module location path (global or local)
 * @returns {string} path to @oracle/oraclejet-icu-l10n, preferring local
 */
util.getIcuL10nPath = () => util.getModulePath(constants.ICU_L10N_PATH,
  constants.ORACLEJET_ICU_L10N_NAME);

/**
 * Get the bundler to during the release build.
 * @returns {string} bundler to use during release build (webpack or r.js)
 */
util.getBundler = () => {
  const oracletjetConfig = util.getOraclejetConfigJson();
  return oracletjetConfig.bundler;
};

/**
 * Determine whether to bundle with webpack or not
 * @returns {boolean}
 */
util.bundleWithWebpack = () => (util.getBundler() === 'webpack');

/**
 * Determine whether to build application (end-to-end) with webpack or not
 * @returns {boolenan}
 */
util.buildWithWebpack = () => (util.fsExistsSync(constants.PATH_TO_OJET_CONFIG));

/**
 * Get name to use for the application bundle file created
 * during release build. Default value is bundle.js
 * @returns {object} object with "full" property corresponding
 * to the full bundle file name (e.g. "bundle.js") and "prefix" property
 * corresponding to the bundle file name without the file extension (e.g. "bundle")
 */
util.getBundleName = () => {
  const oraclejetconfig = util.getOraclejetConfigJson();
  const bundleName = oraclejetconfig.bundleName || constants.DEFAULT_BUNDLE_NAME;
  return {
    full: bundleName,
    prefix: path.basename(bundleName, '.js')
  };
};

/**
 * Formats a time value in milliseconds to a seconds string
 *
 * @param {number}
 * @returns {string}
 */
util.formatSeconds = function (value) {
  return `${Math.round(((value / 1000) + Number.EPSILON) * 1000) / 1000}s`;
};

/**
 * Defines a factory for creating profile methods that take care of instantiating
 * PerformanceObserver
 *
 * @param {object} measurements a timer map
 * @returns {object}
 */
util.profilerFactory = (measurements) => {
  // Set up the PerformanceObserver instance
  const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
      // eslint-disable-next-line no-param-reassign
      measurements[entry.name] += entry.duration;
    });
  });

  perfObserver.observe({ entryTypes: ['measure'], buffer: true });

  /**
   * Profiles performance of a function returning a promise
   *
   * @param {function} func function to profile
   * @param {object} funcOptions profiled function options
   * @param {string} measurement measurement id
   * @returns {Promise}
   */
  const profile = (func, funcOptions, measurement) => {
    const measureStart = `${measurement}-start`;
    const measureEnd = `${measurement}-end`;
    performance.mark(measureStart);
    return func(funcOptions).then((funcResponse) => {
      performance.mark(measureEnd);
      performance.measure(measurement, measureStart, measureEnd);
      return Promise.resolve(funcResponse);
    });
  };

  /**
   * Disconnects the performance observer instance
   */
  const disconnect = () => perfObserver.disconnect();

  return {
    profile,
    disconnect
  };
};

/**
 * ## util.hasDependenciesToken
 *
 * @param {object} componentJson
 * @returns true if componentJson has dependencies token, false otherwise
 */
util.hasDependenciesToken = componentJson => typeof componentJson.dependencies === 'string' &&
 componentJson.dependencies.toLowerCase() === constants.COMPONENT_JSON_DEPENDENCIES_TOKEN;

/**
 * ## util.hasContentsToken
 *
 * @param {object} componentJson
 * @returns true if mono-pack componentJson has contents token, false otherwise
 */
// eslint-disable-next-line max-len
util.hasContentsToken = componentJson => componentJson.contents.indexOf(constants.MONO_PACK_CONTENTS_TOKEN) !== -1;

/**
 * ## util.injectFileIntoApplication
 *
 * Inject file into the current application
 *
 * @private
 * @param {string} options.name name of file
 * @param {string} options.src path to file src
 * @param {string} options.dest path to file dest
 * @returns {Promise}
 */
util.injectFileIntoApplication = ({ name, src, dest }) => {
  util.log(`Adding ${dest}`);
  return new Promise((resolve) => {
    fs.pathExists(dest)
      .then((exists) => {
        if (!exists) {
          fs.copy(src, dest)
            .then(resolve)
            .catch(util.log.error);
        } else {
          const ext = path.extname(name);
          fs.rename(dest, dest.replace(ext, `_old${ext}`))
            .then(() => {
              fs.copy(src, dest)
                .then(resolve)
                .catch(util.log.error);
            })
            .catch(util.log.error);
        }
      })
      .catch(util.log.error);
  });
};

/**
 * Determine whether the current application is a VDOm
 * application i.e is built using the VDOM architecture
 *
 * @returns {boolean}
 */
util.isVDOMApplication = () => {
  const oraclejetConfig = util.getOraclejetConfigJson();
  if (oraclejetConfig && util.hasProperty(oraclejetConfig, 'architecture')
    && oraclejetConfig.architecture === constants.VDOM_ARCHITECTURE) {
    return true;
  }
  return false;
};

/**
 * Retrieves the array with elements in the format
 * <packName>-<componentName>. This info is needed
 * to retrieve respective component's component
 * cache for mono-packs.
 *
 * @returns {array}
 */
util.getMonoPackMemberNameList = (packComponentJson) => {
  const contentsArray = packComponentJson.contents;
  const packName = packComponentJson.name;
  const packMemberNameList = [];

  if (!contentsArray) {
    return [];
  }

  contentsArray.forEach((content) => {
    // Do not include non component contents:
    if (!content.type || (content.type !== 'module') ||
      ['resource', 'composite'].includes(content.type)) {
      packMemberNameList.push(`${packName}-${content.name}`);
    }
  });
  return packMemberNameList;
};

/**
 * ## util.getComponentJsDocsJsonFile
 *
 * This method return the json file used to generate Js Docs
 * For example, a vcomponent my-component-1-to-test-the-format
 * gets transformed to MyComponent1ToTestTheFormat.json, which
 * is in the used naming format for such files.
 *
 * @param {string} component
 * @returns string
 */
util.getComponentJsDocsJsonFile = (component) => {
  const jsDocJsonFile = component
    .toLowerCase()
    .split('-')
    .map(componentName => componentName.charAt(0).toUpperCase() + componentName.slice(1))
    .join('')
    .concat('.json');
  return jsDocJsonFile;
};

/**
 * util.useUnversionedStructure
 *
 * Should determine what version structure to use depending on the
 * configured oraclejet configure property "unversioned" or the flag
 * --omit-component-version flag:
 *
 * @param {object} context
 * @returns Boolean
 */
util.useUnversionedStructure = (context) => {
  const omitComponentVersionFlag = context && context.opts &&
    context.opts[constants.OMIT_COMPONENT_VERSION_FLAG];
  const configUnversionedValue = util.getOraclejetConfigJson().unversioned;

  if (configUnversionedValue !== undefined) {
    return configUnversionedValue;
  }

  return (omitComponentVersionFlag && configUnversionedValue === undefined);
};

/**
 * util.replaceVersionToken
 *
 * Replace the version token with the lib number
 *
 * @param {string} libPath
 * @param {array} version
 * @param {string} libName
 */
util.replaceVersionToken = (libPath, versions, libName) => {
  // Specialized handling for very specific case for rc versions
  if (libName === 'oj-c') {
    const versionStr = /\d+.\d+.\d+-rc.\d+/;
    const ver = libPath.match(versionStr);
    if (ver && ver.length > 0) {
      return libPath.replace(constants.PATH_MAPPING_VERSION_TOKEN, ver[0]);
    }
  }
  return libPath.replace(constants.PATH_MAPPING_VERSION_TOKEN, versions[libName]);
};

/**
 * util.isValidName
 * Validate a name by checking if the second segment does not start with a digit.
 * @param {string} name component or pack name to validate
 * @returns {boolean} True if the name is valid, false otherwise
 */

util.isValidName = (name) => {
  const validateSegment = segments => (segments.length < 2 || isNaN(parseInt(segments[1][0], 10)));

  return validateSegment(name.split('-'));
};

/**
 * util.buildICUTranslationsBundle
 * Checks whether buildICUTranslationsBundle is defined in the
 * oraclejetconfig.json file and returns its value.
 * @returns {boolean} True if defined and set to true, false otherwise;
 */
util.buildICUTranslationsBundle = () => {
  let isICUTranslation;
  const oraclejetConfig = util.getOraclejetConfigJson();

  if (oraclejetConfig.buildICUTranslationsBundle === undefined) {
    return false;
  }

  if (oraclejetConfig.translation) {
    isICUTranslation = oraclejetConfig.translation.type === constants.TRANSLATION_TYPE.ICU;
  }

  return oraclejetConfig.buildICUTranslationsBundle && isICUTranslation;
};

util.getPathsToComponentsFoldersInSrcByAppType = ({ appType }) => {
  const pathToApp = util.destPath();
  const configPaths = util.getConfiguredPaths();
  const pathToSrcFolder = path.join(pathToApp, configPaths.src.common);

  const pathToJsComponentsFolder = path.join(
    pathToSrcFolder,
    configPaths.src.javascript,
    constants.JET_COMPOSITE_DIRECTORY
  );

  const pathToTsComponentsFolder = path.join(
    pathToSrcFolder,
    configPaths.src.typescript,
    constants.JET_COMPOSITE_DIRECTORY
  );

  const pathToVdomComponentsFolder = path.join(
    pathToSrcFolder,
    constants.COMPONENTS_DIRECTORY
  );

  const pathsToComponents = {
    ts: pathToTsComponentsFolder,
    js: pathToJsComponentsFolder,
    vdom: pathToVdomComponentsFolder
  };

  return pathsToComponents[appType];
};

util.getComponentsPathInSrc = () => {
  let componentPaths;

  if (util.isVDOMApplication()) {
    componentPaths = util.getPathsToComponentsFoldersInSrcByAppType({ appType: 'vdom' });
  } else if (util.isTypescriptApplication()) {
    componentPaths = util.getPathsToComponentsFoldersInSrcByAppType({ appType: 'ts' });
  } else {
    componentPaths = util.getPathsToComponentsFoldersInSrcByAppType({ appType: 'js' });
  }

  return componentPaths;
};

util.getJETComponentsInFolder = (folderPath) => {
  let jetComponents = [];
  if (fs.existsSync(folderPath)) {
    jetComponents = fs.readdirSync(folderPath)
      .filter((item) => {
        const itemPath = path.join(folderPath, item);

        if (!fs.statSync(itemPath).isDirectory()) {
          return false;
        }

        if (util.isLocalComponent({ component: item })) {
          return true;
        }

        const pathToComponentJson = path.join(itemPath, constants.COMPONENTS_DIRECTORY);

        if (fs.existsSync(pathToComponentJson)) {
          const componentJson = JSON.parse(fs.readFileSync(pathToComponentJson, 'utf8'));
          return util.isJETPack({ pack: item, componentJson });
        }

        return false;
      });
  }
  return jetComponents;
};

util.getComponentsInPack = ({ packName, pathToPack }) => {
  let componentsInPack = [];
  if (fs.existsSync(pathToPack)) {
    componentsInPack = fs.readdirSync(pathToPack)
      .filter((item) => {
        const itemPath = path.join(pathToPack, item);

        if (!fs.statSync(itemPath).isDirectory()) {
          return false;
        }

        if (util.isLocalComponent({ pack: packName, component: item })) {
          return true;
        }

        return false;
      });
  }

  return componentsInPack;
};
