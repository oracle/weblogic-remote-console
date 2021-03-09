/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(["knockout", 'ojs/ojarraydataprovider', 'ojs/ojmodule-element-utils', '../../cfe/common/runtime', '../modules/tooltip-helper', 'ojs/ojlogger', "ojs/ojknockout", 'ojs/ojmodule-element', 'ojs/ojmodule'],
  function(ko, ArrayDataProvider, ModuleElementUtils, Runtime, TooltipHelper, Logger) {
    function ContentAreaHeaderTemplate(viewParams){
      var self = this;

      this.i18n = {
        buttons: {
          readwrite: {id: "readwrite", label: "Read/Write", image: "console-mode-readwrite_24x24", disabled: ko.observable(false)},
          readonly: {id: "readonly", label: "Read-Only", image: "console-mode-readonly_24x24", disabled: ko.observable(false)}
        }
      };

      this.headerTitle = ko.observable();
      this.readonly = ko.observable(false);

      // System messages
      this.messages = ko.observableArray(this.messageArray);
      this.messagesDataprovider = new ArrayDataProvider(this.messages);

      this.messagePosition = ko.observable({
        my: { vertical: 'top', horizontal: 'center' },
        at: { vertical: 'top', horizontal: 'center' },
        of: '#content-area-container'
      });

      this.connected = function() {
        const ele = document.getElementById("content-area-header-container");
        if (ele !== null) {
          new TooltipHelper(ele);
        }
      };

      this.domainsModuleConfig = ModuleElementUtils.createConfig({
        name: "template/domains", 
        params: { 
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          onTitleChanged: setContentAreaHeaderBranding
        } 
      });

      this.readonlyButtonClickHandler = function(event) {
        self.readonly(!self.readonly());
        Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, self.readonly());
        viewParams.signaling.readonlyChanged.dispatch(self.readonly());
      };

      function setContentAreaHeaderBranding(label) {
        self.headerTitle(label);
        document.title = Runtime.getName() + " " + (label.length > 0 ? "-" : "") + label;
      }

      viewParams.signaling.perspectiveChanged.add((newPerspective) => {
        setContentAreaHeaderBranding(newPerspective.label);
      });

      viewParams.signaling.popupMessageSent.add((message, autoTimeout) => {
        if (!message) {
          self.messages.removeAll();
        } else {

          if (typeof message.severity !== "undefined" && message.severity === "confirmation") {
            message.autoTimeout = autoTimeout || 1500;
          }
          self.messages.push(message);
        }
      });

      viewParams.signaling.modeChanged.add((newMode) => {
        const isOffline = (newMode === "OFFLINE");
        self.i18n.buttons.readwrite.disabled(isOffline);
        self.i18n.buttons.readonly.disabled(isOffline);
      });
    }

    return ContentAreaHeaderTemplate;
  }
);    
