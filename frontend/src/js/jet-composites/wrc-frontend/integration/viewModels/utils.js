/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * @module
 */
define([
  'ojs/ojcore',
  'wrc-frontend/apis/data-operations',
  'wrc-frontend/apis/message-displaying',
  'wrc-frontend/microservices/preferences/preferences-manager',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/types',
  'wrc-frontend/core/utils',
  'ojs/ojlogger'
],
  function (
    oj,
    DataOperations,
    MessageDisplaying,
    PreferencesManager,
    Runtime,
    CoreTypes,
    CoreUtils,
    Logger
  ) {
    const i18n = {
      'labels': {
        'unexpectedErrorResponse': {value: oj.Translations.getTranslatedString('wrc-view-model-utils.labels.unexpectedErrorResponse.value')}
      },
      'messages': {
        'connectionRefused': {
          'summary': oj.Translations.getTranslatedString('wrc-view-model-utils.messages.connectionRefused.summary'),
          'details': oj.Translations.getTranslatedString('wrc-view-model-utils.messages.connectionRefused.details')
        }
      }
    };

    function displayResponseMessage(message) {
      MessageDisplaying.displayMessage({
          severity: message.severity || 'error',
          summary: message.summary,
          detail: message.detail
        }, PreferencesManager.notifications.autoCloseInterval()
      );
    }

    function failureResponseDefaultHandling (response, severity) {
      // For a coding error, the response will be
      // the JavaScript Error. If that is the case,
      // then re-create the response object with
      // the actual failureType and failureReason
      // properties.
      if (CoreUtils.isError(response) ||
        CoreUtils.isError(response.failureReason)
      ) {
        if (CoreTypes.isConnectionResponseFailure(response)) {
          severity = 'warning';
          response = {
            failureType: CoreTypes.FailureType.CONNECTION_REFUSED,
            failureReason: response.failureReason.message
          };
        }
        else {
          response = {
            failureType: CoreTypes.FailureType.UNEXPECTED,
            failureReason: response
          };
        }
      }

      if (PreferencesManager.notifications.showPopupForFailureResponsesPreference()) {
        let messageSummary, messageDetails;
        // The end user's "showPopupForFailureResponses"
        // preference setting has a value of true, so
        // display the message. Use response.failureReason
        // to craft the summary property.
        if (response.failureType === CoreTypes.FailureType.CONNECTION_REFUSED) {
          messageSummary = oj.Translations.getTranslatedString('wrc-view-model-utils.messages.connectionRefused.summary');
          messageDetails = oj.Translations.getTranslatedString('wrc-view-model-utils.messages.connectionRefused.details');
        }
        else {
          messageSummary = (CoreUtils.isError(response.failureReason) ? response.failureReason.name : oj.Translations.getTranslatedString('wrc-view-model-utils.labels.unexpectedErrorResponse.value'));
          messageDetails = response.failureReason;
          // Look for a response message to use for the message details displayed to the user
          if (CoreUtils.isNotUndefinedNorNull(response?.body?.messages)
            && CoreUtils.isNotUndefinedNorNull(response.body.messages[0]?.message)) {
            messageDetails = response.body.messages[0].message;
            severity = CoreUtils.isNotUndefinedNorNull(response.body.messages[0]?.severity) ? response.body.messages[0].severity : severity;
          }
        }

        // Assign 'error' to severity, if parameter wasn't provided
        severity = (severity || 'error');

        // Set value of severity to "info", if an invalid value was
        // assigned to the severity parameter.
        if (!['error', 'warning', 'info'].includes(severity)) severity = 'info';

        // Display failure type message.
        MessageDisplaying.displayMessage(
          {
            severity: severity,
            summary: messageSummary,
            detail: messageDetails
          }
        );
      }

      if (PreferencesManager.logging.logFailureResponses()) {
        // The end user's "logFailureResponses"
        // preference setting has a value of true, so
        // log the failure reason.
        if (CoreUtils.isError(response.failureReason)) {
          // Failure was caused by a JavaScript Error
          // Create log message with ERROR severity that
          // is the stacktrace for the Error.
          Logger.error(`${response.failureReason.stack}`);
        }
        else {
          // Failure was transport-related, so the
          // failureReason will be the statusText
          // of the HTTP response.
          Logger.error(`statusText=${response.failureReason}`);
        }
      }

      // Return response, as this utility function is
      // just for the "default" handling of a failure
      // response.
      return response;
    }

    return {
      i18n: i18n,

      /**
       * Determines if a given ``response`` has messages in it.
       * @param {{body: {data: any, [messages]: any}}|{failureType: FailureType, [failureReason]: any}|any} response
       * @returns {{boolean}}
       */
      hasResponseMessages: function (response) {
        return (
          CoreUtils.isNotUndefinedNorNull(response) &&
          CoreUtils.isNotUndefinedNorNull(response.body) &&
          CoreUtils.isNotUndefinedNorNull(response.body.messages)
        );
      },

      displayResponseMessage: displayResponseMessage,

      displayFailureResponseMessages: (messages) => {
        if (CoreUtils.isNotUndefinedNorNull(messages) && messages.length > 0) {
          MessageDisplaying.displayErrorMessagesHTML(messages, i18n.labels.unexpectedErrorResponse.value, 5000);
        }
      },

      getResponseBodyMessages: function (response, properties) {
        let bodyMessages = [], errorMessage;
        if (CoreUtils.isError(response)) {
          errorMessage = {
            severity: 'error',
            summary: i18n.labels.unexpectedErrorResponse.value,
            detail: response.stack
          };
          bodyMessages.push(errorMessage);
        }
        else if (CoreUtils.isNotUndefinedNorNull(response.body) && CoreUtils.isNotUndefinedNorNull(response.body.messages)) {
          response.body.messages.forEach((message) => {
            if (CoreUtils.isUndefinedOrNull(message.property)) {
              errorMessage = {
                severity: message.severity.toLowerCase(),
                summary: response.failureReason,
                detail: message.message
              };
              bodyMessages.push(errorMessage);
            }
            else {
              errorMessage = { severity: message.severity };
              const property = properties.find(property => property.name === message.property);
              if (typeof property !== 'undefined') errorMessage['summary'] = property.label;
              errorMessage['detail'] = message.message;
              bodyMessages.push(errorMessage);
            }
          });
        }
        return bodyMessages;
      },

      getResponseErrorMessages: (response, correctiveActions = '') => {
        const responseErrorMessages = {
          status: response.transport.status,
          html: '<p/>'
        };
        if (CoreUtils.isNotUndefinedNorNull(response.body.messages) && response.body.messages.length > 0) {
          const details = [];
          response.body.messages.forEach((message) => {
            details.push({detail: message.message});
          });
          responseErrorMessages.html = `${correctiveActions}${MessageDisplaying.getErrorMessagesAsHTML(details)}`;
        }
        return responseErrorMessages;
      },

      getYAMLExceptionFailureMessage: (failure) => {
        return oj.Translations.getTranslatedString('wrc-data-providers.messages.correctiveAction.yamlException.detail',
          `${failure.failureReason.reason.charAt(0).toUpperCase()}${failure.failureReason.reason.slice(1)}`,
          failure.failureReason.mark.line + 1,
          failure.failureReason.mark.column
        );
      },
  
      /**
       * Provides default handling of responses passed in Promise rejections.
       * <p>User preferences govern the behavior of this method:<p>
       *   <ul>
       *     <li><code>notifications.showPopupForFailureResponses|boolean</code>&nbsp;&nbsp;&nbsp;Default: <code>false</code></li>
       *     <li><code>logging.logFailureResponses|boolean</code>&nbsp;&nbsp;&nbsp;Default: <code>true</code></li>
       *   </ul>
       * </p>
       * <p>See the <code>src/js/jet-composites/wrc-frontend/config/console-preferences.yaml</code> file.</p>
       * @param {{body: {data: any, [messages]: any}}|{failureType: FailureType, failureReason?: any}|{Error}} response
       * @param {"error"|"warn"|"info"} [severity] - Optional severity to use for ``failureReason``. The possible values are: "error", "warn" and "info". The value "info" will be used, if not provided or not one of the possible values.
       * @returns {{body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}}
       */
      failureResponseDefaultHandling: failureResponseDefaultHandling,

      /**
       * Sets the cursor to a given ``type``
       * <p>Nothing will happen if the value of ``type`` is not "progress", "wait" or "default".</p>
       * @param {"progress"|"wait"|"default"} type
       */
      setCursorType: (type) => {
        if (['progress', 'wait', 'default'].includes(type)) {
          document.body.style.cursor = type;
        }
      },

      setTableCursor:  (navigationProperty) => {
        let cursor = 'pointer';
        if (navigationProperty === 'none') {
          cursor = 'default';
        }
        document.documentElement.style.setProperty('--table-cursor', cursor);
      },

      setPreloaderVisibility: (visible) => {
        const div = document.getElementById('preloader-image');
        if (div !== null) {
          div.style.display = (visible ? 'inline-flex' : 'none');
        }
      },

      /**
       * Changes the active element on the page back to the default (the <body> element)
       * <p>Call this function to trigger JET change events, without having to press the tab or enter key.</p>
       * @returns {HTMLElement}
       */
      blurActiveElement: () => {
        document.activeElement.blur();
        return document.activeElement;
      },

      cancelEventPropagation: (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      },

      /**
       * Returns whether CFE is running inside an Electron app, or not.
       * @returns {boolean}
       */
      isElectronApiAvailable: () => {
        return (CoreUtils.isNotUndefinedNorNull(window.electron_api));
      },
      /**
       *
       * @param {string} name
       * @returns {string}
       * @example
       * const minHeight = ViewModelUtils.getCssCustomProperty("slideup-popup-offset-top");
       */
      getCustomCssProperty: (name) => {
        if (name[0] !== '-') name = `--${name}`;
        return getComputedStyle(document.documentElement).getPropertyValue(name);
      },

      setCustomCssProperty: (name, value) => {
        if (name[0] !== '-') name = `--${name}`;
        document.documentElement.style.setProperty(name, value);
      },

      /**
       * Returns how many ``root element`` responsive units (rem) are in the specified number of ``pixels``.
       * @param {number} pixels - Number of pixels, without the ``px`` suffix.
       * @returns {string} - Root element units suffixed with ``rem``.
       */
      pxToRem: (pixels) => {
        const baseFontSize = parseInt(getComputedStyle(document.documentElement).fontSize, 10);
        return `${pixels / baseFontSize}rem`;
      },

      /**
      * Use ``download`` attribute on an ``<a>`` HTML tag, to download a file to the local filesystem.
      * @param {{filepath: string, fileContents?: string, href?: string, target?: string, mediaType?: string}} options - JS object with properties containing data for the file to be downloaded.
      */
      downloadFile: (options) => {
        function createHiddenLink() {
          const link = document.createElement('a');
          Object.assign(link.style, { visibility: 'hidden', width: 0, height: 0, overflow: 'hidden', position: 'absolute'});
          return link;
        }

        function triggerDownload(options, link, downloadBlob) {
          link.download = options.filepath;
          link.href = window.URL.createObjectURL(downloadBlob);
          if (options.target) link.target = options.target;
          if (options.mediaType) link.type = options.mediaType;
          link.click();
          link.remove();
        }

        function handleFailureResponse(response) {
          if (CoreUtils.isNotUndefinedNorNull(response) && CoreUtils.isError(response)) {
            failureResponseDefaultHandling(response, 'error');
          }
          else if (CoreUtils.isNotUndefinedNorNull(response) && CoreUtils.isNotUndefinedNorNull(response.failure)) {
            failureResponseDefaultHandling(response.failure);
          }
          else if (CoreUtils.isNotUndefinedNorNull(response) && CoreUtils.isNotUndefinedNorNull(response.body)) {
            MessageDisplaying.displayResponseMessages(response.body.messages);
          }
          else {
            failureResponseDefaultHandling(response);
          }
        }

        let downloadBlob;

        if (options.fileContents) {
          downloadBlob = new Blob([options.fileContents], {type: options.mediaType});
          const link = createHiddenLink();
          link.href = window.URL.createObjectURL(downloadBlob);
          link.onclick = function(event) {
            const that = this;
            setTimeout(function() {
              window.URL.revokeObjectURL(that.href);
            }, 1500);
          };
          triggerDownload(options, link, downloadBlob);
        }
        else {
          DataOperations.href.downloadFile(options)
            .then(reply => {
              const link = createHiddenLink();
              reply.blob()
                .then(blob => {
                  downloadBlob = blob;
                  triggerDownload(options, link, downloadBlob);
                })
                .finally (() => {
                  if (CoreUtils.isNotUndefinedNorNull(downloadBlob)) {
                    window.URL.revokeObjectURL(downloadBlob);
                  }
                });

            })
            .catch(response => {
              handleFailureResponse(response);
            });

        }

      },

        /**
       * Uses a given ``router`` to go to a given ``path``, calling a can exit callback, if specified
       * @param {object} router
       * @param {string} path
       * @param {function} canExitCallback
       */
      goToRouterPath: (router, path, canExitCallback) => {
        if (CoreUtils.isNotUndefinedNorNull(canExitCallback)) {
          canExitCallback('exit')
            .then(reply => {
              if (reply) {
                router.go(path);
              }
            })
            .catch(failure => {
              MessageDisplaying.displayMessage({
                severity: 'error',
                summary: i18n.labels.unexpectedErrorResponse.value,
                detail: failure.stack
              });
            });
        }
        else {
          router.go(path);
        }
      },

      /**
       *
       * @param {'exit'} eventType
       * @param {function} canExitCallback
       * @param {{dialogMessage: {name: string}}} [options]
       * @returns {Promise<*>}
       */
      abandonUnsavedChanges: async (eventType, canExitCallback, options) => {
        if (CoreUtils.isNotUndefinedNorNull(canExitCallback)) {
          return canExitCallback(eventType, options);
        }
        else {
          return Promise.resolve(true);
        }
      },

      setFocusFirstIncompleteField: (selectors) => {
        const nodeList = document.querySelectorAll(selectors);
        if (nodeList !== null) {
          const arr = Array.from(nodeList);
          const index = arr.findIndex(node => node.readOnly === false && (node.value === '' || node.value === null));
          if (index !== -1)
            arr[index].focus();
          else
            arr[0].focus();
        }
      },

      getBrowserName: () => {
        const agent = window.navigator.userAgent.toLowerCase();
        switch (true) {
          case agent.indexOf('edge') > -1: return 'MS Edge';
          case agent.indexOf('edg/') > -1: return 'Edge ( chromium based)';
          case agent.indexOf('opr') > -1 && !!window.opr: return 'Opera';
          case agent.indexOf('chrome') > -1 && !!window.chrome: return 'Chrome';
          case agent.indexOf('trident') > -1: return 'MS IE';
          case agent.indexOf('firefox') > -1: return 'Mozilla Firefox';
          case agent.indexOf('safari') > -1: return 'Safari';
          default: return 'other';
        }
      },

      detectOS: () => {
        let userAgent = window.navigator.userAgent,
          platform = window.navigator.platform,
          macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
          windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
          iosPlatforms = ['iPhone', 'iPad', 'iPod'],
          os = null;
  
        if (macosPlatforms.indexOf(platform) !== -1) {
          os = 'macOS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
          os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
          os = 'windows';
        } else if (/Android/.test(userAgent)) {
          os = 'android';
        } else if (!os && /Linux/.test(platform)) {
          os = 'linux';
        }
  
        return os;
      },

      openExternalURL: (url) => {
        if (CoreUtils.isNotUndefinedNorNull(window.electron_api)) {
          window.electron_api.ipc.invoke('external-url-opening', url);
        }
        else {
          window.open(url, '_blank', 'noopener noreferrer');
        }
      },

      copyToClipboard: async (text) => {
        return navigator.clipboard.writeText(text);
      },
  
      /**
       *
       * @param {number} keyCode - The `keyCode` of the key to simulate
       * @param {string} [type='down'] - The type of event : down, up or press. The default is down
       * @param {object} [modifiers={}] - An object which contains modifiers keys. For example: `{ ctrlKey: true, altKey: false, ...}`
       * @example
       *  // Simulate 'ArrowUp'
       *  ViewModelUtils.simulateKeyPress(38);
       *  // Simulate 'F2'
       *  ViewModelUtils.simulateKeyPress(113);
       *  // Simulate 'Option+Command+i' (i.e. "Open Developer Tools")
       *  ViewModelUtils.simulateKeyPress(73, 'up', {altKey: true, metaKey: true});
       */
      simulateKeyPress: (keyCode, type, modifiers) => {
        const eventName = (typeof type === 'string' ? `key${type}` : 'keydown');
        const modifiersObj = (modifiers instanceof Object ? modifiers : {});
        modifiersObj['keyCode'] = keyCode;
        if (modifiers.ctrlKey) modifiersObj['ctrlKey'] = modifiers.ctrlKey;
        if (modifiers.shiftKey) modifiersObj['shiftKey'] = modifiers.shiftKey;
        if (modifiers.altKey) modifiersObj['altKey'] = modifiers.altKey;
        if (modifiers.metaKey) modifiersObj['metaKey'] = modifiers.metaKey;
        const event = new KeyboardEvent(eventName, modifiersObj);
        document.dispatchEvent(event);
      },

      getAcceleratorElement: (accelerator = 'Alt|Q' , platform = 'linux') => {
        function linuxAcceleratorElement(span, values) {
        }
  
        function macOSAcceleratorElement(span, values) {
        }
  
        function windowsOSAcceleratorElement(span, values) {
        }
  
        let span = document.createElement('span');
        span.setAttribute('slot', 'endIcon');

        switch (platform) {
          case 'linux':
            linuxAcceleratorElement(span, accelerator.split('|'));
            break;
          case 'macOS':
            macOSAcceleratorElement(span, accelerator.split('|'));
            break;
          case 'windows':
            windowsOSAcceleratorElement(span, accelerator.split('|'));
            break;
        }

        return span;
      },

      helpIconClickListener: (event) => {
        const instructionHelp = event.currentTarget.attributes['help.definition'].value;
        const detailedHelp = event.currentTarget.attributes['data-detailed-help'].value;

        if (detailedHelp !== null) {
          const popup = document.getElementById(event.target.getAttribute('aria-describedby'));

          if (popup != null) {
            const content = popup.getElementsByClassName('oj-label-help-popup-container')[0];
            if (content != null) {
              if (popup.classList.contains('cfe-detail-popup')) {
                content.innerHTML = instructionHelp;
                popup.classList.remove('cfe-detail-popup');
              }
              else {
                content.innerHTML = detailedHelp;
                popup.classList.add('cfe-detail-popup');
              }
            }
          }
        }
      },
      helpLinkClickListener: (event) => {
        if (window.electron_api) {
          window.electron_api.ipc.invoke('external-url-opening', event.target.attributes['data-external-help-link'].value);
        }
        else {
          window.open(event.target.attributes['data-external-help-link'].value, '_blank', 'noopener noreferrer');
        }
      },
      infoIconHTMLEventListener: (event) => {
        if (!Runtime.getProperty('features.pageInfo.disabled')) {
          if (event.type === 'click' || event.key === 'Enter') {
            const popup = event.currentTarget.querySelector('.cfe-page-info-popup');
            if (popup !== null) {
              const toggleState = getComputedStyle(popup).getPropertyValue('--page-info-popup-toggle-state');
              popup.style.setProperty('--page-info-popup-toggle-state', toggleState === 'visible' ? 'hidden' : 'visible');
            }
          }
        }
      }

    }
  }
);