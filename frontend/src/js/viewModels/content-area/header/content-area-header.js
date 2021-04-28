/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', "knockout", 'ojs/ojarraydataprovider', 'ojs/ojmodule-element-utils', '../../../core/runtime', '../../../core/utils', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule'],
  function(oj, ko, ArrayDataProvider, ModuleElementUtils, Runtime, CoreUtils) {
    function ContentAreaHeaderTemplate(viewParams){
      var self = this;

      this.i18n = {
        buttons: {
          readwrite: {id: "readwrite", image: "console-mode-readwrite_24x24", disabled: ko.observable(false),
            label: oj.Translations.getTranslatedString("wrc-content-area-header.buttons.readwrite.label")
          },
          readonly: {id: "readonly", image: "console-mode-readonly_24x24", disabled: ko.observable(false),
            label: oj.Translations.getTranslatedString("wrc-content-area-header.buttons.readonly.label")
          }
        }
      };

      this.headerTitle = ko.observable();
      this.readonly = ko.observable(false);

      // System messages
      this.messages = ko.observableArray([]);
      this.messagesDataProvider = new ArrayDataProvider(this.messages);

      this.messagePosition = ko.observable({
        my: { vertical: 'top', horizontal: 'center' },
        at: { vertical: 'top', horizontal: 'center' },
        of: '#content-area-container'
      });

      this.contentAreaHeaderButtonsToolbarModuleConfig = ModuleElementUtils.createConfig({
        name: "content-area/header/buttons-toolbar",
        params: { 
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });

      this.contentAreaHeaderIconsTabstripModuleConfig = ko.observable({ view: [], viewModel: null });
/*
      this.contentAreaHeaderIconsTabstripModuleConfig = ModuleElementUtils.createConfig({
        name: "content-area/header/icons-tabstrip",
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });
*/

      this.readonlyButtonClickHandler = function(event) {
        self.readonly(!self.readonly());
        Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, self.readonly());
        viewParams.signaling.readonlyChanged.dispatch(self.readonly());
      };

      function setContentAreaHeaderBranding(label) {
        self.headerTitle(label);
        document.title = `${Runtime.getName()}  ${(label.length > 0 ? "-" : "")}${label}`;
      }

      viewParams.signaling.perspectiveChanged.add((newPerspective) => {
        setContentAreaHeaderBranding(
          oj.Translations.getTranslatedString(`wrc-content-area-header.title.${newPerspective.id}`)
        );
      });

      viewParams.signaling.popupMessageSent.add((message, autoTimeout) => {
        if (!message) {
          self.messages.removeAll();
        }
        else {
          if (CoreUtils.isNotUndefinedNorNull(message.severity) && ["confirmation", "info"].includes(message.severity) ) {
            message.autoTimeout = autoTimeout || 1500;
            const value = parseInt(message.autoTimeout);
            if (isNaN(value) || message.autoTimeout < 1000 || message.autoTimeout > 60000) {
              message.autoTimeout = 1500;
            }
          }
          self.messages.push(message);
        }
      });

      viewParams.signaling.modeChanged.add((newMode) => {
        const isOffline = (newMode === "DETACHED");
        self.i18n.buttons.readwrite.disabled(isOffline);
        self.i18n.buttons.readonly.disabled(isOffline);
      });
    }

    return ContentAreaHeaderTemplate;
  }
);    
