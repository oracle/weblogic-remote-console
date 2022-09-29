/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojknockout'],
  function (oj, ko, ViewModelUtils, Runtime, CoreTypes, CoreUtils) {
    function ContentAreaHeaderButtonsToolbar(viewParams) {
      const self = this;

      this.i18n = {
        toolbar: {
          buttons: {
            home: {
              id: 'home', image: 'home-icon-blk_24x24', disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.home.label')
            },
            preferences: {
              id: 'preferences', image: 'preferences-icon-blk_24x24', disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.preferences.label')
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

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            setToolbarButtonDisabledState(true);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
          self.canExitCallback = undefined;
          viewParams.signaling.beanTreeChanged.dispatch({type: 'home', label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.home.label'), provider: {id: dataProvider.id, name: dataProvider.name}});
          this.contentAreaHeaderButtonClickHandler({currentTarget: {id: 'home'}});
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setToolbarButtonDisabledState(true);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        this.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      }.bind(this);

      function setToolbarButtonDisabledState(state) {
        self.i18n.toolbar.buttons.home.disabled(state);

        if (state) {
          viewParams.onToolbarButtonClicked({label: '', info: ''});
        }
        self.i18n.toolbar.buttons.home.visible(!state);
      }

      /**
       * Called when user clicks a button in the content
       * area header's menubar
       * @param event
       */
      this.contentAreaHeaderButtonClickHandler = (event) => {
        switch(event.currentTarget.id) {
          case 'home': {
              if (!self.i18n.toolbar.buttons.home.disabled()) {
                ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
                  .then(reply => {
                    if (reply) {
                      const title = {
                        label: oj.Translations.getTranslatedString('wrc-content-area-header.title.home'),
                      };
                      viewParams.onToolbarButtonClicked(title);
                      // Go to "Home" page
                      viewParams.parentRouter.go('home');
                    }
                  })
                  .catch(failure => {
                    ViewModelUtils.failureResponseDefaultHandling(failure);
                  });
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
