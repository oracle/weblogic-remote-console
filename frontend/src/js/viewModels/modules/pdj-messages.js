/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojhtmlutils', 'ojs/ojlogger'],
  function (HtmlUtils, Logger) {

  function displayMessages(messages, popupMessageSent) {
    let errorMessage;
    messages.forEach((message) => {
      errorMessage = { severity: getMessageSeverity(message) };
      errorMessage.detail = (typeof message.message !== "undefined" ? message.message : message);
      popupMessageSent.dispatch(errorMessage);
    });
  }

  function getMessageSeverity(message) {
    // Default to the error severity
    let severity = 'error';

    // Check if the message defines a severity and map to the message box severity
    if ((typeof message.severity !== 'undefined') && (message.severity !== "")) {
      switch (message.severity) {
        case "INFO":
          severity = 'info';
          break;
        case "WARNING":
          severity = 'warning';
          break;
      }
    }

    // Return the mapped severity
    return severity;
  }

  //public:
    return {
      displayResponseMessages: function (responseMessages, popupMessageSent) {
        let rtnval = [];

        if (typeof responseMessages !== 'undefined') {
          responseMessages.forEach((message) => {
            if (typeof message.message !== "undefined") {
              displayMessages([message], popupMessageSent);
            }
            else if (typeof message.property === 'undefined') {
              let messages = [];
              if (message.message.indexOf("{") !== -1)
                messages = JSON.parse(message.message);
              else
                messages.push(message);

              if (typeof messages.messages !== "undefined") {
                messages = messages.messages;
              }
              displayMessages(messages, popupMessageSent);
            }
          });
        }

        return rtnval;
      },

      displayResponseBodyMessages: function (messages, popupMessageSent) {
        let errorMessagesHTML = "<ul>";
        messages.forEach((message) => {
          if (message !== "") {
            errorMessagesHTML += "<li>" + message.message + "</li>";
          }
        });
        if (errorMessagesHTML.indexOf("<li>") !== -1) {
          errorMessagesHTML += "</ul>";
          const errorMessage = {
            html: {
              view: HtmlUtils.stringToNodeArray(errorMessagesHTML)
            },
            severity: "info",
            summary: "Messages"
          };
          popupMessageSent.dispatch(errorMessage);
        }
      }
    };
  }
);
