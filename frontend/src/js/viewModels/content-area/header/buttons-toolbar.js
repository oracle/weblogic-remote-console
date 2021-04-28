/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojknockout'],
  function (oj, ko) {
    function ContentAreaHeaderButtonsToolbar(viewParams) {
      const self = this;

      this.i18n = {
        toolbar: {
          buttons: {
            home: {
              id: "home", image: "home-icon-blk_24x24", disabled: ko.observable(false), visible: true,
              label: oj.Translations.getTranslatedString("wrc-content-area-header.toolbar.buttons.home.label")
            },
            preferences: {
              id: "preferences", image: "preferences-icon-blk_24x24", disabled: ko.observable(false), visible: false,
              label: oj.Translations.getTranslatedString("wrc-content-area-header.toolbar.buttons.preferences.label")
            },
            search: {
              id: "search", image: "search-icon-blk_24x24", disabled: ko.observable(false), visible: false,
              label: oj.Translations.getTranslatedString("wrc-content-area-header.toolbar.buttons.search.label")
            }
          }
        }
      };

      viewParams.signaling.modeChanged.add((newMode) => {
        setToolbarButtonDisabledState(newMode === "DETACHED");
      });

      function setToolbarButtonDisabledState(state) {
        self.i18n.toolbar.buttons.home.disabled(state);
        self.i18n.toolbar.buttons.preferences.disabled(state);
        self.i18n.toolbar.buttons.search.disabled(state);
      }

      /**
       * Called when user clicks the "Home" button in the content
       * area header's menubar
       * @param event
       */
      this.contentAreaHeaderButtonClickHandler = function(event) {
        switch(event.currentTarget.id) {
          case "home":
            viewParams.parentRouter.go("home");
            break;
          default:
            break;
        }
      };
    }

    return ContentAreaHeaderButtonsToolbar;
  }
);
