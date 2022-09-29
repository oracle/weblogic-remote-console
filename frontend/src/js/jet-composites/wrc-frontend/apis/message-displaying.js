/**
 * @license
 * Copyright (c) 2021, 2022 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * CFE UI API module for displaying popup messages of all severities and varieties
 * <p>The CBE REST API does not currently have a standardizes contract for either the message structure, or the location. They are generally in the response body of the HTTP response, but the format varies from:</p>
 * <ul>
 *   <li><b>Plain-text that is not, and cannot be coerced to be JSON or YAML.</b>&nbsp;&nbsp;&nbsp;These need to be turned into a JSON array containing JSON objects for each message.</li>
 *   <li><b>JSON intertwined with HTML tags.</b>&nbsp;&nbsp;&nbsp;These need to be transformed into a JSON array containing JSON objects for each message, which get rendered as HTML <p> tags.</li>
 *   <li>JSON array with the name <code><messages</code>, which contains <code>message</code> objects.</li>
 *   <li><p>Plain-text that is in JSON format, but the root may or maynot be a JSON array, and the root may or may not be named <code>messages</code></b>&nbsp;&nbsp;&nbsp;Again, the CFE has to turn this into a JSON array that contains JSON objects for each message.</li>
 * </ul>
 * <p>This is, as you might guess, too involved to be done in the code of a ViewModels, so this module is dedicated to dealing with all of those nuances.</p>
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils', 'ojs/ojlogger'],
  function (oj, ko, HtmlUtils, Logger) {
    const i18n = {
      messages: {
        'seeJavascriptConsole': {
          detail: oj.Translations.getTranslatedString('wrc-message-displaying.messages.seeJavascriptConsole.detail')
        },
        'responseMessages': {
          summary: oj.Translations.getTranslatedString('wrc-message-displaying.messages.responseMessages.summary')
        }
      }
    };

    var _popupMessageSentSignal;

    /**
     *
     * @param {{severity: string, summary: string, [detail]: string}} message
     * @returns {string}
     */
    function getMessageSeverity(message) {
      // Default to the error severity
      let severity = 'error';

      // Check if the message defines a severity and map to the message box severity
      if ((typeof message.severity !== 'undefined') && (message.severity !== '')) {
        switch (message.severity.toUpperCase()) {
          case 'INFO':
          case 'SUCCESS':
            severity = 'info';
            break;
          case 'WARNING':
            severity = 'warning';
            break;
          case 'ERROR':
          case 'FAILURE':
          case 'CRITICAL':
            severity = 'error';
            break;
        }
      }

      // Return the mapped severity
      return severity;
    }

    function getPopupMessageSentSignal() {
      return _popupMessageSentSignal;
    }

    return {
      setPopupMessageSentSignal: function(signal) {
        _popupMessageSentSignal = signal;
      },

      /**
       * Common message objects.
       */
      messages: {
        'seeJavascriptConsole': i18n.messages.seeJavascriptConsole
      },

      /**
       * Displays `message` as a popup message.
       * <p>The optional `autoCloseInterval` parameter is ignored if `message.severity !=== "confirmation"`</p>only </p>
       * @param {{severity: string, summary: string, [detail]: string}} message - The message object to display
       * @param {number} [autoCloseInterval] - Optionally, the number of milliseconds to leave message up, before auto-closing it. 1500 milliseconds (1.5 seconds) will be used, if the parameter is missing.
       */
      displayMessage: function(message, autoCloseInterval) {
        if (typeof message.severity === 'undefined') message['severity'] = 'confirmation';
        if (autoCloseInterval && ['confirmation', 'info'].includes(message.severity) ) {
          getPopupMessageSentSignal().dispatch(message, autoCloseInterval || 1500);
        }
        else {
          getPopupMessageSentSignal().dispatch(message);
        }
      },

      /**
       *
       * @param {{severity: string, summary: string, detail?: string}[]} messages
       */
      displayMessages: function(messages) {
        messages.forEach((message) => {
          message['severity'] = getMessageSeverity(message);
          getPopupMessageSentSignal().dispatch(message);
        });
      },

      /**
       *
       * @param {{severity: string, summary: string, detail?: string}[]} responseMessages
       * @param {number} [autoCloseInterval] - Optionally, the number of milliseconds to leave message up, before auto-closing it. 1500 milliseconds (1.5 seconds) will be used, if the parameter is missing.
       * @returns {Array}
       */
      displayResponseMessages: function(responseMessages, autoCloseInterval) {
        let rtnval = [];

        if (typeof responseMessages !== 'undefined') {
          let errorMessagesHTML = '<ul>', errorSummary = i18n.messages.responseMessages.summary;
          responseMessages.forEach((message) => {
            if (typeof message === 'object') {
              errorMessagesHTML += '<li>' + message.message + '</li>';
            }
            else {
              errorMessagesHTML += '<li>' + message + '</li>';
            }
          });
          if (errorMessagesHTML.indexOf('<li>') !== -1) {
            errorMessagesHTML += '</ul>';
            const errorMessage = {
              html: { view: HtmlUtils.stringToNodeArray(errorMessagesHTML) },
              severity: 'error',
              summary: errorSummary
            };
            getPopupMessageSentSignal().dispatch(errorMessage, autoCloseInterval || 5000);
          }
        }

        return rtnval;
      },

      displayFieldMessages: function(fieldMessages) {

      },

      /**
       * Display a given array of messages with detail fields that contain HTML tags.
       * <p>All of the messages are displayed in a single popup, using ``summary`` as the message summary field.</p>
       * @param {{severity: string, summary?: string, detail?: string}[]} messages - Array of messages to display
       * @param {string} summary
       * @param {number} [autoCloseInterval] - Optionally, the number of milliseconds to leave message up, before auto-closing it. 1500 milliseconds (1.5 seconds) will be used, if the parameter is missing.
       */
      displayErrorMessagesHTML: function (messages, summary, autoCloseInterval) {
        const errorMessagesHTML = this.getErrorMessagesAsHTML(messages);
        if (errorMessagesHTML.indexOf('<li>') !== -1) {
          const errorSummary = summary || i18n.messages.incompleteRequiredField.summary;
          const errorMessage = {
            html: { view: HtmlUtils.stringToNodeArray(errorMessagesHTML) },
            severity: 'error',
            summary: errorSummary
          };
          getPopupMessageSentSignal().dispatch(errorMessage, autoCloseInterval);
        }
      },

      getErrorMessagesAsHTML: (messages) => {
        let errorMessagesHTML = '<ul>';
        messages.forEach((message) => {
          errorMessagesHTML += '<li>' + message.detail + '</li>';
        });
        if (errorMessagesHTML.indexOf('<li>') !== -1) {
          errorMessagesHTML += '</ul>';
        }
        return errorMessagesHTML;
      }
    };

  }
);
