#! /usr/bin/env node
/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

/**
 * ## Dependencies
 */

const fs = require('fs-extra');
const path = require('path');
const util = require('./util');
const CONSTANTS = require('./constants');
/**
 * #addpwa
 *
 * @public
 * @returns {Promise}
 */

module.exports = function () {
  const appName = path.basename(process.cwd());
  const appNameRegex = new RegExp('@AppName@', 'g');
  const pathToApp = path.join('src');
  const pathToIndexHtml = path.join(pathToApp, 'index.html');
  const pathToServiceWorkerTemplates = path.join(util.getToolingPath(),
    CONSTANTS.PATH_TO_PWA_TEMPLATES);
  // 1. read index.html
  const indexHtmlString = fs.readFileSync(
    pathToIndexHtml,
    { encoding: 'utf-8' }
  );
  // 2. read sw.txt, replace app name token and resources to cache
  //    according to the app's architecture, and then write to app as js file
  let swJsString;
  if (util.isVDOMApplication()) {
    swJsString = fs.readFileSync(
      path.join(pathToServiceWorkerTemplates, 'sw.txt'),
      { encoding: 'utf-8' });
    const vdomResourcesToCache = `[
      'index.js',
      'index.html',
      'bundle.js',
      'manifest.json',
      'components/',
      'libs/',
      'styles/',
      'assets/'
    ]`;
    const mvvmResourcesToCache = "['index.html', 'manifest.json', 'js/', 'css/', 'assets/']";
    swJsString = swJsString.replace(mvvmResourcesToCache, vdomResourcesToCache);
  } else {
    swJsString = fs.readFileSync(
      path.join(pathToServiceWorkerTemplates, 'sw.txt'),
      { encoding: 'utf-8' });
  }
  const pathToAppSw = path.join(pathToApp, 'sw.js');
  if (fs.pathExistsSync(pathToAppSw)) {
    fs.renameSync(pathToAppSw, path.join(pathToApp, 'sw_old.js'));
  }
  fs.outputFileSync(
    pathToAppSw,
    swJsString.replace(appNameRegex, appName)
  );
  // 3. read manifest.json, replace app name token, write to app
  const manifestJsonString = fs.readFileSync(
    path.join(pathToServiceWorkerTemplates, 'manifest.json'),
    { encoding: 'utf-8' }
  );
  const pathToAppManifest = path.join(pathToApp, 'manifest.json');
  if (fs.pathExistsSync(pathToAppManifest)) {
    fs.renameSync(pathToAppManifest, path.join(pathToApp, 'manifest_old.json'));
  }
  fs.outputFileSync(
    path.join(pathToApp, 'manifest.json'),
    manifestJsonString.replace(appNameRegex, appName)
  );
  // 4. copy swInit.txt and add it to end of body tag index.html, add <link>
  // and other necessary to end of header tag in index.html and update
  const swInitString = fs.readFileSync(
    path.join(pathToServiceWorkerTemplates, 'swInit.txt'),
    { encoding: 'utf-8' }
  );
  const additionalTagsForPWALighthouseCompliance = `
    <meta name="apple-mobile-web-app-title" content="Oracle JET" />
    <meta name="theme-color" content="#000000">
    
    <!-- Splash screens -->
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-640x1136.jpg" media="(device-width: 320px) and (device-height: 568px)">
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-750x1334.jpg" media="(device-width: 375px) and (device-height: 667px)">
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-1242x2208.jpg" media="(device-width: 414px) and (device-height: 736px)">
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-1125x2436.jpg" media="(device-width: 375px) and (device-height: 812px)">
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-828x1792.jpg" media="(device-width: 414px) and (device-height: 896px)">
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-1242x2688.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)">
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-1536x2048.jpg" media="(device-width: 768px) and (device-height: 1024px)">
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-1668x2224.jpg" media="(device-width: 834px) and (device-height: 1112px)">
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-1668x2388.jpg" media="(device-width: 834px) and (device-height: 1194px)">
    <link rel="apple-touch-startup-image" href="assets/splashscreens/splash-2048x2732.jpg" media="(device-width: 1024px) and (device-height: 1366px)">
    `;
  fs.outputFileSync(
    pathToIndexHtml,
    indexHtmlString.replace(
      new RegExp('</head>', 'g'),
      `${additionalTagsForPWALighthouseCompliance}\n<link rel="manifest" href="manifest.json">\n</head>`
    ).replace(
      new RegExp('</body>', 'g'),
      `${swInitString.replace(appNameRegex, appName)}\n</body>`
    )
  );

  // 5. Copy the assets into the /src folder: This will add the needed
  // icons and splashscreens, among others.
  fs.copySync(
    path.join(pathToServiceWorkerTemplates, 'assets'),
    path.join(pathToApp, 'assets')
  );

  // 6. Copy over swinit.js
  fs.copyFileSync(path.join(pathToServiceWorkerTemplates, 'swinit._js'),
    path.join(pathToApp, 'swinit.js'));

  // 7. Ensure that the app name token is replaced by the app name:
  fs.outputFileSync(
    path.join(pathToApp, 'swinit.js'),
    fs.readFileSync(
      path.join(pathToApp, 'swinit.js'), { encoding: 'utf-8' }
    ).replace(
      appNameRegex,
      appName
    )
  );

  return Promise.resolve();
};
