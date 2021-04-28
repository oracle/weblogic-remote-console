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
define(['ojs/ojcore', '../microservices/preferences/preferences', '../apis/message-displaying', '../core/types', '../core/utils', 'ojs/ojlogger'],
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

    /**
       * Provides default handling of responses passed in Promise rejections.
       * <p>User preferences govern the behavior of this method:<p>
       *   <ul>
       *     <li><code>notifications.showPopupForFailureResponses|boolean</code>&nbsp;&nbsp;&nbsp;Default: <code>false</code></li>
       *     <li><code>logging.logFailureResponses|boolean</code>&nbsp;&nbsp;&nbsp;Default: <code>true</code></li>
       *   </ul>
       * </p>
       * <p>See the <code>src/config/console-preferences.yaml</code> file.</p>
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
          const messageSummary = (CoreUtils.isError(response.failureReason) ? response.failureReason.name : i18n.labels.unexpectedError.value);

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
              detail: MessageDisplaying.messages.seeJavascriptConsole.detail
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
      }

    }
  }
);