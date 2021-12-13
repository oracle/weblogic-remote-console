/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * @module
 */
define(['ojs/ojcore', 'wrc-frontend/microservices/preferences/preferences', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function (oj, Preferences, MessageDisplaying, CoreTypes, CoreUtils, Logger) {
    const i18n = {
      labels: {
        "unexpectedErrorResponse": {value: oj.Translations.getTranslatedString("wrc-view-model-utils.labels.unexpectedErrorResponse.value")}
      }
    };

    return {
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

      getResponseBodyMessages: function (response, properties) {
        let bodyMessages = [], errorMessage;
        if (CoreUtils.isError(response)) {
          errorMessage = {
            severity: "error",
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
              if (typeof property !== "undefined") errorMessage["summary"] = property.label;
              errorMessage["detail"] = message.message;
              bodyMessages.push(errorMessage);
            }
          });
        }
        return bodyMessages;
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
      failureResponseDefaultHandling: function (response, severity) {
        // For a coding error, the response will be
        // the JavaScript Error. If that is the case,
        // then re-create the response object with
        // the actual failureType and failureReason
        // properties.
        if (CoreUtils.isError(response)) {
          response = {
            failureType: CoreTypes.FailureType.UNEXPECTED,
            failureReason: response
          };
        }

        if (Preferences.notifications.showPopupForFailureResponsesPreference()) {
          // The end user's "showPopupForFailureResponses"
          // preference setting has a value of true, so
          // display the message. Use response.failureReason
          // to craft the summary property.
          const messageSummary = (CoreUtils.isError(response.failureReason) ? response.failureReason.name : i18n.labels.unexpectedErrorResponse.value);

          // Assign default value to severity, if
          // parameter wasn't provided
          severity = (severity || "info");

          // Set value of severity to "info", if
          // an invalid value was assigned to the
          // severity parameter.
          if (!["error", "warn", "info"].includes(severity)) severity = "info";

          // Display message used for default failure
          // response handling, using parameter and
          // preference values.
          MessageDisplaying.displayMessage({
              severity: severity,
              summary: messageSummary,
              detail: response.failureReason
            }, Preferences.notifications.autoCloseInterval()
          );
        }

        if (Preferences.logging.logFailureResponses()) {
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
      },

      /**
       * Sets the cursor to a given ``type``
       * <p>Nothing will happen if the value of ``type`` is not "progress", "wait" or "default".</p>
       * @param {"progress"|"wait"|"default"} type
       */
      setCursorType: (type) => {
        if (["progress", "wait", "default"].includes(type)) {
          document.body.style.cursor = type;
        }
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
       * @param {{filepath: string, fileContents: string, mediaType: string}} options - JS object with properties containing data for the file to be downloaded.
       */
      downloadFile: (options) => {
        // Define "click" event handler that releases the
        // object URL after the element has been clicked.
        function clickHandler(event) {
          setTimeout(() => {
            // Here, "this" is referring to the link
            if (CoreUtils.isNotUndefinedNorNull(this)) {
              this.removeEventListener('click', clickHandler);
            }
            // Release object URL from memory
            URL.revokeObjectURL(url);
          }, 1500);
        }
        const blob = new Blob([options.fileContents], {type: options.mediaType});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = options.filepath;
        Object.assign(link.style, {
          visibility: 'hidden',
          width: 0,
          height: 0,
          overflow: 'hidden',
          position: 'absolute'
        });
        // Add "click" event listener.
        link.addEventListener('click', clickHandler, false);
        // Open the file saver programmatically
        link.click();
      }
    }
  }
);