/**
 * @license
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{processCustomUrl}}
 */
const TokenUtils = (() => {
  const { dialog, net } = require('electron');
  const { log } = require('./console-logger');
  const I18NUtils = require('./i18n-utils');

  // Wait time before ending process!
  const processEndWait = 1000;

  // End process handling...
  function processEnd() {
    log('debug', `Handle Custom URL end process: ${process.pid}`);
    process.exit();
    process.kill(process.pid, 9);
  }

  // Error message box handling...
  function showErrorMessageBox(messageText, endProcess) {
    const message = `${messageText}\n>>> ${I18NUtils.get('wrc-electron.dialog.customurl.checklog.message')}`;
    const title = `${I18NUtils.get('wrc-electron.labels.app.appName.value')} - ${I18NUtils.get('wrc-electron.dialog.customurl.error.title')}`;
    dialog.showMessageBox(undefined,
      {
        title: title,
        buttons: [`${I18NUtils.get('wrc-common.buttons.ok.label')}`],
        type: 'warning',
        message: message
      }
    ).then(() => {
        if (endProcess) setTimeout(processEnd, processEndWait);
    });
  }

  return {
    /**
     * Process the supplied Custom URL value and indicate
     * if the process should end once processing is completed.
     *
     * The Custom URL is parsed into JSON data that will be
     * included with an HTTP POST request to the console backend.
     */
    processCustomUrl: (url, endProcess = false) => {
      // Check Custom URL syntax for any errors...
      let wrcUrl;
      try {
        wrcUrl = new URL(url);
      }
      catch(error) {
        // URL syntax error should only appear if there is a problem with the remote
        // console helper or the user is directly entering custom URLs in the browser.
        log('error', `Handle Custom URL - Invalid URL syntax: ${error} (${process.pid})`);
        showErrorMessageBox(`${I18NUtils.get('wrc-electron.dialog.customurl.badurl.message')}`, endProcess);
        return;
      }

      // Parse the Custom URL to gather the HTTP request data: ssoid, domain, token, expires
      // Check the domain protocol in the event that a non-secure context used for authentication
      const protocol = wrcUrl.searchParams.get('protocol');
      const domainProtocol = protocol ? protocol : 'https';
      const domain = domainProtocol + '://' + wrcUrl.host;
      const ssoid = wrcUrl.searchParams.get('ssoid');

      // Log the results of parsing the Custom URL information but do _not_ include the token!
      log('info', `Handle Custom URL: ${domain} - ssoid: ${ssoid} (${process.pid})`);

      // Get token information...
      const token = wrcUrl.searchParams.get('token');
      const expiresInt = parseInt(wrcUrl.searchParams.get('expires'));
      const expires = isNaN(expiresInt) ? 300 : expiresInt;

      // Get the backend port...
      const port = parseInt(wrcUrl.searchParams.get('port'));
      const backendPort = isNaN(port) ? 8012 : port;

      // Create the HTTP request used to send the token to the console backend!
      let request;
      try {
        request = net.request({
            method: 'POST',
            protocol: 'http:',
            hostname: 'localhost',
            port: backendPort,
            path: '/api/token',
            redirect: 'error'
        });
      }
      catch (error) {
        // Web authentication would normally occur from a running remote console app.
        // However, a network error is thrown if the console app is sent the Custom URL
        // and the console app is not yet ready. Simply log the issue and return
        // so that the web authentication can be tried again!
        log('error', `Handle Custom URL - Network unavailable: ${error} (${process.pid})`);
        if (endProcess) setTimeout(processEnd, processEndWait);
        return;
      }

      // Create the HTTP request body from the JSON payload for the console backend...
      const body = JSON.stringify({
        ssoid: ssoid,
        domain: domain,
        token: token,
        expires: expires
      });

      // Log the location of the backend using the port number...
      log('debug', `Handle Custom URL: POSTing to backend at port ${backendPort} (${process.pid})`);

      // Log when when the HTTP request setup has completed...
      request.on('close', () => {
        log('debug', `Handle Custom URL request closed: ${process.pid}`);
      });

      // Handle when the response to the HTTP request is received from the backend...
      request.on('response', (response) => {
        log('info', `Handle Custom URL status: ${response.statusCode} (${process.pid})`);
        if ((response.statusCode >= 200) && (response.statusCode < 300)) {
          // All is well, so now it's time to pull the plug if specified!
          if (endProcess) setTimeout(processEnd, processEndWait);
        } else {
          // Houston, we have a problem... Show the error dialog when a failure status code returned!
          showErrorMessageBox(`${I18NUtils.get('wrc-electron.dialog.customurl.problem.message')}`, endProcess);
        }
      });

      // Handle when there is an error sending the HTTP request to the backend...
      request.on('error', (error) => {
        log('info', `Handle Custom URL error: ${error} (${process.pid})`);
        showErrorMessageBox(`${I18NUtils.get('wrc-electron.dialog.customurl.problem.message')}`, endProcess);
      });

      // Set the HTTP request headers, write the request body and end the client request!
      request.setHeader('Content-Type', 'application/json');
      request.write(body);
      request.end();
    }
  };
})();

module.exports = TokenUtils;
