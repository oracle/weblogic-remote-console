/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'ojs/ojknockout'],
  function (oj, ko, Runtime, CoreTypes) {
    function ContentAreaHeaderButtonsToolbar(viewParams) {
      const self = this;

      this.i18n = {
        toolbar: {
          buttons: {
            home: {
              id: "home", image: "home-icon-blk_24x24", disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString("wrc-content-area-header.toolbar.buttons.home.label")
            },
            preferences: {
              id: "preferences", image: "preferences-icon-blk_24x24", disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString("wrc-content-area-header.toolbar.buttons.preferences.label")
            },
            search: {
              id: "search", image: "search-icon-blk_24x24", disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString("wrc-content-area-header.toolbar.buttons.search.label")
            }
          }
        }
      };

      this.signalBindings = [];

      this.connected = function() {
        let binding = viewParams.signaling.modeChanged.add((newMode) => {
          const disabled = (newMode === CoreTypes.Console.RuntimeMode.DETACHED.name);
          setToolbarButtonDisabledState(disabled);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((dataProvider) => {
          setToolbarButtonDisabledState(true);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
          viewParams.signaling.beanTreeChanged.dispatch({type: "home", label: oj.Translations.getTranslatedString("wrc-content-area-header.toolbar.buttons.home.label"), provider: {id: dataProvider.id, name: dataProvider.name}});
          $("#home").click();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setToolbarButtonDisabledState(true);
        });

        self.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      }.bind(this);

      function setToolbarButtonDisabledState(state) {
        self.i18n.toolbar.buttons.home.disabled(state);
        self.i18n.toolbar.buttons.preferences.disabled(state);
        self.i18n.toolbar.buttons.search.disabled(state);

        if (state) {
          viewParams.onToolbarButtonClicked("");
        }
        self.i18n.toolbar.buttons.home.visible(!state);
      }

      /**
       * Called when user clicks the "Home" button in the content
       * area header's menubar
       * @param event
       */
      this.contentAreaHeaderButtonClickHandler = function(event) {
        switch(event.currentTarget.id) {
          case "home": {
              if (!self.i18n.toolbar.buttons.home.disabled()) {
                // Go to "Home" page
                viewParams.parentRouter.go("home");
              }
            }
            break;
          default:
            break;
        }
      };
    }

    return ContentAreaHeaderButtonsToolbar;
  }
);
